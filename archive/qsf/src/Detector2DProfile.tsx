/**
 * Detector2DProfile – renders 1D projection profiles for edge-on detectors in
 * orthographic (2D) views, using a canvas-textured THREE.js mesh.
 *
 * Benefits over the previous <Html> approach:
 *   • Sized in world units → correctly scales with camera zoom
 *   • depthTest:false + depthWrite:false → never hides other scene objects
 *   • Portrait bins drawn with bin-0 at bottom (matching world +Y = up)
 *   • No DOM overlay blocking the WebGL canvas
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type {
  SceneObjectType,
  PhysicsDomain,
  CustomParameter,
  GlobalConstant,
  ProjectDerivedVariable,
  ParticleDefinition,
} from './types';
import { PALETTE_DEFINITIONS } from './colorPalettes';
import { buildEvaluationScope, evaluateWaveMagnitudeSqAt } from './utils';

/* ─────────────────────────── types ─────────────────────────────────────── */

type CameraViewType = 'xy' | 'xz' | 'yz';

type DetectorGrid = {
  objectId: string;
  uDivisions: number;
  vDivisions: number;
  counts: Float32Array;
  totalHits: number;
  maxCount: number;
};

export type Detector2DProfileProps = {
  viewType: CameraViewType;
  sceneObjects: SceneObjectType[];
  detectorGridsRef: React.MutableRefObject<Map<string, DetectorGrid>>;
  detectorGridsVersion: number;
  globalMax: number;
  detectorRangeRef: React.MutableRefObject<{ min: number; max: number }>;
  globalPalette: string;
  domain: PhysicsDomain | null;
  parameters: CustomParameter[];
  globalConstants: GlobalConstant[];
  projectVariables?: ProjectDerivedVariable[];
  particles: ParticleDefinition[];
  simulationTimeRef: React.MutableRefObject<number>;
  timeScale: number;
  sceneScale: [number, number, number];
};

/* ─────────────────── face / axis metadata ───────────────────────────────── */

const FACE_AXES: Record<string, {
  uAxis: 'x' | 'y' | 'z';
  vAxis: 'x' | 'y' | 'z';
  normalAxis: 'x' | 'y' | 'z';
  normalSign: 1 | -1;
  // True when the hit-detection code stores uIndex=0 at the HIGH end of uAxis
  // (because the overlay plane's rotation flips its local X vs the world axis).
  // Affects 'back' (rotation.y=π) and 'right' (rotation.y=+π/2).
  uFlipped: boolean;
}> = {
  front:  { uAxis: 'x', vAxis: 'y', normalAxis: 'z', normalSign:  1, uFlipped: false },  // Z- face
  back:   { uAxis: 'x', vAxis: 'y', normalAxis: 'z', normalSign: -1, uFlipped: true  },  // Z+ face
  right:  { uAxis: 'z', vAxis: 'y', normalAxis: 'x', normalSign:  1, uFlipped: true  },
  left:   { uAxis: 'z', vAxis: 'y', normalAxis: 'x', normalSign: -1, uFlipped: false },
  top:    { uAxis: 'x', vAxis: 'z', normalAxis: 'y', normalSign:  1, uFlipped: false },
  bottom: { uAxis: 'x', vAxis: 'z', normalAxis: 'y', normalSign: -1, uFlipped: false },
};

const DEPTH_AXIS: Record<CameraViewType, 'x' | 'y' | 'z'> = {
  xy: 'z', xz: 'y', yz: 'x',
};

/** [horizontal world axis, vertical world axis] for each 2D view. */
const VIEW_VISIBLE: Record<CameraViewType, ['x' | 'y' | 'z', 'x' | 'y' | 'z']> = {
  xy: ['x', 'y'],
  xz: ['x', 'z'],
  yz: ['z', 'y'],
};

function isFaceOn(face: string, view: CameraViewType): boolean {
  const info = FACE_AXES[face];
  return !!info && info.normalAxis === DEPTH_AXIS[view];
}

/* ─────────────────── 1-D projection ────────────────────────────────────── */

type Projection1D = {
  bins: Float32Array;
  nBins: number;
  binWorldAxis: 'x' | 'y' | 'z';
  worldStart: number;
  worldEnd: number;
  faceWorldPos: [number, number, number];
};

function compute1DProjection(
  grid: DetectorGrid,
  obj: SceneObjectType,
  face: string,
  view: CameraViewType,
): Projection1D | null {
  const info = FACE_AXES[face];
  if (!info || isFaceOn(face, view)) return null;

  const { uDivisions, vDivisions, counts } = grid;
  const [cx, cy, cz] = obj.position;
  const [sx, sy, sz] = obj.scale;
  const halfX = sx * 0.5, halfY = sy * 0.5, halfZ = sz * 0.5;
  const depth = DEPTH_AXIS[view];

  const sumU = info.uAxis === depth;
  const sumV = info.vAxis === depth;
  if (!sumU && !sumV) return null;

  const worldOrigin: Record<'x' | 'y' | 'z', number> = {
    x: cx - halfX, y: cy - halfY, z: cz - halfZ,
  };
  const worldSize: Record<'x' | 'y' | 'z', number> = {
    x: sx, y: sy, z: sz,
  };

  let bins: Float32Array;
  let binWorldAxis: 'x' | 'y' | 'z';
  let worldStart: number;
  let worldEnd: number;

  if (sumU) {
    binWorldAxis = info.vAxis;
    worldStart   = worldOrigin[binWorldAxis];
    worldEnd     = worldStart + worldSize[binWorldAxis];
    bins = new Float32Array(vDivisions);
    for (let v = 0; v < vDivisions; v++) {
      let s = 0;
      for (let u = 0; u < uDivisions; u++) s += counts[v * uDivisions + u];
      bins[v] = s;
    }
    // V is never flipped for any face – no reversal needed.
  } else {
    binWorldAxis = info.uAxis;
    worldStart   = worldOrigin[binWorldAxis];
    worldEnd     = worldStart + worldSize[binWorldAxis];
    bins = new Float32Array(uDivisions);
    for (let u = 0; u < uDivisions; u++) {
      let s = 0;
      for (let v = 0; v < vDivisions; v++) s += counts[v * uDivisions + u];
      bins[u] = s;
    }
    // For back/right faces, hit-detection stores uIndex=0 at the HIGH end of
    // uAxis (the overlay plane's rotation flips its local X vs world X/Z).
    // Reverse so that bin[0] represents the LOW end of the world axis,
    // which is where worldStart is.
    if (info.uFlipped) bins.reverse();
  }

  // Step INWARD from the detector face so ψ is sampled inside the active
  // wave domain.  The outward face (+sign) sits at/beyond the domain
  // boundary, returning zero.  Reversing the sign places the sample on
  // the incoming side, safely within the domain.
  const EPS = 0.02;
  const fc: [number, number, number] = [cx, cy, cz];
  const sign = info.normalSign;
  if (info.normalAxis === 'x') fc[0] = cx - sign * (halfX + EPS);
  if (info.normalAxis === 'y') fc[1] = cy - sign * (halfY + EPS);
  if (info.normalAxis === 'z') fc[2] = cz - sign * (halfZ + EPS);

  return { bins, nBins: bins.length, binWorldAxis, worldStart, worldEnd, faceWorldPos: fc };
}

/* ─────────────────── colour sampling ───────────────────────────────────── */

function samplePaletteRGB(name: string, t: number): [number, number, number] {
  const stops = PALETTE_DEFINITIONS[name] ?? PALETTE_DEFINITIONS['inferno'];
  if (!stops?.length) return [255, 255, 255];
  const ct = Math.min(1, Math.max(0, t));
  const scaled = ct * (stops.length - 1);
  const i = Math.floor(scaled);
  const f = scaled - i;
  const c1 = stops[i];
  const c2 = stops[Math.min(i + 1, stops.length - 1)];
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * f),
    Math.round(c1[1] + (c2[1] - c1[1]) * f),
    Math.round(c1[2] + (c2[2] - c1[2]) * f),
  ];
}

/* ─────────────────── canvas drawing ────────────────────────────────────── */

const PX_PER_BIN = 64;   // canvas pixels per histogram bin
const STRIP_PX   = 40;   // color-strip thickness (canvas px)
const GAP_PX     = 4;
const CHART_PX   = 160;  // chart breadth perpendicular to bin axis (canvas px)

/**
 * Draws the 1D profile onto the given canvas.
 *
 * Portrait  (binWorldAxis = 'y'):
 *   Bins run top → bottom in canvas coords, but bin[0] = min-Y = BOTTOM of world.
 *   We therefore flip: draw bin[i] at canvas row [nBins-1-i] so the highest
 *   world-Y bin is at the TOP of the canvas, matching the view.
 *
 * Landscape (binWorldAxis = 'x' | 'z'):
 *   Bins left → right; bin[0] = min-horiz = LEFT. No flip needed.
 */
function drawProfile(
  canvas: HTMLCanvasElement,
  portrait: boolean,
  bins: Float32Array,
  nBins: number,
  psi2: Float32Array | null,
  palette: string,
  effMax: number,
  rangeMin: number,
  rangeMax: number,
): void {
  if (nBins === 0) return;

  const BIN_TOTAL = nBins * PX_PER_BIN;
  const cW = portrait ? (STRIP_PX + GAP_PX + CHART_PX) : BIN_TOTAL;
  const cH = portrait ? BIN_TOTAL : (STRIP_PX + GAP_PX + CHART_PX);

  if (canvas.width !== cW || canvas.height !== cH) {
    canvas.width  = cW;
    canvas.height = cH;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, cW, cH);

  // Semi-transparent dark background
  ctx.fillStyle = 'rgba(15,15,15,0.78)';
  ctx.fillRect(0, 0, cW, cH);

  /** Returns palette t ∈ [0,1], or null for zero-count (transparent). */
  const paletteT = (count: number): number | null => {
    const norm = count / effMax;
    if (norm <= 0) return null;
    if (rangeMax <= rangeMin) return Math.min(1, norm);
    if (norm < rangeMin) return 0.01;
    return Math.min(1, (norm - rangeMin) / (rangeMax - rangeMin));
  };

  const psi2Max = psi2 ? Math.max(1e-30, ...Array.from(psi2)) : 1;

  if (portrait) {
    // ── Portrait: bins along Y ──────────────────────────────────────────
    // bin[nBins-1] (max-Y = top of world) → canvas top (y=0)
    // bin[0]       (min-Y = bottom)       → canvas bottom
    const chartX0 = STRIP_PX + GAP_PX;

    for (let i = 0; i < nBins; i++) {
      const drawRow = nBins - 1 - i;      // flip for +Y-up orientation
      const y0 = drawRow * PX_PER_BIN;
      const h  = PX_PER_BIN;
      const t = paletteT(bins[i]);
      if (t !== null) {
        const [r, g, b] = samplePaletteRGB(palette, t);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(1, y0 + 1, STRIP_PX - 2, h - 2);
      }
      if (bins[i] > 0) {
        const barW = Math.min(1, bins[i] / effMax) * CHART_PX;
        ctx.fillStyle = 'rgba(120,160,220,0.3)';
        ctx.fillRect(chartX0, y0 + 1, barW, h - 2);
      }
    }

    // separator
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(chartX0 - 2, 0); ctx.lineTo(chartX0 - 2, cH); ctx.stroke();

    // |ψ|² curve (same flip)
    if (psi2 && psi2.length === nBins) {
      ctx.strokeStyle = '#4caf50'; ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let i = 0; i < nBins; i++) {
        const drawRow = nBins - 1 - i;
        const cy = drawRow * PX_PER_BIN + PX_PER_BIN * 0.5;
        const x  = chartX0 + (psi2[i] / psi2Max) * CHART_PX;
        if (i === 0) ctx.moveTo(x, cy); else ctx.lineTo(x, cy);
      }
      ctx.stroke();
    }

    // hit dots + horizontal error bars (also flipped)
    for (let i = 0; i < nBins; i++) {
      if (bins[i] === 0) continue;
      const drawRow = nBins - 1 - i;
      const cy   = drawRow * PX_PER_BIN + PX_PER_BIN * 0.5;
      const norm = bins[i] / effMax;
      const px   = chartX0 + norm * CHART_PX;
      const errPx = Math.min((Math.sqrt(bins[i]) / effMax) * CHART_PX, CHART_PX);
      const x0 = Math.max(chartX0, px - errPx);
      ctx.strokeStyle = 'rgba(200,200,200,0.7)'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x0, cy); ctx.lineTo(px + errPx, cy);
      ctx.moveTo(x0, cy - 3); ctx.lineTo(x0, cy + 3);
      ctx.moveTo(px + errPx, cy - 3); ctx.lineTo(px + errPx, cy + 3);
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(px, cy, 3.5, 0, Math.PI * 2); ctx.fill();
    }

  } else {
    // ── Landscape: bins along X or world-Z ─────────────────────────────
    const chartY1 = cH - STRIP_PX - GAP_PX;  // chart baseline (strip below)

    for (let i = 0; i < nBins; i++) {
      const x0 = i * PX_PER_BIN;
      const w  = PX_PER_BIN;
      const t = paletteT(bins[i]);
      if (t !== null) {
        const [r, g, b] = samplePaletteRGB(palette, t);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x0 + 1, cH - STRIP_PX + 1, w - 2, STRIP_PX - 2);
      }
      if (bins[i] > 0) {
        const barH = Math.min(1, bins[i] / effMax) * chartY1;
        ctx.fillStyle = 'rgba(120,160,220,0.3)';
        ctx.fillRect(x0 + 1, chartY1 - barH, w - 2, barH);
      }
    }

    // separator
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, chartY1 + 2); ctx.lineTo(cW, chartY1 + 2); ctx.stroke();

    // |ψ|² curve
    if (psi2 && psi2.length === nBins) {
      ctx.strokeStyle = '#4caf50'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let i = 0; i < nBins; i++) {
        const cx = i * PX_PER_BIN + PX_PER_BIN * 0.5;
        const cy = chartY1 - (psi2[i] / psi2Max) * chartY1;
        if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // hit dots + vertical error bars
    for (let i = 0; i < nBins; i++) {
      if (bins[i] === 0) continue;
      const px  = i * PX_PER_BIN + PX_PER_BIN * 0.5;
      const norm = bins[i] / effMax;
      const py   = chartY1 - norm * chartY1;
      const errPx = Math.min((Math.sqrt(bins[i]) / effMax) * chartY1, chartY1);
      const y0 = Math.max(0, py - errPx);
      const y1 = Math.min(chartY1, py + errPx);
      ctx.strokeStyle = 'rgba(200,200,200,0.7)'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(px, y0); ctx.lineTo(px, y1);
      ctx.moveTo(px - 3, y0); ctx.lineTo(px + 3, y0);
      ctx.moveTo(px - 3, y1); ctx.lineTo(px + 3, y1);
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
    }
  }
}

/* ─────────────────── per-detector overlay mesh ─────────────────────────── */

type SingleOverlayProps = {
  obj: SceneObjectType;
  grid: DetectorGrid;
  view: CameraViewType;
  globalMax: number;
  detectorRangeRef: React.MutableRefObject<{ min: number; max: number }>;
  palette: string;
  domain: PhysicsDomain | null;
  parameters: CustomParameter[];
  globalConstants: GlobalConstant[];
  projectVariables?: ProjectDerivedVariable[];
  particles: ParticleDefinition[];
  simulationTimeRef: React.MutableRefObject<number>;
  timeScale: number;
  sceneObjects: SceneObjectType[];
};

const SingleDetectorOverlay: React.FC<SingleOverlayProps> = ({
  obj, grid, view, globalMax, detectorRangeRef, palette,
  domain, parameters, globalConstants, projectVariables, particles,
  simulationTimeRef, timeScale, sceneObjects,
}) => {
  const face = obj.detector?.face ?? 'front';
  const { camera } = useThree();

  const projection = useMemo(
    () => compute1DProjection(grid, obj, face, view),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grid.totalHits, grid.uDivisions, grid.vDivisions,
     obj.id, obj.position[0], obj.position[1], obj.position[2], face, view],
  );

  // Canvas + CanvasTexture – created once per instance
  const stateRef = useRef<{ canvas: HTMLCanvasElement; texture: THREE.CanvasTexture } | null>(null);
  if (!stateRef.current) {
    const canvas = document.createElement('canvas');
    canvas.width = 4; canvas.height = 4;
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    stateRef.current = { canvas, texture };
  }

  // Dispose texture on unmount
  useEffect(() => {
    const s = stateRef.current;
    return () => { s?.texture.dispose(); };
  }, []);

  // |ψ|² profile
  const psi2Ref     = useRef<Float32Array | null>(null);
  const lastTimeRef = useRef<number>(-1);

  useFrame(() => {
    if (!projection || !stateRef.current) return;

    // ── update |ψ|² ───────────────────────────────────────────────────
    if (domain?.waveEquation?.isValidated) {
      const t = simulationTimeRef.current;
      if (Math.abs(t - lastTimeRef.current) >= 0.01) {
        lastTimeRef.current = t;
        const { nBins, binWorldAxis, worldStart, worldEnd, faceWorldPos } = projection;
        const waveEq     = domain.waveEquation!;
        const staticScope = buildEvaluationScope(sceneObjects, globalConstants);
        const result      = new Float32Array(nBins);
        const [ox, oy, oz] = faceWorldPos;
        for (let i = 0; i < nBins; i++) {
          const bc  = worldStart + ((i + 0.5) / nBins) * (worldEnd - worldStart);
          const pos = { x: ox, y: oy, z: oz };
          (pos as Record<string, number>)[binWorldAxis] = bc;
          result[i] = evaluateWaveMagnitudeSqAt(
            domain, waveEq, staticScope, parameters,
            projectVariables, particles, pos, t, timeScale, false,
          ) ?? 0;
        }
        psi2Ref.current = result;
      }
    }

    // ── redraw canvas every frame (keeps range slider live) ───────────
    const rMin   = detectorRangeRef.current.min;
    const rMax   = detectorRangeRef.current.max;
    const effMax = Math.max(1, globalMax > 0 ? globalMax :
      (projection.bins.length > 0 ? Math.max(...Array.from(projection.bins)) : 1));
    const portrait = projection.binWorldAxis === 'y';
    drawProfile(
      stateRef.current.canvas, portrait,
      projection.bins, projection.nBins,
      psi2Ref.current, palette, effMax, rMin, rMax,
    );
    stateRef.current.texture.needsUpdate = true;
  });

  if (!projection) return null;

  /* ── geometry sizing ─────────────────────────────────────────────── */

  const { binWorldAxis, worldStart, worldEnd, faceWorldPos } = projection;
  const binAxisSize     = Math.abs(worldEnd - worldStart);
  // Chart panel depth in world units – scales with detector, clamped sensibly.
  const chartWorldDepth = Math.max(1.5, Math.min(8, binAxisSize * 0.18));
  const gapWorld        = 0.12;

  const portrait = binWorldAxis === 'y';
  // Portrait: narrow panel to the side; Landscape: flat panel above/below
  const [planeW, planeH] = portrait
    ? [chartWorldDepth, binAxisSize]
    : [binAxisSize, chartWorldDepth];

  /* ── anchor position ─────────────────────────────────────────────── */

  const [cx, cy, cz] = obj.position;
  const [sx, sy, sz] = obj.scale;
  const halfSizes: Record<'x' | 'y' | 'z', number> = {
    x: sx * 0.5, y: sy * 0.5, z: sz * 0.5,
  };

  // The panel goes alongside the detector edge along the non-bin visible axis.
  const [hAxis] = VIEW_VISIBLE[view];
  const panelOffsetAxis: 'x' | 'y' | 'z' =
    binWorldAxis === hAxis ? VIEW_VISIBLE[view][1] : VIEW_VISIBLE[view][0];

  const anchor: [number, number, number] = [...faceWorldPos] as [number, number, number];
  const edgeDist = halfSizes[panelOffsetAxis] + gapWorld + chartWorldDepth * 0.5;
  if (panelOffsetAxis === 'x') anchor[0] = cx + edgeDist;
  if (panelOffsetAxis === 'y') anchor[1] = cy + edgeDist;
  if (panelOffsetAxis === 'z') anchor[2] = cz + edgeDist;

  /* ── rotation to face the camera ─────────────────────────────────── */
  // PlaneGeometry default normal = +Z.
  // Rotate so the normal points toward the camera (opposite to look direction).
  // We also need the canvas left edge (which holds the colour strip) to sit
  // adjacent to the detector face rather than pointing away from it.
  //
  // XZ view (camera along ±Y):
  //   rotX = -π/2  when camera at +Y  →  normal → +Y, local +X → world +X ✓
  //   panel is offset along +Y from the detector top edge.
  //
  // YZ view (camera along +X):
  //   rotY = -π/2  →  normal → +X (faces camera), local +X → world +Z.
  //   Panel is offset along +Z; canvas left (strip) sits at low-Z=near detector ✓.
  //   rotY = +π/2 (camera at -X) → normal → -X; local +X → world -Z; offset -Z ✓.
  const camPos = camera.position;
  let rotX = 0, rotY = 0;
  if (view === 'xz') {
    rotX = camPos.y >= 0 ? -Math.PI / 2 : Math.PI / 2;
  } else if (view === 'yz') {
    rotY = camPos.x >= 0 ? -Math.PI / 2 : Math.PI / 2;
  }

  return (
    <mesh position={anchor} rotation={[rotX, rotY, 0]} renderOrder={1200}>
      <planeGeometry args={[planeW, planeH]} />
      <meshBasicMaterial
        map={stateRef.current.texture}
        transparent
        depthTest={false}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/* ─────────────────── main exported component ───────────────────────────── */

export const Detector2DProfile: React.FC<Detector2DProfileProps> = ({
  viewType, sceneObjects, detectorGridsRef, detectorGridsVersion,
  globalMax, detectorRangeRef, globalPalette, domain,
  parameters, globalConstants, projectVariables, particles,
  simulationTimeRef, timeScale,
}) => {
  const overlays = useMemo(() => {
    return sceneObjects
      .filter(o => o.detector?.enabled)
      .flatMap(obj => {
        const face = obj.detector!.face;
        if (isFaceOn(face, viewType)) return [];
        const grid = detectorGridsRef.current.get(obj.id);
        if (!grid || grid.totalHits === 0) return [];
        return [{ obj, grid }];
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneObjects, viewType, detectorGridsVersion]);

  if (overlays.length === 0) return null;

  return (
    <>
      {overlays.map(({ obj, grid }) => (
        <SingleDetectorOverlay
          key={obj.id}
          obj={obj}
          grid={grid}
          view={viewType}
          globalMax={globalMax}
          detectorRangeRef={detectorRangeRef}
          palette={globalPalette}
          domain={domain}
          parameters={parameters}
          globalConstants={globalConstants}
          projectVariables={projectVariables}
          particles={particles}
          simulationTimeRef={simulationTimeRef}
          timeScale={timeScale}
          sceneObjects={sceneObjects}
        />
      ))}
    </>
  );
};

