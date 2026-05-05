import React, { Suspense, useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ComponentRef } from 'react';
import { OrbitControls, TransformControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three'; // Keep THREE import
import type { TransformControlsMode, SceneObjectType, CustomParameter, ParameterRelation, CameraViewType, GlobalConstant, PhysicsDomain, ParticleDefinition, ProjectDerivedVariable } from './types';
import { SceneObject } from './SceneObject';
import { ParametricManager } from './ParametricManager';
import { DomainWave } from './DomainWave';
import { DomainRenderer } from './DomainRenderer';
import { ParticleGPUBridge } from './ParticleGPUBridge';
import { buildEvaluationScope, evaluateExpressionWithScope, expandMacro, evaluateWaveMagnitudeSqAt } from './utils';
import { PALETTE_DEFINITIONS } from './colorPalettes';

type PositionArray = [number, number, number];
const getCameraPosition = (view: CameraViewType, bounds: THREE.Box3, flipX: boolean): PositionArray => {
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 10;
  const dist = maxDim * 2;

  switch (view) {
    case 'xy': return [center.x, center.y, flipX ? bounds.min.z - dist : bounds.max.z + dist];
    case 'xz': return [center.x, flipX ? bounds.min.y - dist : bounds.max.y + dist, center.z];
    case 'yz': return [flipX ? bounds.max.x + dist : bounds.min.x - dist, center.y, center.z];
    case '3D': default: return [-2 * bounds.max.x, 1.8 * bounds.max.y, -2 * bounds.max.z];
  }
};

// --- NEW: Type for individual view settings, passed from App ---
type ViewSettings = {
  id: string;
  cameraView: CameraViewType;
  wheelMode: 'zoom' | 'clip';
  cameraResetVersion: number;
  clippingOffsets: { xy: number; xz: number; yz: number };
  clippingVersion: number;
  showAxes: boolean;
  showGrid: boolean; // NEW: Grid visibility is now per-view
  isToolbarExpanded: boolean; // FIX: Add missing property
  flipX: boolean; // NEW
  flipY: boolean; // NEW
  isClippingEnabled: boolean; // NEW
  rotation: number; // NEW
  fitScaleTrigger: number; // NEW
};

type SceneViewProps = {
  viewIndex: number;
  settings: ViewSettings;
  // Data
  sceneObjects: SceneObjectType[];
  sceneBounds: THREE.Box3;
  sceneScale: [number, number, number]; // NEW: Receive scene scale
  previewDomain: PhysicsDomain | null;
  previewKind: 'domain' | 'wave' | 'surface' | 'surfacePsi2' | null;
  particles: ParticleDefinition[];
  physicsDomains: PhysicsDomain[]; // <-- NEW: Pass all domains
  parameters: CustomParameter[];
  globalConstants: GlobalConstant[];
  projectVariables?: ProjectDerivedVariable[];
  labelTextSize: number; // NEW: Pass labelTextSize from App
  showAxisLabels: boolean;
  relations: ParameterRelation[];
  objectCount: number;

  // State
  selectedId: string | null;
  transformMode: TransformControlsMode;
  isDragging: boolean;
  isSelectionEnabled: boolean;
  autoRecam: boolean; // NEW: Controls automatic bounds recalculation
  autoFitScale: boolean;
  // --- NEW: Wave controls from App ---
  waveVersion: number;
  isWaveRunning: boolean;
  showWave: boolean;
  waveResolution: number;
  waveUpdatesPerSecond: number;
  simulationTimeRef: React.MutableRefObject<number>;
  timeScale: number;
  timeScaleFactor: number;
  showParticles: boolean;
  showParticleMarkers: boolean;
  showParticleTrajectories: boolean;
  particleInjectionRateSim: number;
  particleMaxCount: number;
  trajectoryMinDistance: number;
  // When true, keep trajectory trails even after particles leave the
  // domain or are killed. When false, trails are cleared when
  // particles die so only active particles have visible tracks.
  persistTrailsOnDeath?: boolean;
  particleShape: 'sphere' | 'cube';
  particleSize: number;
  particleColor: string;
  trajectoryColor: string;

  // Detector hit visualization
  detectorGridsRef: React.MutableRefObject<Map<string, {
    objectId: string;
    uDivisions: number;
    vDivisions: number;
    counts: Float32Array;
    totalHits: number;
    maxCount: number;
  }>>;
  detectorGridsVersion: number;
  detectorMaxCount: number;
  detectorRangeRef: React.MutableRefObject<{ min: number; max: number }>;
  detectorPalette: string;
  showDetector: boolean;

  // Refs
  controlsRef: React.RefObject<ComponentRef<typeof OrbitControls> | null>;
  objectRefs: React.RefObject<Map<string, THREE.Object3D>>;
  selectedObjectRef: THREE.Object3D | null;
  viewRef: React.RefObject<HTMLDivElement>;

  // Callbacks
  setSettings: (settings: ViewSettings) => void;
  setObjectRef: (id: string, node: THREE.Object3D | null) => void;
  onPerformanceUpdate: (domainId: string, updatesPerSecond: number) => void; // NEW: Pass performance update callback
  onParticleCountChange?: (domainId: string, activeCount: number, totalInjected: number) => void;
  onDetectorHit?: (domainId: string, detectorObjectId: string, uIndex: number, vIndex: number) => void;
  setSelectedId: (id: string | null) => void;
  updateObject: (id: string, newProps: Partial<SceneObjectType>) => void;
  setIsDragging: (isDragging: boolean) => void;
  setParameters: (p: CustomParameter[] | ((prev: CustomParameter[]) => CustomParameter[])) => void;
  updateDomain: (id: string, newProps: Partial<PhysicsDomain>) => void;
  updateAllDomains: (newProps: Partial<PhysicsDomain>) => void;
  setSceneBounds: (bounds: THREE.Box3) => void;
  setSimulationTime: (time: number) => void;
  onMagnitudeRangeComputed: (domainId: string, range: { min: number; max: number; logMin: number }) => void; // NEW: GPU-based normalization callback
  onPsi2SurfaceStats?: (domainId: string, stats: { min: number; max: number; integral: number }) => void;
};

import { buildInjectionSurfacePatch } from './injectionSurfaces';


// --- Detector Heatmap Overlay (3D) ---
// Renders a simple green heatmap texture on top of a detector object's
// configured face, based on the per-cell hit counts accumulated in App.
type DetectorHeatmap3DProps = {
  object: SceneObjectType;
  grid: {
    objectId: string;
    uDivisions: number;
    vDivisions: number;
    counts: Float32Array;
    totalHits: number;
    maxCount: number;
  };
  globalMax: number;
  detectorRangeRef: React.MutableRefObject<{ min: number; max: number }>;
  globalPalette: string;
  clippingPlanes?: THREE.Plane[];
};

// ---- Palette LUT texture (256 × 1, RGBA) ----------------------------------
// One texel per palette sample. RGBA avoids the removed RGBFormat.
function buildPaletteLUT(name: string): THREE.DataTexture {
  const N = 256;
  const data = new Uint8Array(N * 4);
  for (let i = 0; i < N; i++) {
    const [r, g, b] = samplePalette(name, i / (N - 1));
    data[i * 4 + 0] = Math.max(0, Math.min(255, Math.round(r)));
    data[i * 4 + 1] = Math.max(0, Math.min(255, Math.round(g)));
    data[i * 4 + 2] = Math.max(0, Math.min(255, Math.round(b)));
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, N, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

// ---- GLSL shaders -----------------------------------------------------------
const DETECTOR_VERT = /* glsl */`
  #include <clipping_planes_pars_vertex>
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <clipping_planes_vertex>
  }
`;
const DETECTOR_FRAG = /* glsl */`
  #include <clipping_planes_pars_fragment>
  uniform sampler2D countTex;   // normalised count per cell (stored in .r)
  uniform sampler2D paletteLUT; // 256x1 RGBA palette
  uniform float rangeMin;
  uniform float rangeMax;
  varying vec2 vUv;

  void main() {
    #include <clipping_planes_fragment>
    float norm = texture2D(countTex, vUv).r;
    // Always sample the palette so zero-hit cells show the palette's
    // zero colour rather than being transparent.
    float t;
    if (norm <= 0.0) {
      t = 0.0;
    } else if (rangeMax <= rangeMin) {
      t = clamp(norm, 0.0, 1.0);
    } else if (norm < rangeMin) {
      t = 0.0;
    } else {
      float span = rangeMax - rangeMin;
      t = clamp((norm - rangeMin) / span, 0.0, 1.0);
    }
    vec3 color = texture2D(paletteLUT, vec2(t, 0.5)).rgb;
    gl_FragColor = vec4(color, 0.92);
  }
`;

const DetectorHeatmap3D: React.FC<DetectorHeatmap3DProps> = ({ object, grid, globalMax, detectorRangeRef, globalPalette, clippingPlanes = [] }) => {
  // --- ALL hooks must run unconditionally before any early return ---

  const paletteName  = globalPalette || object.detector?.palette || 'inferno';
  const localMax     = grid.maxCount || 0;
  const effectiveMax = globalMax > 0 ? globalMax : localMax;

  // Count texture: Uint8 RGBA – R channel holds normalised count 0..255.
  // Rebuilt only when hit data or effective max changes.
  // Using Uint8 (not Float) avoids float-texture support issues on some drivers.
  const countTexture = useMemo(() => {
    const { uDivisions, vDivisions, counts } = grid;
    if (uDivisions <= 0 || vDivisions <= 0) return null;
    const n = uDivisions * vDivisions;
    const data = new Uint8Array(n * 4);
    const denom = effectiveMax > 0 ? effectiveMax : 1;
    for (let i = 0; i < n; i++) {
      data[i * 4]     = Math.round(Math.min(1, Math.max(0, counts[i]) / denom) * 255);
      data[i * 4 + 3] = 255;
    }
    const tex = new THREE.DataTexture(data, uDivisions, vDivisions, THREE.RGBAFormat, THREE.UnsignedByteType);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid.uDivisions, grid.vDivisions, grid.totalHits, effectiveMax]);

  // Palette LUT: rebuilt only when palette name changes.
  const paletteLUT = useMemo(() => buildPaletteLUT(paletteName), [paletteName]);

  // ShaderMaterial created once per component instance (not on every render).
  // Uniforms are updated via useFrame below – no React state involved.
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  if (!materialRef.current) {
    materialRef.current = new THREE.ShaderMaterial({
      vertexShader:   DETECTOR_VERT,
      fragmentShader: DETECTOR_FRAG,
      uniforms: {
        countTex:   { value: null },
        paletteLUT: { value: null },
        rangeMin:   { value: 0 },
        rangeMax:   { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.FrontSide, // Plane rotation already orients the front face toward the simulation domain
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
  }
  const material = materialRef.current;

  // Sync count texture + palette whenever they change (useMemo deps above gate this).
  if (material.uniforms.countTex.value !== countTexture) {
    material.uniforms.countTex.value = countTexture;
  }
  if (material.uniforms.paletteLUT.value !== paletteLUT) {
    material.uniforms.paletteLUT.value = paletteLUT;
  }
  // Keep clipping planes in sync every render
  material.clippingPlanes = clippingPlanes;

  // Push range from the shared ref into uniforms every animation frame.
  // This lets the slider update the GPU display at 60 fps with zero React re-renders.
  useFrame(() => {
    material.uniforms.rangeMin.value = detectorRangeRef.current.min;
    material.uniforms.rangeMax.value = detectorRangeRef.current.max;
  });

  // --- early returns after hooks ---
  const detector = object.detector;
  if (!detector || !detector.enabled) return null;
  if (!countTexture) return null;

  const [cx, cy, cz] = object.position;
  const [sx, sy, sz] = object.scale;
  const halfX = sx * 0.5;
  const halfY = sy * 0.5;
  const halfZ = sz * 0.5;
  const position = new THREE.Vector3(cx, cy, cz);
  const rotation = new THREE.Euler(0, 0, 0);
  let width  = sx;
  let height = sy;
  let depth  = 0.01; // thickness visible in edge-on 2D views = 0.25× face dimension

  // Position the slab so its inner face sits flush with the detector surface.
  // depth/2 offsets the centred box outward so it doesn't overlap the object.
  switch (detector.face) {
    case 'front':  // Z- face
      depth = sz * 0.25; width = sx; height = sy;
      rotation.y = Math.PI; position.z = cz - halfZ - depth * 0.5; break;
    case 'back':   // Z+ face
      depth = sz * 0.25; width = sx; height = sy;
      position.z = cz + halfZ + depth * 0.5; break;
    case 'left':
      depth = sx * 0.25; width = sz; height = sy;
      rotation.y = -Math.PI / 2; position.x = cx - halfX - depth * 0.5; break;
    case 'right':
      depth = sx * 0.25; width = sz; height = sy;
      rotation.y =  Math.PI / 2; position.x = cx + halfX + depth * 0.5; break;
    case 'top':
      depth = sy * 0.25; width = sx; height = sz;
      rotation.x = -Math.PI / 2; position.y = cy + halfY + depth * 0.5; break;
    case 'bottom':
      depth = sy * 0.25; width = sx; height = sz;
      rotation.x =  Math.PI / 2; position.y = cy - halfY - depth * 0.5; break;
    default: break;
  }

  return (
    <mesh position={position} rotation={rotation} renderOrder={1100}>
      <boxGeometry args={[width, height, depth]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

// NEW: Simple preview of the particle injection surface as a cloud of points
// built from the domain's geometric injection surfaces.
type InjectionSurfacePreviewProps = {
  domain: PhysicsDomain;
  sceneObjects: SceneObjectType[];
  globalConstants: GlobalConstant[];
  parameters: CustomParameter[];
  projectVariables?: ProjectDerivedVariable[];
  sceneBounds: THREE.Box3;
  sceneScale: [number, number, number];
  particles: ParticleDefinition[];
};

const InjectionSurfacePreview: React.FC<InjectionSurfacePreviewProps> = ({
  domain,
  sceneObjects,
  sceneScale,
}) => {
  const [sx, sy, sz] = sceneScale;
  const patch = useMemo(() => buildInjectionSurfacePatch(domain, sceneObjects), [domain, sceneObjects]);

  if (!patch) return null;

  const { samples, indices } = patch;
  const positions = new Float32Array(samples.length * 3);
  samples.forEach((p, idx) => {
    const i3 = idx * 3;
    positions[i3 + 0] = p.x * sx;
    positions[i3 + 1] = p.y * sy;
    positions[i3 + 2] = p.z * sz;
  });

  return (
    <mesh>
      <bufferGeometry>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <bufferAttribute attach="index" args={[indices, 1]} />
      </bufferGeometry>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <meshBasicMaterial
        color="#00ffff"
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
        // Nudge depth-testing so this preview tends to render
        // on top of the underlying surface without heavy
        // z-fighting flicker.
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
};

// Helper: sample a discrete color palette definition at t in [0,1].
function samplePalette(name: string, t: number): [number, number, number] {
  const stops = PALETTE_DEFINITIONS[name] || PALETTE_DEFINITIONS['phase'];
  if (!stops || stops.length === 0) return [255, 255, 255];
  if (stops.length === 1) return stops[0];
  const clampedT = Math.min(1, Math.max(0, t));
  const scaled = clampedT * (stops.length - 1);
  const i = Math.floor(scaled);
  const frac = scaled - i;
  const c1 = stops[i];
  const c2 = stops[Math.min(i + 1, stops.length - 1)];
  return [
    c1[0] + (c2[0] - c1[0]) * frac,
    c1[1] + (c2[1] - c1[1]) * frac,
    c1[2] + (c2[2] - c1[2]) * frac,
  ];
}

// NEW: Preview |psi|^2 on the injection surface, normalized so that
// the numerical integral over the surface is 1, and visualized as a
// colored point cloud using the domain's colorPalette.
type Psi2SurfacePreviewProps = InjectionSurfacePreviewProps & {
  onPsi2SurfaceStats?: (domainId: string, stats: { min: number; max: number; integral: number }) => void;
};

const Psi2SurfacePreview: React.FC<Psi2SurfacePreviewProps> = (props) => {
  const { domain, sceneObjects, globalConstants, parameters, projectVariables, sceneBounds, sceneScale, particles, onPsi2SurfaceStats } = props;
  const [sx, sy, sz] = sceneScale;

  const data = useMemo(() => {
    const waveEq = domain.waveEquation;
    if (!waveEq) {
      console.warn('Psi2SurfacePreview: no waveEquation for domain', domain.id);
      return null;
    }
    if (!waveEq.isValidated) {
      console.warn('Psi2SurfacePreview: waveEquation is not validated for domain', domain.id, 'expr:', waveEq.expression);
      return null;
    }
    const patch = buildInjectionSurfacePatch(domain, sceneObjects);
    if (!patch) return null;

    const { samples, indices } = patch;

    const staticScope = buildEvaluationScope(sceneObjects, globalConstants);

    const particleList = particles || [];
    const particleId = domain.selectedParticleId || (particleList.length > 0 ? particleList[0].id : undefined);
    const particle = particleId ? particleList.find(p => p.id === particleId) : undefined;
    if (particle) {
      const massVal = (particle as any).mass ?? (particle as any).massKg;
      if (massVal !== undefined) staticScope['mass'] = massVal;
    }

    const values: number[] = new Array(samples.length).fill(0);
    const positions: number[] = new Array(samples.length * 3).fill(0);
    const rsValues: number[] = [];

    samples.forEach((p, sampleIndex) => {
      const scope: Record<string, any> = { ...staticScope };
      parameters.forEach(param => {
        scope[param.name] = param.value;
      });

      // Evaluate project-level derived variables with macro expansion
      if (projectVariables && projectVariables.length > 0) {
        for (const pv of projectVariables) {
          if (!pv.name || !pv.expression) continue;
          const exprPv = expandMacro(pv.expression, 1);
          const valPv = evaluateExpressionWithScope(exprPv, scope);
          if (valPv !== null && isFinite(valPv as number)) {
            scope[pv.name] = valPv;
          }
        }
      }

      // Track r_s = distance(Source) if present, to verify the
      // spherical patch really has constant radius from the source.
      if ((scope as any).r_s !== undefined && typeof (scope as any).r_s === 'number' && isFinite((scope as any).r_s)) {
        rsValues.push((scope as any).r_s as number);
      }

      const m2 = evaluateWaveMagnitudeSqAt(
        domain,
        waveEq,
        staticScope,
        parameters,
        projectVariables,
        particleList,
        p,
        /* simTime */ 0,
        /* timeScale */ 1,
      ) || 0;

      values[sampleIndex] = m2;
      const i3 = sampleIndex * 3;
      positions[i3 + 0] = p.x * sx;
      positions[i3 + 1] = p.y * sy;
      positions[i3 + 2] = p.z * sz;
    });

    // If all values are zero, there's nothing meaningful to show.
    if (values.every(v => v === 0)) {
      console.warn('Psi2SurfacePreview: all |psi|^2 values are zero for domain', domain.id, 'waveExpr:', waveEq.expression);
      return null;
    }

    // Debug: log variation in r_s over the patch for this preview.
    if (rsValues.length > 0) {
      let rsMin = Infinity;
      let rsMax = -Infinity;
      for (const v of rsValues) {
        if (v < rsMin) rsMin = v;
        if (v > rsMax) rsMax = v;
      }
      // Only log if there is noticeable spread.
      if (isFinite(rsMin) && isFinite(rsMax) && rsMax - rsMin > 1e-6) {
        console.log('Psi2SurfacePreview: r_s range on patch', { rsMin, rsMax, delta: rsMax - rsMin });
      }
    }

    let minMag = Infinity;
    let maxMag = 0;
    for (const v of values) {
      if (v < minMag) minMag = v;
      if (v > maxMag) maxMag = v;
    }
    if (!isFinite(maxMag) || maxMag <= 0) return null;

    // Base range from actual data; if all values are truly identical,
    // we treat the surface as empty rather than forcing a noisy
    // normalization.
    const normMin = isFinite(minMag) ? minMag : 0;
    const normMax = maxMag;
    const normRange = normMax - normMin;
    if (!(normRange > 0)) return null;

    // Report stats back to the app / setup modal if requested.
    if (onPsi2SurfaceStats) {
      const integral = values.reduce((acc, v) => acc + v, 0);
      onPsi2SurfaceStats(domain.id, { min: minMag, max: maxMag, integral });
    }

    const paletteName = domain.colorPalette || 'phase';

    const posArr = new Float32Array(values.length * 3);
    const colArr = new Float32Array(values.length * 3);

    for (let i = 0; i < values.length; i++) {
      const raw = values[i];
      // Map into [0,1] using the full data window [normMin, normMax]
      // so even relatively small variations in |psi|^2 remain
      // visible as bands/gradients on the surface.
      let value = (raw - normMin) / normRange;
      if (!isFinite(value)) value = 0.5;
      if (value < 0) value = 0;
      if (value > 1) value = 1;
      const gamma = 0.5;
      const mapped = value > 0 ? Math.pow(value, gamma) : 0;
      const [r, g, b] = samplePalette(paletteName, mapped);

      const i3 = i * 3;
      posArr[i3 + 0] = positions[i3 + 0];
      posArr[i3 + 1] = positions[i3 + 1];
      posArr[i3 + 2] = positions[i3 + 2];

      colArr[i3 + 0] = r / 255;
      colArr[i3 + 1] = g / 255;
      colArr[i3 + 2] = b / 255;
    }

    return { positions: posArr, colors: colArr, indices };
  }, [domain, sceneObjects, globalConstants, parameters, projectVariables, sceneBounds, sceneScale, particles, onPsi2SurfaceStats]);

  if (!data) return null;
  const { positions, colors, indices } = data;

  return (
    <mesh>
      <bufferGeometry>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <bufferAttribute attach="index" args={[indices, 1]} />
      </bufferGeometry>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <meshBasicMaterial
        vertexColors
        side={THREE.DoubleSide}
        transparent
        opacity={1}
        // Same z-fighting mitigation for the Psi^2 surface.
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
};

export function SceneView(props: SceneViewProps) {
  const {
    sceneObjects,
    sceneBounds,
    sceneScale,
    particles,
    parameters,
    physicsDomains,
    previewDomain,
    previewKind,
    relations,
    globalConstants,
    objectCount,
    settings,
    selectedId,
    transformMode,
    isDragging,
    isSelectionEnabled,
    autoRecam,
    autoFitScale,
    waveVersion,
    isWaveRunning,
    showWave,
    waveResolution, // Destructure the new prop
    waveUpdatesPerSecond,
    simulationTimeRef,
    timeScale,
    timeScaleFactor,
    showParticles,
    showParticleMarkers,
    showParticleTrajectories, // For future GPU trajectory implementation
    particleInjectionRateSim,
    particleMaxCount,
    trajectoryMinDistance,
    persistTrailsOnDeath,
    controlsRef,
    selectedObjectRef,
    objectRefs,
    viewRef,
    setObjectRef,
    setSelectedId,
    updateObject,
    setIsDragging,
    setParameters,
    setSceneBounds,
    labelTextSize, // Destructure labelTextSize
    showAxisLabels,
    setSettings,
    onPerformanceUpdate,
    onParticleCountChange,
    detectorGridsRef,
    detectorGridsVersion,
    detectorMaxCount,
    detectorRangeRef,
    detectorPalette,
    showDetector,
    onDetectorHit,
    setSimulationTime,
    onMagnitudeRangeComputed,
    onPsi2SurfaceStats,
    projectVariables,
    particleShape,
    particleSize,
    particleColor,
    trajectoryColor, // For future GPU trajectory implementation
  } = props;

  // --- FIX: Declare camera refs at the top of the component ---
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera>(null);
  const orthographicCameraRef = useRef<THREE.OrthographicCamera>(null);

  // -------------------------------------------------------------------------
  // Domain-crossing quantum injection wiring
  // -------------------------------------------------------------------------
  // Stable store of pending-injection maps shared between bridge pairs.
  // Key: `${upstreamDomainId}:${downstreamDomainId}`
  const pendingCrossingsStoreRef = useRef<Map<string, { current: Map<string, number> }>>(new Map());

  // Clear all pending crossing counts when simulation resets (waveVersion changes).
  // This prevents stale counts from a previous run from immediately activating
  // crossing-triggered domains in the new run before any wave front arrives.
  useEffect(() => {
    for (const pendingRef of pendingCrossingsStoreRef.current.values()) {
      pendingRef.current.clear();
    }
  }, [waveVersion]);

  // Pre-compute per-domain configs from injection-surface declarations.
  const { upstreamCrossingConfigs, downstreamCrossingConfigs } = useMemo(() => {
    const upstreamCrossingConfigs = new Map<string, {
      crossingObjectIds: string[];
      onDomainCrossing: (coId: string) => void;
    }>();
    const downstreamCrossingConfigs = new Map<string, {
      pendingInjectionsRef: { current: Map<string, number> };
    }>();

    for (const downstream of (physicsDomains ?? [])) {
      const surfaces = downstream.injectionSurfaces ?? [];
      // Crossing-triggered surfaces: any spawn mode can use domain-crossing trigger.
      // linkedFromDomainIds present (even empty array) means the surface waits for
      // an upstream particle to cross its source object before spawning.
      const crossingSurfaces = surfaces.filter(
        (s) => (s.linkedFromDomainIds?.length ?? 0) > 0,
      );
      if (!crossingSurfaces.length) continue;

      const upstreamDomainIds = [
        ...new Set(crossingSurfaces.flatMap((s) => s.linkedFromDomainIds ?? [])),
      ];

      for (const upstreamId of upstreamDomainIds) {
        const pairKey = `${upstreamId}:${downstream.id}`;
        if (!pendingCrossingsStoreRef.current.has(pairKey)) {
          pendingCrossingsStoreRef.current.set(pairKey, { current: new Map() });
        }
        const pendingRef = pendingCrossingsStoreRef.current.get(pairKey)!;

        // Slit source-object IDs that should fire a crossing event.
        const crossingObjectIds = crossingSurfaces
          .filter((s) => s.linkedFromDomainIds?.includes(upstreamId) && s.sourceObjectId)
          .map((s) => s.sourceObjectId);

        if (!upstreamCrossingConfigs.has(upstreamId)) {
          const capturedRef = pendingRef;
          upstreamCrossingConfigs.set(upstreamId, {
            crossingObjectIds,
            onDomainCrossing: (coId: string) => {
              capturedRef.current.set(coId, (capturedRef.current.get(coId) ?? 0) + 1);
            },
          });
        } else {
          const existing = upstreamCrossingConfigs.get(upstreamId)!;
          existing.crossingObjectIds = [
            ...new Set([...existing.crossingObjectIds, ...crossingObjectIds]),
          ];
        }

        downstreamCrossingConfigs.set(downstream.id, { pendingInjectionsRef: pendingRef });
      }
    }

    return { upstreamCrossingConfigs, downstreamCrossingConfigs };
    // pendingCrossingsStoreRef is a stable ref — intentionally excluded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [physicsDomains]);

  // This handler prevents object selection unless the view is '3D'.
  const handleSelect = (id: string | null) => {
    if (cameraView === '3D' && isSelectionEnabled) {
      setSelectedId(id);
    }

    // --- FIX: If a domain preview is started, hide any active wave function ---
    // This ensures the domain preview box and the wave function are not shown simultaneously.
    // This logic is now handled by the global `showWave` state.
  };

  // --- Internal State Management ---
  const [axesSize, setAxesSize] = useState(5); // axesSize is still local to SceneView

  const { cameraView, wheelMode, cameraResetVersion, clippingOffsets, clippingVersion, flipX, flipY, rotation, fitScaleTrigger } = settings;

  // --- FIX: Calculate the clipping plane definition ALWAYS for wave calculation ---
  // The wave renderer needs to know where to slice, even if geometry clipping is disabled.
  const waveClippingPlanes = useMemo(() => {
    if (cameraView === '3D') return [];

    const offset = clippingOffsets[cameraView];
    let plane;
    switch (cameraView) {
      case 'xy': plane = new THREE.Plane(new THREE.Vector3(0, 0, flipX ? -1 : 1), flipX ? offset : -offset); break;
      case 'xz': plane = new THREE.Plane(new THREE.Vector3(0, flipX ? -1 : 1, 0), flipX ? offset : -offset); break;
      case 'yz': plane = new THREE.Plane(new THREE.Vector3(flipX ? 1 : -1, 0, 0), flipX ? -offset : offset); break;
      default: return [];
    }
    return [plane];
  }, [cameraView, clippingOffsets, clippingVersion, flipX]);

  // Geometry/particles/trajectories clip only in 'clip' wheel mode.
  // The wave renderer always uses waveClippingPlanes to know its slice position.
  const geometryClippingPlanes = useMemo(
    () => (wheelMode === 'clip' ? waveClippingPlanes : []),
    [wheelMode, waveClippingPlanes]
  );

  const lastResetVersion = useRef(cameraResetVersion);
  const lastFitCameraResetVersion = useRef(cameraResetVersion);
  const lastFitScaleTrigger = useRef(fitScaleTrigger);
  // Ugly but effective: track a one-time initialization phase for 3D recam
  const is3DInitializing = useRef(cameraView === '3D');

  // --- Camera Fitting Logic (now lives in SceneView) ---
  // MOVED UP: Must be declared before useEffect uses it
  const runCameraFit = useCallback((
    cameraRef: React.RefObject<THREE.Camera | null>,
    targetBounds?: THREE.Box3 // NEW: Allow overriding bounds
  ) => {
    const camera = cameraRef.current;
    const boundsToUse = targetBounds || sceneBounds;
    if (!camera || boundsToUse.isEmpty()) return;

    const center = boundsToUse.getCenter(new THREE.Vector3());

    if (cameraView === '3D') { // --- Uses stable sceneBounds from props ---
      const newPos = getCameraPosition('3D', boundsToUse, false);
      // Set camera position BEFORE updating controls so OrbitControls syncs its
      // internal spherical coordinates from the correct final position. If we call
      // controls.update() first, it recalculates from the OLD position; then when
      // we override camera.position the controls state is stale, and the next
      // animation-loop update() call reverts the camera. Two Re-Cam clicks were
      // needed because the second click happened to align the states.
      camera.position.fromArray(newPos);
      camera.up.set(0, 1, 0);
      camera.lookAt(center);

      if (controlsRef.current) {
        controlsRef.current.target.copy(center);
        controlsRef.current.update(); // Reads new camera.position → stores correct spherical coords

        // Schedule a second correction one RAF later. On a fresh page load the
        // R3F frame loop may fire one more update() using its pre-init spherical
        // AFTER our call here, briefly pushing the camera back. Re-applying in
        // the next frame ensures we always win without fighting user input.
        const raf = requestAnimationFrame(() => {
          if (controlsRef.current) {
            controlsRef.current.target.copy(center);
            controlsRef.current.update();
          }
        });
        // Store the RAF id on the controls ref so it can theoretically be
        // cancelled, but since it's one-shot it's fine to let it run.
        void raf;
      }

      const sphere = new THREE.Sphere();
      boundsToUse.getBoundingSphere(sphere);
      const radius = sphere.radius;

      // --- FIX for Grid Z-Fighting ---
      // Set near/far planes based on scene size, but allow close zoom
      const persp = camera as THREE.PerspectiveCamera;
      persp.near = Math.max(0.01, radius / 1000); // Much smaller near plane for close zoom
      persp.far = radius * 20;
      persp.updateProjectionMatrix();

      const size = boundsToUse.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const axesData = sceneObjects.find(o => o.type === 'axes');
      // Use the scale from the file if it's defined, otherwise calculate a default.
      // We check if axesData and its scale exist before trying to use them.
      const newAxesSize = (axesData?.scale?.[0] !== undefined)
        ? axesData.scale[0]
        : (maxDim > 0 ? maxDim * 0.03 : 5);
      setAxesSize(newAxesSize);
    } else {
      const orthoCam = camera as THREE.OrthographicCamera;
      // The camera's frustum is now fixed. We adjust the zoom to fit the scene.
      const camWidth = orthoCam.right - orthoCam.left;
      const camHeight = orthoCam.top - orthoCam.bottom;

      const size = boundsToUse.getSize(new THREE.Vector3()).multiplyScalar(1.1); // Add 10% padding

      let maxDim = Math.max(size.x, size.y, size.z);
      let requiredWidth = size.x;
      let requiredHeight = size.y;

      if (cameraView === 'xy') {
        requiredWidth = size.x; requiredHeight = size.y;
        maxDim = Math.max(size.x, size.y);
      } else if (cameraView === 'xz') {
        requiredWidth = size.x; requiredHeight = size.z;
        maxDim = Math.max(size.x, size.z);
      } else if (cameraView === 'yz') {
        requiredWidth = size.z; requiredHeight = size.y;
        maxDim = Math.max(size.y, size.z);
      }

      // --- FIX: Handle rotation for Camera Fit ---
      if (rotation % 2 !== 0) {
         const temp = requiredWidth;
         requiredWidth = requiredHeight;
         requiredHeight = temp;
      }

      // Calculate the zoom factor needed to fit the required dimensions into the camera's fixed frustum.
      // We take the minimum of the two zoom factors to ensure the entire scene fits (letterboxing).
      const zoomX = camWidth / requiredWidth;
      const zoomY = camHeight / requiredHeight;
      
      orthoCam.zoom = Math.min(zoomX, zoomY);
      if (!isFinite(orthoCam.zoom)) orthoCam.zoom = 1; // Fallback for empty scenes

      orthoCam.near = -100000;
      orthoCam.far = 100000; // No longer need to offset here

      const newPos = getCameraPosition(cameraView, boundsToUse, flipX);
      orthoCam.position.fromArray(newPos);

      const baseUp = new THREE.Vector3();
      if (cameraView === 'xz') {
        baseUp.set(0, 0, flipY ? 1 : -1);
      } else {
        baseUp.set(0, flipY ? -1 : 1, 0);
      }
      const camPosVec = new THREE.Vector3().fromArray(newPos);
      const camDir = new THREE.Vector3().subVectors(center, camPosVec).normalize();
      // --- FIX: Negate angle to match clockwise button direction ---
      const angle = -rotation * (Math.PI / 2);
      baseUp.applyAxisAngle(camDir, angle);
      orthoCam.up.copy(baseUp);

      orthoCam.lookAt(center);

      orthoCam.updateProjectionMatrix();

      // Sync OrbitControls target/state AFTER camera is in its final position.
      if (controlsRef.current) {
        controlsRef.current.target.copy(center);
        controlsRef.current.update();
      }

      const axesData = sceneObjects.find(o => o.type === 'axes');
      // Use the scale from the file if it's defined, otherwise calculate a default.
      // We check if axesData and its scale exist before trying to use them.
      const newAxesSize = (axesData?.scale?.[0] !== undefined)
        ? axesData.scale[0]
        : (maxDim > 0 ? maxDim * 0.03 : 5);
      setAxesSize(newAxesSize);
    }
  }, [sceneBounds, cameraView, controlsRef, flipX, flipY, rotation, sceneObjects]);

  // NOTE: Psi² surface preview no longer auto-adjusts the camera.
  // This keeps previews from changing the field of view; the user
  // can still recenter/zoom manually with the existing controls.

  // --- STABILITY FIX: Calculate scene bounds ONLY when object count changes ---
  // This breaks the re-render loop by separating bounds calculation from camera fitting.
  useEffect(() => {
    const objects = Array.from(objectRefs.current.values());
    if (objects.length === 0) return;

    // --- FIX: Force matrix update to ensure bounds are correct with new scale ---
    for (const root of objects) {
        if (root.parent) root.parent.updateMatrixWorld(true);
    }

    // Check if this update was triggered by a manual Re-Cam
    lastResetVersion.current = cameraResetVersion;

    // Check for Fit Scale trigger
    const isFitScale = fitScaleTrigger !== lastFitScaleTrigger.current;

    // --- FIX: Prevent bounds updates while dragging to avoid fighting (unless fitting scale) ---
    if (isDragging && !isFitScale) return;

    // Always keep sceneBounds current so the camera has accurate targets whenever
    // a manual Re-Cam or autoRecam triggers.  The camera-fitting gate in the
    // separate effect below controls whether the camera actually moves.
    const bounds = new THREE.Box3();
    for (const root of objects) {
      bounds.expandByObject(root);
    }

    if (!sceneBounds.equals(bounds)) {
      setSceneBounds(bounds);
    }

    // --- FIX: Handle Fit Scale Trigger immediately with calculated bounds ---
    if (isFitScale) {
      lastFitScaleTrigger.current = fitScaleTrigger;
      const activeCameraRef = cameraView === '3D' ? perspectiveCameraRef : orthographicCameraRef;
      // Run fit immediately with the CALCULATED bounds, ensuring one-click update
      runCameraFit(activeCameraRef, bounds);
    }
  }, [objectCount, objectRefs, setSceneBounds, cameraResetVersion, sceneObjects, autoRecam, autoFitScale, sceneScale, isDragging, fitScaleTrigger, runCameraFit, cameraView, sceneBounds]);

  // Wrap the handler in useCallback to prevent re-creating it on every render.
  const handleWheelClip = useCallback((e: globalThis.WheelEvent) => {
    if (wheelMode === 'clip' && cameraView !== '3D') {
      // Prevent OrbitControls from zooming
      e.stopPropagation();

      // Calculate dynamic step based on scene bounds
      const size = sceneBounds.getSize(new THREE.Vector3());
      let step = 1; // Default step if bounds are empty or zero

      // Check if bounds are valid before calculating step
      if (!sceneBounds.isEmpty()) {
        switch (cameraView) {
          case 'xy': // Clipping along Z
            step = size.z / 100;
            break;
          case 'xz': // Clipping along Y
            step = size.y / 100;
            break;
          case 'yz': // Clipping along X
            step = size.x / 100;
            break;
        }
      }

      // Adjust clipping plane offset
      const direction = e.deltaY > 0 ? -1 : 1;
      // Ensure step is not zero to prevent getting stuck
      const effectiveStep = Math.max(0.001, step);

      setSettings({ ...settings, clippingOffsets: { ...clippingOffsets, [cameraView]: clippingOffsets[cameraView] + direction * effectiveStep }, clippingVersion: clippingVersion + 1 });
    }
  }, [
    wheelMode,
    cameraView,
    sceneBounds,
    setSettings, settings, clippingOffsets, clippingVersion
  ]); // Dependencies for the callback

  // Use an effect to attach the event listener directly to the DOM element
  useEffect(() => {
    const viewElement = viewRef.current;
    if (viewElement) {
      viewElement.addEventListener('wheel', handleWheelClip);
      return () => viewElement.removeEventListener('wheel', handleWheelClip);
    }
  }, [viewRef, handleWheelClip]); // Re-run if the ref or handler changes

  // This effect runs whenever the view changes, ensuring we call runCameraFit
  // with a RELIABLE reference to the correct camera.
  useEffect(() => {
    const activeCameraRef = cameraView === '3D' ? perspectiveCameraRef : orthographicCameraRef;
    if (activeCameraRef.current) {
      const isManualReset = cameraResetVersion !== lastFitCameraResetVersion.current;
      lastFitCameraResetVersion.current = cameraResetVersion;

      // Also handle one-time 3D initialization: runs when sceneBounds becomes
      // available (after the bounds effect calls setSceneBounds), using the same
      // deferred path as Re-Cam so OrbitControls is fully mounted.
      const isInitial3D = is3DInitializing.current && cameraView === '3D' && !sceneBounds.isEmpty();
      if (isInitial3D) {
        is3DInitializing.current = false;
      }

      if (isManualReset || autoRecam || autoFitScale || isInitial3D) {
        // Schedule the fit to run after the current render cycle so OrbitControls
        // is fully mounted (this matches what the Re-Cam button does).
        const timerId = setTimeout(() => runCameraFit(activeCameraRef), 0);
        return () => clearTimeout(timerId);
      }
    }
  }, [cameraView, cameraResetVersion, runCameraFit, sceneBounds, autoRecam, autoFitScale]);

  // --- FIX: Adjust light position based on view direction to ensure visibility ---
  const lightPos = useMemo<[number, number, number]>(() => {
    if (cameraView === '3D') return [10, 10, 5];
    const dist = 50;
    switch (cameraView) {
      case 'xy': return [0, 0, flipX ? -dist : dist];
      case 'xz': return [0, flipX ? -dist : dist, 0];
      case 'yz': return [flipX ? dist : -dist, 0, 0];
      default: return [10, 10, 5];
    }
  }, [cameraView, flipX]);

  return (
    <>
      <PerspectiveCamera
        ref={perspectiveCameraRef}
        makeDefault={cameraView === '3D'}
        position={[-10, -10, 10]}
        fov={50}
        up={[0, 1, 0]}
        near={0.1} // Remove initial offset
        far={1000}  // Remove initial offset
      />
      <OrthographicCamera
        ref={orthographicCameraRef}
        makeDefault={cameraView !== '3D'}
        // --- THE FIX: Define a large, static frustum. We will control the view with ZOOM. ---
        left={-100} right={100} top={100} bottom={-100}
        near={-100000}
        far={100000}
      />

      <ParametricManager
        parameters={parameters}
        setParameters={setParameters}
        relations={relations}
        globalConstants={globalConstants}
        sceneObjects={sceneObjects}
        updateObject={updateObject}
        objectCount={objectCount}
      />
      <OrbitControls
        // By creating a key from both cameraView and cameraResetVersion, we force
        // React to create a new instance of OrbitControls whenever the view changes OR
        key={`${settings.id}-${cameraView}`} // STABILITY FIX: Use stable ID
        ref={controlsRef}
        enabled={!isDragging}
        enablePan={true}
        zoomToCursor={true}
        panSpeed={1}
        screenSpacePanning={true}
        enableRotate={cameraView === '3D'}
        enableZoom={cameraView === '3D' || wheelMode === 'zoom'}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={lightPos} intensity={1.5} castShadow />

      {settings.showGrid && ( // This will now work correctly
        <gridHelper
          args={(() => {
            const sizeVec = sceneBounds.getSize(new THREE.Vector3());
            const gridSize = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) * 1.5;
            return [gridSize, Math.max(10, Math.floor(gridSize / 10))];
          })()}
          rotation={
            cameraView === 'xy' ? [Math.PI / 2, 0, 0] : // Aligns with XY plane
              cameraView === 'yz' ? [0, Math.PI / 2, 0] : // Aligns with YZ plane
                [0, 0, 0] // Default for 3D and XZ plane
          }
          // --- ROBUST FIX for Z-Fighting ---
          // 1. Use renderOrder to give this grid priority over others.
          renderOrder={-1}
          // 2. The material changes ensure it draws on top of other grids
          //    without needing to change its position in 3D space.
          material-depthWrite={false}
          material-polygonOffset={true}
          material-polygonOffsetFactor={-1}
          material-polygonOffsetUnits={-1}
          raycast={() => null} // Make the grid non-interactive
        />
      )}
      {/* --- NEW: Wrap scene objects in a scaled group --- */}
      <group scale={sceneScale}>
        <Suspense fallback={null}>
          {sceneObjects.map(obj => (
            <group
              key={obj.id}
              // --- THE FIX: Check the object's `visible` property ---
              visible={(obj.visible ?? true) && (obj.type !== 'axes' || settings.showAxes)}
            >
              {/* For axes, we add raycast={() => null} to make them non-interactive */}
              {obj.type === 'axes' ? (
                <SceneObject
                  data={{ ...obj, size: axesSize, labelTextSize: labelTextSize }}
                  selectedId={selectedId}
                  showAxisLabels={showAxisLabels}
                  setObjectRef={setObjectRef}
                  onSelect={handleSelect}
                  onUpdate={updateObject}
                  isSelectionEnabled={isSelectionEnabled}
                  cameraView={cameraView}
                  clippingPlanes={geometryClippingPlanes}
                />
              ) : (
                <SceneObject
                  data={obj}
                  selectedId={selectedId}
                  setObjectRef={setObjectRef}
                  onSelect={handleSelect}
                  onUpdate={updateObject}
                  cameraView={cameraView}
                  isSelectionEnabled={isSelectionEnabled}
                  clippingPlanes={geometryClippingPlanes}
                />
              )}
            </group>
          ))}
        </Suspense>

        {/* Detector heatmap overlay – rendered on all enabled detector objects */}
        {showDetector && sceneObjects.map(obj => {
          if (!obj.detector || !obj.detector.enabled) return null;

          // For debugging, fall back to a 2x2 empty grid if we
          // don't have any recorded hits yet, so we still render
          // a visible overlay plane over the detector.
          const grid = detectorGridsRef.current.get(obj.id) || {
            objectId: obj.id,
            uDivisions: 2,
            vDivisions: 2,
            counts: new Float32Array(4),
            totalHits: 0,
            maxCount: 0,
          };

          return (
            <DetectorHeatmap3D
              key={`detector-heatmap-${obj.id}-${detectorGridsVersion}`}
              object={obj}
              grid={grid}
              globalMax={detectorMaxCount}
              detectorRangeRef={detectorRangeRef}
              globalPalette={detectorPalette}
              clippingPlanes={geometryClippingPlanes}
            />
          );
        })}

      </group>

      {selectedObjectRef && cameraView === '3D' && isSelectionEnabled && (
        <TransformControls
          key={selectedId ?? undefined}
          object={selectedObjectRef}
          mode={transformMode}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onObjectChange={() => {
            // Guard against race conditions where the object is deselected
            // before this callback runs.
            if (selectedObjectRef && selectedId) {
              const { position, rotation, scale } = selectedObjectRef;

              // --- RELATION-AWARE DRAG ---
              // If a relation controls this object's property via a simple
              // parameter reference (e.g. "Wall.z = WallPos"), update that
              // parameter so the relation evaluates to the dragged value and
              // the object doesn't snap back.
              const selectedObj = sceneObjects.find(o => o.id === selectedId);
              if (selectedObj) {
                const valueByShorthand: Record<string, number> = {
                  x: position.x, y: position.y, z: position.z,
                  dx: scale.x,   dy: scale.y,   dz: scale.z,
                  rx: rotation.x, ry: rotation.y, rz: rotation.z,
                };
                const paramUpdates: Record<string, number> = {};
                for (const rel of relations) {
                  const m = rel.id.match(/^(?:'([^']*)'|([a-zA-Z0-9_-]+))\.(.*)$/);
                  if (!m) continue;
                  const relObjName = m[1] || m[2];
                  const relProp   = m[3];
                  if (relObjName !== selectedObj.name) continue;
                  if (!(relProp in valueByShorthand)) continue;
                  // Only handle expressions that are purely a parameter name
                  const exprTrimmed = rel.expression.trim();
                  const param = parameters.find(p => p.name === exprTrimmed || p.id === exprTrimmed);
                  if (param) {
                    let newVal = valueByShorthand[relProp];
                    // Clamp to parameter bounds if defined
                    if (param.min !== undefined) newVal = Math.max(param.min, newVal);
                    if (param.max !== undefined) newVal = Math.min(param.max, newVal);
                    paramUpdates[param.id] = newVal;
                  }
                }
                if (Object.keys(paramUpdates).length > 0) {
                  setParameters(prev =>
                    prev.map(p => p.id in paramUpdates ? { ...p, value: paramUpdates[p.id] } : p)
                  );
                }
              }

              updateObject(selectedId, { position: [position.x, position.y, position.z], rotation: [rotation.x, rotation.y, rotation.z], scale: [scale.x, scale.y, scale.z] });
            }
          }}
        />
      )}

      {/* --- NEW: Render wave functions for ALL domains --- */}
      {/* Case 1: Wave Test Rendering when previewKind === 'wave' */}
      {previewDomain && previewKind === 'wave' ? (
        <DomainWave
          key={`${previewDomain.id}-test`}
          domain={previewDomain}
          sceneObjects={sceneObjects}
          globalConstants={globalConstants}
          sceneBounds={sceneBounds}
          sceneScale={sceneScale} // NEW: Pass scale to DomainWave
          parameters={parameters}
          particles={particles}
          isCalculating={true} // Test render is always calculating, persistOnStop is false by default
          isVisible={true} // Test render is always visible
          cameraView={settings.cameraView}
          clippingPlanes={waveClippingPlanes}
          simulationTimeRef={simulationTimeRef}          
          onPerformanceUpdate={onPerformanceUpdate}
          waveResolution={waveResolution}
          updatesPerSecond={waveUpdatesPerSecond}
          setSimulationTime={setSimulationTime}
          timeScale={timeScale}
          projectVariables={projectVariables}
          onMagnitudeRangeComputed={onMagnitudeRangeComputed}
        />
      ) : !previewDomain && (
        // --- Otherwise, render all domains based on the main controls ---
        physicsDomains.map(domain => (
          <group key={`${domain.id}-${domain.minMagnitude ?? 'n'}-${domain.maxMagnitude ?? 'n'}-${domain.logMinMagnitude ?? 'n'}-${objectCount}`}>
            <DomainWave
              key={`wave-${domain.id}-${waveVersion}-${settings.cameraView}`}
              domain={domain}
              sceneObjects={sceneObjects}
              globalConstants={globalConstants}
              sceneBounds={sceneBounds}
              sceneScale={sceneScale} // NEW: Pass scale to DomainWave
              parameters={parameters}
              particles={particles}
              isCalculating={isWaveRunning} // Pass calculating state
              cameraView={settings.cameraView}
              isVisible={showWave} // <-- NEW: Pass visibility as a prop
              clippingPlanes={waveClippingPlanes}
              simulationTimeRef={simulationTimeRef}
              onPerformanceUpdate={onPerformanceUpdate}
              waveResolution={waveResolution}
              updatesPerSecond={waveUpdatesPerSecond}
              setSimulationTime={setSimulationTime}
              timeScale={timeScale}
              persistOnStop={true} // For the main solver, we want the result to stay
              projectVariables={projectVariables}
              onMagnitudeRangeComputed={onMagnitudeRangeComputed}
            />
            {/* NEW: GPU-based particle system with trajectories
                Always keep the compute/renderer mounted so particles and
                trajectories survive visibility toggles. The top-level
                "showParticles" flag only controls visual visibility here. */}
            <ParticleGPUBridge
              key={`particles-${domain.id}-${waveVersion}`}
              domainId={domain.id}
              domain={domain}
              allDomains={physicsDomains}
              sceneObjects={sceneObjects}
              maxParticles={particleMaxCount}
              // Combine global and local visibility flags so turning off the
              // top-level Particle checkbox hides markers without destroying state.
              showParticles={showParticles && showParticleMarkers}
              showParticleTrajectories={showParticles && showParticleTrajectories}
              sceneScale={sceneScale}
              particleShape={particleShape}
              particleSize={particleSize}
              particleColor={particleColor}
              trajectoryColor={trajectoryColor}
              // For now, emit along the source->screen normal.
              emitterDirection={[0, 0, 1]}
              parameters={parameters}
              globalConstants={globalConstants}
              particles={particles}
              projectVariables={projectVariables}
              simulationTimeRef={simulationTimeRef}
              timeScale={timeScale}
              timeScaleFactor={timeScaleFactor}
              injectionRateSim={particleInjectionRateSim}
              trajectoryMinDistance={trajectoryMinDistance}
              persistTrailsOnDeath={persistTrailsOnDeath}
              isWaveRunning={isWaveRunning}
              sceneBounds={sceneBounds}
              clippingPlanes={geometryClippingPlanes}
              onParticleCountChange={onParticleCountChange}
              onDetectorHit={onDetectorHit}
              crossingObjectIds={upstreamCrossingConfigs.get(domain.id)?.crossingObjectIds}
              onDomainCrossing={upstreamCrossingConfigs.get(domain.id)?.onDomainCrossing}
              pendingInjectionsRef={
                downstreamCrossingConfigs.get(domain.id)?.pendingInjectionsRef as
                  React.MutableRefObject<Map<string, number>> | undefined
              }
            />
          </group>
        ))
      )}

      {/* Case 3: Simple Preview of the domain volume (no wave). */}
      {previewDomain && previewKind === 'domain' && (
        // Note: DomainRenderer is rendered outside the scaled group here, but we want it inside.
        // However, DomainRenderer calculates bounds from sceneObjects (unscaled).
        // If we put it inside the scaled group, it will scale correctly.
        // Let's move it inside the group above or wrap it.
        // Actually, since SceneView structure is: <group scale>...objects...</group> ... <DomainWave> ... <DomainRenderer>
        // We should wrap DomainWave and DomainRenderer in the scaled group too, OR pass the scale to them.
        // The user requested changing the Renderer.
        // If we wrap them in the group, the `v_world_position` in shaders will be scaled.
        // Then we handle the unscaling in the shader.
        // So, let's wrap EVERYTHING in the scaled group?
        // No, TransformControls should probably stay outside or handle scale carefully.
        // But DomainWave/Renderer definitely belong in the scene space.
        // Let's keep the structure as is (DomainWave outside the objects loop but inside SceneView)
        // and rely on `sceneScale` prop passed to them to handle the math.
        // Wait, if DomainWave is NOT inside the `<group scale={...}>`, its geometry (the box) won't be scaled visually!
        // The `WaveRenderer` creates a mesh. That mesh needs to be scaled.
        // So `DomainWave` and `DomainRenderer` MUST be inside a scaled group, OR they must apply the scale to their meshes.
        // Applying scale to the mesh is cleaner than wrapping big blocks of code.
        // Let's pass `sceneScale` to them and let them handle it.
        <DomainRenderer domain={previewDomain} sceneObjects={sceneObjects} sceneBounds={sceneBounds} globalConstants={globalConstants} particles={particles} sceneScale={sceneScale} />
      )}

      {/* Case 4: Injection Surface Test Preview (geometry only, no psi^2) */}
      {previewDomain && previewKind === 'surface' && (
        <InjectionSurfacePreview
          domain={previewDomain}
          sceneObjects={sceneObjects}
          globalConstants={globalConstants}
          parameters={parameters}
          projectVariables={projectVariables}
          sceneBounds={sceneBounds}
          sceneScale={sceneScale}
          particles={particles}
        />
      )}

      {/* Case 5: Psi^2 on the injection surface, normalized and color-coded */}
      {previewDomain && previewKind === 'surfacePsi2' && (
        <Psi2SurfacePreview
          domain={previewDomain}
          sceneObjects={sceneObjects}
          globalConstants={globalConstants}
          parameters={parameters}
          projectVariables={projectVariables}
          sceneBounds={sceneBounds}
          sceneScale={sceneScale}
          particles={particles}
          onPsi2SurfaceStats={onPsi2SurfaceStats}
        />
      )}

    </>
  );
}
