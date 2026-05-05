// App.tsx
import React, { useState, useRef, useMemo, useCallback, useEffect, createRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ComponentRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useCursor, View, Html } from '@react-three/drei';
import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';
import type { TransformControlsMode, CameraViewType } from './types';
import './Toolbar.css';
import './App.css';
import { CustomSliderInput, CustomTextInput, CustomButtonGroup, CustomButton } from './CustomControls';
import './CustomControls.css';
import { ColorPalettePicker } from './ColorPalettePicker.tsx';
import { DetectorLegend } from './DetectorLegend.tsx';
import { ControlTabs } from './ControlTabs';
import './ControlTabs.css';
import { SceneView } from './SceneView';
import { SelectedObjectControls } from './SelectedObjectControls';
import { ParametricEditorModal } from './ParametricEditorModal.tsx';
import { DomainEditorModal } from './SetupEditorModal.tsx';
import { saveProjectToFile } from './fileUtils.ts';
import type { ProjectData, CustomParameter, ParameterRelation, SceneObjectType, PhysicsDomain, GlobalConstant, ParticleDefinition } from './types.ts';
import { buildEvaluationScope, evaluateExpressionWithScope, expandMacro, parseDomainBounds } from './utils.ts';
import { getCssGradient, PALETTE_DEFINITIONS } from './colorPalettes';

// A hardcoded blank model for resets and fallbacks.
const blankModel: ProjectData = {
  projectName: 'New QSF Project', projectVersion: '1.0',
  sceneObjects: [{ id: "axes", type: 'axes', name: 'axes-001', position: [0, 0, 0], rotation: [0, 0, 0], scale: [100, 100, 100] }],
  parameters: [], relations: [], physicsDomains: [], globalConstants: [],
  units: { distance: 'nm', energy: 'eV' }
};

// Helper function to load from local storage
const loadFromLocalStorage = (): ProjectData | null => {
  const savedData = localStorage.getItem('myProjectData');
  if (savedData) {
    try {
      const project = JSON.parse(savedData) as ProjectData;

      // Basic validation
      if (project.sceneObjects && project.parameters && project.relations && project.units) {
        return project;
      }
    } catch (e) {
      console.error("Failed to load project from local storage", e);
    }
  }
  return null;
};

const findObjectById = (obj: SceneObjectType, id: string): SceneObjectType | null => {
  if (obj.id === id) return obj;
  if (obj.children) for (const child of obj.children) { const found = findObjectById(child, id); if (found) return found; }
  return null;
};

/**
 * Validates all relevant parts of a loaded project data object.
 * Sets the `isValidated` flag on each item and returns a list of errors.
 */
const validateProjectData = (data: ProjectData): { validatedData: ProjectData; errors: string[] } => {
  const validatedData = JSON.parse(JSON.stringify(data)); // Deep copy to modify
  const errors: string[] = [];
  const baseScope = buildEvaluationScope(validatedData.sceneObjects, validatedData.globalConstants);
  const paramsScope = validatedData.parameters.reduce((acc: Record<string, number>, p: CustomParameter) => ({ ...acc, [p.name]: p.value }), {});
  const fullScope: Record<string, any> = { ...baseScope, ...paramsScope, x: 0, y: 0, z: 0, t: 0 };

  // Validate that any parameter with a quantity has a corresponding unit defined
  if (validatedData.units) {
    for (const p of validatedData.parameters) {
      const quantity = (p as any).quantity as string | undefined;
      if (!quantity) continue;
      if (quantity === 'distance' && !validatedData.units.distance) {
        errors.push(`Units validation failed: project.units.distance is required for parameter "${p.name}".`);
      } else if (quantity === 'time' && !(validatedData.units as any).time) {
        errors.push(`Units validation failed: project.units.time is required for parameter "${p.name}".`);
      } else if (quantity === 'energy' && !validatedData.units.energy) {
        errors.push(`Units validation failed: project.units.energy is required for parameter "${p.name}".`);
      }
    }
  }

  // Include a representative particle mass so project variables can use `mass`
  const particleList = (validatedData as any).particles || [];
  const firstParticle = particleList[0];
  if (firstParticle) {
    const massVal = (firstParticle as any).mass ?? (firstParticle as any).massKg;
    if (massVal !== undefined) fullScope['mass'] = massVal;
  }

  // Evaluate project-level derived variables first so they are available in domain scopes
  if (validatedData.projectVariables && validatedData.projectVariables.length > 0) {
    for (const pv of validatedData.projectVariables) {
      try {
        const expr = expandMacro(pv.expression, 1);
        const val = evaluateExpressionWithScope(expr, fullScope);
        if (val === null) {
          pv.isValidated = false;
          // We don't throw here; just mark invalid and continue so domains can still be validated later
        } else {
          fullScope[pv.name] = val;
          pv.isValidated = true;
        }
      } catch {
        pv.isValidated = false;
      }
    }
  }

  // Validate Physics Domains and Wave Functions
  validatedData.physicsDomains?.forEach((domain: PhysicsDomain) => {
    // --- NEW: Normalize legacy / missing amplitude modes ---
    if (!domain.amplitudeMode) {
      domain.amplitudeMode = 'linear';
    } else if ((domain.amplitudeMode as any) === 'lin') {
      // Support older JSON that used "lin" as a shorthand
      domain.amplitudeMode = 'linear';
    }
    // For now, we'll trust domain rules as their validation is complex.
    domain.rules.forEach(rule => rule.isValidated = true);

    if (domain.waveEquation) {
      try {
        let waveScope = { ...fullScope };
        // Inject selected particle mass into the domain's scope so derived vars can reference `mass`
        const particleList = (validatedData as any).particles || [];
        const particleId = domain.selectedParticleId || (particleList.length > 0 ? particleList[0].id : undefined);
        const particle = particleList.find((p: any) => p.id === particleId);
        if (particle) {
          const massVal = (particle as any).mass ?? (particle as any).massKg;
          if (massVal !== undefined) waveScope['mass'] = massVal;
        }
        // Validate derived variables first
        domain.waveEquation.derivedVariables?.forEach(v => {
          const expandedExpr = expandMacro(v.expression, domain.waveEquation?.numberOfParticles);
          const result = evaluateExpressionWithScope(expandedExpr, waveScope);
          if (result === null) throw new Error(`Error in derived variable "${v.name}".`);
          waveScope[v.name] = result;
          v.isValidated = true;
        });

        // Validate main expression
        const mainExpandedExpr = expandMacro(domain.waveEquation.expression, domain.waveEquation.numberOfParticles);
        const mainResult = evaluateExpressionWithScope(mainExpandedExpr, waveScope);
        if (mainResult === null) throw new Error(`Error in main wave expression for domain "${domain.name}".`);

        domain.waveEquation.isValidated = true;

      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown validation error.';
        errors.push(`Wave Function Validation Failed for "${domain.name}": ${message}`);
        if (domain.waveEquation) domain.waveEquation.isValidated = false;
      }
    }
  });

  return { validatedData, errors };
};

// --- Global simulation clock ---
// Advances simulationTimeRef once per R3F frame, independent of
// how many DomainWave/SceneView instances are mounted.
function SimulationClock({
  simulationTimeRef,
  isWaveRunning,
  isCalculating,
}: {
  simulationTimeRef: React.MutableRefObject<number>;
  isWaveRunning: boolean;
  isCalculating: boolean;
}) {
  useFrame((_, delta) => {
    // Run the clock while either a test render is active (isCalculating)
    // or the main wave simulation is running (regardless of visibility).
    if (!(isCalculating || isWaveRunning)) return;
    simulationTimeRef.current += delta;
  });

  return null;
}

//====================================================================================================

// --- NEW: Type for individual view settings ---
type ViewSettings = {
  id: string; // A unique, stable ID for each view instance
  cameraView: CameraViewType;
  wheelMode: 'zoom' | 'clip';
  cameraResetVersion: number;
  clippingOffsets: { xy: number; xz: number; yz: number };
  clippingVersion: number;
  showAxes: boolean;
  showGrid: boolean; // Add grid visibility to settings
  isToolbarExpanded: boolean; // NEW: To toggle extra toolbar buttons
  flipX: boolean; // NEW: Flip Horizontal (Camera Position)
  flipY: boolean; // NEW: Flip Vertical (Camera Up Vector)
  isClippingEnabled: boolean; // NEW: To toggle clipping planes
  rotation: number; // NEW: 0, 1, 2, 3 for 0, 90, 180, 270 degrees
  fitScaleTrigger: number; // NEW: Triggers camera fit after scale update
};

type EditorProps = {
  initialProjectData: ProjectData; // May include user overrides
  baseProjectData: ProjectData;    // Pure model defaults from JSON or blank
  loadValidationErrors: string[];
  setLoadValidationErrors: (errors: string[]) => void;
  controlsFontSize: number;
  setControlsFontSize: (size: number) => void;
  infoPanelFontSize: number;
  setInfoPanelFontSize: (size: number) => void;
  modelName?: string | undefined;
};

// --- NEW: Define color palettes for the wave function ---
const colorPalettes: Record<string, string> = Object.keys(PALETTE_DEFINITIONS).reduce((acc, key) => {
  acc[key] = getCssGradient(key);
  return acc;
}, {} as Record<string, string>);

// Helper to get the first domain or a default fallback
const getActiveDomain = (domains: PhysicsDomain[], selectedId: string | null) => {
  return domains.find(d => d.id === selectedId) || domains[0] || {} as PhysicsDomain;
};

function Editor({ initialProjectData, baseProjectData, loadValidationErrors, setLoadValidationErrors, controlsFontSize, setControlsFontSize, infoPanelFontSize, setInfoPanelFontSize, modelName }: EditorProps) {
  const navigate = useNavigate();
  const [sceneObjects, setSceneObjects] = useState<SceneObjectType[]>(initialProjectData.sceneObjects);
  const [parameters, setParameters] = useState<CustomParameter[]>(initialProjectData.parameters);
  const [relations, setRelations] = useState<ParameterRelation[]>(initialProjectData.relations);
  const [physicsDomains, setPhysicsDomains] = useState<PhysicsDomain[]>(initialProjectData.physicsDomains);
  // --- NEW: State for which domain is selected in the Physics tab opacity/particle controls ---
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [globalConstants, setGlobalConstants] = useState<GlobalConstant[]>(initialProjectData.globalConstants);
  const [particles, setParticles] = useState<ParticleDefinition[]>(initialProjectData.particles || []);
  const [projectVariables, _setProjectVariables] = useState<any[]>((initialProjectData as any).projectVariables || []);
  const [psi2SurfaceStats, setPsi2SurfaceStats] = useState<Record<string, { min: number; max: number; integral: number }>>({});
  // Always take units from the base model JSON so changes there (e.g., mm -> nm)
  // are reflected even if an older saved snapshot had different units.
  const projectUnits = baseProjectData.units || initialProjectData.units;

  // NOTE: We no longer recompute normalization automatically when sliders
  // change; normalization is done during project validation on load and can
  // be refreshed manually from the Physics panel.

  // --- NEW: Manual helper to recompute normalization for one or all domains ---
  const recomputeNormalization = useCallback((domainId: string | null) => {
    setPhysicsDomains(prevDomains =>
      prevDomains.map(domain => {
        // If a specific domain is requested and this isn't it, leave unchanged
        if (domainId && domain.id !== domainId) {
          return domain;
        }

        // Clear normalization so GPU-based WaveCompute will recompute it
        if (!domain.waveEquation || !domain.waveEquation.isValidated) {
          return {
            ...domain,
            minMagnitude: undefined,
            maxMagnitude: undefined,
            logMinMagnitude: undefined,
          };
        }

        return {
          ...domain,
          minMagnitude: undefined,
          maxMagnitude: undefined,
          logMinMagnitude: undefined,
        };
      })
    );
  }, [setPhysicsDomains]);

  // Capture Psi² surface preview statistics per domain for display in the setup modal.
  void psi2SurfaceStats; // mark state as used so TypeScript doesn't treat it as unused
  const handlePsi2SurfaceStats = useCallback((domainId: string, stats: { min: number; max: number; integral: number }) => {
    setPsi2SurfaceStats(prev => ({ ...prev, [domainId]: stats }));
  }, []);

  // --- NEW: Compute project-level derived variables for display in Info panel ---
  const infoVariables = useMemo(() => {
    if (!projectVariables || projectVariables.length === 0) return [];
    const baseScope = buildEvaluationScope(sceneObjects, globalConstants);
    const paramsScope = parameters.reduce((acc: Record<string, any>, p) => ({ ...acc, [p.name]: p.value }), {});
    const scope: Record<string, any> = { ...baseScope, ...paramsScope, x: 0, y: 0, z: 0, t: 0 };

    // include particle mass using the same active particle logic as the Physics panel
    const particleList = particles || [];
    if (particleList.length > 0) {
      const fallback = particleList[0];
      const activeDomain = physicsDomains.length > 0
        ? (selectedDomainId ? physicsDomains.find(d => d.id === selectedDomainId) || physicsDomains[0] : physicsDomains[0])
        : undefined;

      const activeParticleId = activeDomain?.selectedParticleId || fallback.id;
      const activeParticle = particleList.find(p => p.id === activeParticleId) || fallback;

      const massVal = (activeParticle as any).mass ?? (activeParticle as any).massKg;
      if (massVal !== undefined) scope['mass'] = massVal;
    }

    const results: { name: string; value: number | string }[] = [];
    for (const v of projectVariables) {
      try {
        const expr = expandMacro(v.expression, 1);
        const val = evaluateExpressionWithScope(expr, scope);
        if (val !== null) {
          scope[v.name] = val;
          if (v.showInInfo) results.push({ name: v.name, value: val });
        } else {
          scope[v.name] = null;
        }
      } catch {
        scope[v.name] = null;
      }
    }
    return results;
  }, [projectVariables, parameters, globalConstants, particles, sceneObjects, physicsDomains, selectedDomainId]);

  // Calculate maximum domain dimension for normalizing trajectory detail
  const maxDomainDimension = useMemo(() => {
    if (physicsDomains.length === 0) return 1; // Default fallback
    let maxDim = 0;
    for (const domain of physicsDomains) {
      if (domain.size) {
        const [w, h, d] = domain.size;
        maxDim = Math.max(maxDim, w, h, d);
      }
    }
    return maxDim > 0 ? maxDim : 1; // Fallback to 1 if no valid sizes
  }, [physicsDomains]);

  const [transformMode, setTransformMode] = useState<TransformControlsMode>('translate');
  const [isDragging, setIsDragging] = useState(false);
  // A simpler default bounding box
  const defaultBounds = new THREE.Box3(new THREE.Vector3(-10, -10, -10), new THREE.Vector3(10, 10, 10));
  const [sceneBounds, setSceneBounds] = useState<THREE.Box3>(defaultBounds);
  const [showParamEditor, setShowParamEditor] = useState(false);
  const [projectName, setProjectName] = useState<string>(initialProjectData.projectName);
  const [projectVersion, setProjectVersion] = useState<string>(initialProjectData.projectVersion);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [objectCount, _setObjectCount] = useState(0);
  // --- NEW: UI State with Persistence ---
  const [labelTextSize, setLabelTextSize] = useState(() => parseFloat(localStorage.getItem('ui_labelTextSize') || '0.01'));
  const [showAxisLabels, setShowAxisLabels] = useState(() => localStorage.getItem('ui_showAxisLabels') !== 'false');
  const [showViewLabels, setShowViewLabels] = useState(() => localStorage.getItem('ui_showViewLabels') === 'true');
  const [overlapAxes, setOverlapAxes] = useState(false);
  const [axesIndex2D, setAxesIndex2D] = useState(0); // 0-3
  const [axesIndex3D, setAxesIndex3D] = useState(0); // 0-7

  useEffect(() => {
    localStorage.setItem('ui_labelTextSize', String(labelTextSize));
    localStorage.setItem('ui_showAxisLabels', String(showAxisLabels));
    localStorage.setItem('ui_showViewLabels', String(showViewLabels));
  }, [labelTextSize, showAxisLabels, showViewLabels]);

  const [panelWidth, setPanelWidth] = useState(400); // NEW: State for resizable panel width (default 400px)
  // --- NEW: State for canvas background color ---
  const [canvasColor, setCanvasColor] = useState<'black' | 'white'>('black');
  const [sceneScale, setSceneScale] = useState<[number, number, number]>([1, 1, 1]); // NEW: Global scene scale

  const [performanceMetrics, setPerformanceMetrics] = useState<Map<string, number>>(new Map()); // NEW: For technical tab
  const lastPerfUpdateRef = useRef(0); // Throttle performance metric re-renders
  const [showDomainEditor, setShowDomainEditor] = useState(false);
  const [previewDomain, setPreviewDomain] = useState<PhysicsDomain | null>(null); // NEW: State for domain preview
  const [previewKind, setPreviewKind] = useState<'domain' | 'wave' | 'surface' | 'surfacePsi2' | null>(null); // NEW: What are we previewing?
  const [lastSelectedSetupId, setLastSelectedSetupId] = useState<string | null>(null); // NEW: Remember selection
  // --- NEW: Flag to signal that we should return to the editor after a test render ---
  const isPreviewing = previewDomain !== null;
  const simulationTimeRef = useRef(0); // THE FIX: Centralized simulation time
  const [simulationTime, setSimulationTime] = useState(0); // For display

  // Keep the display simulationTime in sync with the internal
  // simulationTimeRef so the info panel's Sim/Phys Time counter
  // advances while the simulation runs. We sample via rAF and
  // only update state when the value changes by a small amount
  // to avoid excessive re-renders.
  useEffect(() => {
    let rafId: number | null = null;
    let lastValue = simulationTimeRef.current;
    let lastUpdateFrame = 0;
    let frameCount = 0;

    const tick = () => {
      frameCount++;
      const current = simulationTimeRef.current;
      // Throttle display updates to ~10 Hz (every 6 frames at 60fps)
      // and only when the value has actually changed.
      if (frameCount - lastUpdateFrame >= 6 && Math.abs(current - lastValue) > 0.001) {
        lastValue = current;
        lastUpdateFrame = frameCount;
        setSimulationTime(current);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // --- NEW: State for Physics/Wave controls moved from SceneView ---
  const [waveVersion, setWaveVersion] = useState(0);
  const [isWaveRunning, setIsWaveRunning] = useState(false);
  const [showWave, setShowWave] = useState(false);
  // --- NEW: State for WaveCompute resolution ---
  const [waveResolution, setWaveResolution] = useState(32);
  // Note: Wave computation does resolution number of GPU render passes per update.
  // With resolution=32, this means 32 passes. At 30 ups, that's ~960 render passes/sec.
  // 60 ups is often not achievable; 30-45 is more realistic for 3D wave computation.
  const [waveUpdatesPerSecond, setWaveUpdatesPerSecond] = useState(30);
  const [timeScaleBase, setTimeScaleBase] = useState(1);
  const [timeScaleFactor, setTimeScaleFactor] = useState(5);
  // Single effective mapping from simulation seconds to physical nanoseconds
  const timeScale = 1e9 * timeScaleBase * timeScaleFactor;
  // NEW: Global particle injection rate (particles per simulation second)
  const [particleInjectionRateSim, setParticleInjectionRateSim] = useState(1);
  // Smaller default trajectoryMinDistance for smoother-looking
  // particle trails in 3D without requiring user adjustment.
  const [trajectoryMinDistance, setTrajectoryMinDistance] = useState(0.01);
  // NEW: Visual settings for particles (independent of JSON models)
  const [showParticles, setShowParticles] = useState(true);
  const [showDetector, setShowDetector] = useState(true);
  const [showParticleMarkers, setShowParticleMarkers] = useState(true);
  const [showParticleTrajectories, setShowParticleTrajectories] = useState(true);
  // When true, keep trajectory trails even after particles leave the
  // domain or are killed.
  const [persistTrailsOnDeath, setPersistTrailsOnDeath] = useState(false);
  const [particleShape, setParticleShape] = useState<'sphere' | 'cube'>('sphere');
  const [particleSize, setParticleSize] = useState(0.2);
  const [particleMaxCount, setParticleMaxCount] = useState(200);
  const [particleColor, setParticleColor] = useState<string>('#ffff00');
  const [trajectoryColor, setTrajectoryColor] = useState<string>('#ffa500');
  // --- FIX: This state was defined in two places. Consolidate it here. ---
  const [isSelectionEnabled, setIsSelectionEnabled] = useState(false);

  // --- NEW: Auto Re-Cam Setting ---
  const [autoRecam, setAutoRecam] = useState(false);
  const [autoFitScale, setAutoFitScale] = useState(false);
  // Remember last-used Auto settings for 2D views
  const [autoRecam2D, setAutoRecam2D] = useState(true);
  const [autoFitScale2D, setAutoFitScale2D] = useState(false);

  // --- NEW: State to control which list is shown in the Setup tab ---
  const [setupListMode, setSetupListMode] = useState<'objects' | 'domains' | 'both'>(() => {
    const objectCount = initialProjectData.sceneObjects.filter(o => o.type !== 'axes').length;
    const domainCount = initialProjectData.physicsDomains.length;
    // Default to 'both' if the total is small, otherwise default to 'objects'
    return objectCount + domainCount < 10 ? 'both' : 'objects';
  });


  // --- FIX: Re-introduce the view state for switching between 'setup' and 'scene' ---
  const [isCalculating, setIsCalculating] = useState(false); // For test renders and the main solver

  type OrbitControlsRef = ComponentRef<typeof OrbitControls>;
  // --- NEW: Refs for controls of each view ---
  const controlsRefs = useRef<React.RefObject<OrbitControlsRef>[]>([]);

  // --- NEW: State for multiple views ---
  const [numViews, setNumViews] = useState(1);
  const [activeViewIndex, setActiveViewIndex] = useState(0); // Track the hovered view
  // --- FIX: Initialize with one default view setting, ensuring it's stable ---
  const [viewSettings, setViewSettings] = useState<ViewSettings[]>(() => [{
    id: uuidv4(),
    cameraView: '3D', wheelMode: 'zoom', cameraResetVersion: 0, isToolbarExpanded: false, showGrid: true,
    clippingOffsets: { xy: 0, xz: 0, yz: 0 }, clippingVersion: 0, showAxes: true,
    flipX: false, flipY: false, isClippingEnabled: false, rotation: 0, fitScaleTrigger: 0,
  }]);
  const viewRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  // After initialization, switch to the model's default camera view if specified
  useEffect(() => {
    const raw = baseProjectData.defaultCameraView;
    // Normalize: accept '3d' as '3D', 'Yz' as 'yz', etc.
    const defaultView = raw === '3D' || raw?.toUpperCase() === '3D' ? '3D'
      : (raw?.toLowerCase() as CameraViewType | undefined);
    if (defaultView && defaultView !== '3D') {
      // Delay briefly so the 3D scene initializes first
      const timer = setTimeout(() => {
        setViewSettings(prev => prev.map(s => ({
          ...s,
          cameraView: defaultView,
          cameraResetVersion: s.cameraResetVersion + 1,
        })));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto Re-Cam on mount for 3D views: OrbitControls needs a short delay to
  // fully initialize before we can override its internal spherical coordinates.
  // Two staggered bumps: 300ms for the normal case, 700ms as a safety net for
  // fresh page loads where the R3F frame loop may still be settling.
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setViewSettings(prev => prev.map(s =>
        s.cameraView === '3D' ? { ...s, cameraResetVersion: s.cameraResetVersion + 1 } : s
      ));
    }, 300);
    const timer2 = setTimeout(() => {
      setViewSettings(prev => prev.map(s =>
        s.cameraView === '3D' ? { ...s, cameraResetVersion: s.cameraResetVersion + 1 } : s
      ));
    }, 700);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // NEW: Snapshot of view configuration before a temporary preview
  const [prePreviewViewState, setPrePreviewViewState] = useState<{
    viewSettings: ViewSettings[];
    activeViewIndex: number;
  } | null>(null);

  // --- FIX: This logic ensures the refs array always matches the number of views ---
  if (viewRefs.current.length !== viewSettings.length) {
    viewRefs.current = Array.from({ length: numViews }, (_, i) => viewRefs.current[i] || createRef<HTMLDivElement>());
    controlsRefs.current = Array.from({ length: numViews }, (_, i) => controlsRefs.current[i] || createRef<OrbitControlsRef>());
  }

  // --- NEW: Functions to add/remove specific views ---
  const addView = useCallback((viewType: CameraViewType) => {
    if (numViews >= 4) return; // Don't exceed max views

    const newSettings: ViewSettings = {
      id: uuidv4(), // Add a stable ID
      cameraView: viewType,
      wheelMode: 'zoom',
      cameraResetVersion: 0,
      clippingOffsets: { xy: 0, xz: 0, yz: 0 },
      clippingVersion: 0,
      showAxes: true,
      showGrid: true,
      isToolbarExpanded: false,
      flipX: false,
      flipY: false,
      isClippingEnabled: false,
      rotation: 0,
      fitScaleTrigger: 0,
    };

    setViewSettings(prev => [...prev, newSettings]);
    setNumViews(prev => prev + 1);
  }, [numViews]);

  // --- NEW: A dedicated function to stop any active preview ---
  const stopPreview = useCallback(() => {
    // Reset all preview-related states
    setIsCalculating(false);
    simulationTimeRef.current = 0; // Reset time when stopping
    setPreviewDomain(null);
    setPreviewKind(null);
    setShowDomainEditor(true); // Go back to the editor
    // Restore view configuration from before the preview, if we have one.
    setPrePreviewViewState(prev => {
      if (prev) {
        setViewSettings(prev.viewSettings);
        setActiveViewIndex(prev.activeViewIndex);
      }
      return null;
    });
  }, []); // This callback has no dependencies as it only uses setter functions

  // --- NEW: Callback to update a single domain's properties ---
  const updateDomain = useCallback((id: string, newProps: Partial<PhysicsDomain>) => {
    setPhysicsDomains(prevDomains =>
      prevDomains.map(d => (d.id === id ? { ...d, ...newProps } : d))
    );
  }, [setPhysicsDomains]);

  // --- NEW: Callback to update all domains at once ---
  const updateAllDomains = useCallback((newProps: Partial<PhysicsDomain>) => {
    setPhysicsDomains(prevDomains =>
      prevDomains.map(d => ({ ...d, ...newProps }))
    );
  }, [setPhysicsDomains]);

  // --- NEW: Callback to update all relations at once ---
  const updateAllRelations = useCallback((updater: (relation: ParameterRelation) => ParameterRelation) => {
    setRelations(prevRelations =>
      prevRelations.map(updater)
    );
  }, [setRelations]);

  // --- NEW: Callback to update all domains at once (for renaming) ---
  const updateAllDomainsForRename = useCallback((updater: (domain: PhysicsDomain) => PhysicsDomain) => {
    setPhysicsDomains(prevDomains => prevDomains.map(updater));
  }, [setPhysicsDomains]);

  // --- NEW: Logic for panel resizing, moved to App.tsx ---
  const isResizing = useRef(false);
  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    isResizing.current = true;
    // Add listeners to the window to capture mouse movement everywhere
    window.addEventListener('pointermove', handleResizeMove);
    window.addEventListener('pointerup', handleResizeEnd);
  };

  const handleResizeMove = useCallback((e: PointerEvent) => {
    if (!isResizing.current) return;
    // Constrain width between a reasonable min and max
    const newWidth = Math.max(240, Math.min(720, e.clientX));
    setPanelWidth(newWidth);
  }, []);

  const handleResizeEnd = useCallback(() => {
    isResizing.current = false;
    // Clean up the global listeners
    window.removeEventListener('pointermove', handleResizeMove);
    window.removeEventListener('pointerup', handleResizeEnd);
  }, [handleResizeMove]);

  // Ensure listeners are cleaned up if the component unmounts
  useEffect(() => {
    return () => handleResizeEnd();
  }, [handleResizeEnd]);


  // --- NEW: Function to remove a specific view by its ID ---
  const removeView = useCallback((idToRemove: string) => {
    if (numViews <= 1) return; // Should not be possible if button is hidden, but good practice

    setViewSettings(prev => {
      const newSettings = prev.filter(setting => setting.id !== idToRemove);
      // If the active view was removed, reset active index to 0
      const activeSetting = prev[activeViewIndex];
      if (activeSetting && activeSetting.id === idToRemove) setActiveViewIndex(0);
      return newSettings;
    });
    setNumViews(prev => prev - 1);
  }, [numViews, activeViewIndex]);
  // --- Multi-view State Management ---

  // --- Auto-compute visual timeScaleBase from omega/k for good motion speed ---
  // This uses omega/k to derive a timeScale that makes the wave visually move
  // at a reasonable speed (~100 pixels/sec). The ACTUAL physical time is
  // computed separately for display using correct SI physics.
  useEffect(() => {
    if (!sceneBounds || sceneBounds.isEmpty()) return;

    try {
      const size = sceneBounds.getSize(new THREE.Vector3());
      const maxExtent = Math.max(size.x, size.y, size.z);
      if (!isFinite(maxExtent) || maxExtent <= 0) return;

      const travelDistance = maxExtent / 100; // nm: target distance per 1s sim time

      const baseScope = buildEvaluationScope(sceneObjects, globalConstants);
      const paramsScope = parameters.reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {} as Record<string, any>);
      const fullScope: Record<string, any> = { ...baseScope, ...paramsScope, t: 0 };

      const particleList = particles || [];
      if (particleList.length === 0) return;

      const fallback = particleList[0];
      const activeDomain = physicsDomains.length > 0
        ? (selectedDomainId ? physicsDomains.find(d => d.id === selectedDomainId) || physicsDomains[0] : physicsDomains[0])
        : undefined;
      const activeParticleId = activeDomain?.selectedParticleId || fallback.id;
      const activeParticle = particleList.find(p => p.id === activeParticleId) || fallback;

      const massVal = (activeParticle as any).mass ?? (activeParticle as any).massKg;
      if (massVal === undefined) return;
      fullScope['mass'] = massVal;

      // Use omega/k for visual timeScale (makes motion work)
      const kVar = projectVariables?.find(pv => pv.name === 'k');
      const omegaVar = projectVariables?.find(pv => pv.name === 'omega');
      if (!kVar || !omegaVar) return;

      const kVal = evaluateExpressionWithScope(kVar.expression, fullScope);
      if (kVal === null || !isFinite(kVal) || kVal <= 0) return;
      fullScope['k'] = kVal;

      const omegaVal = evaluateExpressionWithScope(omegaVar.expression, fullScope);
      if (omegaVal === null || !isFinite(omegaVal) || omegaVal <= 0) return;

      const waveSpeed = omegaVal / kVal; // for visual timeScale only
      if (!isFinite(waveSpeed) || waveSpeed <= 0) return;

      const newBase = travelDistance / (waveSpeed * 1e9);
      if (isFinite(newBase) && newBase > 0) {
        setTimeScaleBase(newBase);
      }
    } catch {
      // Keep existing timeScaleBase
    }
  }, [sceneBounds, sceneObjects, globalConstants, parameters, particles, projectVariables, physicsDomains, selectedDomainId]);

  // --- NEW: Fit Scale Logic ---
  const handleFitScale = useCallback((viewIndex: number, triggerCameraFit = false) => {
    const setting = viewSettings[viewIndex];
    const viewType = setting.cameraView;
    if (viewType === '3D') return;

    const viewEl = viewRefs.current[viewIndex]?.current;
    if (!viewEl) return;

    // Calculate bounds fresh from objectRefs to ensure they match the current visual scale
    const objects = Array.from(objectRefs.current.values())
      .filter(o => o.userData?.isSceneObject);
    if (objects.length === 0) return;

    // --- FIX: Force update matrices to ensure bounds are absolutely fresh ---
    for (const root of objects) {
        root.updateMatrixWorld(true);
    }

    const bounds = new THREE.Box3();
    for (const root of objects) bounds.expandByObject(root);
    if (bounds.isEmpty()) return;

    const { width, height } = viewEl.getBoundingClientRect();
    const viewAspect = width / height;
    const size = bounds.getSize(new THREE.Vector3());

    let wAxis: 'x' | 'y' | 'z';
    let hAxis: 'x' | 'y' | 'z';
    let wDim: number;
    let hDim: number;

    if (viewType === 'xy') { wAxis = 'x'; hAxis = 'y'; wDim = size.x; hDim = size.y; }
    else if (viewType === 'xz') { wAxis = 'x'; hAxis = 'z'; wDim = size.x; hDim = size.z; }
    else /* yz */ { wAxis = 'z'; hAxis = 'y'; wDim = size.z; hDim = size.y; }

    // --- FIX: Handle rotation for Fit Scale ---
    if (setting.rotation % 2 !== 0) {
       const tempDim = wDim; wDim = hDim; hDim = tempDim;
       const tempAxis = wAxis; wAxis = hAxis; hAxis = tempAxis;
    }

    const axisToIndex = { x: 0, y: 1, z: 2 };
    const newScale = [...sceneScale];

    const currentScaleW = newScale[axisToIndex[wAxis]];
    const currentScaleH = newScale[axisToIndex[hAxis]];

    // Guard against zero dimensions or scales
    if (wDim < 0.001 || hDim < 0.001 || currentScaleW < 0.001 || currentScaleH < 0.001) return;

    const boundsAspect = wDim / hDim;
    
    // --- STABILITY FIX: Add tolerance to prevent flickering ---
    if (Math.abs(1 - (boundsAspect / viewAspect)) < 0.01) return;

    // --- FIX: Correct math for target ratio ---
    // We want: (unscaledW * newScaleW) / (unscaledH * newScaleH) = viewAspect
    // newScaleW / newScaleH = (currentScaleW / currentScaleH) * (viewAspect / boundsAspect)
    const targetScaleRatio = (currentScaleW / currentScaleH) * (viewAspect / boundsAspect);

    // To prevent "exploding" scales (e.g. 4000), we anchor the larger scale 
    // to the current maximum scale (or 1) and scale the other dimension DOWN.
    const baseScale = Math.max(currentScaleW, currentScaleH, 1);
    let newScaleW = baseScale;
    let newScaleH = baseScale;

    if (targetScaleRatio > 1) {
      // Width needs to be relatively larger than Height.
      // Since we anchor to baseScale, we keep W at base and shrink H.
      // newScaleW / newScaleH = targetRatio => base / newScaleH = targetRatio => newScaleH = base / targetRatio
      newScaleH = baseScale / targetScaleRatio;
    } else {
      // Height needs to be relatively larger than Width.
      // Keep H at base and shrink W.
      // newScaleW / base = targetRatio => newScaleW = base * targetRatio
      newScaleW = baseScale * targetScaleRatio;
    }

    // Clamp to safe values to prevent precision issues or zero
    newScaleW = Math.max(0.001, newScaleW);
    newScaleH = Math.max(0.001, newScaleH);

    // Round to 3 decimal places for stability
    newScaleH = Math.round(newScaleH * 1000) / 1000;
    newScaleW = Math.round(newScaleW * 1000) / 1000;

    if (Math.abs(currentScaleW - newScaleW) > 0.001 || Math.abs(currentScaleH - newScaleH) > 0.001) {
      newScale[axisToIndex[wAxis]] = newScaleW;
      newScale[axisToIndex[hAxis]] = newScaleH;
      setSceneScale(newScale as [number, number, number]);

      // If caller requested, trigger the camera-fit after the scale update settles.
      if (triggerCameraFit) {
        setTimeout(() => {
          setViewSettings(prev => prev.map((s, idx) => idx === viewIndex ? { ...s, fitScaleTrigger: s.fitScaleTrigger + 1 } : s));
        }, 0);
      }
    } else {
      // If nothing changed but caller still wants a camera fit, trigger it anyway.
      if (triggerCameraFit) {
        setTimeout(() => {
          setViewSettings(prev => prev.map((s, idx) => idx === viewIndex ? { ...s, fitScaleTrigger: s.fitScaleTrigger + 1 } : s));
        }, 0);
      }
    }
  }, [viewSettings, sceneScale, setSceneScale, setViewSettings]);

  /**
   * Unified handler for all previews (domain box, wave test, particle surface test).
   * `kind` decides what SceneView will render while the countdown is active.
   */
  const handlePreview = (domain: PhysicsDomain, kind: 'domain' | 'wave' | 'surface' | 'surfacePsi2') => {
    const isWaveTest = kind === 'wave';

    // Capture the current view configuration once at the start of a preview
    // so we can restore it when the preview finishes.
    if (!prePreviewViewState) {
      setPrePreviewViewState({
        viewSettings: viewSettings.map(v => ({ ...v })),
        activeViewIndex,
      });
    }

    // For Psi² surface previews, ensure the active view is in 3D mode so
    // the visualization always makes sense spatially.
    if (kind === 'surfacePsi2') {
      setViewSettings(prev => {
        if (prev.length === 0) return prev;
        const targetIndex = Math.min(Math.max(activeViewIndex, 0), prev.length - 1);
        return prev.map((setting, index) =>
          index === targetIndex ? { ...setting, cameraView: '3D' } : setting
        );
      });
    }

    setPreviewDomain(domain);
    setPreviewKind(kind);
    setIsCalculating(isWaveTest); // Only calculate for wave function tests
    if (isWaveTest) simulationTimeRef.current = 0; // Reset time on new test
  };

  // --- NEW: Auto Fit Scale Effect ---
  useEffect(() => {
    if (autoFitScale) {
      let targetIndex = activeViewIndex;
      if (viewSettings[targetIndex]?.cameraView === '3D') {
        targetIndex = viewSettings.findIndex(v => v.cameraView !== '3D');
      }

      if (targetIndex !== -1 && viewSettings[targetIndex]?.cameraView !== '3D') {
        handleFitScale(targetIndex);
      }
    }
  }, [sceneBounds, autoFitScale, activeViewIndex, viewSettings, handleFitScale]);

  const handleTestRender = (domain: PhysicsDomain) => {
    if (!domain.waveEquation || !domain.waveEquation.isValidated) {
      return false;
    }
    handlePreview(domain, 'wave'); // Use the unified handler for a wave test
    return true;
  };

  // NEW: Test-render a single particle injection surface using geometric injection surfaces.
  const handleTestSurfaceRender = (domain: PhysicsDomain, surfaceId: string, mode: 'surface' | 'surfacePsi2' = 'surface') => {
    const allSurfaces = domain.injectionSurfaces || [];
    const surface = allSurfaces.find(s => s.id === surfaceId);
    if (!surface) {
      return false;
    }

    const domainForPreview: PhysicsDomain = {
      ...domain,
      injectionSurfaces: [surface],
    };

    handlePreview(domainForPreview, mode === 'surface' ? 'surface' : 'surfacePsi2');
    return true;
  };

  const handleExport = () => {
    const projectData: ProjectData = {
      projectName,
      projectVersion,
      sceneObjects,
      parameters,
      relations,
      physicsDomains,
      globalConstants,
      particles,
      projectVariables,
      units: { distance: 'nm', energy: 'eV' }, // Assuming default units for now
    };
    const filename = `${projectName.replace(/\s+/g, '_') || 'project'}.json`;
    saveProjectToFile(projectData, filename);
  };

  // --- NEW: Persist current project state (including palette, opacity, parameters) to localStorage ---
  useEffect(() => {
    // Build a serializable snapshot of the current project state
    const snapshot: ProjectData = {
      projectName,
      projectVersion,
      sceneObjects,
      parameters,
      relations,
      physicsDomains,
      globalConstants,
      particles,
      projectVariables,
      units: projectUnits,
    } as ProjectData;

    const storageKey = modelName ? `myProjectData:${modelName}` : 'myProjectData';
    try {
      localStorage.setItem(storageKey, JSON.stringify(snapshot));
    } catch {
      // Ignore storage errors (e.g., private mode / quota)
    }
  }, [
    projectName,
    projectVersion,
    sceneObjects,
    parameters,
    relations,
    physicsDomains,
    globalConstants,
    particles,
    projectVariables,
    projectUnits,
    modelName,
  ]);

  // --- NEW: Reset current project state back to the model defaults ---
  const handleResetProjectToDefaults = () => {
    const storageKey = modelName ? `myProjectData:${modelName}` : 'myProjectData';

    // Reset core project data from the pure model defaults (not the overridden initial state)
    setProjectName(baseProjectData.projectName);
    setProjectVersion(baseProjectData.projectVersion);
    setSceneObjects(JSON.parse(JSON.stringify(baseProjectData.sceneObjects)));
    setParameters(JSON.parse(JSON.stringify(baseProjectData.parameters)));
    setRelations(JSON.parse(JSON.stringify(baseProjectData.relations)));
    setPhysicsDomains(JSON.parse(JSON.stringify(baseProjectData.physicsDomains)));
    setGlobalConstants(JSON.parse(JSON.stringify(baseProjectData.globalConstants)));
    setParticles(JSON.parse(JSON.stringify(baseProjectData.particles || [])));
    _setProjectVariables(JSON.parse(JSON.stringify((baseProjectData as any).projectVariables || [])));

    // Reset simulation-related UI state to app defaults
    simulationTimeRef.current = 0;
    setSimulationTime(0);
    setShowWave(false);
    setIsWaveRunning(false);
    setWaveVersion(v => v + 1); // Force wave re-init next time it's started

    // Reset physics/visualization controls to app defaults
    setSelectedDomainId(null);
    setTimeScaleFactor(5); // Default sim speed factor
    setParticleInjectionRateSim(0); // Default particle injection rate
    setParticleMaxCount(200); // Default max particle count
    setWaveResolution(32); // Default wave resolution

    // Reset simple view-related defaults that affect appearance
    setSceneScale([1, 1, 1]);
    setCanvasColor('black');

    // Clear any active previews or editors that might reference old domains
    setPreviewDomain(null);
    setShowDomainEditor(false);
    setShowParamEditor(false);

    // Clear detector hit histograms so they reflect the fresh model state
    detectorGridsRef.current.clear();
    detectorMaxCountRef.current = 0;
    setDetectorMaxCount(0);
    setDetectorTotalHits(0);
    setDetectorTotalHits(0);

    // Clear any persisted override so a full page reload returns to JSON defaults
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage errors (e.g., in private mode)
    }
  };

  const handleReset = () => {
    // This function correctly handles resetting the simulation time and visualization
    // in both 'running' and 'paused' states.

    // 1. Immediately reset the simulation time reference.
    simulationTimeRef.current = 0;
    setSimulationTime(0); // Also update the display

    // 2. Reset particle counts to zero and clear per-domain counts
    particleCountsRef.current.clear();
    setRuntimeParticleCountActive(0);
    setRuntimeParticleCountTotal(0);

    // Also clear detector hit histograms so they restart from zero
    detectorGridsRef.current.clear();
    detectorMaxCountRef.current = 0;
    setDetectorMaxCount(0);
    setDetectorTotalHits(0);
    setDetectorTotalHits(0);

    // 3. Increment waveVersion to force particle system to reinitialize and clear all particles
    setWaveVersion(v => v + 1);

    // 4. If the simulation is NOT running, we need to manually trigger a
    //    re-computation to show the wave at t=0. We also ensure the wave is visible.
    if (!isWaveRunning) {
      setShowWave(true);
    }
    // If the simulation IS running, the useFrame loop will automatically pick up
    // the reset time on its next tick. No extra action is needed.
  };

  // --- NEW: General axes placement helper with 4 steps for 2D and 8 for 3D ---
  const placeAxesByIndex = useCallback((viewType: CameraViewType, index: number, overrideOverlap?: boolean) => {
    const axesObj = sceneObjects.find(o => o.type === 'axes');
    if (!axesObj) return;

    const axesSize = typeof (axesObj as any).size === 'number' ? (axesObj as any).size : 5;

    // Compute bounds of all non-axes scene objects
    const bounds = new THREE.Box3();
    for (const obj of sceneObjects) {
      if (obj.type === 'axes') continue;
      const [x, y, z] = obj.position;
      const [sx, sy, sz] = obj.scale;
      const half = new THREE.Vector3(sx / 2, sy / 2, sz / 2);
      const center = new THREE.Vector3(x, y, z);
      const min = center.clone().sub(half);
      const max = center.clone().add(half);
      bounds.expandByPoint(min);
      bounds.expandByPoint(max);
    }

    // Also include domain bounds (wave regions)
    for (const domain of physicsDomains) {
      const db = parseDomainBounds(domain, sceneObjects, null, globalConstants, particles);
      if (!db.isEmpty()) bounds.union(db);
    }

    if (bounds.isEmpty()) return;

    const size = bounds.getSize(new THREE.Vector3());
    const margin = 0.1; // 10% of scene size
    const offset = new THREE.Vector3(size.x * margin, size.y * margin, size.z * margin);

    const min = bounds.min.clone();
    const max = bounds.max.clone();

    const useOverlap = overrideOverlap ?? overlapAxes;

    const getInsideOrigin = (minVal: number, maxVal: number, preferMax: boolean) => {
      if (preferMax) {
        const candidate = maxVal - axesSize;
        return Math.max(minVal, candidate);
      }
      return minVal;
    };

    const getOutsideOrigin = (minVal: number, maxVal: number, preferMax: boolean, marginVal: number) => {
      if (preferMax) {
        return maxVal + marginVal;
      }
      return minVal - axesSize - marginVal;
    };

    const chooseOrigin = (axis: 'x' | 'y' | 'z', preferMax: boolean) => {
      const minVal = (min as any)[axis] as number;
      const maxVal = (max as any)[axis] as number;
      const marginVal = (offset as any)[axis] as number;
      return useOverlap
        ? getInsideOrigin(minVal, maxVal, preferMax)
        : getOutsideOrigin(minVal, maxVal, preferMax, marginVal);
    };

    // Decide which side to use on each world axis based on view type and index
    let preferMaxX = false;
    let preferMaxY = false;
    let preferMaxZ = false;

    if (viewType === '3D') {
      // 8 positions: use bits of index for x/y/z corners
      preferMaxX = (index & 1) !== 0; // 0=min, 1=max
      preferMaxY = (index & 2) !== 0;
      preferMaxZ = (index & 4) !== 0;
    } else if (viewType === 'xy') {
      // 4 positions: X corner from bit0, Y corner from bit1, Z always at front (max)
      preferMaxX = (index & 1) !== 0;
      preferMaxY = (index & 2) !== 0;
      preferMaxZ = true;
    } else if (viewType === 'xz') {
      // 4 positions: X from bit0, Z from bit1, Y at front
      preferMaxX = (index & 1) !== 0;
      preferMaxZ = (index & 2) !== 0;
      preferMaxY = true;
    } else {
      // 'yz' view: Z from bit0, Y from bit1, X at front
      preferMaxZ = (index & 1) !== 0;
      preferMaxY = (index & 2) !== 0;
      preferMaxX = true;
    }

    const targetPos = new THREE.Vector3(
      chooseOrigin('x', preferMaxX),
      chooseOrigin('y', preferMaxY),
      chooseOrigin('z', preferMaxZ),
    );

    setSceneObjects(prev => prev.map(obj =>
      obj.id === axesObj.id ? { ...obj, position: [targetPos.x, targetPos.y, targetPos.z] as [number, number, number] } : obj
    ));
  }, [sceneObjects, physicsDomains, globalConstants, particles, setSceneObjects, overlapAxes]);

  const handleStart = () => {
    // Start the simulation without forcing wave visibility;
    // the Wave checkbox fully controls whether the wave is shown.
    setIsWaveRunning(true);
  };

  // --- NEW: Callback for GPU-based wave normalization from WaveCompute ---
  const handleGpuMagnitudeRange = useCallback(
    (domainId: string, range: { min: number; max: number; logMin: number }) => {
      setPhysicsDomains(prevDomains =>
        prevDomains.map(d =>
          d.id === domainId
            ? {
                ...d,
                minMagnitude: range.min,
                maxMagnitude: range.max,
                logMinMagnitude: range.logMin,
              }
            : d
        )
      );
    },
    []
  );

  const selectedObjectData = useMemo(() => {
    if (!selectedId) return null;
    for (const obj of sceneObjects) {
      const found = findObjectById(obj, selectedId);
      if (found) return found;
    }
    return null;
  }, [selectedId, sceneObjects]);

  useCursor(isDragging, 'grabbing', 'grab');

  const objectRefs = useRef<Map<string, THREE.Object3D>>(new Map());
  const selectedObjectRef = (selectedId ? objectRefs.current.get(selectedId) : null) ?? null;

  const handleSetObjectRef = useCallback((id: string, node: THREE.Object3D | null) => {
    const map = objectRefs.current;
    if (node) {
      map.set(id, node);
    } else {
      map.delete(id);
    }
    // Avoid calling setState from a ref callback to prevent
    // nested commit/update loops in React. If we need the
    // object count for keys or bounds, derive it from
    // sceneObjects instead of from this ref.
  }, []);

  // Helper: decide whether a hex color is dark. Returns true for dark colors.
  const isHexColorDark = (hex?: string) => {
    if (!hex) return false;
    const h = hex.replace('#', '');
    if (h.length !== 6) return false;
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;
    const srgb = [r, g, b].map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    const lum = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    return lum < 0.2;
  };

  const getNameTextColor = (obj: SceneObjectType) => {
    const base = obj.color ?? null;
    if (!base) return '#ccc';
    // If the object's color is dark, use white for readability; otherwise use the object color.
    return isHexColorDark(base) ? '#fff' : base;
  };

  // Immutable updates so React detects changes and Leva rebuilds
  const updateObject = useCallback((id: string, newProps: Partial<SceneObjectType> | ((prev: SceneObjectType) => Partial<SceneObjectType>)) => {

    // Helper to find an object by id in a nested tree
    const findById = (objects: SceneObjectType[], targetId: string): SceneObjectType | null => {
      for (const obj of objects) {
        if (obj.id === targetId) return obj;
        if (obj.children) {
          const found = findById(obj.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    // Recursive helper to apply already-computed props
    const updateRecursively = (
      objects: SceneObjectType[],
      targetId: string,
      props: Partial<SceneObjectType>
    ): SceneObjectType[] => {
      return objects.map(obj => {
        if (obj.id === targetId) {
          return { ...obj, ...props };
        }
        if (obj.children) {
          return {
            ...obj,
            children: updateRecursively(obj.children, targetId, props)
          };
        }
        return obj;
      });
    };

    // Apply the update and, if geometry changed, restart the wave at t = 0
    setSceneObjects(prevObjects => {
      const target = findById(prevObjects, id);
      if (!target) return prevObjects;

      const finalProps = typeof newProps === 'function' ? newProps(target) : newProps;

      // Detect changes that should reset the wave (geometry or visibility)
      const geomKeys: (keyof SceneObjectType)[] = ['position', 'rotation', 'scale', 'visible'];
      const geometryChanged = geomKeys.some(key => {
        const nextVal = (finalProps as any)[key];
        if (nextVal === undefined) return false;
        const prevVal = (target as any)[key];
        if (!Array.isArray(nextVal) || !Array.isArray(prevVal) || nextVal.length !== prevVal.length) {
          return nextVal !== prevVal;
        }
        for (let i = 0; i < nextVal.length; i++) {
          if (nextVal[i] !== prevVal[i]) return true;
        }
        return false;
      });

      const updated = updateRecursively(prevObjects, id, finalProps);

      // Avoid repeatedly restarting the wave while an object is being
      // dragged with the transform gizmo; instead, trigger a single
      // reset when the drag finishes. This prevents visual "distortion"
      // during interactive moves.
      if (geometryChanged && !isDragging) {
        // Reset simulation time and force a fresh wave mount
        simulationTimeRef.current = 0;
        setSimulationTime(0);
        setWaveVersion(v => v + 1);
      }

      return updated;
    });

  }, [setSceneObjects, setSimulationTime, setWaveVersion, simulationTimeRef, isDragging]);

  const addObject = useCallback((type: 'box' | 'sphere' | 'cylinder' | 'tube' | 'group') => {
    // --- THE FIX: A more robust way to generate a unique name and ID ---
    let newName = '';
    let counter = 1;
    const existingNamesAndIds = new Set<string>();
    const collectNames = (objects: SceneObjectType[]) => {
      objects.forEach(obj => {
        existingNamesAndIds.add(obj.name ?? "");
        existingNamesAndIds.add(obj.id);
        if (obj.children) collectNames(obj.children);
      });
    };
    collectNames(sceneObjects);

    do {
      newName = `${type}${String(counter++).padStart(3, '0')}`;
    } while (existingNamesAndIds.has(newName));

    // Determine default object size: half of the smallest sceneBounds axis, or 100 if unavailable
    let defaultSize = 100;
    if (sceneBounds && !sceneBounds.isEmpty()) {
      const sizeVec = sceneBounds.getSize(new THREE.Vector3());
      const minExtent = Math.min(sizeVec.x, sizeVec.y, sizeVec.z);
      if (isFinite(minExtent) && minExtent > 0) {
        defaultSize = minExtent / 2;
      }
    }

    // Generate a random hex color
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

    // Default scales per type: boxes & spheres use a cube, cylinders use same height and radius
    const scale: [number, number, number] =
      type === 'cylinder'
        ? [defaultSize / 2, defaultSize, defaultSize / 2]
        : [defaultSize, defaultSize, defaultSize];

    const newObject: SceneObjectType = {
      id: uuidv4(), // Use a stable, unique UUID for the ID
      type: type,
      name: newName,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale,
      // Only assign color and children based on type
      ...(type !== 'group' && { color: randomColor }),
      ...(type === 'group' && { children: [] }),
      ...(type === 'tube' && { tubeInnerRadius: 0.8 }),
    };

    // Add the new object to the root of the scene
    setSceneObjects(prevObjects => [...prevObjects, newObject]);

    // Automatically select the new object
    setSelectedId(newObject.id);

    // Enable selection mode so the new object can be edited
    setIsSelectionEnabled(true);

  }, [sceneObjects, sceneBounds, setSceneObjects, setSelectedId, setIsSelectionEnabled]);

  const deleteObject = useCallback((idToDelete: string) => {
    if (!idToDelete) return;

    // This is the recursive helper function
    const removeRecursively = (
      objects: SceneObjectType[],
      targetId: string
    ): SceneObjectType[] => {
      // Filter out the object at the current level
      const filtered = objects.filter(obj => obj.id !== targetId);

      // If nothing was filtered at this level, recurse into children
      if (filtered.length === objects.length) {
        return objects.map(obj => {
          if (obj.children && obj.children.length > 0) {
            return { ...obj, children: removeRecursively(obj.children, targetId) };
          }
          return obj;
        });
      }

      // The object was found and removed at this level
      return filtered;
    };

    setSceneObjects(prevObjects => removeRecursively(prevObjects, idToDelete));
    setSelectedId(null); // Deselect after deleting
  }, [setSceneObjects]);

  // --- NEW: Callback for performance updates from WaveCompute ---
  const handlePerformanceUpdate = useCallback((domainId: string, updatesPerSecond: number) => {
    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

    setPerformanceMetrics(prev => {
      const previous = prev.get(domainId);
      const roundedPrev = previous !== undefined ? Math.round(previous) : undefined;
      const roundedNext = Math.round(updatesPerSecond);

      // Throttle UI updates: only re-render when the rounded rate changes
      // and at most every 2 seconds. Otherwise, keep the previous Map ref
      // so React skips re-rendering.
      if (roundedPrev === roundedNext && now - lastPerfUpdateRef.current < 2000) {
        return prev;
      }

      const newMap = new Map(prev);
      newMap.set(domainId, roundedNext);
      lastPerfUpdateRef.current = now;
      return newMap;
    });
  }, []);

  // --- NEW: Global 2D visual update rate (approx. frame rate) + UI time sync ---
  // This rAF loop tracks approximate 2D FPS and occasionally
  // mirrors simulationTimeRef into state for display. It is
  // throttled and guards against redundant updates to avoid
  // deep React update chains.
  useEffect(() => {
    let frameCount = 0;
    let lastLogTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    let rafId: number | null = null;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      frameCount++;
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const elapsed = now - lastLogTime;

      // 1) Measure approximate visual frame rate (for 2D visual ups)
      if (elapsed >= 1000) {
        const fps = (frameCount * 1000) / elapsed;
        setPerformanceMetrics(prev => {
          const previous = prev.get('__2D__');
          const roundedPrev = previous !== undefined ? Math.round(previous) : undefined;
          const roundedNext = Math.round(fps);
          if (roundedPrev === roundedNext) return prev;
          const newMap = new Map(prev);
          newMap.set('__2D__', roundedNext);
          return newMap;
        });
        frameCount = 0;
        lastLogTime = now;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [setPerformanceMetrics]);

  // --- NEW: Single toggle to cycle axes positions (4 steps in 2D, 8 in 3D) ---
  const handleCycleAxesPosition = useCallback(() => {
    const activeSettings = viewSettings[activeViewIndex] || viewSettings[0];
    const viewType = activeSettings?.cameraView ?? '3D';

    if (viewType === '3D') {
      const next = (axesIndex3D + 1) % 8;
      setAxesIndex3D(next);
      placeAxesByIndex('3D', next);
    } else {
      const next = (axesIndex2D + 1) % 4;
      setAxesIndex2D(next);
      // Use the concrete view type here (xy/xz/yz)
      placeAxesByIndex(viewType, next);
    }
  }, [viewSettings, activeViewIndex, axesIndex2D, axesIndex3D, placeAxesByIndex]);

  

  // --- NEW: Effect to deselect object when selection is disabled ---
  useEffect(() => {
    if (!isSelectionEnabled) {
      setSelectedId(null);
    }
  }, [isSelectionEnabled]);

  // Create a ref for the content container to use as the event source
  const contentContainerRef = useRef<HTMLDivElement>(null!);

  // --- NEW: Compute active particle info (kinetic energy and wave speed) for Physics Info panel ---
  const activeParticleInfo = useMemo(() => {
    if (!particles || particles.length === 0) return null;

    const particleList = particles;
    const fallback = particleList[0];

    const activeDomain = physicsDomains.length > 0
      ? (selectedDomainId ? physicsDomains.find(d => d.id === selectedDomainId) || physicsDomains[0] : physicsDomains[0])
      : undefined;

    const activeParticleId = activeDomain?.selectedParticleId || fallback.id;
    const activeParticle = particleList.find(p => p.id === activeParticleId) || fallback;

    const rawMass = (activeParticle as any).mass;
    const rawMassKg = (activeParticle as any).massKg;

    // Determine rest energy in keV (convention: JSON mass is rest energy in keV, or legacy kg)
    let restEnergyKeV: number | undefined;
    if (typeof rawMass === 'number') {
      restEnergyKeV = rawMass;
    } else if (typeof rawMassKg === 'number') {
      const cSquared = 8.987551787e16; // (m^2 / s^2)
      const joulePerKeV = 1.602176634e-16; // J / keV
      restEnergyKeV = (rawMassKg * cSquared) / joulePerKeV;
    }

    let kineticEnergyKeV: number | undefined;
    let waveSpeedNmPerNs: number | undefined;

    try {
      if (restEnergyKeV !== undefined && projectVariables && projectVariables.length > 0) {
        // Physical constants (SI) for info-panel calculations only
        const C_SI = 299792458; // m/s
        const EV_TO_J = 1.602176634e-19; // J/eV
        const HBAR_SI = 1.054571817e-34; // J*s

        // Convert rest energy (keV) -> mass in kg via E = m c^2
        const restEnergyJ = restEnergyKeV * 1e3 * EV_TO_J;
        const massKg = restEnergyJ / (C_SI * C_SI);
        if (!isFinite(massKg) || massKg <= 0) {
          return { name: activeParticle.name, kineticEnergyKeV: undefined, waveSpeedNmPerNs: undefined };
        }

        // Build scope at t = 0 for evaluating k (in 1 / distance units).
        // We assume project distance units are nanometers for physical interpretation.
        const baseScope = buildEvaluationScope(sceneObjects, globalConstants);
        const paramsScope = parameters.reduce((acc: Record<string, any>, p) => ({ ...acc, [p.name]: p.value }), {});
        const fullScope: Record<string, any> = { ...baseScope, ...paramsScope, t: 0, mass: restEnergyKeV };

        const kVar = projectVariables.find(pv => pv.name === 'k');
        if (kVar) {
          const kVal = evaluateExpressionWithScope(kVar.expression, fullScope);
          if (kVal !== null && isFinite(kVal) && kVal > 0) {
            // kVal is 1/nm (distance units interpreted as nm). Convert to 1/m.
            const kPerMeter = kVal * 1e9; // 1/nm -> 1/m

            // Group velocity v = ħ k / m in m/s. In nm/ns, the numeric value is identical.
            const vGroupMps = (HBAR_SI * kPerMeter) / massKg;
            if (isFinite(vGroupMps) && vGroupMps > 0) {
              waveSpeedNmPerNs = vGroupMps;

              // Kinetic energy E = (ħ^2 k^2) / (2 m)
              const p = HBAR_SI * kPerMeter;
              const kineticJ = (p * p) / (2 * massKg);
              const kineticEv = kineticJ / EV_TO_J;
              kineticEnergyKeV = kineticEv / 1e3;
            }
          }
        }
      }
    } catch {
      // If anything fails, fall back to showing just particle name.
    }

    // Compute TRUE physical time based on correct SI physics
    // Physical time = simulation time * (distance per sim second / wave speed)
    let physicalTimeNs = 0;
    if (waveSpeedNmPerNs && waveSpeedNmPerNs > 0 && sceneBounds && !sceneBounds.isEmpty()) {
      const size = sceneBounds.getSize(new THREE.Vector3());
      const maxExtent = Math.max(size.x, size.y, size.z);
      const travelDistance = maxExtent / 100; // nm per sim second
      const physicalNsPerSimSecond = travelDistance / waveSpeedNmPerNs;
      physicalTimeNs = simulationTime * physicalNsPerSimSecond;
    }

    return {
      name: activeParticle.name,
      kineticEnergyKeV,
      waveSpeedNmPerNs,
      physicalTimeNs,
    };
  }, [particles, physicsDomains, selectedDomainId, projectVariables, parameters, globalConstants, sceneObjects, sceneBounds, simulationTime]);

  // --- NEW: Filter performance metrics based on active views and wave state ---
  const visiblePerformanceMetrics = useMemo(() => {
    const has3DView = viewSettings.some(v => v.cameraView === '3D');
    const has2DView = viewSettings.some(v => v.cameraView !== '3D');

    // 3D-only layout: show only 3D compute rates, hide 2D visual FPS
    if (has3DView && !has2DView) {
      const filtered = new Map<string, number>();
      for (const [key, value] of performanceMetrics.entries()) {
        if (key === '__2D__') continue;
        filtered.set(key, value);
      }
      return filtered;
    }

    // 2D-only layout: show only the 2D visual FPS entry
    if (has2DView && !has3DView) {
      const filtered = new Map<string, number>();
      const val = performanceMetrics.get('__2D__');
      if (val !== undefined) {
        filtered.set('__2D__', val);
      }
      return filtered;
    }

    // Mixed layout (both 2D and 3D views): show everything
    return performanceMetrics;
  }, [performanceMetrics, viewSettings]);

  // Live particle count for display in the info panel.
  // Store counts per domain and sum them for total display
  const particleCountsRef = useRef<Map<string, { active: number; total: number }>>(new Map());
  const [runtimeParticleCountActive, setRuntimeParticleCountActive] = useState(0);
  const [runtimeParticleCountTotal, setRuntimeParticleCountTotal] = useState(0);
  // Aggregated counts from the GPU loop (written every frame)
  const aggregatedParticleCountsRef = useRef({ active: 0, total: 0 });
  // Last values that were pushed into React state for display
  const displayedParticleCountsRef = useRef({ active: 0, total: 0 });

  // --- NEW: Runtime detector hit accumulators ---------------------------------
  // For each detector-bearing scene object (usually a screen or wall), we
  // maintain a 2D histogram of hit counts over its configured U/V grid. This
  // lives in a ref for performance; a lightweight version counter can be used
  // later to trigger UI updates/visualizations.
  type DetectorGrid = {
    objectId: string;
    uDivisions: number;
    vDivisions: number;
    counts: Float32Array; // length = uDivisions * vDivisions
    totalHits: number;
    maxCount: number; // maximum count in any cell for this detector
  };

  const detectorGridsRef = useRef<Map<string, DetectorGrid>>(new Map());
  const [detectorGridsVersion, setDetectorGridsVersion] = useState(0);
  // Global detector statistics are written by the GPU loop every frame
  const detectorVersionRef = useRef(0);
  const detectorMaxCountRef = useRef(0);
  const detectorTotalHitsRef = useRef(0);
  // React state copies used for UI and visualization
  const [detectorMaxCount, setDetectorMaxCount] = useState(0);
  const [detectorTotalHits, setDetectorTotalHits] = useState(0);
  const displayedDetectorStatsRef = useRef({ version: 0, totalHits: 0, maxCount: 0 });

  // Display window for detector visualization (normalized 0-1 range over
  // the current global detectorMaxCount). This is controlled by a
  // dual-range slider in a small legend overlay on the canvas.
  const [detectorRangeMinNorm, setDetectorRangeMinNorm] = useState(0);
  const [detectorRangeMaxNorm, setDetectorRangeMaxNorm] = useState(1);
  // Mutable ref that always mirrors the range state.  DetectorLegend writes
  // to this directly during drag (no React re-render); SceneView's useFrame
  // reads it to push range changes into GPU uniforms at 60 fps.
  const detectorRangeRef = useRef<{ min: number; max: number }>({ min: 0, max: 1 });
  detectorRangeRef.current.min = detectorRangeMinNorm;
  detectorRangeRef.current.max = detectorRangeMaxNorm;

  // Global detector palette (applies to all detectors for consistent coloring)
  const [detectorPalette, setDetectorPalette] = useState('blue');

  // Sync global palette when user selects an object that has its own stored palette
  useEffect(() => {
    const p = selectedObjectData?.detector?.palette;
    if (p) setDetectorPalette(p);
  }, [selectedObjectData?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResetDetectorHits = useCallback(() => {
    // Clear all accumulated detector hit histograms and reset
    // global statistics so visualizations return to their
    // baseline state without changing any other simulation
    // parameters.
    detectorGridsRef.current.clear();
    detectorVersionRef.current = 0;
    detectorMaxCountRef.current = 0;
    detectorTotalHitsRef.current = 0;
    // Reset React state copies immediately so UI updates
    setDetectorMaxCount(0);
    setDetectorTotalHits(0);
    setDetectorGridsVersion(0);
    displayedDetectorStatsRef.current = { version: 0, totalHits: 0, maxCount: 0 };
    // Reset display window to full range
    setDetectorRangeMinNorm(0);
    setDetectorRangeMaxNorm(1);
    // Keep palette unchanged on reset so user preference is preserved
  }, []);

  // Reset detector histograms whenever any parameter changes (skip initial mount)
  const parametersInitializedRef = useRef(false);
  useEffect(() => {
    if (!parametersInitializedRef.current) {
      parametersInitializedRef.current = true;
      return;
    }
    handleResetDetectorHits();
  }, [parameters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Callback to aggregate particle counts from all domains
  const handleParticleCountChange = useCallback((domainId: string, activeCount: number, totalInjected: number) => {
    particleCountsRef.current.set(domainId, { active: activeCount, total: totalInjected });
    
    // Sum across all domains
    let totalActive = 0;
    let totalInjectedSum = 0;
    for (const counts of particleCountsRef.current.values()) {
      totalActive += counts.active;
      totalInjectedSum += counts.total;
    }
    // Write the aggregated totals into a ref; a separate
    // rAF-driven effect will push changes into React state at
    // a safe cadence to avoid nested update loops.
    aggregatedParticleCountsRef.current = { active: totalActive, total: totalInjectedSum };
  }, []);

  // Smoothly propagate particle count changes from the GPU loop
  // into React state without updating during the render/commit
  // of the same frame.
  useEffect(() => {
    let rafId: number | null = null;

    const tick = () => {
      const current = aggregatedParticleCountsRef.current;
      const last = displayedParticleCountsRef.current;
      if (current.active !== last.active || current.total !== last.total) {
        displayedParticleCountsRef.current = { ...current };
        setRuntimeParticleCountActive(current.active);
        setRuntimeParticleCountTotal(current.total);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const detectorPaletteGradient = useMemo(
    () => colorPalettes[detectorPalette] || colorPalettes['blue'],
    [detectorPalette]
  );

  // Callback invoked by the GPU particle integrator whenever a particle in a
  // given domain is absorbed inside a detector object. We accumulate hits into
  // a per-object 2D grid based on that object's current detector config.
  const handleDetectorHit = useCallback((_domainId: string, detectorObjectId: string, uIndex: number, vIndex: number) => {
    // Look up the detector's current configuration from the scene object list
    const obj = sceneObjects.find(o => o.id === detectorObjectId);
    const cfg = obj?.detector;
    if (!cfg || !cfg.enabled) return;

    const key = detectorObjectId;
    let grid = detectorGridsRef.current.get(key);

    if (!grid || grid.uDivisions !== cfg.uDivisions || grid.vDivisions !== cfg.vDivisions) {
      grid = {
        objectId: detectorObjectId,
        uDivisions: cfg.uDivisions,
        vDivisions: cfg.vDivisions,
        counts: new Float32Array(cfg.uDivisions * cfg.vDivisions),
        totalHits: 0,
        maxCount: 0,
      };
      detectorGridsRef.current.set(key, grid);
    }

    const clampedU = Math.min(grid.uDivisions - 1, Math.max(0, uIndex));
    const clampedV = Math.min(grid.vDivisions - 1, Math.max(0, vIndex));
    const idx = clampedV * grid.uDivisions + clampedU;

    grid.counts[idx] += 1;
    grid.totalHits += 1;
    if (grid.counts[idx] > grid.maxCount) {
      grid.maxCount = grid.counts[idx];
    }

    // Maintain a global maximum count across all detectors so we can
    // normalize heatmaps consistently and avoid scanning all cells
    // on every update.
    if (grid.maxCount > detectorMaxCountRef.current) {
      detectorMaxCountRef.current = grid.maxCount;
    }

    // Track total hits and a monotonically increasing version
    // counter; a separate rAF-driven effect will push these into
    // React state to avoid nested commit/update loops.
    detectorTotalHitsRef.current += 1;
    detectorVersionRef.current += 1;
  }, [sceneObjects]);

  // Propagate detector stats (total hits, global max, version)
  // from refs written by the GPU loop into React state.
  useEffect(() => {
    let rafId: number | null = null;

    const tick = () => {
      const version = detectorVersionRef.current;
      const totalHits = detectorTotalHitsRef.current;
      const maxCount = detectorMaxCountRef.current;
      const last = displayedDetectorStatsRef.current;

      if (version !== last.version || totalHits !== last.totalHits || maxCount !== last.maxCount) {
        displayedDetectorStatsRef.current = { version, totalHits, maxCount };
        setDetectorGridsVersion(version);
        setDetectorTotalHits(totalHits);
        setDetectorMaxCount(maxCount);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="app-container">
      <div className="left-panel-container" style={{ width: `${panelWidth}px` }}>
        <ControlTabs
          controlsFontSize={controlsFontSize}
          simulationTime={simulationTime}
          physicalTimeNs={activeParticleInfo?.physicalTimeNs ?? 0}
          physicalNsPerSimSecond={timeScale}
          activeParticleKineticEnergyKeV={activeParticleInfo?.kineticEnergyKeV}
          activeParticleWaveSpeedNmPerNs={activeParticleInfo?.waveSpeedNmPerNs}
          runtimeParticleCountActive={runtimeParticleCountActive}
          runtimeParticleCountTotal={runtimeParticleCountTotal}
          detectorTotalHits={detectorTotalHits}
          infoPanelFontSize={infoPanelFontSize}
          performanceMetrics={visiblePerformanceMetrics}
          domainLookup={{
            ...Object.fromEntries(physicsDomains.map(d => [d.id, d.name] as [string, string])),
            '__2D__': '2D visual',
          }}
          controlsOverlay={isPreviewing && (
            <div className="control-overlay">
                <div className="preview-container">
                  <button className="stop-preview-btn" onClick={stopPreview}>Return</button>
                </div>
              </div>
          )}
          infoVariables={infoVariables}
          tabs={[ // The content is now JSX, not a hook-calling function
            { label: 'File', content: (
              <div>
                <CustomTextInput label="Project:" value={projectName} onChange={setProjectName} />
                <CustomTextInput label="Version:" value={projectVersion} onChange={setProjectVersion} />
                <CustomButtonGroup>
                  <CustomButton onClick={() => { /* ... import logic ... */ }}>Import</CustomButton>
                  <CustomButton onClick={handleExport}>Export</CustomButton>
                </CustomButtonGroup>
                <CustomButtonGroup>
                  <CustomButton onClick={handleResetProjectToDefaults}>Reset Project</CustomButton>
                  <CustomButton onClick={() => navigate('/')}>All Models</CustomButton>
                </CustomButtonGroup>
              </div>
            )},
            { label: 'Setup', content: (
              <div>
                {/* --- FIX: Rearranged controls --- */}
                <CustomButtonGroup>
                  <CustomButton onClick={() => setShowDomainEditor(true)}>Edit Domains</CustomButton>
                  <CustomButton onClick={() => setShowParamEditor(true)}>Edit Parameters</CustomButton>
                </CustomButtonGroup>

                {/* --- MOVED: Edit Geometry toggle is now in the Setup tab --- */}
                <div className="custom-control-row">
                  <label>Edit Geometry</label>
                  <input type="checkbox" checked={isSelectionEnabled} onChange={(e) => setIsSelectionEnabled(e.target.checked)} />
                </div>

                {/* Add objects with icon-only buttons for each geometry type */}
                <div className="custom-control-row">
                  <label>Add</label>
                  <CustomButtonGroup>
                    <CustomButton
                      onClick={() => addObject('box')}
                      className="geom-icon-button"
                      title="Add box"
                    >
                      <svg
                        className="geom-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        {/* Front face */}
                        <rect x="5" y="7" width="10" height="10" fill="#dddddd" />
                        {/* Top face */}
                        <polygon
                          points="5,7 9,3 19,3 15,7"
                          fill="#f0f0f0"
                        />
                        {/* Side face */}
                        <polygon
                          points="15,7 19,3 19,13 15,17"
                          fill="#c0c0c0"
                        />
                        <polyline
                          points="5,17 15,17 19,13"
                          stroke="#888888"
                          strokeWidth="0.7"
                          fill="none"
                        />
                      </svg>
                    </CustomButton>
                    <CustomButton
                      onClick={() => addObject('sphere')}
                      className="geom-icon-button"
                      title="Add sphere"
                    >
                      <svg
                        className="geom-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <defs>
                          <radialGradient id="sphereGradient" cx="30%" cy="25%" r="70%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="40%" stopColor="#dddddd" />
                            <stop offset="100%" stopColor="#aaaaaa" />
                          </radialGradient>
                        </defs>
                        <circle cx="12" cy="12" r="8" fill="url(#sphereGradient)" />
                        <ellipse
                          cx="12"
                          cy="12"
                          rx="6.5"
                          ry="3"
                          fill="none"
                          stroke="#888888"
                          strokeWidth="0.7"
                        />
                      </svg>
                    </CustomButton>
                    <CustomButton
                      onClick={() => addObject('cylinder')}
                      className="geom-icon-button"
                      title="Add cylinder"
                    >
                      <svg
                        className="geom-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        {/* Top ellipse */}
                        <ellipse
                          cx="12"
                          cy="7"
                          rx="6"
                          ry="3"
                          fill="#f0f0f0"
                          stroke="#888888"
                          strokeWidth="0.7"
                        />
                        {/* Body */}
                        <rect
                          x="6"
                          y="7"
                          width="12"
                          height="10"
                          fill="#d0d0d0"
                          stroke="#888888"
                          strokeWidth="0.7"
                        />
                        {/* Bottom ellipse (front arc only) */}
                        <path
                          d="M6 17c0 1.66 2.69 3 6 3s6-1.34 6-3"
                          fill="none"
                          stroke="#888888"
                          strokeWidth="0.7"
                        />
                      </svg>
                    </CustomButton>
                    <CustomButton
                      onClick={() => addObject('tube')}
                      className="geom-icon-button"
                      title="Add tube (hollow cylinder)"
                    >
                      <svg
                        className="geom-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        {/* Top outer ellipse */}
                        <ellipse
                          cx="12"
                          cy="7"
                          rx="6"
                          ry="3"
                          fill="none"
                          stroke="#888888"
                          strokeWidth="0.7"
                        />
                        {/* Top inner ellipse */}
                        <ellipse
                          cx="12"
                          cy="7"
                          rx="4"
                          ry="2"
                          fill="#f0f0f0"
                          stroke="#888888"
                          strokeWidth="0.7"
                        />
                        {/* Outer walls */}
                        <line x1="6" y1="7" x2="6" y2="17" stroke="#888888" strokeWidth="0.7" />
                        <line x1="18" y1="7" x2="18" y2="17" stroke="#888888" strokeWidth="0.7" />
                        {/* Inner walls */}
                        <line x1="8" y1="7" x2="8" y2="17" stroke="#888888" strokeWidth="0.7" />
                        <line x1="16" y1="7" x2="16" y2="17" stroke="#888888" strokeWidth="0.7" />
                        {/* Bottom outer arc */}
                        <path
                          d="M6 17c0 1.66 2.69 3 6 3s6-1.34 6-3"
                          fill="none"
                          stroke="#888888"
                          strokeWidth="0.7"
                        />
                        {/* Bottom inner arc */}
                        <path
                          d="M8 17c0 1.1 1.79 2 4 2s4-0.9 4-2"
                          fill="none"
                          stroke="#888888"
                          strokeWidth="0.7"
                        />
                      </svg>
                    </CustomButton>
                  </CustomButtonGroup>
                </div>

                {/* --- MOVED & RENAMED: Dropdown to select which list to show --- */}
                <div className="custom-control-row">
                  <label>Show</label>
                  <select className="custom-text-input" value={setupListMode} onChange={(e) => setSetupListMode(e.target.value as any)}>
                    <option value="objects">Objects</option>
                    <option value="domains">Domains</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {/* --- UPDATED: Conditionally render object and domain lists --- */}
                {(setupListMode === 'objects' || setupListMode === 'both') && (
                  <div className="object-list-container">
                    <h4>Scene Objects</h4>
                    <ul className="object-list">
                      {sceneObjects.filter(o => o.type !== 'axes').map(obj => (
                        <li key={obj.id} className="object-list-item">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={() => updateObject(obj.id, { visible: !(obj.visible ?? true) })}
                              title={(obj.visible ?? true) ? 'Hide object' : 'Show object'}
                              style={{
                                width: '18px',
                                height: '18px',
                                backgroundColor: obj.color ?? '#666',
                                borderRadius: '3px',
                                border: '1px solid rgba(0,0,0,0.6)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                              }}
                              aria-pressed={!(obj.visible ?? true)}
                            >
                              <span style={{ width: '12px', height: '12px', display: 'inline-block', opacity: (obj.visible ?? true) ? 1 : 0.35 }} />
                            </button>

                            <span style={{ textDecoration: (obj.visible ?? true) ? 'none' : 'line-through', color: (obj.visible ?? true) ? getNameTextColor(obj) : '#888' }}>
                              {obj.name} ({obj.type})
                            </span>
                          </div>
                          <button
                            className={`edit-button ${selectedId === obj.id ? 'active' : ''}`}
                            onClick={() => {
                              // --- THE FIX: Toggle selection on click ---
                              if (selectedId === obj.id) {
                                setSelectedId(null);
                              } else {
                                setSelectedId(obj.id);
                                setIsSelectionEnabled(true);
                              }
                            }}
                            title={selectedId === obj.id ? 'Close Properties' : 'Edit Properties'}
                          >
                            {selectedId === obj.id ? '✖' : '✎'}
                          </button>                          
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(setupListMode === 'domains' || setupListMode === 'both') && (
                  <div className="object-list-container">
                    <h4>Physics Domains</h4>
                    <ul className="object-list">
                      {physicsDomains.map(domain => (
                        <li key={domain.id} className="object-list-item">
                          <span>{domain.name}</span>
                          <button
                            className="edit-button"
                            onClick={() => {
                              setLastSelectedSetupId(domain.id);
                              setShowDomainEditor(true);
                            }}
                            title="Edit Domain"
                          >
                            ✎
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )},
            { label: 'Layout', content: (
              <div>
                <div className="custom-control-row">
                  <label>Add View</label>
                  <CustomButtonGroup>
                    <CustomButton onClick={() => addView('3D')}>3D</CustomButton>
                    <CustomButton onClick={() => addView('xy')}>XY</CustomButton>
                    <CustomButton onClick={() => addView('xz')}>XZ</CustomButton>
                    <CustomButton onClick={() => addView('yz')}>YZ</CustomButton>
                  </CustomButtonGroup>
                </div>
                {/* --- FIX: Restore missing Layout controls --- */}
                <div className="custom-control-row">
                  <label>Show View Number</label>
                  <input type="checkbox" checked={showViewLabels} onChange={(e) => setShowViewLabels(e.target.checked)} />
                </div>
                {/* --- NEW: Control for canvas background color --- */}
                <div className="custom-control-row">
                  <label>Background</label>
                  <label className="switch">
                    <input type="checkbox"
                      checked={canvasColor === 'white'}
                      onChange={(e) => setCanvasColor(e.target.checked ? 'white' : 'black')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                {/* --- NEW: Scene Scale Sliders Group --- */}
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px 0', borderRadius: '6px', margin: '10px 16px', border: '1px solid #444' }}>
                  <div className="control-group-header" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none', borderBottom: 'none', marginBottom: '5px' }}>Axis Scale</div>
                  <CustomSliderInput label="X" value={sceneScale[0]} onChange={(v) => setSceneScale([v, sceneScale[1], sceneScale[2]])} min={0.1} max={10} step={0.1} onReset={() => setSceneScale([1, sceneScale[1], sceneScale[2]])} inputWidth="40px" />
                  <CustomSliderInput label="Y" value={sceneScale[1]} onChange={(v) => setSceneScale([sceneScale[0], v, sceneScale[2]])} min={0.1} max={10} step={0.1} onReset={() => setSceneScale([sceneScale[0], 1, sceneScale[2]])} inputWidth="40px" />
                  <CustomSliderInput label="Z" value={sceneScale[2]} onChange={(v) => setSceneScale([sceneScale[0], sceneScale[1], v])} min={0.1} max={10} step={0.1} onReset={() => setSceneScale([sceneScale[0], sceneScale[1], 1])} inputWidth="40px" />
                </div>

                {/* Restore dynamic layout parameters */}
{(() => {
                  const paramScope = parameters.reduce((acc, cp) => { acc[cp.name] = cp.value; return acc; }, {} as Record<string, number>);
                  return parameters.filter(p => p.tabName === 'Layout' || !p.tabName).map(p => {
                    let unitLabel: string | undefined;
                    if (p.quantity === 'distance') unitLabel = projectUnits.distance;
                    else if (p.quantity === 'time' && projectUnits.time) unitLabel = projectUnits.time;
                    else if (p.quantity === 'energy' && projectUnits.energy) unitLabel = projectUnits.energy;
                    const effectiveMin = p.minExpression ? (evaluateExpressionWithScope(p.minExpression, paramScope) ?? p.min) : p.min;
                    const effectiveMax = p.maxExpression ? (evaluateExpressionWithScope(p.maxExpression, paramScope) ?? p.max) : p.max;
                    const clampedValue = Math.min(Math.max(p.value, effectiveMin), effectiveMax);
                    return (
                      <CustomSliderInput
                        key={p.id}
                        label={p.label}
                        value={clampedValue}
                        min={effectiveMin}
                        max={effectiveMax}
                        step={p.step}
                        unitLabel={unitLabel}
                        onChange={(v) => setParameters(prev => {
                          const updated = prev.map(cp => cp.id === p.id ? { ...cp, value: v } : cp);
                          const scope = updated.reduce((acc, cp) => { acc[cp.name] = cp.value; return acc; }, {} as Record<string, number>);
                          return updated.map(cp => {
                            const eMax = cp.maxExpression ? (evaluateExpressionWithScope(cp.maxExpression, scope) ?? cp.max) : cp.max;
                            const eMin = cp.minExpression ? (evaluateExpressionWithScope(cp.minExpression, scope) ?? cp.min) : cp.min;
                            const clamped = Math.min(Math.max(cp.value, eMin), eMax);
                            return clamped !== cp.value ? { ...cp, value: clamped } : cp;
                          });
                        })}
                      />
                    );
                  });
                })()}
              </div>
            )},
            { label: 'Physics', content: (
              <div>
                {/* Project particles dropdown (show only if project defines particles) */}
                {particles && particles.length > 0 && (
                  <div className="custom-control-row">
                    <label>Particle</label>
                    {/* Require selection when project defines particles: no '(none)' option. */}
                    <select
                      className="custom-text-input"
                      value={(() => {
                        const fallback = particles[0]?.id || '';
                        if (selectedDomainId) return physicsDomains.find(d => d.id === selectedDomainId)?.selectedParticleId || fallback;
                        return physicsDomains[0]?.selectedParticleId || fallback;
                      })()}
                      onChange={(e) => {
                        const val = e.target.value;
                        // When the particle changes, reset time and wave so all
                        // particle-dependent quantities are recomputed from t = 0.
                        simulationTimeRef.current = 0;
                        setSimulationTime(0);
                        if (!isWaveRunning) {
                          setWaveVersion(v => v + 1);
                        }
                        if (selectedDomainId) {
                          updateDomain(selectedDomainId, { selectedParticleId: val });
                        } else {
                          updateAllDomains({ selectedParticleId: val });
                        }
                      }}
                      disabled={physicsDomains.length === 0}
                    >
                      {particles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                )}

                {/* Domain selector for domain-aware controls */}
                <div className="custom-control-row">
                  <label>Domain</label>
                  <select className="custom-text-input" value={selectedDomainId || 'all'} onChange={(e) => setSelectedDomainId(e.target.value === 'all' ? null : e.target.value)}>
                    <option value="all">All Domains</option>
                    {physicsDomains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                {/* Top-level visibility toggles */}
                <div className="custom-control-row" style={{ justifyContent: 'flex-start', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Wave</span>
                    <input type="checkbox" checked={showWave} onChange={(e) => setShowWave(e.target.checked)} />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Particle</span>
                    <input type="checkbox" checked={showParticles} onChange={(e) => setShowParticles(e.target.checked)} />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Detector</span>
                    <input type="checkbox" checked={showDetector} onChange={(e) => setShowDetector(e.target.checked)} />
                  </label>
                </div>

                {/* --- Time scaling factor (multiplies physics-based base scale) --- */}
                <CustomSliderInput
                  label="Sim Speed"
                  value={timeScaleFactor}
                  min={0.05}
                  max={20}
                  step={0.1}
                  onChange={setTimeScaleFactor}
                />

                {/* Wave controls box */}
                {showWave && (
                  <div
                    style={{
                      border: '1px solid #444',
                      borderRadius: 6,
                      padding: '8px 10px',
                      margin: '8px 0',
                      background: 'rgba(40, 60, 90, 0.35)',
                    }}
                  >
                    {/* Wave header row with palette on the same line */}
                    <div className="custom-control-row" style={{ alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span className="control-group-header" style={{ margin: 0 }}>Wave</span>
                      <div style={{ flex: '1 1 auto' }}>
                        <ColorPalettePicker
                          label=""
                          palettes={colorPalettes}
                          selectedPalette={getActiveDomain(physicsDomains, selectedDomainId).colorPalette ?? 'phase'}
                          onChange={(v) => {
                            selectedDomainId ? updateDomain(selectedDomainId, { colorPalette: v }) : updateAllDomains({ colorPalette: v });
                          }}
                        />
                      </div>
                    </div>
                    <CustomSliderInput
                      label="Opacity"
                      value={(((physicsDomains.find(d => d.id === selectedDomainId) || physicsDomains[0])?.opacityFactor) ?? 0.5) * 100}
                      min={0} max={100} step={1}
                      onChange={(v) => {
                        const normalized = v / 100;
                        selectedDomainId ? updateDomain(selectedDomainId, { opacityFactor: normalized }) : updateAllDomains({ opacityFactor: normalized });
                      }}
                    />
                    {/* --- Amplitude control + normalization reset --- */}
                    <div className="custom-control-row">
                      <label>Amplitude</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select
                          className="custom-text-input"
                          style={{ flex: '1 1 auto' }}
                          value={(physicsDomains.find(d => d.id === selectedDomainId) || physicsDomains[0])?.amplitudeMode ?? 'linear'}
                          onChange={(e) => {
                            const newMode = e.target.value as 'flat' | 'linear' | 'log';
                            selectedDomainId ? updateDomain(selectedDomainId, { amplitudeMode: newMode }) : updateAllDomains({ amplitudeMode: newMode });
                          }}
                        >
                          <option value="flat">Flat</option>
                          <option value="linear">Linear</option>
                          <option value="log">Log</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => recomputeNormalization(selectedDomainId)}
                          title="Recompute wave normalization (min/max) for this domain"
                          style={{
                            background: 'transparent',
                            border: '1px solid #555',
                            color: '#ccc',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            lineHeight: 1,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Reset Range
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Particle controls box */}
                {physicsDomains.length > 0 && (() => {
                  const activeDomain = selectedDomainId
                    ? physicsDomains.find(d => d.id === selectedDomainId) || physicsDomains[0]
                    : physicsDomains[0];
                  const hasParticleVelocity = !!activeDomain.particleEquation?.expression;
                  if (!hasParticleVelocity || !showParticles) return null;

                  const handleToggleMarkers = (checked: boolean) => {
                    if (!checked && !showParticleTrajectories) {
                      // Ensure at least one of markers/trajectories is enabled
                      setShowParticleTrajectories(true);
                    }
                    setShowParticleMarkers(checked);
                  };

                  const handleToggleTrajectories = (checked: boolean) => {
                    if (!checked && !showParticleMarkers) {
                      setShowParticleMarkers(true);
                    }
                    setShowParticleTrajectories(checked);
                  };

                  return (
                    <div
                      style={{
                        border: '1px solid #444',
                        borderRadius: 6,
                        padding: '8px 10px',
                        margin: '8px 0',
                        background: 'rgba(60, 45, 30, 0.35)',
                      }}
                    >
                      {/* Particle header row with Shape control inline */}
                      <div className="custom-control-row" style={{ alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <label>Particle</label>
                        <select
                          className="custom-text-input"
                          value={particleShape}
                          onChange={(e) => setParticleShape(e.target.value as 'sphere' | 'cube')}
                          style={{ maxWidth: '120px' }}
                        >
                          <option value="sphere">Sphere</option>
                          <option value="cube">Cube</option>
                        </select>
                      </div>
                      {/* Global particle injection rate (particles per sim second) */}
                      <CustomSliderInput
                        label="Rate"
                        value={particleInjectionRateSim}
                        min={0}
                        max={200}
                        step={0.5}
                        unitLabel="Hz"
                        onChange={setParticleInjectionRateSim}
                      />
                      {/* Max simultaneous particles in the system */}
                      <CustomSliderInput
                        label="Max"
                        value={particleMaxCount}
                        min={1}
                        max={1000}
                        step={1}
                        unitLabel="particles"
                        onChange={(v) => setParticleMaxCount(Math.round(v))}
                      />
                      {/* Marker & trajectory visibility + colors */}
                      <div className="custom-control-row" style={{ alignItems: 'center', gap: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="checkbox"
                            checked={showParticleMarkers}
                            onChange={(e) => handleToggleMarkers(e.target.checked)}
                          />
                          <span>Particle</span>
                          <input
                            type="color"
                            value={particleColor}
                            onChange={(e) => setParticleColor(e.target.value)}
                            style={{ width: '32px', padding: 0, border: 'none', background: 'transparent' }}
                          />
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="checkbox"
                            checked={showParticleTrajectories}
                            onChange={(e) => handleToggleTrajectories(e.target.checked)}
                          />
                          <span>Trajectory</span>
                          <input
                            type="color"
                            value={trajectoryColor}
                            onChange={(e) => setTrajectoryColor(e.target.value)}
                            style={{ width: '32px', padding: 0, border: 'none', background: 'transparent' }}
                          />
                        </label>
                      </div>
                      {/* Toggle for keeping trails after particles leave the domain */}
                      <div className="custom-control-row" style={{ alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="checkbox"
                            checked={persistTrailsOnDeath}
                            onChange={(e) => setPersistTrailsOnDeath(e.target.checked)}
                          />
                          <span>Keep trails after exit</span>
                        </label>
                      </div>
                      {/* Size */}
                      <CustomSliderInput
                        label="Size"
                        value={particleSize}
                        min={0.1}
                        max={1.0}
                        step={0.1}
                        onChange={setParticleSize}
                      />
                    </div>
                  );
                })()}

                <CustomButtonGroup>
                  {!isWaveRunning ? (
                    <CustomButton className="primary" onClick={handleStart}>Start</CustomButton>
                  ) : (
                    <CustomButton className="primary" onClick={() => setIsWaveRunning(false)}>Stop</CustomButton>
                  )}
                  <CustomButton
                    className="primary"
                    onClick={handleReset}
                    title="Reset simulation time to zero"
                  >
                    Reset
                  </CustomButton>
                  <CustomButton
                    onClick={handleResetDetectorHits}
                    title="Clear detector hit histograms without changing other settings"
                  >
                    Reset Hits
                  </CustomButton>
                </CustomButtonGroup>
                {/* Dynamic physics parameters with unit labels when available */}
{(() => {
                  const paramScope = parameters.reduce((acc, cp) => { acc[cp.name] = cp.value; return acc; }, {} as Record<string, number>);
                  return parameters.filter(p => p.tabName === 'Physics').map(p => {
                    let unitLabel: string | undefined;
                    if (p.quantity === 'distance') unitLabel = projectUnits.distance;
                    else if (p.quantity === 'time' && projectUnits.time) unitLabel = projectUnits.time;
                    else if (p.quantity === 'energy' && projectUnits.energy) unitLabel = projectUnits.energy;
                    const effectiveMin = p.minExpression ? (evaluateExpressionWithScope(p.minExpression, paramScope) ?? p.min) : p.min;
                    const effectiveMax = p.maxExpression ? (evaluateExpressionWithScope(p.maxExpression, paramScope) ?? p.max) : p.max;
                    const clampedValue = Math.min(Math.max(p.value, effectiveMin), effectiveMax);
                    return (
                      <CustomSliderInput
                        key={p.id}
                        label={p.label}
                        value={clampedValue}
                        min={effectiveMin}
                        max={effectiveMax}
                        step={p.step}
                        unitLabel={unitLabel}
                        onChange={(v) => setParameters(prev => {
                          const updated = prev.map(cp => cp.id === p.id ? { ...cp, value: v } : cp);
                          const scope = updated.reduce((acc, cp) => { acc[cp.name] = cp.value; return acc; }, {} as Record<string, number>);
                          return updated.map(cp => {
                            const eMax = cp.maxExpression ? (evaluateExpressionWithScope(cp.maxExpression, scope) ?? cp.max) : cp.max;
                            const eMin = cp.minExpression ? (evaluateExpressionWithScope(cp.minExpression, scope) ?? cp.min) : cp.min;
                            const clamped = Math.min(Math.max(cp.value, eMin), eMax);
                            return clamped !== cp.value ? { ...cp, value: clamped } : cp;
                          });
                        })}
                      />
                    );
                  });
                })()}
              </div>
            )},
            { label: 'Settings', content: (
              <div>
                <div className="custom-control-row">
                  <label>Auto Re-Cam</label>
                  <input type="checkbox" checked={autoRecam} onChange={(e) => {
                    const val = e.target.checked;
                    const activeSettings = viewSettings[activeViewIndex] || viewSettings[0];
                    const viewType = activeSettings?.cameraView ?? '3D';

                    setAutoRecam(val);
                    // When adjusting from a 2D view, remember the 2D preference
                    if (viewType !== '3D') {
                      setAutoRecam2D(val);
                    }
                    if (val) setAutoFitScale(false);
                  }} />
                </div>
                <div className="custom-control-row">
                  <label>Auto Fit Scale</label>
                  <input type="checkbox" checked={autoFitScale} onChange={(e) => {
                    const val = e.target.checked;
                    const activeSettings = viewSettings[activeViewIndex] || viewSettings[0];
                    const viewType = activeSettings?.cameraView ?? '3D';

                    setAutoFitScale(val);
                    // When adjusting from a 2D view, remember the 2D preference
                    if (viewType !== '3D') {
                      setAutoFitScale2D(val);
                    }
                    if (val) setAutoRecam(false);
                  }} />
                </div>
              </div>
            )},
            { label: 'UI', content: (
              <div>
                {/* --- NEW: Grouped Text Size controls --- */}
                <div className="control-group-header">Text Size</div>
                <div className="custom-control-row">
                  <label>Show Axis Labels</label>
                  <input type="checkbox" checked={showAxisLabels} onChange={(e) => setShowAxisLabels(e.target.checked)} />
                </div>
                <CustomSliderInput 
                  label="Axes" 
                  value={labelTextSize} 
                  onChange={setLabelTextSize} 
                  min={0.001} 
                  max={0.05} 
                  step={0.001} 
                />
                <CustomSliderInput
                  label="Controls"
                  value={controlsFontSize}
                  onChange={setControlsFontSize}
                  min={10}
                  max={20}
                  step={0.5}
                />
                <CustomSliderInput label="Messages" value={infoPanelFontSize} onChange={setInfoPanelFontSize} min={10} max={20} step={0.5} />
                <div className="custom-control-row" style={{ marginTop: '12px', alignItems: 'center', gap: '8px' }}>
                  <label>Axes</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85em' }}>
                    <input
                      type="checkbox"
                      checked={overlapAxes}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setOverlapAxes(val);
                        // When toggling overlap, re-apply the current index
                        // for the active view so the axes visibly jump
                        // between inside/outside.
                        const activeSettings = viewSettings[activeViewIndex] || viewSettings[0];
                        const viewType = activeSettings?.cameraView ?? '3D';
                        const idx = viewType === '3D' ? axesIndex3D : axesIndex2D;
                        placeAxesByIndex(viewType, idx, val);
                      }}
                    />
                    overlap
                  </label>
                  <CustomButton
                    className="axes-corner-button"
                    onClick={handleCycleAxesPosition}
                    title="Cycle axes position (4 steps in 2D, 8 in 3D)"
                  >
                    {(() => {
                      const activeSettings = viewSettings[activeViewIndex] || viewSettings[0];
                      const viewType = activeSettings?.cameraView ?? '3D';
                      const idx = viewType === '3D' ? axesIndex3D : axesIndex2D;

                      const isRight = (idx & 1) !== 0;
                      const isTop = (idx & 2) !== 0;
                      const isFront = viewType === '3D' ? ((idx & 4) !== 0) : true;

                      const verticalLabel = viewType === '3D' ? (isTop ? 'Top' : 'Bot') : '';

                      return (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: 10,
                              height: 10,
                              border: '1px solid #666',
                              position: 'relative',
                            }}
                          >
                            <span
                              style={{
                                position: 'absolute',
                                width: 4,
                                height: 4,
                                background: isFront ? '#ccc' : '#777',
                                top: isTop ? 0 : 'auto',
                                bottom: !isTop ? 0 : 'auto',
                                left: !isRight ? 0 : 'auto',
                                right: isRight ? 0 : 'auto',
                              }}
                            />
                          </span>
                          {viewType === '3D' && (
                            <span style={{ fontSize: '0.7em', color: '#ccc' }}>{verticalLabel}</span>
                          )}
                        </span>
                      );
                    })()}
                  </CustomButton>
                </div>
              </div>
            )},
            { label: 'Technical', content: (
              <div style={{ padding: '0 16px' }}>
                {/* --- NEW: Resolution control --- */}
                <div className="custom-control-row">
                  <label>Wave Resolution</label>
                  <select className="custom-text-input" value={waveResolution} onChange={(e) => setWaveResolution(Number(e.target.value))}>
                    <option value={16}>16</option>
                    <option value={32}>32</option>
                    <option value={64}>64</option>
                    <option value={128}>128</option>
                  </select>
                </div>
                {/* --- NEW: 3D volume compute update rate control (UPS) --- */}
                <CustomSliderInput
                  label="3D cps"
                  title="3D compute steps per second for the volume solver (higher = smoother 3D, but more GPU load)"
                  value={waveUpdatesPerSecond}
                  min={5}
                  max={60}
                  step={1}
                  unitLabel="ups"
                  onChange={setWaveUpdatesPerSecond}
                />
                {/* Trajectory detail control (normalized by domain size) */}
                <CustomSliderInput
                  label="Traj Detail"
                  title="Minimum distance between trajectory points, as a fraction of the largest domain dimension (lower = more detail)"
                  value={trajectoryMinDistance / maxDomainDimension}
                  min={0.001}
                  max={0.5}
                  step={0.001}
                  unitLabel="×domain"
                  onChange={(normalizedVal) => setTrajectoryMinDistance(normalizedVal * maxDomainDimension)}
                />
                <h4 style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px' }}>Wave Computation Rates</h4>
                {/* Show each unique updates-per-second value only once */}
                {(() => {
                  const uniqueRates = Array.from(new Set(Array.from(performanceMetrics.values())));
                  return uniqueRates.map((rate, idx) => (
                    <div className="custom-control-row" key={idx}>
                      <span>{rate.toFixed(1)} ups</span>
                    </div>
                  ));
                })()}
              </div>
            )},
          ]}
        />
        <div className="resize-handle" onPointerDown={handleResizeStart} />
      </div>
      {/* --- NEW: Validation Error Message Box --- */}
      {loadValidationErrors.length > 0 && (
        <div className="validation-error-box">
          <div className="validation-error-header">
            <strong>Project Validation Failed</strong>
            <button onClick={() => setLoadValidationErrors([])}>&times;</button>
          </div>
          <ul>
            {loadValidationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {/* --- THE DEFINITIVE FIX: Control the background with CSS --- */}
      <div
        ref={contentContainerRef}
        className={`content-container ${canvasColor === 'white' ? 'bg-white' : 'bg-black'}`}
        style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(numViews))}, 1fr)` }}
      >
        <ParametricEditorModal
          show={showParamEditor}
          onClose={() => setShowParamEditor(false)}
          parameters={parameters}
          relations={relations}
          setParameters={setParameters}
          setRelations={setRelations}
        />
        {/* DomainEditorModal is fine as it's a modal */}
        <DomainEditorModal
          show={showDomainEditor}
          onClose={() => setShowDomainEditor(false)} // This now means "Cancel"
          onTestRender={(domain) => { // This prop now returns a boolean
            const success = handleTestRender(domain);
            if (success) {
              setShowDomainEditor(false); // Only close on success
            }
            return success; // Return success status to the modal
          }}
          onTestSurfaceRender={(domain: PhysicsDomain, surfaceId: string, mode: 'surface' | 'surfacePsi2' = 'surface') => {
            const success = handleTestSurfaceRender(domain, surfaceId, mode);
            if (success) {
              // Persist injection surface edits (and surface palette) used for the test
              setPhysicsDomains(prev =>
                prev.map(d =>
                  d.id === domain.id
                    ? {
                        ...d,
                        injectionSurfaces: domain.injectionSurfaces,
                        colorPalette: domain.colorPalette ?? d.colorPalette,
                      }
                    : d,
                ),
              );
              setShowDomainEditor(false);
            }
            return success;
          }}
          domains={physicsDomains}
          setDomains={setPhysicsDomains}
          onPreview={(domain, id) => { // This is for the simple domain box preview
            handlePreview(domain, 'domain'); // Use the unified handler for a simple preview
            setShowDomainEditor(false); // Close the editor to see the preview
            setLastSelectedSetupId(id);
          }} 
          onSave={(draft, shouldClose) => {
            // --- UPDATED: Clear magnitude range when definitions change; GPU will recompute on next run ---
            const clearedDomains = draft.domains.map(domain => ({
              ...domain,
              minMagnitude: undefined,
              maxMagnitude: undefined,
              logMinMagnitude: undefined,
            }));

            // Save the updated data to the main state
            setPhysicsDomains(clearedDomains);
            setParameters(draft.parameters); // Keep parameter updates
            setRelations(draft.relations);
            setGlobalConstants(draft.constants);
            setParticles(draft.particles || []);
            // Persist project-level variables if present
            if (draft.projectVariables) _setProjectVariables(draft.projectVariables);
            if (shouldClose) {
              // --- FIX: Clear any active preview when saving to avoid stale renders ---
              setPreviewDomain(null);
              setShowDomainEditor(false);
            }
          }}
          initialSelectedId={lastSelectedSetupId} // Pass the remembered ID back in
          parameters={parameters}
          setParameters={setParameters}
          relations={relations}
          setRelations={setRelations}
          globalConstants={globalConstants}
          setGlobalConstants={setGlobalConstants}
          particles={particles}
          setParticles={setParticles}
          projectVariables={projectVariables}
          setProjectVariables={_setProjectVariables}
          psi2SurfaceStats={psi2SurfaceStats}
          sceneObjects={sceneObjects}
        />
        {/* The Canvas now sits as a background element covering the entire content area */}
        <Canvas
          dpr={[1, 2]}
          shadows
          gl={{ localClippingEnabled: true }}
          eventSource={contentContainerRef} // <-- Use the container as the event source
          onPointerMissed={() => isSelectionEnabled && setSelectedId(null)} // <-- NEW: Correct way to handle deselection
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        > {/* ParametricManager is now rendered inside SceneView, but its Leva controls are in a tab */}
          {/* Global simulation clock: advances simulationTimeRef once per frame */}
          <SimulationClock
            simulationTimeRef={simulationTimeRef}
            isWaveRunning={isWaveRunning}
            isCalculating={isCalculating}
          />

          {/* Detector legend – compact palette-bar + double-handle range slider */}
          {showDetector && (detectorTotalHits > 0 || detectorMaxCount > 0 || sceneObjects.some(o => o.detector?.enabled)) && (
            <Html
              fullscreen
              portal={contentContainerRef}
              style={{ pointerEvents: 'none' }}
            >
              <DetectorLegend
                paletteGradient={detectorPaletteGradient}
                paletteName={detectorPalette}
                totalHits={detectorTotalHits}
                maxHits={detectorMaxCount}
                rangeMinNorm={detectorRangeMinNorm}
                rangeMaxNorm={detectorRangeMaxNorm}
                rangeRef={detectorRangeRef}
                onChangePalette={setDetectorPalette}
                onChangeRange={(minN, maxN) => {
                  setDetectorRangeMinNorm(minN);
                  setDetectorRangeMaxNorm(maxN);
                }}
                detectorGridsRef={detectorGridsRef}
                detectorObject={sceneObjects.find(o => o.detector?.enabled) ?? null}
                domains={physicsDomains}
                parameters={parameters}
                globalConstants={globalConstants}
                projectVariables={projectVariables}
                particles={particles}
                simulationTimeRef={simulationTimeRef}
                timeScale={timeScale}
                sceneObjects={sceneObjects}
              />
            </Html>
          )}

          {/* --- THE DEFINITIVE FIX: Use <Html> to embed the panel inside the Canvas --- */}
          {/* This correctly overlays the UI without causing R3F errors or layout issues. */}
          {selectedObjectData && (
            <Html
              fullscreen
              portal={contentContainerRef}
              style={{ pointerEvents: 'none' }} // --- THE FIX (Part 1): Let events pass through the container
            >
              <SelectedObjectControls
                key={selectedId}
                selectedId={selectedId!}
                selectedObjectData={selectedObjectData}
                updateAllDomains={updateAllDomainsForRename}
                updateAllRelations={updateAllRelations}
                updateObject={updateObject}
                deleteObject={deleteObject}
                isDragging={isDragging}
                sceneBounds={sceneBounds}
                onClose={() => setSelectedId(null)}
                containerRef={contentContainerRef}
                transformMode={transformMode}
                setTransformMode={setTransformMode}
                onChangeDetectorPalette={setDetectorPalette}
              />
            </Html>
          )}

          {viewSettings.map((setting, i) => (
            <View index={i + 1} track={viewRefs.current[i]} key={setting.id}>
              <SceneView
                viewIndex={i + 1}
                previewDomain={previewDomain}
                // Pass down the settings for THIS specific view and global UI settings
                settings={setting}
                setSettings={(newSettings) => setViewSettings(prev => prev.map((s, idx) => idx === i ? newSettings : s))}
                // Pass down scene-wide data
                sceneObjects={sceneObjects}
                sceneBounds={sceneBounds}
                sceneScale={sceneScale} // NEW: Pass scale to SceneView
                physicsDomains={physicsDomains}
                particles={particles}
                parameters={parameters}
                objectCount={objectCount}
                globalConstants={globalConstants}
                projectVariables={projectVariables}
                previewKind={previewKind}
                relations={relations}
                labelTextSize={labelTextSize}
                showAxisLabels={showAxisLabels}
                detectorGridsRef={detectorGridsRef}
                detectorGridsVersion={detectorGridsVersion}
                detectorMaxCount={detectorMaxCount}
                detectorRangeRef={detectorRangeRef}
                detectorPalette={detectorPalette}
                showDetector={showDetector}
                // Pass down selection and interaction state
                selectedId={selectedId}
                transformMode={transformMode}
                isDragging={isDragging}
                isSelectionEnabled={isSelectionEnabled}
                autoRecam={autoRecam}
                autoFitScale={autoFitScale}
                // NEW: Pass wave controls state down
                waveVersion={waveVersion}
                waveResolution={waveResolution} // Pass down the new resolution state
                waveUpdatesPerSecond={waveUpdatesPerSecond}
                isWaveRunning={isWaveRunning}
                showWave={showWave}
                // End new props
                simulationTimeRef={simulationTimeRef}
                timeScale={timeScale}
                timeScaleFactor={timeScaleFactor}
                showParticles={showParticles}
                showParticleMarkers={showParticleMarkers}
                showParticleTrajectories={showParticleTrajectories}
                particleInjectionRateSim={particleInjectionRateSim}
                particleMaxCount={particleMaxCount}
                trajectoryMinDistance={trajectoryMinDistance}
                persistTrailsOnDeath={persistTrailsOnDeath}
                particleShape={particleShape}
                particleSize={particleSize}
                particleColor={particleColor}
                trajectoryColor={trajectoryColor}
                // Pass down refs
                controlsRef={controlsRefs.current[i]}
                selectedObjectRef={selectedObjectRef}
                objectRefs={objectRefs}
                // Pass down callbacks
                setObjectRef={handleSetObjectRef}
                setSelectedId={setSelectedId}
                setSimulationTime={setSimulationTime}
                updateObject={updateObject}
                setIsDragging={setIsDragging}
                onPerformanceUpdate={handlePerformanceUpdate} // NEW: Pass performance update callback
                onParticleCountChange={handleParticleCountChange}
                onDetectorHit={handleDetectorHit}
                setParameters={setParameters}
                updateDomain={updateDomain}
                updateAllDomains={updateAllDomains}
                setSceneBounds={setSceneBounds}
                viewRef={viewRefs.current[i]}
                onMagnitudeRangeComputed={handleGpuMagnitudeRange}
                onPsi2SurfaceStats={handlePsi2SurfaceStats}
              />
            </View>
          ))}

        </Canvas>
        {/* The tracked divs are now direct children of the grid container, giving them size */}
        {viewSettings.map((setting, i) => (
          // This div is now ONLY for mouse events.
          <div
            ref={viewRefs.current[i]}
            key={setting.id}
            style={{
              position: 'relative',
              pointerEvents: 'auto',
              border: activeViewIndex === i ? '2px solid #5a99e1' : '1px solid #5a99e1', // Always show border, active is thicker
              boxSizing: 'border-box'
            }}
            onMouseEnter={() => setActiveViewIndex(i)}
          >
            {/* Container for top-left UI elements */}
            <div className="view-controls-container" style={{ pointerEvents: 'auto' }}>
              {showViewLabels && <span className="view-label">View {i + 1}</span>}

              <select
                className="view-select"
                value={setting.cameraView}
                onChange={(e) => {
                  const newView = e.target.value as CameraViewType;
                  const prevView = setting.cameraView;

                  // If this is the active view, synchronize Auto settings based on 3D vs 2D
                  if (i === activeViewIndex) {
                    if (prevView !== '3D' && newView === '3D') {
                      // Entering 3D from a 2D view: remember 2D values and turn Auto off
                      setAutoRecam2D(autoRecam);
                      setAutoFitScale2D(autoFitScale);
                      setAutoRecam(false);
                      setAutoFitScale(false);
                    } else if (prevView === '3D' && newView !== '3D') {
                      // Leaving 3D to a 2D view: restore the last 2D values
                      setAutoRecam(autoRecam2D);
                      setAutoFitScale(autoFitScale2D);
                    }
                  }

                  // When the user changes the view type (e.g. XZ -> XY),
                  // force a camera reset so the new view is correctly
                  // framed and oriented. Without this, the orthographic
                  // camera can keep the old view's position/zoom, which
                  // makes subsequent 2D views look "wrong" after using
                  // a defaultCameraView from the JSON.
                  setViewSettings(prev => prev.map((s, idx) => idx === i
                    ? { ...s, cameraView: newView, cameraResetVersion: s.cameraResetVersion + 1 }
                    : s));
                }}
              >
                <option value="3D">3D</option>
                <option value="xy">XY</option>
                <option value="xz">XZ</option>
                <option value="yz">YZ</option>
              </select>

              {/* --- NEW: Toggle button for the rest of the toolbar --- */}
              <button
                className="view-button"
                onClick={() => setViewSettings(prev => prev.map((s, idx) => idx === i ? { ...s, isToolbarExpanded: !s.isToolbarExpanded } : s))}
                title={setting.isToolbarExpanded ? "Hide Tools" : "Show Tools"}
              >
                ...
              </button>

              {/* --- Conditionally render the expanded toolbar actions (except Close) --- */}
              {setting.isToolbarExpanded && (
                <>
                  {setting.cameraView !== '3D' && (
                    <button
                      className={`view-button ${setting.flipX ? 'active' : ''}`}
                      onClick={() => {
                        setViewSettings(prev => prev.map((s, idx) => idx === i ? { 
                          ...s, 
                          flipX: !s.flipX,
                          cameraResetVersion: s.cameraResetVersion + 1 // Force re-cam to apply flip
                        } : s));
                      }}
                      title="Flip Horizontal"
                    >
                      Flip H
                    </button>
                  )}

                  {setting.cameraView !== '3D' && (
                    <button
                      className={`view-button ${setting.flipY ? 'active' : ''}`}
                      onClick={() => {
                        setViewSettings(prev => prev.map((s, idx) => idx === i ? { 
                          ...s, 
                          flipY: !s.flipY,
                          cameraResetVersion: s.cameraResetVersion + 1 // Force re-cam to apply flip
                        } : s));
                      }}
                      title="Flip Vertical"
                    >
                      Flip V
                    </button>
                  )}

                  {setting.cameraView !== '3D' && (
                    <button
                      className="view-button"
                      onClick={() => {
                        setViewSettings(prev => prev.map((s, idx) => idx === i ? { 
                          ...s, 
                          rotation: (s.rotation + 1) % 4,
                          cameraResetVersion: s.cameraResetVersion + 1 // Force re-cam to apply rotation
                        } : s));
                      }}
                      title="Rotate 90°"
                    >
                      ↻ 90°
                    </button>
                  )}

                  {setting.cameraView !== '3D' && (
                    <button
                      className={`view-button ${setting.wheelMode === 'clip' ? 'active' : ''}`}
                      onClick={() => {
                        const newMode = setting.wheelMode === 'zoom' ? 'clip' : 'zoom';
                        setViewSettings(prev => prev.map((s, idx) => idx === i ? { ...s, wheelMode: newMode } : s));
                      }}
                      title="Toggle scroll-wheel between zoom and clip-plane movement"
                    >
                      {setting.wheelMode === 'zoom' ? 'Zoom' : 'Clip'}
                    </button>
                  )}

                  {setting.cameraView !== '3D' && (
                    <button className="view-button" onClick={() => {
                      handleFitScale(i);
                      // Trigger a camera fit that will run AFTER the scale/bounds update
                      setViewSettings(prev => prev.map((s, idx) => idx === i ? { ...s, fitScaleTrigger: s.fitScaleTrigger + 1 } : s));
                    }} 
                    title="Adjust scale to maximize view usage">
                      Fit Scale
                    </button>
                  )}

                  <button className="view-button" onClick={() => {
                    setViewSettings(prev => prev.map((s, i) => i === activeViewIndex ? { ...s, cameraResetVersion: s.cameraResetVersion + 1 } : s));
                  }}>
                    Re-Cam
                  </button>

                  {setting.cameraView !== '3D' && (
                    <button className="view-button" onClick={() => {
                      setViewSettings(prev => prev.map((s, idx) => {
                        if (idx === i) {
                          // Reset clip offset to 0 and ensure clip mode is active
                          const newOffsets = { ...s.clippingOffsets, [s.cameraView]: 0 };
                          return { ...s, clippingOffsets: newOffsets, clippingVersion: s.clippingVersion + 1, wheelMode: 'clip' };
                        }
                        return s;
                      }));
                    }} title="Reset clip plane to origin and enter clip mode">Re-Clip</button>
                  )}

                  <button
                    className={`view-button ${setting.showGrid ? 'active' : ''}`}
                    onClick={() => setViewSettings(prev => prev.map((s, idx) => idx === i ? { ...s, showGrid: !s.showGrid } : s))}
                  >
                    Grid
                  </button>

                  <button
                    className={`view-button ${setting.showAxes ? 'active' : ''}`}
                    onClick={() => setViewSettings(prev => prev.map((s, idx) => idx === i ? { ...s, showAxes: !s.showAxes } : s))}
                  >
                    Axes
                  </button>
                </>
              )}

              {/* Close button should always be visible, even when toolbar is collapsed */}
              {numViews > 1 && (
                <button
                  className="view-close-button"
                  onClick={() => removeView(setting.id)}
                  title="Close this view"
                >
                  &times;
                </button>
              )}
            </div>
            {setting.cameraView !== '3D' && (
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '5px 10px',
                borderRadius: '5px',
                fontFamily: 'monospace',
                pointerEvents: 'none',
                lineHeight: '1.4',
              }}>
                {(() => {
                  const { cameraView, clippingOffsets, flipX, wheelMode } = setting;
                  const axis = cameraView === 'xy' ? 'Z' : cameraView === 'xz' ? 'Y' : 'X';
                  const offset = (clippingOffsets[cameraView as keyof typeof clippingOffsets] ?? 0);
                  const offsetStr = offset.toFixed(2);
                  if (wheelMode !== 'clip') return `${axis}: ${offsetStr}`;
                  // Determine which side is visible based on view + flip
                  // xy/!flip, xz/!flip → visible [offset,+∞); yz/!flip → visible (-∞,offset]
                  const showUpper = (cameraView === 'yz') ? flipX : !flipX;
                  const intervalStr = showUpper
                    ? `[${offsetStr}, +\u221e)`
                    : `(-\u221e, ${offsetStr}]`;
                  return `${axis}: ${intervalStr}`;
                })()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Lazy glob: Vite bundles every model JSON as a separate chunk at build time,
// making dynamic imports work correctly in production regardless of base path.
const modelModules = import.meta.glob<{ default: ProjectData }>('../models/*.json');

export default function App() {
  const { modelName } = useParams(); // Get model name from URL (e.g., "Double_Slit_Experiment.json")
  const [initialProjectData, setInitialProjectData] = useState<ProjectData | null>(null);
  const [baseProjectData, setBaseProjectData] = useState<ProjectData | null>(null);
  const [loadValidationErrors, setLoadValidationErrors] = useState<string[]>([]);
  
  // --- NEW: Persist font sizes ---
  const [controlsFontSize, setControlsFontSize] = useState(() => parseFloat(localStorage.getItem('ui_controlsFontSize') || '14'));
  const [infoPanelFontSize, setInfoPanelFontSize] = useState(() => parseFloat(localStorage.getItem('ui_infoPanelFontSize') || '14'));

  useEffect(() => {
    localStorage.setItem('ui_controlsFontSize', String(controlsFontSize));
    localStorage.setItem('ui_infoPanelFontSize', String(infoPanelFontSize));
  }, [controlsFontSize, infoPanelFontSize]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (modelName) {
        try {
          // Always load the base model JSON from disk as the source of defaults
          const key = `../models/${modelName}`;
          const loader = modelModules[key];
          if (!loader) throw new Error(`Model not found: ${modelName}`);
          const modelModule = await loader();
          const { validatedData: baseValidated, errors: baseErrors } = validateProjectData(modelModule.default);
          setBaseProjectData(baseValidated);

          // Then, try to load a saved project snapshot for this model from localStorage
          const storageKey = `myProjectData:${modelName}`;
          const savedData = localStorage.getItem(storageKey);
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData) as ProjectData;
              const { validatedData, errors } = validateProjectData(parsed);
              setInitialProjectData(validatedData);
              setLoadValidationErrors(errors);
              return;
            } catch (e) {
              console.error('Failed to parse saved project for model', modelName, e);
              // Fall back to the base model if the saved snapshot is invalid
              setInitialProjectData(baseValidated);
              setLoadValidationErrors(baseErrors);
              return;
            }
          }

          // If no saved snapshot, fall back to the base model JSON
          setInitialProjectData(baseValidated);
          setLoadValidationErrors(baseErrors);
        } catch (e) {
          console.error(`Failed to load model: ${modelName}. Loading blank project.`, e);
          const { validatedData: baseValidated, errors: baseErrors } = validateProjectData(blankModel);
          setBaseProjectData(baseValidated);
          setInitialProjectData(baseValidated);
          setLoadValidationErrors(baseErrors);
        }
      } else {
        // If no model is in the URL, use the blank model as the base defaults.
        const { validatedData: baseValidated, errors: baseErrors } = validateProjectData(blankModel);
        setBaseProjectData(baseValidated);

        // Then try loading a saved project from local storage, or fall back to the base.
        const savedProject = loadFromLocalStorage();
        if (savedProject) {
          const { validatedData, errors } = validateProjectData(savedProject);
          setInitialProjectData(validatedData);
          setLoadValidationErrors(errors);
        } else {
          setInitialProjectData(baseValidated);
          setLoadValidationErrors(baseErrors);
        }
      }
    };
    loadInitialData();
  }, [modelName]);

  if (!initialProjectData || !baseProjectData) {
    return <div>Loading Project...</div>; // Or a spinner component
  }

  return <Editor
    initialProjectData={initialProjectData}
    baseProjectData={baseProjectData}
    loadValidationErrors={loadValidationErrors}
    setLoadValidationErrors={setLoadValidationErrors}
    controlsFontSize={controlsFontSize}
    setControlsFontSize={setControlsFontSize}
    infoPanelFontSize={infoPanelFontSize}
    setInfoPanelFontSize={setInfoPanelFontSize}
    modelName={modelName}
  />;
}
