import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { PhysicsDomain, PhysicsEquation, CustomParameter, ParameterRelation, GlobalConstant, SceneObjectType, ParticleDefinition, InjectionSurface, InjectionSurfaceKind } from './types.ts';
import './SetupEditorModal.css';
import './WaveEditor.css';
import { v4 as uuidv4 } from 'uuid';
import { evaluateExpressionWithScope, findObjectByName, setPropertyByPath, buildEvaluationScope, expandMacro, expandShorthand } from './utils.ts';
import { create, all } from 'mathjs';
import { ColorPalettePicker } from './ColorPalettePicker.tsx';
import { PALETTE_DEFINITIONS, getCssGradient } from './colorPalettes';

type DraftData = {
  domains: PhysicsDomain[];
  parameters: CustomParameter[];
  relations: ParameterRelation[];
  constants: GlobalConstant[];
  particles?: ParticleDefinition[];
  projectVariables?: DerivedVariable[];
};

// NEW: Type for a derived variable
type DerivedVariable = {
  id: string;
  name: string;
  expression: string;
  showExpanded?: boolean;
  isValidated?: boolean;
}

type Props = {
  show: boolean;
  onClose: () => void;
  onTestRender: (domain: PhysicsDomain) => boolean; // NEW: Return success status
  onTestSurfaceRender?: (domain: PhysicsDomain, surfaceId: string, mode?: 'surface' | 'surfacePsi2') => boolean; // NEW: Optional surface test render with mode
  onPreview: (domain: PhysicsDomain, id: string) => void; // Pass back the ID
  onSave: (draft: DraftData, shouldClose: boolean) => void;
  // Domains
  domains: PhysicsDomain[];
  setDomains: (domains: PhysicsDomain[] | ((prev: PhysicsDomain[]) => PhysicsDomain[])) => void;
  initialSelectedId: string | null; // To restore selection
  // Parameters
  parameters: CustomParameter[];
  setParameters: (p: CustomParameter[] | ((prev: CustomParameter[]) => CustomParameter[])) => void;
  // Project-level particles registry
  particles?: ParticleDefinition[];
  setParticles?: (p: ParticleDefinition[] | ((prev: ParticleDefinition[]) => ParticleDefinition[])) => void;
  // Relations
  relations: ParameterRelation[];
  setRelations: (r: ParameterRelation[] | ((prev: ParameterRelation[]) => ParameterRelation[])) => void;
  // Constants
  globalConstants: GlobalConstant[];
  setGlobalConstants: (c: GlobalConstant[] | ((prev: GlobalConstant[]) => GlobalConstant[])) => void;
  // Scene Objects for reference
  sceneObjects: SceneObjectType[]; // Added for relation editor context
  // Project-level derived variables (optional)
  projectVariables?: DerivedVariable[];
  setProjectVariables?: (v: DerivedVariable[] | ((prev: DerivedVariable[]) => DerivedVariable[])) => void;
  psi2SurfaceStats?: Record<string, { min: number; max: number; integral: number }>;
};

export function DomainEditorModal(props: Props) {
  const { show, onClose, onSave, onPreview, onTestRender, onTestSurfaceRender, sceneObjects, initialSelectedId, psi2SurfaceStats } = props;
  const [mainTab, setMainTab] = useState<'domains' | 'parameters' | 'relations' | 'constants' | 'variables'>('domains');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [domainSubTab, setDomainSubTab] = useState<'definition' | 'derived' | 'wave' | 'particle'>('definition'); // NEW: Updated tab states
  const [validationResult, setValidationResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // --- NEW: Local draft state for editing ---
  const [draftDomains, setDraftDomains] = useState<PhysicsDomain[]>([]);
  const [draftParameters, setDraftParameters] = useState<CustomParameter[]>([]);
  const [draftRelations, setDraftRelations] = useState<ParameterRelation[]>([]);
  const [draftConstants, setDraftConstants] = useState<GlobalConstant[]>([]);
  const [draftParticles, setDraftParticles] = useState<ParticleDefinition[]>([]);
  const [draftProjectVariables, setDraftProjectVariables] = useState<DerivedVariable[]>([]);
  const [justValidatedDomainId, setJustValidatedDomainId] = useState<string | null>(null); // --- NEW: Signal for saving after validation ---
  const [editingVarId, setEditingVarId] = useState<string | null>(null); // NEW: State to track which variable is being edited
  const [particleDerivationError, setParticleDerivationError] = useState<{ domainId: string; message: string } | null>(null);
  const [surfaceTestError, setSurfaceTestError] = useState<string | null>(null); // NEW: Inline error for Test Surface
  const [initialDraftSnapshot, setInitialDraftSnapshot] = useState<DraftData | null>(null);
  const [lastTestedSurfaceId, setLastTestedSurfaceId] = useState<string | null>(null);

  // Local map of available palettes for Psi^2 surface previews
  const surfacePalettes = useMemo(() => {
    return Object.keys(PALETTE_DEFINITIONS).reduce((acc, key) => {
      acc[key] = getCssGradient(key);
      return acc;
    }, {} as Record<string, string>);
  }, []);

  // Local math.js instance for symbolic operations (derivatives/simplify)
  const math = useMemo(() => create(all, { implicit: 'auto' } as any), []);

  // --- NEW: Shared validation icon/button for derived & project variables ---
  const ValidationIconButton = ({
    validated,
    onClick,
    title,
  }: {
    validated?: boolean;
    onClick: () => void;
    title?: string;
  }) => (
    <button
      type="button"
      className="validate-btn"
      onClick={onClick}
      title={title || (validated ? 'Re-validate' : 'Validate')}
      style={{
        padding: '2px 6px',
        fontWeight: 'bold',
        fontSize: '1.1em',
        color: validated ? '#28a745' : '#888',
        borderColor: validated ? '#28a745' : undefined,
        background: 'transparent',
      }}
    >
      ✓
    </button>
  );

  const [activeField, setActiveField] = useState<'target' | 'expression' | null>(null);
  // --- NEW: State for font size and column widths with persistence ---
  const [modalFontSize, setModalFontSize] = useState(() => {
    const savedSize = localStorage.getItem('modalFontSize');
    return savedSize ? parseFloat(savedSize) : 14; // Default font size
  });
  const [columnWidths, setColumnWidths] = useState<{ nav: number, list: number }>(() => {
    const savedWidths = localStorage.getItem('modalColumnWidths');
    return savedWidths ? JSON.parse(savedWidths) : { nav: 180, list: 250 }; // Default widths
  });
  const [modalPosition, setModalPosition] = useState<{ top: number, left: number } | null>(() => {
    // --- NEW: Load position from localStorage on init ---
    const savedPosition = localStorage.getItem('modalPosition');
    return savedPosition ? JSON.parse(savedPosition) : null;
  });
  const [modalSize, setModalSize] = useState(() => {
    const savedSize = localStorage.getItem('modalSize');
    return savedSize ? JSON.parse(savedSize) : { width: 1200, height: '80vh' }; // Default size
  });

  const buildCurrentDraftSnapshot = useCallback((): DraftData => ({
    domains: draftDomains,
    parameters: draftParameters,
    relations: draftRelations,
    constants: draftConstants,
    particles: draftParticles,
    projectVariables: draftProjectVariables,
  }), [draftDomains, draftParameters, draftRelations, draftConstants, draftParticles, draftProjectVariables]);

  // --- NEW: Define property mappings for UI ---
  const propertyMappings = [
    { label: 'x', value: 'position.x', title: 'Position X' },
    { label: 'y', value: 'position.y', title: 'Position Y' },
    { label: 'z', value: 'position.z', title: 'Position Z' },
    { label: 'dx', value: 'scale.x', title: 'Scale X (size)' },
    { label: 'dy', value: 'scale.y', title: 'Scale Y (size)' },
    { label: 'dz', value: 'scale.z', title: 'Scale Z (size)' },
  ];

  // --- NEW: Flatten the scene object tree ---
  // This recursively walks the sceneObjects to create a flat list of all items.
  const flattenedObjects = useMemo(() => {
    const allObjects: SceneObjectType[] = [];
    function walk(objects: SceneObjectType[]) {
      // --- FIX: Ensure we only iterate over actual arrays ---
      if (!Array.isArray(objects)) return;
      for (const obj of objects) {
        allObjects.push(obj);
        if (obj.children) walk(obj.children);
      }
    }
    walk(sceneObjects);
    return allObjects;
  }, [sceneObjects]);

  // --- NEW: Helper to split a vector expression [vx, vy, vz] into components safely ---
  const splitParticleExpression = (expr: string): [string, string, string] => {
    const trimmed = expr.trim();
    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
      // Not a vector-style expression; treat whole string as X component for editing
      return [trimmed, '', ''];
    }
    const inner = trimmed.slice(1, -1);
    const parts: string[] = [];
    let depth = 0;
    let current = '';
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i];
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      else if (ch === ')' || ch === ']' || ch === '}') depth = Math.max(0, depth - 1);
      if (ch === ',' && depth === 0) {
        parts.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim().length > 0) parts.push(current.trim());

    while (parts.length < 3) parts.push('');
    return [parts[0] || '', parts[1] || '', parts[2] || ''];
  };

  // --- MOVED UP: Derived state for selection ---
  const selectedDomain = mainTab === 'domains' ? draftDomains.find(d => d.id === selectedId) : null;
  const selectedParameter = mainTab === 'parameters' ? draftParameters.find(p => p.id === selectedId) : null;
  const selectedRelation = mainTab === 'relations' ? draftRelations.find(r => r.id === selectedId) : null;
  const selectedConstant = mainTab === 'constants' ? draftConstants.find(c => c.id === selectedId) : null;

  // --- NEW: Particle Properties ---
  const selectedParticleDef = useMemo(() => {
    if (!selectedDomain) return null;
    // Use the domain's selected particle, or fallback to the first in the project list
    const particleId = selectedDomain.selectedParticleId || (draftParticles.length > 0 ? draftParticles[0].id : undefined);
    if (!particleId) return null;
    return draftParticles.find(p => p.id === particleId) || null;
  }, [selectedDomain, draftParticles]);

  // --- NEW: Live values for project-level variables (General tab) ---
  const projectVariableValues = useMemo(() => {
    if (!draftProjectVariables || draftProjectVariables.length === 0) return {} as Record<string, number | null>;

    const baseScope = buildEvaluationScope(flattenedObjects, draftConstants);
    const paramsScope = draftParameters.reduce((acc: Record<string, any>, p) => ({ ...acc, [p.name]: p.value }), {});
    const scope: Record<string, any> = { ...baseScope, ...paramsScope, x: 0, y: 0, z: 0, t: 0 };

    // Include particle mass in a generic way (same pattern as App.tsx)
    const particleList = draftParticles || [];
    const particle = particleList[0];
    if (particle) {
      const massVal = (particle as any).mass ?? (particle as any).massKg;
      if (massVal !== undefined) scope['mass'] = massVal;
    }

    const values: Record<string, number | null> = {};
    for (const v of draftProjectVariables) {
      try {
        const expr = expandMacro(v.expression, 1);
        const val = evaluateExpressionWithScope(expr, scope);
        values[v.id] = val;
        scope[v.name] = val !== null ? val : null;
      } catch {
        values[v.id] = null;
        scope[v.name] = null;
      }
    }
    return values;
  }, [draftProjectVariables, draftParameters, draftConstants, flattenedObjects, draftParticles]);

  // --- NEW: Live values for domain-derived variables (per selected domain) ---
  const derivedVariableValues = useMemo(() => {
    if (!selectedDomain?.waveEquation?.derivedVariables) return {} as Record<string, number | null>;

    const { derivedVariables, numberOfParticles } = selectedDomain.waveEquation;
    const numParticles = numberOfParticles || 1;

    const baseScope = buildEvaluationScope(flattenedObjects, draftConstants);
    const paramsScope = draftParameters.reduce((acc: Record<string, any>, p) => ({ ...acc, [p.name]: p.value }), {});
    const scope: Record<string, any> = { ...baseScope, ...paramsScope, x: 0, y: 0, z: 0, t: 0 };

    // Include selected particle's mass in the scope if available (same pattern as validators)
    if (selectedParticleDef) {
      const massVal = (selectedParticleDef as any).mass ?? (selectedParticleDef as any).massKg;
      if (massVal !== undefined) scope['mass'] = massVal;
    }

    // Include validated project-level variables in the scope
    for (const pv of draftProjectVariables) {
      if (!pv.name || !pv.expression || !pv.isValidated) continue;
      try {
        const expanded = expandMacro(pv.expression, 1);
        const val = evaluateExpressionWithScope(expanded, scope);
        scope[pv.name] = val !== null ? val : null;
      } catch {
        scope[pv.name] = null;
      }
    }

    const values: Record<string, number | null> = {};
    for (const v of derivedVariables) {
      if (!v.name || !v.expression) {
        values[v.id] = null;
        continue;
      }
      try {
        const expandedExpr = expandMacro(v.expression, numParticles);
        const val = evaluateExpressionWithScope(expandedExpr, scope);
        values[v.id] = val;
        scope[v.name] = val !== null ? val : null;
      } catch {
        values[v.id] = null;
        scope[v.name] = null;
      }
    }

    return values;
  }, [selectedDomain, draftConstants, draftParameters, draftProjectVariables, flattenedObjects, selectedParticleDef]);

  // This effect initializes the draft state when the modal is first opened.
  useEffect(() => {
    if (show) {
      // --- FIX: Center the modal on open if no position is set ---
      if (!modalPosition) {
        const initialTop = (window.innerHeight - (typeof modalSize.height === 'number' ? modalSize.height : window.innerHeight * 0.8)) / 2;
        const initialLeft = (window.innerWidth - modalSize.width) / 2;
        setModalPosition({ top: initialTop, left: initialLeft });
      }
      // Initialize draft state from props
      const clonedDomains = JSON.parse(JSON.stringify(props.domains));
      const clonedParameters = JSON.parse(JSON.stringify(props.parameters));
      const clonedRelations = JSON.parse(JSON.stringify(props.relations));
      const clonedConstants = JSON.parse(JSON.stringify(props.globalConstants));
      const clonedParticles = JSON.parse(JSON.stringify((props.particles || [])));
      const clonedProjectVariables = JSON.parse(JSON.stringify((props.projectVariables || [])));

      setDraftDomains(clonedDomains);
      setDraftParameters(clonedParameters);
      setDraftRelations(clonedRelations);
      setDraftConstants(clonedConstants);
      setDraftParticles(clonedParticles);
      setDraftProjectVariables(clonedProjectVariables);
      setInitialDraftSnapshot({
        domains: clonedDomains,
        parameters: clonedParameters,
        relations: clonedRelations,
        constants: clonedConstants,
        particles: clonedParticles,
        projectVariables: clonedProjectVariables,
      });
      setValidationResult(null); // Clear old validation messages
      setSurfaceTestError(null);
      setLastTestedSurfaceId(null);
      
      // Set initial selection
      if (initialSelectedId && props.domains.some(d => d.id === initialSelectedId)) {
        // If a specific ID was requested (e.g., returning from preview), use it.
        setSelectedId(initialSelectedId);
      } else if (props.domains.length > 0) {
        // Otherwise, default to the first item.
        const firstId = props.domains[0]?.id;
        setSelectedId(firstId);
      } else {
        setSelectedId(null);
      }
      setEditingVarId(null); // NEW: Reset edit mode when modal opens
      setMainTab('domains'); // Always start on the domains tab
    }
  }, [show]); // --- FIX: Only run this when the modal is first opened ---

  // --- NEW: Effect for font scaling and persistence ---
  useEffect(() => {
    const modalContent = document.querySelector<HTMLElement>('.domain-modal-content');
    if (!modalContent || !show) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const direction = e.deltaY < 0 ? 1 : -1;
        setModalFontSize(currentSize => {
          const newSize = Math.max(10, Math.min(20, currentSize + direction * 0.5));
          localStorage.setItem('modalFontSize', String(newSize));
          return newSize;
        });
      }
    };

    modalContent.addEventListener('wheel', handleWheel, { passive: false });
    return () => modalContent.removeEventListener('wheel', handleWheel);
  }, [show]);

  // --- NEW: Effect for persisting column widths ---
  useEffect(() => {
    // This effect runs whenever columnWidths changes, saving it to localStorage.
    // We debounce this slightly to avoid excessive writes during drag.
    const handler = setTimeout(() => localStorage.setItem('modalColumnWidths', JSON.stringify(columnWidths)), 200);
    return () => clearTimeout(handler);
  }, [columnWidths]);

  // --- NEW: Effect for persisting modal size ---
  useEffect(() => {
    // Debounce saving to avoid excessive writes during drag.
    const handler = setTimeout(() => localStorage.setItem('modalSize', JSON.stringify(modalSize)), 200);
    return () => clearTimeout(handler);
  }, [modalSize]);

  // --- NEW: Effect for persisting modal position ---
  useEffect(() => {
    if (modalPosition) {
      localStorage.setItem('modalPosition', JSON.stringify(modalPosition));
    }
  }, [modalPosition]);

  // --- NEW: Clear validation messages when switching tabs or selection ---
  useEffect(() => {
    setValidationResult(null);
    setSurfaceTestError(null);
  }, [mainTab, selectedId]);

  // This effect handles selection changes when switching main tabs.
  useEffect(() => {
    // When the main tab changes, find the first item in the corresponding list
    // and select it. This prevents the editor pane from being blank.
    const listMap: Record<string, any[]> = {
      domains: draftDomains,
      parameters: draftParameters,
      relations: draftRelations,
      constants: draftConstants,
      variables: draftProjectVariables,
    };
    const list = listMap[mainTab];
    setSelectedId(list.length > 0 ? list[0].id : null);
  }, [mainTab]); // --- FIX: Only run this when the main tab changes ---

  // --- THE FIX: This effect runs *after* the state has been updated ---
  // When `justValidatedDomainId` is set, it means a domain was just validated.
  // We can now safely save the updated draft state.
  useEffect(() => {
    if (justValidatedDomainId) {
      onSave({
        domains: draftDomains,
        parameters: draftParameters,
        relations: draftRelations,
        constants: draftConstants,
        particles: draftParticles,
        projectVariables: draftProjectVariables,
      }, false); // false = don't close the modal
      setInitialDraftSnapshot(buildCurrentDraftSnapshot());
      setJustValidatedDomainId(null); // Reset the signal
    }
  }, [justValidatedDomainId, draftDomains]); // This effect depends on the signal and the state to be saved

  const hasUnsavedChanges = useCallback(() => {
    if (!initialDraftSnapshot) return false;
    const current = buildCurrentDraftSnapshot();
    return JSON.stringify(current) !== JSON.stringify(initialDraftSnapshot);
  }, [initialDraftSnapshot, buildCurrentDraftSnapshot]);

  const handleRequestClose = () => {
    if (hasUnsavedChanges()) {
      const confirmClose = window.confirm('You have unsaved changes in the Setup editor. Close without saving?');
      if (!confirmClose) return;
    }
    onClose();
  };

  const handleAddDomain = () => {
    const newDomain: PhysicsDomain = {
      id: uuidv4(),
      name: `New Domain ${draftDomains.length + 1}`,
      rules: [{ id: uuidv4(), definition: '' }],
      // NEW: Default to a Box shape for new domains
      shape: 'box',
      center: [0, 0, 0],
      size: [100, 100, 100],
      opacityFactor: 0.5,
    };
    setDraftDomains(prev => [...prev, newDomain]);
    setSelectedId(newDomain.id);
    setDomainSubTab('definition'); // Switch to definition tab for new domain
  };

  const handleDeleteDomain = (id: string) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      setDraftDomains(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleAddParameter = () => {
    const newParam: CustomParameter = { id: uuidv4(), name: 'newParam', label: 'New Param', folderName: 'Parameters', value: 0, min: 0, max: 100, step: 1, tabName: 'Parameters' };
    setDraftParameters(prev => [...prev, newParam]);
    setSelectedId(newParam.id);
  };

  const handleAddRelation = () => {
    // --- NEW: Create a smarter default target ---
    const firstObject = flattenedObjects.find(o => o.name && o.type !== 'axes');
    const defaultTarget = firstObject ? `${firstObject.name}.x` : 'new_target';

    const newRelation: ParameterRelation = { id: defaultTarget, expression: '0' };
    setValidationResult(null); // Clear any previous validation result when adding a new relation
    setDraftRelations(prev => {
      setSelectedId(newRelation.id);
      return [...prev, newRelation];
    });
  };

  const handleAddConstant = () => {
    let newId = 'new_constant';
    let counter = 1;
    // Ensure the new ID is unique
    while (draftConstants.some(c => c.id === newId)) {
      newId = `new_constant_${counter}`;
      counter++;
    }
    const newConstant: GlobalConstant = { id: newId, name: newId, value: 1, units: '' };
    setDraftConstants(prev => [...prev, newConstant]);
    setSelectedId(newId);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (mainTab === 'parameters') setDraftParameters(prev => prev.filter(p => p.id !== id));
      else if (mainTab === 'relations') setDraftRelations(prev => prev.filter(r => r.id !== id));
      else if (mainTab === 'constants') setDraftConstants(prev => prev.filter(c => c.id !== id));
      else if (mainTab === 'variables') setDraftProjectVariables(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleUpdateDomain = (id: string, newProps: Partial<PhysicsDomain>) => {
    setDraftDomains(prev => prev.map(d => d.id === id ? { ...d, ...newProps } : d));
    if (newProps.rules) setDraftDomains(prev => prev.map(d => d.id === id ? { ...d, rules: d.rules.map(r => ({ ...r, isValidated: false })) } : d));
  };

  // --- NEW: Helpers for geometric injection surfaces ---
  const [collapsedSurfaces, setCollapsedSurfaces] = useState<Record<string, boolean>>(() => ({}));

  const handleAddInjectionSurface = () => {
    if (!selectedDomain) return;
    const existing = selectedDomain.injectionSurfaces || [];
    const index = existing.length + 1;

    // Pick first usable source object (box, sphere, cylinder; exclude axes and groups)
    const firstObject = flattenedObjects.find(
      o => o.type === 'box' || o.type === 'sphere' || o.type === 'cylinder'
    );

    let kind: InjectionSurfaceKind = 'rect';
    if (firstObject?.type === 'sphere') kind = 'sphereProjected';
    else if (firstObject?.type === 'cylinder') kind = 'cylinderSection';

    const newSurface: InjectionSurface = {
      id: uuidv4(),
      name: `Surface ${index}`,
      kind,
      sourceObjectId: firstObject ? firstObject.id : '',
      face: firstObject?.type === 'box' ? 'front' : undefined,
      uSegments: 24,
      vSegments: 24,
    };
    handleUpdateDomain(selectedDomain.id, {
      injectionSurfaces: [...existing, newSurface],
    });
    setCollapsedSurfaces(prev => ({ ...prev, [newSurface.id]: false }));
  };

  const handleUpdateInjectionSurface = (surfaceId: string, patch: Partial<InjectionSurface>) => {
    if (!selectedDomain) return;
    const existing = selectedDomain.injectionSurfaces || [];
    const updated = existing.map(s => (s.id === surfaceId ? { ...s, ...patch } : s));
    handleUpdateDomain(selectedDomain.id, { injectionSurfaces: updated });
  };

  const handleDeleteInjectionSurface = (surfaceId: string) => {
    if (!selectedDomain) return;
    const existing = selectedDomain.injectionSurfaces || [];
    const updated = existing.filter(s => s.id !== surfaceId);
    handleUpdateDomain(selectedDomain.id, { injectionSurfaces: updated });
    setCollapsedSurfaces(prev => {
      const next = { ...prev };
      delete next[surfaceId];
      return next;
    });
  };

  const handleUpdateDomainEquation = (domainId: string, type: 'wave' | 'particle', newProps: Partial<PhysicsEquation>) => {
    setDraftDomains(prev => prev.map(d => {
      if (d.id === domainId) {
        const key = type === 'wave' ? 'waveEquation' : 'particleEquation';
        const existingEq = d[key] || { id: uuidv4(), type, name: '', expression: '' };
        // --- FIX: When the expression changes, invalidate it ---
        const updatedEq = { ...existingEq, ...newProps };
        if (newProps.expression !== undefined || newProps.numberOfParticles !== undefined) {
          updatedEq.isValidated = false;
        }

        // --- THE FIX: If we are invalidating the wave equation, also clear the magnitude range. ---
        if (key === 'waveEquation' && updatedEq.isValidated === false) {
          // Setting magnitudes to undefined will hide the range display.
          return { ...d, [key]: updatedEq, minMagnitude: undefined, maxMagnitude: undefined };
        }

        return { ...d, [key]: updatedEq };
      }
      return d;
    }));
  };

  const toggleShowExpanded = (varId: string) => {
    if (!selectedDomain) return;
    setDraftDomains(prev => prev.map(d => {
      if (d.id === selectedDomain.id && d.waveEquation?.derivedVariables) {
        const derivedVariables = d.waveEquation.derivedVariables.map(v =>
          v.id === varId ? { ...v, showExpanded: !v.showExpanded } : v
        );
        return { ...d, waveEquation: { ...d.waveEquation, derivedVariables } };
      }
      return d;
    }));
  };

  // --- NEW: Handlers for Derived Variables in Wave Function ---
  const handleAddDerivedVariable = () => { // Simplified handler
    if (!selectedDomain) return;
    // Generate a unique name that doesn't clash with project-level variables
    const existingNames = new Set<string>();
    (selectedDomain.waveEquation?.derivedVariables || []).forEach(v => existingNames.add(v.name));
    draftProjectVariables.forEach(v => existingNames.add(v.name));
    let base = 'newVar';
    let suffix = 1;
    let name = base;
    while (existingNames.has(name)) {
      suffix++; name = `${base}${suffix}`;
    }
    const newVar = { id: uuidv4(), name, expression: '1' };
    setDraftDomains(prev => prev.map(d => {
      if (d.id === selectedDomain.id) {
        const waveEq = d.waveEquation || { id: uuidv4(), type: 'wave', name: '', expression: '', derivedVariables: [] };
        const derivedVariables = [...(waveEq.derivedVariables || []), newVar];
        return { ...d, waveEquation: { ...waveEq, derivedVariables } };
      }
      return d;
    }));
    setEditingVarId(newVar.id); // NEW: Immediately edit the new variable
  };

  const handleUpdateDerivedVariable = (varId: string, newProps: { name?: string; expression?: string; showExpanded?: boolean; isValidated?: boolean; }) => {
    if (!selectedDomain) return;
    setDraftDomains(prev => prev.map(d => {
      if (d.id === selectedDomain.id && d.waveEquation) {
        const derivedVariables = d.waveEquation.derivedVariables?.map((v: DerivedVariable) => v.id === varId ? { ...v, ...newProps, isValidated: false } : v); // Reset validation on change
        return { ...d, waveEquation: { ...d.waveEquation, derivedVariables } };
      }
      return d;
    }));
  };
  const handleDeleteDerivedVariable = (domainId: string, varId: string) => {
    // --- FIX: Perform checks BEFORE updating state to prevent double alerts ---
    const domain = draftDomains.find(d => d.id === domainId);
    if (!domain?.waveEquation) return;

    const targetVar = domain.waveEquation.derivedVariables?.find(v => v.id === varId);
    if (!targetVar) return;

    // Check for whole-variable usage in wave/particle expressions
    const name = targetVar.name;
    const waveExpr = domain.waveEquation.expression || '';
    const particleExpr = domain.particleEquation?.expression || '';
    const pattern = new RegExp(`\\b${name}\\b`);

    const isUsedInWave = pattern.test(waveExpr);
    const isUsedInParticle = pattern.test(particleExpr);

    if (isUsedInWave || isUsedInParticle) {
      alert(`Cannot delete "${targetVar.name}". It is currently used in the ${isUsedInWave ? 'Wave' : 'Particle'} expression.`);
      return; // Abort deletion
    }

    // If all checks pass, then update the state
    setDraftDomains(prev => prev.map(d => {
      if (d.id !== domainId) return d;
      // We already know d.waveEquation exists from the checks above
      const newDerivedVars = d.waveEquation!.derivedVariables?.filter((v: DerivedVariable) => v.id !== varId);
      return { ...d, waveEquation: { ...d.waveEquation!, derivedVariables: newDerivedVars } };
    }));
  };

  // --- NEW: Ref for the wave function expression textarea ---
  const waveExpressionTextareaRef = useRef<HTMLTextAreaElement>(null);

  // --- NEW: Auto-generate Bohmian particle dynamics from the wave function ---
  const handlePopulateParticleFromWave = () => {
    if (!selectedDomain || !selectedDomain.waveEquation) {
      setParticleDerivationError(selectedDomain ? { domainId: selectedDomain.id, message: 'No wave function is defined for this domain.' } : null);
      return;
    }

    const waveEq = selectedDomain.waveEquation;
    const numParticles = waveEq.numberOfParticles || 1;
    if (numParticles !== 1) {
      setParticleDerivationError({ domainId: selectedDomain.id, message: 'Automatic Bohmian dynamics is currently only supported for single-particle wave functions.' });
      return;
    }

    try {
      // 1. Expand macros in the main wave expression so math.js can differentiate it.
      let expanded = expandMacro(waveEq.expression, numParticles);

      // 1b. Inline any derived variables so that psi is expressed directly
      // in terms of the base spatial coordinates (x, y, z) before
      // differentiation. This lets math.js correctly apply the chain rule
      // instead of treating r1, r2, etc. as constants.
      if (waveEq.derivedVariables && waveEq.derivedVariables.length > 0) {
        for (const v of waveEq.derivedVariables) {
          if (!v.name || !v.expression) continue;
          const defExpanded = expandMacro(v.expression, numParticles);
          if (!defExpanded) continue;
          const pattern = new RegExp(`\\b${v.name}\\b`, 'g');
          expanded = expanded.replace(pattern, `(${defExpanded})`);
        }
      }

      // 2. Parse as a math.js node representing psi(x,y,z,t).
      const psiNode = math.parse(expanded);

      // 3. Compute spatial derivatives of psi.
      const dPsiDx = math.derivative(psiNode, 'x');
      const dPsiDy = math.derivative(psiNode, 'y');
      const dPsiDz = math.derivative(psiNode, 'z');

      // 4. Build (∂ψ/∂x)/ψ etc. and let math.js simplify them.
      const psiStr = psiNode.toString();
      const ratioDx = math.simplify(`(${dPsiDx.toString()})/(${psiStr})`);
      const ratioDy = math.simplify(`(${dPsiDy.toString()})/(${psiStr})`);
      const ratioDz = math.simplify(`(${dPsiDz.toString()})/(${psiStr})`);

      // 5. Compute the imaginary part symbolically using the identity
      // Im(f) = (f - conj(f)) / (2 i), assuming all symbols except 'i' are real.
      const imagOf = (node: any): string => {
        const raw = node.toString().replace(/\s+/g, '');
        const conj = raw.replace(/\bi\b/g, '(-i)');
        const expr = `((${raw})-(${conj}))/(2*i)`;
        const simplified = math.simplify(expr);
        return simplified.toString();
      };

      // 6. Try to re-express Im((∂ψ/∂x)/ψ) etc. using any derived variables from JSON for readability.
      const simplifyWithDerived = (exprStr: string): string => {
        let out = exprStr.replace(/\s+/g, '');
        if (!selectedDomain?.waveEquation?.derivedVariables) return out;
        for (const v of selectedDomain.waveEquation.derivedVariables) {
          if (!v.name || !v.expression) continue;

          const defExpanded = expandMacro(v.expression, numParticles);
          if (!defExpanded) continue;

          let pattern = defExpanded.replace(/\s+/g, '');
          try {
            // Use math.js to canonicalize the derived expression so it
            // matches the form produced inside the larger simplified
            // Bohmian expression (e.g., handling things like
            // y - slitSeparation/2 vs y + slitSeparation * -1/2).
            pattern = math.simplify(defExpanded).toString().replace(/\s+/g, '');
          } catch {
            // Fall back to the raw expanded form if simplification fails.
          }

          if (!pattern) continue;
          out = out.split(pattern).join(v.name);
        }
        return out;
      };

      const imDx = simplifyWithDerived(imagOf(ratioDx));
      const imDy = simplifyWithDerived(imagOf(ratioDy));
      const imDz = simplifyWithDerived(imagOf(ratioDz));

      // 7. Assemble Bohmian velocity components v = (hbar/mass) * Im(∇ψ/ψ),
      // now with Im(...) already expanded into a purely real expression.
      const simplifyComponent = (expr: string): string => {
        try {
          // Let math.js clean up trivial factors like hbar/mass*(0) -> 0
          // and perform basic algebraic simplifications.
          return math.simplify(expr).toString();
        } catch {
          return expr;
        }
      };

      const vx = simplifyComponent(`hbar/mass*(${imDx})`);
      const vy = simplifyComponent(`hbar/mass*(${imDy})`);
      const vz = simplifyComponent(`hbar/mass*(${imDz})`);

      const particleExpr = `[${vx},${vy},${vz}]`;

      handleUpdateDomainEquation(selectedDomain.id, 'particle', { expression: particleExpr });
      setValidationResult({ type: 'success', message: 'Particle dynamics populated from wave function (Bohmian form).' });
      setJustValidatedDomainId(selectedDomain.id);
      setParticleDerivationError(null);
    } catch (e) {
      console.error('Failed to derive Bohmian dynamics from wave function:', e);
      setParticleDerivationError({ domainId: selectedDomain.id, message: 'Failed to derive Bohmian dynamics. Please check that the wave expression only uses supported math functions and variables.' });
    }
  };
  const [activeWaveTextarea, setActiveWaveTextarea] = useState<'main' | string | null>(null); // 'main' or var ID
  const waveCursorPosition = useRef<number | null>(null);

  // --- NEW: Reference filter for Wave/Derived/Particle tabs ---
  type ReferenceFilter = 'all' | 'variables' | 'constants' | 'parameters' | 'objects';
  const [referenceFilter, setReferenceFilter] = useState<ReferenceFilter>('all');


  const handleUpdateParameter = (id: string, newProps: Partial<CustomParameter>) => {
    setDraftParameters(prev => prev.map(p => p.id === id ? { ...p, ...newProps } : p));
  };

  const handleUpdateRelation = (id: string, newProps: Partial<ParameterRelation>) => {
    // Any edit to a relation invalidates previous validation feedback
    setValidationResult(null);
    setDraftRelations(prev => prev.map(r =>
      r.id === id
        ? { ...r, ...newProps, isValidated: false }
        : r
    ));
  };

  const handleUpdateConstant = (id: string, newProps: Partial<GlobalConstant>) => {
    setDraftConstants(prev => prev.map(c => c.id === id ? { ...c, ...newProps } : c));
  };

  const handleUpdateConstantId = (oldId: string, newId: string) => {
    // Prevent empty IDs
    if (!newId.trim()) {
      alert('Error: Constant ID cannot be empty.');
      return;
    }
    // Check if the new ID is already in use by another constant
    if (draftConstants.some(c => c.id === newId && c.id !== oldId)) {
      alert(`Error: Constant ID "${newId}" already exists. Please choose a unique ID.`);
      return;
    }
    // Update the constant and the selected ID
    setDraftConstants(prev => prev.map(c => (c.id === oldId ? { ...c, id: newId } : c)));
    setSelectedId(newId);
  };

  const handleUpdateRelationId = (oldId: string, newId: string) => {
    // Prevent empty IDs
    // Check if the new ID is already in use by another relation
    if (newId.trim() && draftRelations.some(r => r.id === newId && r.id !== oldId)) {
      alert(`Error: Relation ID "${newId}" already exists. Please choose a unique ID.`);
      return;
    }
    // Update the relation and the selected ID; clear old validation
    setValidationResult(null);
    setDraftRelations(prev => prev.map(r => (r.id === selectedId ? { ...r, id: newId, isValidated: false } : r)));
    setSelectedId(newId);
  };

  const expressionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);
  const nextCursorPosition = useRef<number | null>(null);

  const handleInsertReference = (textToInsert: string, type: 'object' | 'property' | 'parameter') => {
    if (selectedId === null || !selectedRelation) return;

    const name = (type === 'object' && textToInsert.includes(' ')) ? `'${textToInsert}'` : textToInsert;

    if (activeField === 'target' || (activeField === null && (type === 'object' || type === 'property'))) {
      // Insert into Target field
      const input = targetInputRef.current;
      if (!input) return;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue = input.value.substring(0, start) + name + input.value.substring(end);
      nextCursorPosition.current = start + name.length;
      handleUpdateRelationId(selectedRelation.id, newValue);

    } else if (activeField === 'expression' || (activeField === null && type === 'parameter')) {
      // Insert into Expression field
      const textarea = expressionTextareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const currentExpr = selectedRelation.expression || '';
      const newExpr = currentExpr.substring(0, start) + name + currentExpr.substring(end);
      handleUpdateRelation(selectedId, { expression: newExpr });
      // We can also manage cursor for the expression textarea
      nextCursorPosition.current = start + name.length;
    }
  };

  // --- NEW: Handle inserting references into wave function textareas ---
  const handleInsertWaveReference = (textToInsert: string, cursorOffset = 0) => {
    if (!selectedDomain) return;

    let activeInput: HTMLTextAreaElement | HTMLInputElement | null = null;
    let isDerivedVarInput = false;

    if (activeWaveTextarea === 'main') {
      activeInput = waveExpressionTextareaRef.current;
    } else if (activeWaveTextarea) {
      // Find the input for the derived variable
      const inputElement = document.getElementById(`derived-expr-${activeWaveTextarea}`);
      if (inputElement instanceof HTMLInputElement || inputElement instanceof HTMLTextAreaElement) {
        activeInput = inputElement;
        isDerivedVarInput = true;
      }
    }

    if (!activeInput) return; // No active textarea

    const start = activeInput.selectionStart || 0;
    const end = activeInput.selectionEnd || 0;
    const currentValue = activeInput.value;
    const newValue = currentValue.substring(0, start) + textToInsert + currentValue.substring(end);

    // Manually trigger the update since we are bypassing React's state flow for the input
    if (isDerivedVarInput && activeWaveTextarea) {
      handleUpdateDerivedVariable(activeWaveTextarea, { expression: newValue });
    } else {
      handleUpdateDomainEquation(selectedDomain.id, 'wave', { expression: newValue });
    }

    // Set cursor position for the next render cycle
    waveCursorPosition.current = start + textToInsert.length - cursorOffset;

    // We need to focus the textarea again manually after the state update
    setTimeout(() => activeInput?.focus(), 0);
  };
  // Effect to set cursor position after an insertion
  useEffect(() => {
    if (nextCursorPosition.current !== null) {
      const input = activeField === 'target' ? targetInputRef.current : expressionTextareaRef.current;
      input?.focus();
      input?.setSelectionRange(nextCursorPosition.current, nextCursorPosition.current);
      nextCursorPosition.current = null; // Reset after use
    }
    if (waveCursorPosition.current !== null) {
      let textarea: HTMLInputElement | HTMLTextAreaElement | null = null;
      if (activeWaveTextarea === 'main') {
        textarea = waveExpressionTextareaRef.current;
      } else if (activeWaveTextarea) {
        textarea = document.getElementById(`derived-expr-${activeWaveTextarea}`) as HTMLInputElement | HTMLTextAreaElement;
      }
      textarea?.focus();
      textarea?.setSelectionRange(waveCursorPosition.current, waveCursorPosition.current);
      waveCursorPosition.current = null;
    }
  });

  // --- NEW: Insert helper for Project Variables editor ---
  const handleInsertVariableReference = (textToInsert: string, cursorOffset = 0) => {
    if (!editingVarId) return;
    const inputElement = document.getElementById(`project-expr-${editingVarId}`) as HTMLInputElement | HTMLTextAreaElement | null;
    if (!inputElement) return;
    const start = (inputElement.selectionStart as number) || 0;
    const end = (inputElement.selectionEnd as number) || 0;
    const current = inputElement.value || '';
    const newValue = current.substring(0, start) + textToInsert + current.substring(end);
    setDraftProjectVariables(prev => prev.map(pv => pv.id === editingVarId ? { ...pv, expression: newValue, isValidated: false } : pv));
    const newCursor = start + textToInsert.length - cursorOffset;
    setTimeout(() => {
      inputElement.focus();
      try { inputElement.setSelectionRange(newCursor, newCursor); } catch { /* ignore */ }
    }, 0);
  };

  const domainDefinitionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const handleInsertDomainReference = (textToInsert: string) => {
    if (selectedId && selectedDomain) {
      const currentDef = selectedDomain.rules[0]?.definition || '';
      // --- FIX: Use conditional quoting ---
      const name = textToInsert.includes(' ') ? `'${textToInsert}'` : textToInsert;
      const newDef = currentDef + name;
      handleUpdateDomain(selectedId, { rules: [{ id: selectedDomain.rules[0]?.id || uuidv4(), definition: newDef }] });
    }
  };

  const validateCurrentDomain = () => {
    if (!selectedDomain || !selectedDomain.rules[0]) return;
    setValidationResult(null);

    // --- NEW: Handle geometric shapes ---
    if (selectedDomain.shape === 'box') {
      // Geometric shapes are inherently valid.
      setValidationResult({ type: 'success', message: 'Geometric shape is valid. Saved!' });
      setJustValidatedDomainId(selectedDomain.id); // --- FIX: Signal a save ---
      return;
    }

    // --- USE SHORTHAND EXPANDER ---
    const definition = selectedDomain.rules[0].definition;
    if (!definition.trim()) {
      setValidationResult({ type: 'error', message: 'Definition cannot be empty.' });
      return;
    }

    // --- NEW: More Intelligent and Flexible Validation Logic ---
    // --- FIX: Add math functions to the list of known keywords ---
    const knownKeywords = new Set(['x', 'y', 'z', 'r', 'dx', 'dy', 'dz', 'xy', 'xz', 'yz', '>', '<', '>=', '<=', '==', '!=', '&&', '||', 'and', 'or', '(', ')', 'abs', 'sqrt', 'sin', 'cos', 'exp'])
    const knownObjectNames = new Set(flattenedObjects.map(o => o.name).filter(Boolean) as string[]);
    // --- FIX: Include shorthand property labels in the set of known properties ---
    const shorthandLabels = propertyMappings.map(p => p.label);
    const knownProperties = new Set(['position', 'rotation', 'scale', 'x', 'y', 'z', ...shorthandLabels]);

    // --- NEW: Function to test evaluation ---
    const testExpression = (expr: string, scope: Record<string, number>) => {
      const result = evaluateExpressionWithScope(expr, scope);
      if (result === null) {
        setValidationResult({ type: 'error', message: `Could not evaluate expression part: "${expr}"` });
        return false;
      }
      return true;
    };

    // This regex finds: quoted or unquoted words with properties, numbers, and operators.
    const tokens = definition.match(/'[^']+'(?:\.\w+)*|\b\w+(?:\.\w+)*\b|&&|\|\||>=|<=|==|!=|[<>()]/g) || [];

    for (const token of tokens) {
      // --- NEW: Check for incomplete property access like "Wall." ---
      if (token.endsWith('.') && token.length > 1) {
        setValidationResult({ type: 'error', message: `Incomplete property access: "${token}"` });
        return;
      }

      // 1. Check for known keywords (x, y, z, >, and, or, etc.) or numbers
      if (knownKeywords.has(token)) {
        continue;
      }
      if (!isNaN(parseFloat(token))) {
        continue;
      }

      // 2. Check for object property access like Wall.position.z
      const isQuoted = token.startsWith("'") && token.endsWith("'");
      const isUnquotedWord = /^\w+/.test(token);

      if (isQuoted || (isUnquotedWord && token.includes('.'))) {
        const cleanToken = isQuoted ? token.substring(1, token.length - 1) : token;
        const parts = cleanToken.split('.');
        const objectName = parts[0];

        if (!knownObjectNames.has(objectName)) {
          setValidationResult({ type: 'error', message: `Object '${objectName}' not found in the scene.` });
          return;
        }
        for (let i = 1; i < parts.length; i++) {
          if (!knownProperties.has(parts[i])) {
            setValidationResult({ type: 'error', message: `Invalid property: "${parts[i]}"` });
            return;
          }
        }
        continue; // The entire object.property token is valid
      }

      // 3. Check if the token itself is a known object name
      if (isUnquotedWord && knownObjectNames.has(token)) {
        continue;
      }

      // 4. If it's none of the above, it's an invalid token
      setValidationResult({ type: 'error', message: `Unknown variable or keyword: "${token}"` });
      return;
    }

    // --- NEW: Final structural check ---
    const hasComparison = ['>', '<', '>=', '<=', '==', '!='].some(op => definition.includes(op));
    if (!hasComparison) {
      setValidationResult({ type: 'error', message: 'Definition must be a logical expression containing a comparison (e.g., >, <, within).'});
      return;
    }

    // --- FIX: Handle multiple clauses separated by 'and' or 'or' ---
    // This makes the validator's logic match the renderer's logic.
    const validationClauses = definition.split(/\s+(?:and|or|&&|\|\|)\s+/);
    const scope = buildEvaluationScope(flattenedObjects, draftConstants);

    for (const clause of validationClauses) {
      const comparisonMatch = clause.match(/\b([xyz])\s*([><]=?)\s*(.*)/);

      if (comparisonMatch) {
        const expressionToTest = comparisonMatch[3].trim();
        const expandedExpression = expandShorthand(expressionToTest); // Use shared function
        if (!testExpression(expandedExpression, scope)) return; // Stop if evaluation fails
      }
    }
    // (We can add more checks for 'within' clauses here later if needed)

    // If all checks pass, mark as validated and give success message
    setDraftDomains(prev => prev.map(d => d.id === selectedDomain.id ? { ...d, rules: d.rules.map(r => ({ ...r, isValidated: true })) } : d));
    setValidationResult({ type: 'success', message: 'Validation successful! Saved!' });
    setJustValidatedDomainId(selectedDomain.id); // --- FIX: Signal a save ---
  };

  // --- NEW: Handle Preview ---
  const handlePreviewDomain = () => {
    if (!selectedDomain) return;
    if (!selectedDomain.rules[0]?.isValidated) {
      alert('Please validate the domain definition successfully before previewing.');
      return;
    }
    // Use the new callback and close the modal
    onPreview(selectedDomain, selectedDomain.id);
  };

  // --- NEW: Validation logic for relations ---
  const validateCurrentRelation = () => {
    if (!selectedRelation) return;
    setValidationResult(null); // Clear previous result

    const constantsScope = draftConstants.reduce((acc, c) => ({ ...acc, [c.name]: c.value }), {});
    const paramsScope = draftParameters.reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {});
    const fullScope = { ...constantsScope, ...paramsScope };

    // --- REFACTORED VALIDATION ---
    const rightHandSide = selectedRelation.expression;

    // --- FIX: Use the same robust regex as the ParametricManager ---
    // This regex finds: an optional quoted name OR an unquoted name, followed by a dot and the property.
    const match = selectedRelation.id.match(/^(?:'([^']*)'|([a-zA-Z0-9_-]+))\.(.*)$/);
    if (!match) {
      setValidationResult({ type: 'error', message: `Invalid target: "${selectedRelation.id}". Must be in the format 'ObjectName'.property or ObjectName.property` });
      return;
    }
    // The object name will be in either the first or second capture group
    const targetObjectId = match[1] || match[2]; // e.g., 'TopScreen' or TopScreen
    // --- FIX: Expand the shorthand *after* parsing ---
    const shorthandProperty = match[3]; // e.g., 'dy'
    // Use propertyMappings to get the full path for validation
    const targetProperty = propertyMappings.find(p => p.label === shorthandProperty)?.value || shorthandProperty;

    if (!findObjectByName(flattenedObjects, targetObjectId)) {
      setValidationResult({ type: 'error', message: `Object "${targetObjectId}" not found in the scene.` });
      return;
    }

    // --- NEW: Check if the property path is valid on a dummy object ---
    const dummyObject: Record<string, any> = { position: [0,0,0], rotation: [0,0,0], scale: [1,1,1], opacity: 1 };
    const tempNewProps = JSON.parse(JSON.stringify(dummyObject));
    const success = setPropertyByPath(tempNewProps, targetProperty, 1); // Use a dummy value

    if (!success) {
      setValidationResult({ type: 'error', message: `Property "${targetProperty}" is not a valid or assignable path.` });
      return;
    }
    // --- End of new validation ---

    // --- NEW: Enforce that relations depend only on parameters/constants, not object properties ---
    try {
      const node = (math as any).parse(rightHandSide);
      const symbols = new Set<string>();
      node.traverse((n: any) => {
        if (n.isSymbolNode) symbols.add(n.name);
      });

      const allowedNames = new Set<string>([ 
        ...draftParameters.map(p => p.name),
        ...draftConstants.map(c => c.name),
        'pi', 'PI', 'e', 'E' // common math constants
      ]);

      const forbidden = Array.from(symbols).filter(name => !allowedNames.has(name));
      if (forbidden.length > 0) {
        setValidationResult({
          type: 'error',
          message: `Relations can only depend on parameters (and constants), not object properties. Found invalid symbol${forbidden.length > 1 ? 's' : ''}: ${forbidden.join(', ')}.`,
        });
        return;
      }
    } catch {
      // If parsing fails, let the numeric evaluator below report the problem.
    }

    const newValue = evaluateExpressionWithScope(rightHandSide, fullScope);
    if (newValue === null) {
      setValidationResult({ type: 'error', message: `Could not evaluate expression: "${rightHandSide}". Check for typos or undefined variables.` });
      return;
    }

    if (!isFinite(newValue)) {
      setValidationResult({ type: 'error', message: `Result is not a finite number (${newValue}).` });
      return;
    }

    if (targetProperty.includes('scale') && newValue <= 0) {
      setValidationResult({ type: 'error', message: `Scale values must be positive, but got ${newValue}.` });
      return;
    }

    // If all checks pass, mark as validated
    setDraftRelations(prev => prev.map(r => r.id === selectedRelation.id ? { ...r, isValidated: true } : r));
    setValidationResult({ type: 'success', message: `Validation successful! Result: ${newValue.toFixed(4)}` });
  };

  // --- NEW: Handle Save ---
  const handleSave = () => {
    // --- NEW: Only check items that are new or have been modified ---
    const unvalidatedRelations = draftRelations.filter(r => {
      const original = props.relations.find(orig => orig.id === r.id);
      // It's a problem if it's new and not validated, OR if it's modified and not validated.
      return (!original && !r.isValidated) || (original && (original.expression !== r.expression || original.id !== r.id) && !r.isValidated);
    });

    const unvalidatedDomains = draftDomains.filter(d => {
      const original = props.domains.find(orig => orig.id === d.id);
      const originalDef = original?.rules[0]?.definition ?? null;
      const currentDef = d.rules[0]?.definition ?? null;
      // It's a problem if it's new and has a definition that isn't validated, OR if it's modified and not validated.
      return (!original && currentDef && !d.rules[0].isValidated) || (original && originalDef !== currentDef && currentDef && !d.rules[0].isValidated);
    });

    if (unvalidatedDomains.length > 0) {
      alert(`Error: ${unvalidatedDomains.length} domain definition(s) have not been successfully validated. Please validate all domains before saving.`);
      return;
    }

    if (unvalidatedRelations.length > 0) {
      // --- NEW: Stricter save logic ---
      alert(`Error: ${unvalidatedRelations.length} relation(s) have not been successfully validated. Please validate all relations before saving.`);
      return; // Prevent saving and closing
    }

    // Proceed with saving
    onSave({
      domains: draftDomains,
      parameters: draftParameters,
      relations: draftRelations,
      constants: draftConstants,
      particles: draftParticles,
      projectVariables: draftProjectVariables,
    }, false); // false = don't close

    setInitialDraftSnapshot(buildCurrentDraftSnapshot());

    // Give user feedback that save was successful
    setValidationResult({ type: 'success', message: 'Saved!' });
    setTimeout(() => setValidationResult(null), 2000); // Clear message after 2 seconds
  };
  
  // --- NEW: Validation for Wave Function ---
  const validateWave = () => {
    if (!selectedDomain?.waveEquation) {
      setValidationResult({ type: 'error', message: 'No wave function to validate.' });
      return;
    }
    setValidationResult(null);

    const { expression, derivedVariables = [] } = selectedDomain.waveEquation;

    // Pre-compute names of domain-derived variables so we don't
    // accidentally treat them as project variables in the early check.
    const derivedNames = new Set<string>(
      derivedVariables
        .map(v => v.name)
        .filter((n): n is string => !!n)
    );

    // --- NEW: Early check for unvalidated project variables referenced in the wave expression ---
    const findUnvalidatedProjectVarReference = (expr: string): string | null => {
      const tokens = expr.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g) || [];
      for (const token of tokens) {
        // If this name is a domain-derived variable, let the
        // derived-variable validation handle it instead.
        if (derivedNames.has(token)) continue;

        const pv = draftProjectVariables.find(p => p.name === token);
        if (pv && !pv.isValidated) return token;
      }
      return null;
    };

    const unvalidatedVar = findUnvalidatedProjectVarReference(expression);
    if (unvalidatedVar) {
      setValidationResult({ type: 'error', message: `Project variable "${unvalidatedVar}" is not validated.` });
      return;
    }

    // Build a scope with all available variables
    const baseScope = buildEvaluationScope(flattenedObjects, draftConstants);
    const paramsScope = draftParameters.reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {});
    let fullScope: Record<string, any> = { ...baseScope, ...paramsScope, x: 0, y: 0, z: 0, t: 0 };

    // --- FIX: Add selected particle's mass to the validation scope ---
    if (selectedParticleDef) {
      const massVal = (selectedParticleDef as any).mass ?? (selectedParticleDef as any).massKg;
      if (massVal !== undefined) fullScope['mass'] = massVal;
    }

    // --- NEW: Inject validated project-level variables into the scope ---
    for (const pv of draftProjectVariables) {
      if (!pv.name || !pv.expression) continue;
      if (!pv.isValidated) continue; // only trust validated globals

      try {
        const expanded = expandMacro(pv.expression, 1);
        const val = evaluateExpressionWithScope(expanded, fullScope);
        if (val === null) throw new Error('Evaluation returned null.');
        fullScope[pv.name] = val;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
        setValidationResult({ type: 'error', message: `Error in project variable "${pv.name}": ${msg}` });
        return;
      }
    }

    // Validate and add derived variables to the scope one by one
    for (const v of derivedVariables) {
      if (!v.name || !v.expression) {
        setValidationResult({ type: 'error', message: `Derived variable "${v.name || 'Unnamed'}" is incomplete.` });
        return;
      }
      // --- NEW: Expand macros before validating ---
      const expandedExpr = expandMacro(v.expression, selectedDomain.waveEquation.numberOfParticles);
      try {
        const result = evaluateExpressionWithScope(expandedExpr, fullScope);
        if (result === null) throw new Error('Evaluation returned null.');
        fullScope[v.name] = result; // Add to scope for next variables
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setValidationResult({ type: 'error', message: `Error in "${v.name}": ${errorMessage}` });
        return;
      }
    }

    // Finally, validate the main expression
    const expandedMainExpr = expandMacro(expression, selectedDomain.waveEquation.numberOfParticles);
    try {
      const mainResult = evaluateExpressionWithScope(expandedMainExpr, fullScope);
      if (mainResult === null) throw new Error('Evaluation returned null.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setValidationResult({ type: 'error', message: `Error in main expression: ${errorMessage}` });
      return;
    }

    // --- FIX: Actually set the isValidated flag on success ---
    // Clear magnitude range; GPU-based normalization will be recomputed on next run
    handleUpdateDomain(selectedDomain.id, { minMagnitude: undefined, maxMagnitude: undefined, logMinMagnitude: undefined });
    handleUpdateDomainEquation(selectedDomain.id, 'wave', { isValidated: true });

    // --- NEW: Synchronize validated wave back to main domains in App ---
    // This keeps physicsDomains (used by previews and simulation) in sync
    // with the expression and validation state the user just checked here.
    if (props.setDomains) {
      const updatedWave = {
        ...selectedDomain.waveEquation!,
        isValidated: true,
      };
      props.setDomains(prev => prev.map(d =>
        d.id === selectedDomain.id
          ? { ...d, waveEquation: updatedWave, minMagnitude: undefined, maxMagnitude: undefined, logMinMagnitude: undefined }
          : d
      ));
    }

    setValidationResult({ type: 'success', message: 'Validation successful!' });
  };

  // --- NEW: Validation for a single derived variable ---
  const validateSingleDerivedVariable = (varId: string): boolean => {
    if (!selectedDomain?.waveEquation?.derivedVariables) return false;
    setValidationResult(null);

    const derivedVariables = selectedDomain.waveEquation.derivedVariables;
    const varIndex = derivedVariables.findIndex(v => v.id === varId);
    const targetVar = derivedVariables[varIndex];

    if (!targetVar) return false;

    // Build a scope with all available variables UP TO the one being validated
    const baseScope = buildEvaluationScope(flattenedObjects, draftConstants);
    const paramsScope = draftParameters.reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {});
    let fullScope: Record<string, any> = { ...baseScope, ...paramsScope, x: 0, y: 0, z: 0, t: 0 };

    // Include the selected particle's mass in the scope if available
    if (selectedParticleDef) {
      const massVal = (selectedParticleDef as any).mass ?? (selectedParticleDef as any).massKg;
      if (massVal !== undefined) fullScope['mass'] = massVal;
    }

    // --- NEW: Inject validated project-level variables into the scope ---
    for (const pv of draftProjectVariables) {
      if (!pv.name || !pv.expression) continue;
      if (!pv.isValidated) continue;

      const expanded = expandMacro(pv.expression, 1);
      const res = evaluateExpressionWithScope(expanded, fullScope);
      if (res === null) {
        setValidationResult({ type: 'error', message: `Dependency error in project variable "${pv.name}".` });
        return false;
      }
      fullScope[pv.name] = res;
    }

    // Add preceding derived variables to the scope
    for (let i = 0; i < varIndex; i++) {
      const prevVar = derivedVariables[i];
      const expandedExpr = expandMacro(prevVar.expression, selectedDomain.waveEquation.numberOfParticles);
      const result = evaluateExpressionWithScope(expandedExpr, fullScope);
      if (result !== null) fullScope[prevVar.name] = result;
    }

    // Prevent collision with project-level variables
    if (draftProjectVariables.some(pv => pv.name === targetVar.name)) {
      setValidationResult({ type: 'error', message: `Name collision: domain variable "${targetVar.name}" conflicts with a project-level variable.` });
      return false;
    }

    // Now, validate the target variable
    const expandedExpr = expandMacro(targetVar.expression, selectedDomain.waveEquation.numberOfParticles);
    try {
      const result = evaluateExpressionWithScope(expandedExpr, fullScope);
      if (result === null) throw new Error('Evaluation returned null.');

      setValidationResult({ type: 'success', message: `"${targetVar.name}" is valid!` });
      // Mark as validated in the draft state
      handleUpdateDerivedVariable(varId, { isValidated: true });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setValidationResult({ type: 'error', message: `Error in "${targetVar.name}": ${message}` });
      return false;
    }
  };

  // --- NEW: Validation for a single project-level variable ---
  const validateSingleProjectVariable = (varId: string): boolean => {
    if (!draftProjectVariables || draftProjectVariables.length === 0) return false;
    setValidationResult(null);

    const varIndex = draftProjectVariables.findIndex(v => v.id === varId);
    const targetVar = draftProjectVariables[varIndex];
    if (!targetVar) return false;

    // Build a base scope similar to runtime infoVariables evaluation
    const baseScope = buildEvaluationScope(flattenedObjects, draftConstants);
    const paramsScope = draftParameters.reduce((acc: Record<string, any>, p) => ({ ...acc, [p.name]: p.value }), {});
    const scope: Record<string, any> = { ...baseScope, ...paramsScope, x: 0, y: 0, z: 0, t: 0 };

    // Include a representative particle mass if available (use selected particle, otherwise first)
    let massVal: number | undefined;
    if (selectedParticleDef) {
      const m = (selectedParticleDef as any).mass ?? (selectedParticleDef as any).massKg;
      if (m !== undefined) massVal = m;
    } else if (draftParticles && draftParticles.length > 0) {
      const p: any = draftParticles[0];
      massVal = (p as any).mass ?? (p as any).massKg;
    }
    if (massVal !== undefined) scope['mass'] = massVal;

    // Evaluate project variables in sequence up to and including the target
    for (let i = 0; i <= varIndex; i++) {
      const v = draftProjectVariables[i];
      if (!v.name || !v.expression) {
        setValidationResult({ type: 'error', message: `Project variable "${v.name || 'Unnamed'}" is incomplete.` });
        return false;
      }

      const expandedExpr = expandMacro(v.expression, 1);
      try {
        const val = evaluateExpressionWithScope(expandedExpr, scope);
        if (val === null) throw new Error('Evaluation returned null.');
        scope[v.name] = val;

        if (v.id === varId) {
          // Mark as validated in draft state
          setDraftProjectVariables(prev => prev.map(pv => pv.id === varId ? { ...pv, isValidated: true } : pv));
          setValidationResult({ type: 'success', message: `"${v.name}" is valid!` });
          return true;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setValidationResult({ type: 'error', message: `Error in project variable "${v.name}": ${message}` });
        return false;
      }
    }

    return false;
  };

  // --- NEW: Handler for saving a derived variable with validation ---
  const handleSaveDerivedVariableClick = (varId: string) => {
    const targetVar = selectedDomain?.waveEquation?.derivedVariables?.find(v => v.id === varId);
    // If it's already validated, just save.
    if (targetVar?.isValidated) {
      setEditingVarId(null);
      return;
    }
    // Otherwise, try to validate. If successful, save.
    if (validateSingleDerivedVariable(varId)) {
      setEditingVarId(null);
    }
    // If validation fails, do nothing, keeping the row in edit mode.
  };

  // --- NEW: Handle Save & Close ---
  // Combined Save & Close handler (project variables included)
  const handleSaveAndCloseWithVariables = () => {
    onSave({
      domains: draftDomains,
      parameters: draftParameters,
      relations: draftRelations,
      constants: draftConstants,
      particles: draftParticles,
      projectVariables: draftProjectVariables,
    }, true);
    setInitialDraftSnapshot(buildCurrentDraftSnapshot());
  };

  // --- NEW: Logic for column resizing ---
  const resizingRef = useRef<{ column: 'nav' | 'list', startX: number, startWidth: number } | null>(null);

  const handleResizeStart = (e: React.PointerEvent, column: 'nav' | 'list') => {
    e.preventDefault();
    resizingRef.current = {
      column,
      startX: e.clientX,
      startWidth: columnWidths[column],
    };
    window.addEventListener('pointermove', handleResizeMove);
    window.addEventListener('pointerup', handleResizeEnd);
  };

  const handleResizeMove = (e: PointerEvent) => {
    if (!resizingRef.current) return;
    const { column, startX, startWidth } = resizingRef.current;
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(120, Math.min(400, startWidth + deltaX)); // Constrain width
    setColumnWidths(prev => ({ ...prev, [column]: newWidth }));
  };

  const handleResizeEnd = () => {
    resizingRef.current = null;
    window.removeEventListener('pointermove', handleResizeMove);
    window.removeEventListener('pointerup', handleResizeEnd);
  };
  // --- End of resizing logic ---

  // --- NEW: Logic for modal dragging ---
  const dragRef = useRef<{ offsetX: number, offsetY: number } | null>(null);

  const handleDragStart = (e: React.PointerEvent) => {
    // Only drag on the header itself, not on buttons inside it
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    const modalRect = (e.currentTarget.closest('.domain-modal-content') as HTMLElement).getBoundingClientRect();
    dragRef.current = {
      offsetX: e.clientX - modalRect.left,
      offsetY: e.clientY - modalRect.top,
    };
    window.addEventListener('pointermove', handleDragMove);
    window.addEventListener('pointerup', handleDragEnd);
  };

  const handleDragMove = (e: PointerEvent) => {
    if (!dragRef.current) return;
    const newTop = e.clientY - dragRef.current.offsetY;
    const newLeft = e.clientX - dragRef.current.offsetX;
    setModalPosition({ top: newTop, left: newLeft });
  };

  const handleDragEnd = () => {
    dragRef.current = null;
    window.removeEventListener('pointermove', handleDragMove);
    window.removeEventListener('pointerup', handleDragEnd);
  };

  // --- NEW: Logic for modal resizing ---
  const modalResizingRef = useRef<{ startX: number, startY: number, startW: number, startH: number } | null>(null);

  const handleModalResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    modalResizingRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: (e.currentTarget.closest('.domain-modal-content') as HTMLElement).offsetWidth,
      startH: (e.currentTarget.closest('.domain-modal-content') as HTMLElement).offsetHeight,
    };
    window.addEventListener('pointermove', handleModalResizeMove);
    window.addEventListener('pointerup', handleModalResizeEnd);
  };

  const handleModalResizeMove = (e: PointerEvent) => {
    if (!modalResizingRef.current) return;
    const { startX, startY, startW, startH } = modalResizingRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const newWidth = Math.max(800, startW + deltaX);
    const newHeight = Math.max(500, startH + deltaY); // Use pixels for height during resize
    setModalSize({ width: newWidth, height: newHeight });
  };

  const handleModalResizeEnd = () => {
    modalResizingRef.current = null;
    window.removeEventListener('pointermove', handleModalResizeMove);
    window.removeEventListener('pointerup', handleModalResizeEnd);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div 
        className="domain-modal-content" 
        style={{ 
          position: 'relative', // --- FIX: Allow top/left positioning ---
          width: `${modalSize.width}px`, 
          height: typeof modalSize.height === 'number' ? `${modalSize.height}px` : modalSize.height,
          top: modalPosition ? `${modalPosition.top}px` : undefined,
          left: modalPosition ? `${modalPosition.left}px` : undefined,
        }}>
        <div className="domain-modal-header" onPointerDown={handleDragStart} style={{ cursor: 'move' }}>
          <h2>Setup</h2>
          <button onClick={handleRequestClose} className="modal-close-btn">&times;</button>
        </div>        
        {/* CSS styles are now here, so they apply to all tabs consistently */}
        <style>{`
          .form-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }
          .form-row label {
            flex: 0 0 150px; /* Give label a fixed width */
            margin-right: 10px;
            text-align: right;
          }
          .form-row input, .form-row textarea {
            flex: 1; /* Allow input to take remaining space */
          }
          .reference-container {
            margin-top: 20px;
            border-top: 1px solid #444;
            padding-top: 15px;
          }
          .reference-section {
            display: flex;
            align-items: flex-start;
            margin-bottom: 8px;
            gap: 8px;
          }
          .reference-section h5 {
            flex: 0 0 100px;
            text-align: right;
            margin: 0;
            padding-top: 4px;
            font-size: 1em; /* FIX: Make label scale */
            color: #aaa;
          }
          .reference-container h4 {
            margin: 0 0 5px 0;
            color: #aaa;
          }
          .reference-list {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
          }
          .ref-item {
            background-color: #3a3a3a;
            border: 1px solid #555;
            color: #ddd;
            padding: 2px 6px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em; /* FIX: Make buttons scale */
          }
          .form-row-split {
            display: flex;
            gap: 20px; /* Space between the groups */
            align-items: center;
          }
          .form-row-split .form-row {
            flex: 1; /* Each group takes half the space */
            margin-bottom: 0; /* Remove bottom margin since the parent has it */
            gap: 10px;
            align-items: baseline;
          }
          /* --- FIX for font scaling --- */
          .tab-content input, .tab-content textarea {
            font-size: 1em; /* Use em to inherit from parent */
          }
          .gui-nav-button, .domain-list-item, .tab-button {
            font-size: 1em; /* Make all nav/list text scale */
          }
          .modal-btn-apply, .modal-btn-cancel, .modal-btn-secondary {
            font-size: 0.9em; /* Make footer buttons scale too */
          }
          /* --- FIX: Make correlation list scale --- */
          .correlation-list ul {
            font-size: 0.85em; /* This was for font scaling */
            flex-grow: 1; /* --- FIX: Make the list grow to fill space --- */
          }
          .correlation-list {
            flex-grow: 1; /* --- FIX: Make the container grow --- */
            display: flex;
            flex-direction: column;
          }
          .resize-handle {
            position: absolute;
            right: -3px;
            top: 0;
            bottom: 0;
            width: 6px;
            cursor: col-resize;
            z-index: 10;
          }
          .resize-handle:hover {
            background-color: #007bff33;
          }
          .modal-resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 16px;
            height: 16px;
            cursor: se-resize;
            z-index: 20;
            border-bottom: 2px solid #888;
            border-right: 2px solid #888;
          }
        `}</style>
        <div className="domain-modal-main" style={{ fontSize: `${modalFontSize}px` }}>
          {/* Column 1: Main Navigator */}
          <div className="gui-nav" style={{ width: `${columnWidths.nav}px`, position: 'relative' }}>
            <button className={`gui-nav-button ${mainTab === 'domains' ? 'active' : ''}`} onClick={() => { setMainTab('domains'); setValidationResult(null); }}>Domains</button>
            <button className={`gui-nav-button ${mainTab === 'parameters' ? 'active' : ''}`} onClick={() => { setMainTab('parameters'); setValidationResult(null); }}>Parameters</button>
            <button className={`gui-nav-button ${mainTab === 'relations' ? 'active' : ''}`} onClick={() => { setMainTab('relations'); setValidationResult(null); }}>Relations</button>
            <button className={`gui-nav-button ${mainTab === 'constants' ? 'active' : ''}`} onClick={() => { setMainTab('constants'); setValidationResult(null); }}>Constants</button>
            <button className={`gui-nav-button ${mainTab === 'variables' ? 'active' : ''}`} onClick={() => { setMainTab('variables'); setValidationResult(null); }}>Variables</button>
            <div className="resize-handle" onPointerDown={(e) => handleResizeStart(e, 'nav')}></div>
          </div>

          {/* Column 2: Item List */}
          <div className="gui-item-list-container" style={{ width: `${columnWidths.list}px`, position: 'relative' }}>
            <ul className="domain-list">
              {mainTab === 'domains' && draftDomains.map(item => (
                <li key={item.id} className={`domain-list-item ${selectedId === item.id ? 'active' : ''}`} onClick={() => setSelectedId(item.id)}>
                  {item.name}
                  {item.rules[0]?.definition && item.rules[0]?.isValidated && <span style={{ color: '#28a745', marginLeft: '8px', fontWeight: 'bold' }}>✓</span>}
                </li>
              ))}
              {mainTab === 'variables' && draftProjectVariables.map(item => (
                <li key={item.id} className={`domain-list-item ${selectedId === item.id ? 'active' : ''}`} onClick={() => setSelectedId(item.id)}>
                  {item.name}
                  {item.isValidated && <span style={{ color: '#28a745', marginLeft: '8px', fontWeight: 'bold' }}>✓</span>}
                </li>
              ))}
              {mainTab === 'parameters' && draftParameters.map(item => (
                <li key={item.id} className={`domain-list-item ${selectedId === item.id ? 'active' : ''}`} onClick={() => setSelectedId(item.id)}>{item.label}</li>
              ))}
              {mainTab === 'relations' && draftRelations.map(item => (
                <li key={item.id} className={`domain-list-item ${selectedId === item.id ? 'active' : ''}`} onClick={() => setSelectedId(item.id)}>
                  {item.id}
                  {item.isValidated && <span style={{ color: '#28a745', marginLeft: '8px', fontWeight: 'bold' }}>✓</span>}
                </li>
              ))}
              {mainTab === 'constants' && draftConstants.map(item => (
                <li key={item.id} className={`domain-list-item ${selectedId === item.id ? 'active' : ''}`} onClick={() => setSelectedId(item.id)}>{item.name}</li>
              ))}
            </ul>
            <div className="domain-list-actions">
              {mainTab === 'domains' && <button className="modal-btn-apply" style={{ width: '100%' }} onClick={handleAddDomain}>Add Domain</button>}
              {mainTab === 'parameters' && <button className="modal-btn-apply" style={{ width: '100%' }} onClick={handleAddParameter}>Add Parameter</button>}
              {mainTab === 'relations' && <button className="modal-btn-apply" style={{ width: '100%' }} onClick={handleAddRelation}>Add Relation</button>}
              {mainTab === 'constants' && <button className="modal-btn-apply" style={{ width: '100%' }} onClick={handleAddConstant}>Add Constant</button>}
              {mainTab === 'variables' && <button className="modal-btn-apply" style={{ width: '100%' }} onClick={() => {
                // Add a new project-level variable
                const newVar: DerivedVariable = { id: uuidv4(), name: 'newVar', expression: '1' };
                setDraftProjectVariables(prev => [...prev, newVar]);
                setSelectedId(newVar.id);
                setEditingVarId(newVar.id);
              }}>Add Variable</button>}
              {selectedId && mainTab === 'domains' && <button className="modal-btn-cancel" style={{ width: '100%', marginTop: '8px' }} onClick={() => handleDeleteDomain(selectedId)}>Delete Selected</button>}
              {selectedId && mainTab !== 'domains' && <button className="modal-btn-cancel" style={{ width: '100%', marginTop: '8px' }} onClick={() => handleDeleteItem(selectedId)}>Delete Selected</button>}
            </div>
            <div className="resize-handle" onPointerDown={(e) => handleResizeStart(e, 'list')}></div>
          </div>

          {/* Column 3: Detail Editor */}
          <div className="domain-editor-pane">
            {mainTab === 'domains' && selectedDomain && (
              <>
                <div className="tabs" onClick={() => setValidationResult(null)}>
                  <button className={`tab-button ${domainSubTab === 'definition' ? 'active' : ''}`} onClick={() => setDomainSubTab('definition')}>Definition</button>
                  <button className={`tab-button ${domainSubTab === 'derived' ? 'active' : ''}`} onClick={() => setDomainSubTab('derived')}>Derived Variables</button>                  <button className={`tab-button ${domainSubTab === 'wave' ? 'active' : ''}`} onClick={() => setDomainSubTab('wave')}>Wave</button>
                  <button className={`tab-button ${domainSubTab === 'particle' ? 'active' : ''}`} onClick={() => setDomainSubTab('particle')}>Particle</button>
                </div>
                {domainSubTab === 'definition' && (
                  <div className="tab-content">
                    <div className="form-row">
                      <label htmlFor="domain-name">Name</label>
                      <input id="domain-name" type="text" value={selectedDomain.name} onChange={e => handleUpdateDomain(selectedDomain.id, { name: e.target.value })} />
                    </div>

                    {/* --- NEW: Shape selector --- */}
                    <div className="form-row">
                      <label htmlFor="domain-shape">Shape</label>
                      <select id="domain-shape" value={selectedDomain.shape || 'custom'} onChange={e => handleUpdateDomain(selectedDomain.id, { shape: e.target.value as any })}>
                        <option value="box">Box</option>                        
                        <option value="custom">Custom Rule</option>
                      </select>
                    </div>

                    {/* --- NEW: Shape properties --- */}
                    {(selectedDomain.shape === 'box' ) && (
                      <>
                        <div className="form-row-split" style={{marginBottom: '8px'}}>
                          <div className="form-row"><label>Center X</label><input type="number" step="0.1" value={selectedDomain.center?.[0] ?? 0} onChange={e => handleUpdateDomain(selectedDomain.id, { center: [parseFloat(e.target.value), selectedDomain.center?.[1] ?? 0, selectedDomain.center?.[2] ?? 0] })} /></div>
                          <div className="form-row"><label>Center Y</label><input type="number" step="0.1" value={selectedDomain.center?.[1] ?? 0} onChange={e => handleUpdateDomain(selectedDomain.id, { center: [selectedDomain.center?.[0] ?? 0, parseFloat(e.target.value), selectedDomain.center?.[2] ?? 0] })} /></div>
                          <div className="form-row"><label>Center Z</label><input type="number" step="0.1" value={selectedDomain.center?.[2] ?? 0} onChange={e => handleUpdateDomain(selectedDomain.id, { center: [selectedDomain.center?.[0] ?? 0, selectedDomain.center?.[1] ?? 0, parseFloat(e.target.value)] })} /></div>
                        </div>
                        {selectedDomain.shape === 'box' && (
                          <div className="form-row-split" style={{marginBottom: '8px'}}>
                            <div className="form-row"><label>Size X</label><input type="number" step="0.1" min="0" value={selectedDomain.size?.[0] ?? 1} onChange={e => handleUpdateDomain(selectedDomain.id, { size: [parseFloat(e.target.value), selectedDomain.size?.[1] ?? 1, selectedDomain.size?.[2] ?? 1] })} /></div>
                            <div className="form-row"><label>Size Y</label><input type="number" step="0.1" min="0" value={selectedDomain.size?.[1] ?? 1} onChange={e => handleUpdateDomain(selectedDomain.id, { size: [selectedDomain.size?.[0] ?? 1, parseFloat(e.target.value), selectedDomain.size?.[2] ?? 1] })} /></div>
                            <div className="form-row"><label>Size Z</label><input type="number" step="0.1" min="0" value={selectedDomain.size?.[2] ?? 1} onChange={e => handleUpdateDomain(selectedDomain.id, { size: [selectedDomain.size?.[0] ?? 1, selectedDomain.size?.[1] ?? 1, parseFloat(e.target.value)] })} /></div>
                          </div>
                        )}
                      </>
                    )}

                    {/* --- NEW: Conditional rule editor --- */}
                    {(!selectedDomain.shape || selectedDomain.shape === 'custom') && (
                      <div className="form-row" style={{ alignItems: 'flex-start' }}>
                        <label htmlFor="domain-def" style={{ paddingTop: '5px' }}>Definition</label>
                        <textarea ref={domainDefinitionTextareaRef} id="domain-def" value={selectedDomain.rules[0]?.definition || ''} onChange={e => handleUpdateDomain(selectedDomain.id, { rules: [{ id: selectedDomain.rules[0]?.id || uuidv4(), definition: e.target.value }] })} rows={3} />
                      </div>
                    )}
                    <div className="validation-section">
                      <div style={{ flex: '0 0 150px', marginRight: '10px' }}></div> {/* Spacer */}
                      <button className="modal-btn-secondary" onClick={validateCurrentDomain}>Validate</button>
                      <button className="modal-btn-secondary" onClick={handlePreviewDomain} style={{marginLeft: '10px'}}>Preview on Scene</button>
                      {validationResult && (
                        <span className={`validation-message ${validationResult.type}`}>
                          {validationResult.message}
                        </span>
                      )}
                    </div>
                    {(!selectedDomain.shape || selectedDomain.shape === 'custom') && (
                      <div className="reference-container">
                        <div className="reference-section">
                          <h5>Objects:</h5>
                          <div className="reference-list">
                            {flattenedObjects.filter(o => o.name && o.type !== 'axes').map(obj => (
                              <button key={obj.id} className="ref-item" onClick={() => handleInsertDomainReference(obj.name!)}>
                                {obj.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="reference-section">
                          <h5>Properties:</h5>
                          <div className="reference-list">
                            {propertyMappings.filter(p => !p.value.startsWith('rotation') && p.value !== 'opacity').map(prop => (
                              <button key={prop.value} className="ref-item" title={prop.title} onClick={() => handleInsertDomainReference(`.${prop.label}`)}>
                                {prop.label} 
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {domainSubTab === 'wave' && (
                  <div className="tab-content">
                    {/* --- NEW: Compact Layout --- */}
                    {/* --- NEW: Top row for Name and Particles --- */}
                    <div className="form-row-split" style={{ alignItems: 'center', marginBottom: '10px' }}>
                      <label htmlFor="wave-name" style={{ flex: '0 0 auto', marginRight: '10px' }}>Name</label>
                      <input id="wave-name" type="text" value={selectedDomain.waveEquation?.name || ''} onChange={e => handleUpdateDomainEquation(selectedDomain.id, 'wave', { name: e.target.value })} placeholder="e.g., Plane Wave" style={{ flex: 1 }} />
                      <label htmlFor="num-particles" style={{ flex: '0 0 auto', marginLeft: '20px', marginRight: '10px' }}>Particles</label>
                      <input id="num-particles" type="number" min="1" step="1"
                        value={selectedDomain.waveEquation?.numberOfParticles || 1}
                        onChange={e => handleUpdateDomainEquation(selectedDomain.id, 'wave', { numberOfParticles: parseInt(e.target.value, 10) || 1 })} style={{ flex: '0 0 60px' }} />                      
                      {/* Particle selection for a domain is shown in the main Physics controls instead. */}
                    </div>

                    <label htmlFor="wave-expr">Wave Expression (ψ)</label>
                    <textarea
                      id="wave-expr"
                      ref={waveExpressionTextareaRef}
                      value={selectedDomain.waveEquation?.expression || ''}
                      onFocus={() => setActiveWaveTextarea('main')}
                      onChange={e => handleUpdateDomainEquation(selectedDomain.id, 'wave', { expression: e.target.value })}
                      placeholder="Expression, e.g., sin(k * z - omega * t)"
                      rows={5}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                    {/* --- NEW: Validation row moved below everything --- */}
                    <div className="validation-section" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <button className="modal-btn-secondary" onClick={validateWave}>Validate</button>
                      <button className="modal-btn-secondary" onClick={() => {
                        if (selectedDomain && !onTestRender(selectedDomain)) {
                          setValidationResult({ type: 'error', message: 'Wave expression must be validated before rendering.' });
                        }
                      }}>
                        Test Render
                      </button>
                      {/* --- MOVED & STYLED: Display for calculated magnitude range --- */}
                      {(selectedDomain.minMagnitude !== undefined && selectedDomain.maxMagnitude !== undefined) && (
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginLeft: 'auto' }}>
                          <label style={{fontSize: '0.9em', color: '#aaa'}}>Range:</label>
                          <input type="text" readOnly value={selectedDomain.minMagnitude.toPrecision(4)} title="Minimum Magnitude" style={{width: '70px', textAlign: 'center'}} />
                          <span>-</span>
                          <input type="text" readOnly value={selectedDomain.maxMagnitude.toPrecision(4)} title="Maximum Magnitude" style={{width: '70px', textAlign: 'center'}} />
                        </div>
                      )}
                      {validationResult && (
                        <span className={`validation-message ${validationResult.type}`} style={{ flex: 1 }}>
                          {validationResult.message}
                        </span>
                      )}
                    </div>

                  </div>
                )}
                {domainSubTab === 'derived' && (
                  <div className="tab-content">
                    {/* The validation message will now appear here, below the table */}
                    <table className="derived-variables-table">
                      <thead>
                        <tr>
                          <th style={{ width: '22%' }}>Name</th>
                          <th>Expression</th>
                          <th style={{ width: '16%' }}>Value</th>
                          <th className="action-cell">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                              <span>Actions</span>
                              {/* --- NEW: Toolbar in table header --- */}
                              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                                <button
                                  className="modal-btn-secondary"
                                  onClick={handleAddDerivedVariable}
                                  title="Add a new derived variable"
                                >
                                  Add
                                </button>
                                <button
                                  className="modal-btn-secondary"
                                  onClick={validateWave}
                                  title="Validate all derived variables and the main wave function expression"
                                >
                                  Validate
                                </button>
                              </div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDomain.waveEquation?.derivedVariables?.map(v => (
                          <tr key={v.id}>
                            {editingVarId === v.id ? (
                              // --- NEW: Editable Row ---
                              <>
                                <td><input type="text" value={v.name} onChange={e => handleUpdateDerivedVariable(v.id, { name: e.target.value })} placeholder="e.g., r" autoFocus /></td>
                                <td><input type="text" id={`derived-expr-${v.id}`} value={v.expression} onFocus={() => setActiveWaveTextarea(v.id)} onChange={e => handleUpdateDerivedVariable(v.id, { expression: e.target.value })} placeholder="e.g., distance(Object)" /></td>
                                <td>
                                  {derivedVariableValues[v.id] !== undefined && derivedVariableValues[v.id] !== null
                                    ? <code>{derivedVariableValues[v.id]?.toPrecision(4)}</code>
                                    : <span style={{ color: '#777' }}>—</span>}
                                </td>
                                <td className="action-cell" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                  <button className="modal-btn-apply" style={{ padding: '2px 6px' }} onClick={() => handleSaveDerivedVariableClick(v.id)} title="Save changes">Save</button>
                                  <button className="delete-var-btn" onClick={() => handleDeleteDerivedVariable(selectedDomain.id, v.id)}>&times;</button>
                                </td>
                              </>
                            ) : (
                              // --- NEW: Read-Only Row ---
                              <>
                                <td>{v.name}</td>
                                <td>
                                  <div className="expression-cell">
                                    {v.showExpanded ? (
                                      <code className="expanded-expr">{expandMacro(v.expression, selectedDomain.waveEquation?.numberOfParticles || 1)}</code>
                                    ) : (
                                      <code>{v.expression}</code>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  {derivedVariableValues[v.id] !== undefined && derivedVariableValues[v.id] !== null
                                    ? <code>{derivedVariableValues[v.id]?.toPrecision(4)}</code>
                                    : <span style={{ color: '#777' }}>—</span>}
                                </td>
                                <td className="action-cell" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                  <button
                                    className="modal-btn-secondary"
                                    style={{ padding: '2px 6px' }}
                                    onClick={() => setEditingVarId(v.id)}
                                    title="Edit this variable"
                                  >
                                    ✎
                                  </button>
                                  <button
                                    className="expand-btn"
                                    title="Toggle expanded expression (macros expanded)"
                                    onClick={() => toggleShowExpanded(v.id)}
                                  >
                                    ↔
                                  </button>
                                  <ValidationIconButton
                                    validated={v.isValidated}
                                    onClick={() => validateSingleDerivedVariable(v.id)}
                                    title="Validate this variable"
                                  />
                                  <button className="delete-var-btn" onClick={() => handleDeleteDerivedVariable(selectedDomain.id, v.id)}>&times;</button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {validationResult && (
                      <div className="validation-section" style={{ padding: '10px 0 0 0', justifyContent: 'flex-end' }}>
                        <span className={`validation-message ${validationResult.type}`}>{validationResult.message}</span>
                      </div>
                    )}
                  </div>
                )}

                {domainSubTab === 'particle' && (
                  <div className="tab-content">
                    <div className="form-row" style={{ alignItems: 'flex-start', marginBottom: '8px' }}>
                      <label style={{ width: '100px' }}>Velocity law</label>
                      <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.9em', lineHeight: 1.4 }}>
                        {selectedDomain.particleEquation?.displayFormula || 'Bohmian: v = (ħ/m) Im(∇ψ / ψ)'}
                      </div>
                    </div>
                    {(() => {
                      const expr = selectedDomain.particleEquation?.expression || '';
                      const [vx, vy, vz] = splitParticleExpression(expr);
                      return (
                        <div className="form-row" style={{ alignItems: 'flex-start', paddingLeft: 0 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
                            <div className="form-row" style={{ marginBottom: 0 }}>
                              <label style={{ width: '36px', marginRight: '6px' }}>v_x</label>
                              <input
                                type="text"
                                className="custom-text-input"
                                style={{ flex: 1, width: '100%' }}
                                value={vx}
                                onChange={e => {
                                  const [, curVy, curVz] = splitParticleExpression(selectedDomain.particleEquation?.expression || '');
                                  const newExpr = `[${e.target.value || ''},${curVy || ''},${curVz || ''}]`;
                                  handleUpdateDomainEquation(selectedDomain.id, 'particle', { expression: newExpr });
                                }}
                                placeholder="e.g., hbar/mass*im(...)"
                              />
                            </div>
                            <div className="form-row" style={{ marginBottom: 0 }}>
                              <label style={{ width: '36px', marginRight: '6px' }}>v_y</label>
                              <input
                                type="text"
                                className="custom-text-input"
                                style={{ flex: 1, width: '100%' }}
                                value={vy}
                                onChange={e => {
                                  const [curVx, , curVz] = splitParticleExpression(selectedDomain.particleEquation?.expression || '');
                                  const newExpr = `[${curVx || ''},${e.target.value || ''},${curVz || ''}]`;
                                  handleUpdateDomainEquation(selectedDomain.id, 'particle', { expression: newExpr });
                                }}
                                placeholder="e.g., hbar/mass*im(...)"
                              />
                            </div>
                            <div className="form-row" style={{ marginBottom: 0 }}>
                              <label style={{ width: '36px', marginRight: '6px' }}>v_z</label>
                              <input
                                type="text"
                                className="custom-text-input"
                                style={{ flex: 1, width: '100%' }}
                                value={vz}
                                onChange={e => {
                                  const [curVx, curVy] = splitParticleExpression(selectedDomain.particleEquation?.expression || '');
                                  const newExpr = `[${curVx || ''},${curVy || ''},${e.target.value || ''}]`;
                                  handleUpdateDomainEquation(selectedDomain.id, 'particle', { expression: newExpr });
                                }}
                                placeholder="e.g., hbar/mass*im(...)"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="form-row">
                      <button
                        type="button"
                        className="modal-btn-secondary"
                        onClick={handlePopulateParticleFromWave}
                        disabled={!selectedDomain.waveEquation}
                        title="Derive Bohmian velocity field v = (ħ/m) Im(∇ψ / ψ) from the current wave function"
                      >
                        Populate from Wave (Bohmian)
                      </button>
                      {particleDerivationError && particleDerivationError.domainId === selectedDomain.id && (
                        <span style={{ marginLeft: '10px', color: '#ff8080', fontSize: '0.85em' }}>
                          {particleDerivationError.message}
                        </span>
                      )}
                    </div>
                    {/* Particle injection surfaces: geometric surfaces tied to scene objects */}
                    <div className="form-row" style={{ alignItems: 'flex-start', marginTop: '10px' }}>
                      <label style={{ width: '90px', marginRight: '6px' }}>Injection surfaces</label>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
                        <div className="form-row" style={{ justifyContent: 'space-between', marginBottom: 0 }}>
                          <button
                            type="button"
                            className="modal-btn-secondary"
                            onClick={handleAddInjectionSurface}
                            disabled={!selectedDomain}
                          >
                            Add surface
                          </button>
                          <div style={{ minWidth: '220px' }}>
                            <ColorPalettePicker
                              label="Psi² Palette"
                              palettes={surfacePalettes}
                              selectedPalette={selectedDomain.colorPalette ?? 'phase'}
                              onChange={(v) => handleUpdateDomain(selectedDomain.id, { colorPalette: v })}
                            />
                          </div>
                        </div>

                        {(Array.isArray(selectedDomain.injectionSurfaces) && selectedDomain.injectionSurfaces.length > 0) ? (
                          selectedDomain.injectionSurfaces.map((s, index) => {
                            const sourceObj = flattenedObjects.find(o => o.id === s.sourceObjectId);
                            const sourceType = sourceObj?.type;
                            const isCollapsed = collapsedSurfaces[s.id] === true;
                            return (
                              <div
                                key={s.id}
                                className="injection-surface-card"
                                style={{
                                  border: '1px solid #444',
                                  borderRadius: '4px',
                                  padding: '6px',
                                  background: '#1a1a1a',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px',
                                }}
                              >
                                <div className="form-row" style={{ alignItems: 'center', marginBottom: 0 }}>
                                  <button
                                    type="button"
                                    className="modal-btn-secondary"
                                    style={{ marginRight: '6px', width: '26px', padding: '2px 4px' }}
                                    onClick={() =>
                                      setCollapsedSurfaces(prev => ({
                                        ...prev,
                                        [s.id]: !isCollapsed,
                                      }))
                                    }
                                    title={isCollapsed ? 'Expand surface controls' : 'Collapse surface to a single line'}
                                  >
                                    {isCollapsed ? '+' : '−'}
                                  </button>
                                  <input
                                    type="text"
                                    className="custom-text-input"
                                    style={{ flex: 1, marginRight: '6px' }}
                                    value={s.name || `Surface ${index + 1}`}
                                    onChange={e => handleUpdateInjectionSurface(s.id, { name: e.target.value })}
                                    placeholder={`Surface ${index + 1}`}
                                  />
                                  <button
                                    type="button"
                                    className="modal-btn-secondary"
                                    onClick={() => handleDeleteInjectionSurface(s.id)}
                                    title="Remove this surface"
                                  >
                                    ✕
                                  </button>
                                </div>

                                {!isCollapsed && (
                                  <>
                                <div className="form-row" style={{ marginBottom: 0 }}>
                                  <label style={{ width: '70px', marginRight: '6px' }}>Source</label>
                                  <select
                                    className="custom-text-input"
                                    style={{ flex: 0, minWidth: '168px', width: 'auto' }}
                                    value={s.sourceObjectId || ''}
                                    onChange={e => {
                                      const newId = e.target.value;
                                      const obj = flattenedObjects.find(o => o.id === newId);
                                      let kind: InjectionSurfaceKind = 'rect';
                                      if (obj?.type === 'sphere') kind = 'sphereProjected';
                                      else if (obj?.type === 'cylinder') kind = 'cylinderSection';
                                      const patch: Partial<InjectionSurface> = {
                                        sourceObjectId: newId,
                                        kind,
                                      };
                                      if (obj?.type === 'box') {
                                        patch.face = s.face || 'front';
                                      } else {
                                        patch.face = undefined;
                                      }
                                      if (newId === s.targetObjectId) {
                                        patch.targetObjectId = undefined;
                                      }
                                      handleUpdateInjectionSurface(s.id, patch);
                                    }}
                                  >
                                    <option value="">Select source object</option>
                                    {flattenedObjects
                                      .filter(obj => obj.type !== 'axes')
                                      .map(obj => (
                                        <option key={obj.id} value={obj.id}>
                                          {(obj.name || obj.id) + (obj.type ? ` (${obj.type})` : '')}
                                        </option>
                                      ))}
                                  </select>
                                  {sourceType && (
                                    <span style={{ marginLeft: '6px', fontSize: '0.8em', color: '#aaa' }}>
                                      {sourceType}
                                    </span>
                                  )}

                                  {/* When the source is a box, show face selector inline to the right */}
                                  {sourceType === 'box' && (
                                    <>
                                      <span style={{ margin: '0 4px', fontSize: '0.8em', color: '#aaa' }}>
                                        ·
                                      </span>
                                      <label style={{ marginRight: '4px', fontSize: '0.8em', color: '#ccc' }}>Face</label>
                                      <select
                                        className="custom-text-input"
                                        style={{ flex: 0, minWidth: '132px', width: 'auto' }}
                                        value={s.face || 'front'}
                                        onChange={e => handleUpdateInjectionSurface(s.id, { face: e.target.value as any })}
                                      >
                                        <option value="front">Front (+z)</option>
                                        <option value="back">Back (-z)</option>
                                        <option value="left">Left (-x)</option>
                                        <option value="right">Right (+x)</option>
                                        <option value="top">Top (+y)</option>
                                        <option value="bottom">Bottom (-y)</option>
                                      </select>
                                    </>
                                  )}
                                </div>

                                {/* Surface selector for cylinder sources */}
                                {sourceType === 'cylinder' && (
                                  <div className="form-row" style={{ marginBottom: 0 }}>
                                    <label style={{ width: '70px', marginRight: '6px' }}>Surface</label>
                                    <select
                                      className="custom-text-input"
                                      style={{ flex: 0, minWidth: '144px', width: 'auto' }}
                                      value="side"
                                      onChange={() => { /* side only for now */ }}
                                    >
                                      <option value="side">Side (curved)</option>
                                    </select>
                                  </div>
                                )}

                                {/* Target object for projection (optional for all surfaces) */}
                                <div className="form-row" style={{ marginBottom: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                                  <label style={{ width: '70px', marginRight: '6px' }}>Target</label>
                                  <select
                                    className="custom-text-input"
                                    style={{ flex: 0, minWidth: '192px', width: 'auto' }}
                                    value={s.targetObjectId || ''}
                                    onChange={e => handleUpdateInjectionSurface(s.id, { targetObjectId: e.target.value || undefined })}
                                  >
                                    <option value="">None (whole surface)</option>
                                    {flattenedObjects
                                      .filter(obj => obj.id !== s.sourceObjectId && obj.type !== 'axes')
                                      .map(obj => (
                                        <option key={obj.id} value={obj.id}>
                                          {(obj.name || obj.id) + (obj.type ? ` (${obj.type})` : '')}
                                        </option>
                                      ))}
                                  </select>
                                  <span style={{ margin: '0 4px', fontSize: '0.8em', color: '#aaa' }}>·</span>
                                  <label style={{ marginRight: '4px', fontSize: '0.8em', color: '#ccc' }}>Res</label>
                                  <input
                                    type="number"
                                    className="custom-text-input"
                                    style={{ width: '72px' }}
                                    min={2}
                                    max={256}
                                    value={s.uSegments ?? s.vSegments ?? 24}
                                    onChange={e => {
                                      const v = Math.max(2, Math.min(256, Number(e.target.value) || 2));
                                      handleUpdateInjectionSurface(s.id, { uSegments: v, vSegments: v });
                                    }}
                                  />
                                  <span style={{ marginLeft: '6px', fontSize: '0.8em', color: '#888' }}>
                                    ≈ (N×N = {Math.pow(s.uSegments ?? s.vSegments ?? 24, 2)} points)
                                  </span>
                                </div>

                                {/* ---- Quantum injection controls ---- */}
                                <div className="form-row" style={{ marginTop: '6px', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                  <label style={{ fontSize: '0.8em', color: '#ccc', minWidth: '88px' }}>Spawn Mode</label>
                                  <select
                                    className="custom-select"
                                    style={{ fontSize: '0.8em' }}
                                    value={s.spawnMode ?? 'freeform'}
                                    onChange={e => handleUpdateInjectionSurface(s.id, {
                                      spawnMode: e.target.value as 'freeform' | 'quantum',
                                    })}
                                  >
                                    <option value="freeform">Freeform (uniform random)</option>
                                    <option value="quantum">Quantum (|ψ|² weighted)</option>
                                  </select>
                                </div>

                                {s.spawnMode === 'quantum' && (
                                  <>
                                    <div className="form-row" style={{ marginTop: '4px', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                      <label style={{ fontSize: '0.8em', color: '#ccc', minWidth: '88px' }}>Pool size</label>
                                      <input
                                        type="number"
                                        className="custom-text-input"
                                        style={{ width: '72px' }}
                                        min={10}
                                        max={2000}
                                        step={10}
                                        value={s.quantumPoolSize ?? 200}
                                        onChange={e => {
                                          const v = Math.max(10, Math.min(2000, Number(e.target.value) || 200));
                                          handleUpdateInjectionSurface(s.id, { quantumPoolSize: v });
                                        }}
                                      />
                                      <span style={{ fontSize: '0.75em', color: '#888' }}>pre-traced spawn points</span>
                                    </div>
                                  </>
                                )}

                                {/* ---- Trigger controls (all spawn modes) ---- */}
                                <div className="form-row" style={{ marginTop: '4px', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                  <label style={{ fontSize: '0.8em', color: '#ccc', minWidth: '88px' }}>Trigger</label>
                                  <select
                                    className="custom-select"
                                    style={{ fontSize: '0.8em' }}
                                    value={s.linkedFromDomainIds !== undefined ? 'crossing' : 'continuous'}
                                    onChange={e => {
                                      if (e.target.value === 'continuous') {
                                        handleUpdateInjectionSurface(s.id, { linkedFromDomainIds: undefined });
                                      } else if (s.linkedFromDomainIds === undefined) {
                                        handleUpdateInjectionSurface(s.id, { linkedFromDomainIds: [] });
                                      }
                                    }}
                                  >
                                    <option value="continuous">Continuous (rate-based)</option>
                                    <option value="crossing">On domain crossing</option>
                                  </select>
                                </div>

                                {s.linkedFromDomainIds !== undefined && (
                                  <div className="form-row" style={{ marginTop: '4px', gap: '6px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                    <label style={{ fontSize: '0.8em', color: '#ccc', minWidth: '88px', paddingTop: '2px' }}>
                                      From domain(s)
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                      {draftDomains
                                        .filter(d => d.id !== selectedDomain?.id)
                                        .map(d => (
                                          <label
                                            key={d.id}
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8em', color: '#ccc', cursor: 'pointer' }}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={(s.linkedFromDomainIds ?? []).includes(d.id)}
                                              onChange={e => {
                                                const current = s.linkedFromDomainIds ?? [];
                                                const next = e.target.checked
                                                  ? [...current, d.id]
                                                  : current.filter(id => id !== d.id);
                                                handleUpdateInjectionSurface(s.id, { linkedFromDomainIds: next });
                                              }}
                                            />
                                            {d.name || d.id}
                                          </label>
                                        ))}
                                      {draftDomains.filter(d => d.id !== selectedDomain?.id).length === 0 && (
                                        <span style={{ fontSize: '0.8em', color: '#777' }}>No other domains</span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="form-row" style={{ marginTop: '4px', marginBottom: 0, gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                  <button
                                    className="modal-btn-secondary"
                                    type="button"
                                    onClick={() => {
                                      if (!selectedDomain || !onTestSurfaceRender) return;
                                      setSurfaceTestError(null);
                                      setLastTestedSurfaceId(null);
                                      const ok = onTestSurfaceRender(selectedDomain, s.id, 'surface');
                                      if (!ok) {
                                        setSurfaceTestError('Unable to start surface preview.');
                                      }
                                    }}
                                  >
                                    Test Surface
                                  </button>

                                  <button
                                    className="modal-btn-secondary"
                                    type="button"
                                    onClick={() => {
                                      if (!selectedDomain || !onTestSurfaceRender) return;
                                      setSurfaceTestError(null);
                                      setLastTestedSurfaceId(s.id);
                                      const ok = onTestSurfaceRender(selectedDomain, s.id, 'surfacePsi2');
                                      if (!ok) {
                                        setSurfaceTestError('Unable to start Psi² surface preview.');
                                      }
                                    }}
                                  >
                                    Test Psi²
                                  </button>

                                  {lastTestedSurfaceId === s.id && selectedDomain && psi2SurfaceStats && psi2SurfaceStats[selectedDomain.id] && (
                                    <span style={{ fontSize: '0.8em', color: '#aaa' }}>
                                      Psi² min: {psi2SurfaceStats[selectedDomain.id].min.toExponential(2)},
                                      max: {psi2SurfaceStats[selectedDomain.id].max.toExponential(2)}
                                    </span>
                                  )}

                                  {surfaceTestError && (
                                    <span className="validation-message error" style={{ whiteSpace: 'nowrap' }}>
                                      {surfaceTestError}
                                    </span>
                                  )}
                                </div>
                                  </>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div style={{ fontSize: '0.8em', color: '#888' }}>
                            No injection surfaces defined yet. Use "Add surface" to create one tied to a scene object.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- NEW: Universal Reference Panel at the bottom --- */}
                {(domainSubTab === 'wave' || domainSubTab === 'derived') && (
                  <div className="reference-container" style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <h4 style={{ marginBottom: 0 }}>References</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.85em', color: '#aaa' }}>Show:</span>
                        <select
                          value={referenceFilter}
                          onChange={e => setReferenceFilter(e.target.value as ReferenceFilter)}
                          style={{ fontSize: '0.85em' }}
                        >
                          <option value="all">All</option>
                          <option value="variables">Variables</option>
                          <option value="constants">Constants</option>
                          <option value="parameters">Parameters</option>
                          <option value="objects">Objects / Properties</option>
                        </select>
                      </div>
                    </div>
                    {(referenceFilter === 'all' || referenceFilter === 'variables') && (
                      <div className="reference-section">
                        <h5>Variables:</h5>
                        <div className="reference-list">
                          {(() => {
                            const numParticles = selectedDomain?.waveEquation?.numberOfParticles || 1;
                            if (numParticles <= 1) {
                              return ['x', 'y', 'z', 't'].map(v => <button key={v} className="ref-item" onClick={() => handleInsertWaveReference(v)}>{v}</button>);
                            }
                            const vars = [];
                            for (let i = 1; i <= numParticles; i++) {
                              vars.push(`x${i}`, `y${i}`, `z${i}`);
                            }
                            vars.push('t');
                            return vars.map(v => <button key={v} className="ref-item" onClick={() => handleInsertWaveReference(v)}>{v}</button>);
                          })()}
                        </div>
                      </div>
                    )}
                    {(referenceFilter === 'all' || referenceFilter === 'constants') && (
                      <div className="reference-section">
                        <h5>Constants:</h5>
                        <div className="reference-list">
                          {draftConstants.map(c => <button key={c.id} className="ref-item" onClick={() => handleInsertWaveReference(c.name)}>{c.name}</button>)}
                        </div>
                      </div>
                    )}
                    {(referenceFilter === 'all' || referenceFilter === 'parameters') && (
                      <div className="reference-section">
                        <h5>Parameters:</h5>
                        <div className="reference-list">
                          {draftParameters.map(p => <button key={p.id} className="ref-item" onClick={() => handleInsertWaveReference(p.name)}>{p.name}</button>)}
                        </div>
                      </div>
                    )}
                    {(referenceFilter === 'all') && (
                      <div className="reference-section">
                        <h5>Functions:</h5>
                        <div className="reference-list">
                          <button className="ref-item" title="Calculates distance between particle and an object" onClick={() => handleInsertWaveReference('distance()', 1)}>distance()</button>
                          <button className="ref-item" title="Square Root" onClick={() => handleInsertWaveReference('sqrt()', 1)}>sqrt()</button>
                          <button className="ref-item" title="Sine" onClick={() => handleInsertWaveReference('sin()', 1)}>sin()</button>
                          <button className="ref-item" title="Cosine" onClick={() => handleInsertWaveReference('cos()', 1)}>cos()</button>
                          <button className="ref-item" title="Exponential" onClick={() => handleInsertWaveReference('exp()', 1)}>exp()</button>
                        </div>
                      </div>
                    )}
                    {/* --- NEW: Grouped Objects and Properties --- */}
                    {(referenceFilter === 'all' || referenceFilter === 'objects') && (
                      <div style={{ border: '1px solid #4a4a4a', borderRadius: '4px', padding: '10px', marginTop: '8px' }}>
                        <div className="reference-section" style={{ marginBottom: '10px' }}>
                          <h5 title="Geometrical objects from the scene">Objects:</h5>
                          <div className="reference-list">
                            {flattenedObjects.filter(o => o.name && o.type !== 'axes').map(obj => (
                              <button key={obj.id} className="ref-item" onClick={() => handleInsertWaveReference(obj.name!)}>
                                {obj.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="reference-section" style={{ marginBottom: '0' }}>
                          <h5>Properties:</h5>
                          <div className="reference-list">
                            {propertyMappings.map(prop => (
                              <button key={prop.value} className="ref-item" title={prop.title} onClick={() => handleInsertWaveReference(`.${prop.label}`)}>{prop.label}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* --- NEW: Particle Properties (treated as variables) --- */}
                    {selectedParticleDef && (referenceFilter === 'all' || referenceFilter === 'variables') && (
                      <div className="reference-section" style={{ marginTop: '10px' }}>
                        <h5>Particle:</h5>
                        <div className="reference-list">
                          <button
                            className="ref-item"
                            title={`Mass in project units: ${(selectedParticleDef as any).mass}`}
                            onClick={() => handleInsertWaveReference('mass')}
                          >
                            mass
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Conditionally show Derived Vars in References (as variables) */}
                    {domainSubTab === 'wave' && (referenceFilter === 'all' || referenceFilter === 'variables') && (
                      <div className="reference-section">
                        <h5>Derived Vars:</h5>
                        <div className="reference-list">
                          {selectedDomain.waveEquation?.derivedVariables?.filter(v => v.name).map(v => (
                            <button key={v.id} className="ref-item" title={v.expression} onClick={() => handleInsertWaveReference(v.name)}>{v.name}</button>
                          ))}
                          {draftProjectVariables.map(v => (
                            <button key={`proj-${v.id}`} className="ref-item" title={v.expression} onClick={() => handleInsertWaveReference(v.name)}>{v.name}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {mainTab === 'parameters' && selectedParameter && (
              <div className="tab-content">
                <h3>Edit Parameter</h3>
                {/* Use a div with flexbox for each row to align label and input */}
                <div className="form-row"><label>Label</label><input type="text" value={selectedParameter.label} onChange={e => handleUpdateParameter(selectedId!, { label: e.target.value })} /></div>
                <div className="form-row-split" style={{marginBottom: '8px'}}>
                  <div className="form-row"><label>Name</label><input type="text" value={selectedParameter.name} onChange={e => handleUpdateParameter(selectedId!, { name: e.target.value })} /></div>
                  <div className="form-row"><label>Folder</label><input list="folder-names-param" type="text" value={selectedParameter.folderName} onChange={e => handleUpdateParameter(selectedId!, { folderName: e.target.value })} /></div>
                </div>
                <div className="form-row-split" style={{marginBottom: '8px'}}>
                  <div className="form-row"><label>Value</label><input type="number" value={selectedParameter.value} onChange={e => handleUpdateParameter(selectedId!, { value: parseFloat(e.target.value) })} /></div>
                  <div className="form-row"><label>Step</label><input type="number" value={selectedParameter.step} onChange={e => handleUpdateParameter(selectedId!, { step: parseFloat(e.target.value) })} /></div>
                </div>
                <div className="form-row-split" style={{marginBottom: '8px'}}>
                  <div className="form-row"><label>Min</label><input type="number" value={selectedParameter.min} onChange={e => handleUpdateParameter(selectedId!, { min: parseFloat(e.target.value) })} /></div>
                  <div className="form-row"><label>Max</label><input type="number" value={selectedParameter.max} onChange={e => handleUpdateParameter(selectedId!, { max: parseFloat(e.target.value) })} /></div>
                </div>
                <datalist id="folder-names-param">
                  {[...new Set(draftParameters.map(p => p.folderName))].map(folder => (<option key={folder} value={folder} />))}
                </datalist>
                <div className="correlation-list">
                  <h4>Used By Relations:</h4>
                  <ul style={{ overflowY: 'auto' }}>
                    {draftRelations.filter(r => r.expression.includes(selectedParameter.name)).map(r => (
                      <li key={r.id}>{r.expression}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {mainTab === 'variables' && (
              <div className="tab-content">
                <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Project Variables</h3>
                  <div>
                    <button className="modal-btn-secondary" onClick={() => {
                      // Validate all project variables in order
                      for (const v of draftProjectVariables) validateSingleProjectVariable(v.id);
                    }}>Validate All</button>
                  </div>
                </div>
                <table className="derived-variables-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '22%' }}>Name</th>
                      <th style={{ width: '46%' }}>Expression</th>
                      <th style={{ width: '16%' }}>Value</th>
                      <th className="action-cell" style={{ width: '16%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftProjectVariables.map(v => (
                      <tr key={v.id}>
                        {editingVarId === v.id ? (
                          <>
                            <td><input type="text" value={v.name} onChange={e => setDraftProjectVariables(prev => prev.map(pv => pv.id === v.id ? { ...pv, name: e.target.value, isValidated: false } : pv))} autoFocus /></td>
                            <td>
                              <div className="expression-cell">
                                <input
                                  id={`project-expr-${v.id}`}
                                  type="text"
                                  value={v.expression}
                                  onFocus={() => setEditingVarId(v.id)}
                                  onChange={e => setDraftProjectVariables(prev => prev.map(pv => pv.id === v.id ? { ...pv, expression: e.target.value, isValidated: false } : pv))}
                                />
                              </div>
                            </td>
                            <td>
                              {projectVariableValues[v.id] !== undefined && projectVariableValues[v.id] !== null
                                ? <code>{projectVariableValues[v.id]?.toPrecision(4)}</code>
                                : <span style={{ color: '#777' }}>—</span>}
                            </td>
                            <td className="action-cell" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <button className="modal-btn-apply" onClick={() => { if (validateSingleProjectVariable(v.id)) setEditingVarId(null); }}>Save</button>
                              <button className="delete-var-btn" onClick={() => setDraftProjectVariables(prev => prev.filter(pv => pv.id !== v.id))}>&times;</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{v.name}</td>
                            <td>
                              <div className="expression-cell">
                                {v.showExpanded
                                  ? <code className="expanded-expr">{expandMacro(v.expression, 1)}</code>
                                  : <code>{v.expression}</code>}
                              </div>
                            </td>
                            <td>
                              {projectVariableValues[v.id] !== undefined && projectVariableValues[v.id] !== null
                                ? <code>{projectVariableValues[v.id]?.toPrecision(4)}</code>
                                : <span style={{ color: '#777' }}>—</span>}
                            </td>
                            <td className="action-cell" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <button
                                className="modal-btn-secondary"
                                onClick={() => setEditingVarId(v.id)}
                                title="Edit this variable"
                              >
                                ✎
                              </button>
                              <button
                                className="expand-btn"
                                title="Toggle expanded expression (macros expanded)"
                                onClick={() => setDraftProjectVariables(prev => prev.map(pv => pv.id === v.id ? { ...pv, showExpanded: !pv.showExpanded } : pv))}
                              >
                                ↔
                              </button>
                              <ValidationIconButton
                                validated={v.isValidated}
                                onClick={() => validateSingleProjectVariable(v.id)}
                                title="Validate this variable"
                              />
                              <button className="delete-var-btn" onClick={() => setDraftProjectVariables(prev => prev.filter(pv => pv.id !== v.id))}>&times;</button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {validationResult && (
                  <div className="validation-section" style={{ paddingTop: '10px' }}>
                    <span className={`validation-message ${validationResult.type}`}>{validationResult.message}</span>
                  </div>
                )}

                <div className="reference-container" style={{ marginTop: '20px' }}>
                  <h4>References</h4>
                  <div className="reference-section">
                    <h5>Variables:</h5>
                    <div className="reference-list">
                      {['x', 'y', 'z', 't'].map(v => <button key={v} className="ref-item" onClick={() => handleInsertVariableReference(v)}>{v}</button>)}
                    </div>
                  </div>
                  <div className="reference-section">
                    <h5>Constants:</h5>
                    <div className="reference-list">
                      {draftConstants.map(c => <button key={c.id} className="ref-item" onClick={() => handleInsertVariableReference(c.name)}>{c.name}</button>)}
                    </div>
                  </div>
                  <div className="reference-section">
                    <h5>Parameters:</h5>
                    <div className="reference-list">
                      {draftParameters.map(p => <button key={p.id} className="ref-item" onClick={() => handleInsertVariableReference(p.name)}>{p.name}</button>)}
                    </div>
                  </div>
                  <div className="reference-section">
                    <h5>Functions:</h5>
                    <div className="reference-list">
                      <button className="ref-item" title="Calculates distance between particle and an object" onClick={() => handleInsertVariableReference('distance()', 1)}>distance()</button>
                      <button className="ref-item" title="Square Root" onClick={() => handleInsertVariableReference('sqrt()', 1)}>sqrt()</button>
                      <button className="ref-item" title="Sine" onClick={() => handleInsertVariableReference('sin()', 1)}>sin()</button>
                      <button className="ref-item" title="Cosine" onClick={() => handleInsertVariableReference('cos()', 1)}>cos()</button>
                      <button className="ref-item" title="Exponential" onClick={() => handleInsertVariableReference('exp()', 1)}>exp()</button>
                    </div>
                  </div>
                  <div style={{ border: '1px solid #4a4a4a', borderRadius: '4px', padding: '10px', marginTop: '8px' }}>
                    <div className="reference-section" style={{ marginBottom: '10px' }}>
                      <h5 title="Geometrical objects from the scene">Objects:</h5>
                      <div className="reference-list">
                        {flattenedObjects.filter(o => o.name && o.type !== 'axes').map(obj => (
                          <button key={obj.id} className="ref-item" onClick={() => handleInsertVariableReference(obj.name!)}>
                            {obj.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="reference-section" style={{ marginBottom: '0' }}>
                      <h5>Properties:</h5>
                      <div className="reference-list">
                        {propertyMappings.map(prop => (
                          <button key={prop.value} className="ref-item" title={prop.title} onClick={() => handleInsertVariableReference(`.${prop.label}`)}>{prop.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {draftParticles && draftParticles.length > 0 && (
                    <div className="reference-section" style={{ marginTop: '10px' }}>
                      <h5>Particle:</h5>
                      <div className="reference-list">
                        <button className="ref-item" onClick={() => handleInsertVariableReference('mass')}>mass</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {mainTab === 'relations' && selectedRelation && (
              <div className="tab-content">
                <h3>Edit Relation</h3>
                <div className="form-row" style={{ alignItems: 'flex-start' }}>
                  <label style={{ paddingTop: '5px' }}>Target</label>
                  <input ref={targetInputRef} type="text" value={selectedRelation.id} onFocus={() => setActiveField('target')} onChange={e => handleUpdateRelationId(selectedId!, e.target.value)} />
                </div>
                <div className="form-row" style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 150px', justifyContent: 'flex-end', marginRight: '10px' }}>
                    <label style={{ paddingTop: '5px' }}>Expression</label>
                  </div>
                  <textarea ref={expressionTextareaRef} value={selectedRelation.expression} onFocus={() => setActiveField('expression')} onChange={e => handleUpdateRelation(selectedId!, { expression: e.target.value })} rows={3} placeholder="e.g., slitSeparation / 2"/>
                </div>
                <div className="validation-section">
                  <div style={{ flex: '0 0 150px', marginRight: '10px' }}></div> {/* Spacer to align with inputs */}
                  <button className="modal-btn-secondary" onClick={validateCurrentRelation}>Validate</button>
                  {validationResult && (
                    <span className={`validation-message ${validationResult.type}`}>
                      {validationResult.message}
                    </span>
                  )}
                </div>                <div className="reference-container">
                  <div className="reference-section">
                    <h5>Objects:</h5>
                    <div className="reference-list">
                      {flattenedObjects.filter(o => o.name && o.type !== 'axes').map(obj => (
                        <button key={obj.id} className="ref-item" onClick={() => handleInsertReference(obj.name!, 'object')}>
                          {obj.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="reference-section">
                    <h5>Properties:</h5>
                    <div className="reference-list">
                      {propertyMappings.map(prop => (
                        <button key={prop.value} className="ref-item" title={prop.title} onClick={() => handleInsertReference(`.${prop.label}`, 'property')}>
                          {prop.label} 
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="reference-section">
                    <h5>Parameters:</h5>
                    <div className="reference-list">
                      {draftParameters.map(p => (
                        <button key={p.id} className="ref-item" onClick={() => handleInsertReference(p.name, 'parameter')}>
                          {p.name}
                        </button>
                      ))}
                      {draftConstants.map(c => (
                        <button key={c.id} className="ref-item" onClick={() => handleInsertReference(c.name, 'parameter')}>
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {mainTab === 'constants' && selectedConstant && (
              <div className="tab-content">
                <h3>Edit Constant</h3>
                <div className="form-row">
                  <label>ID</label>
                  <input type="text" value={selectedConstant.id} onChange={e => handleUpdateConstantId(selectedId!, e.target.value)} />
                </div>
                <div className="form-row">
                  <label>Name (for formulas)</label><input type="text" value={selectedConstant.name} onChange={e => handleUpdateConstant(selectedId!, { name: e.target.value })} />
                </div>
                <div className="form-row">
                  <label>Value</label><input type="number" value={selectedConstant.value} onChange={e => handleUpdateConstant(selectedId!, { value: parseFloat(e.target.value) })} />
                </div>
                <div className="form-row">
                  <label>Units</label><input type="text" value={selectedConstant.units || ''} onChange={e => handleUpdateConstant(selectedId!, { units: e.target.value })} placeholder="e.g., J*s"/>
                </div>
              </div>
            )}
            {!selectedId && <p>Select an item from the list or add a new one.</p>}
          </div>
        </div>
        {/* --- NEW: Main Footer with Save/Cancel --- */}
        <div className="domain-modal-footer">
          <button className="modal-btn-cancel" onClick={handleRequestClose}>
            Cancel
          </button>
          <button className="modal-btn-secondary" onClick={handleSave}>
            Save
          </button>
          <button className="modal-btn-apply" onClick={handleSaveAndCloseWithVariables}>
            Save & Close
          </button>
        </div>
        <div className="modal-resize-handle" onPointerDown={handleModalResizeStart}></div>
      </div>
    </div>
  );
}