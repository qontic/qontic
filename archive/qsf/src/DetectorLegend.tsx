/**
 * DetectorLegend – bottom-right overlay:
 *
 *   ┌─ histogram panel ──────────────────────────────────────────┐
 *   │  [U] [V]  hit bars + √N error bars + |ψ|² curve           │
 *   └────────────────────────────────────────────────────────────┘
 *   ┌─ Detector ─────────────────────────── N hits ──────────────┐
 *   │  [▓▓▓▓▓▓▓▓▓▓ palette bar ▓▓▓▓▓▓▓▓▓▓]  ← click to change  │
 *   │  ▼                              ▼                          │
 *   │  0                            823                          │
 *   └────────────────────────────────────────────────────────────┘
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getCssGradient, PALETTE_DEFINITIONS } from './colorPalettes';
import type {
  SceneObjectType,
  PhysicsDomain,
  CustomParameter,
  GlobalConstant,
  ProjectDerivedVariable,
  ParticleDefinition,
} from './types';
import * as THREE from 'three';
import { buildEvaluationScope, evaluateWaveMagnitudeSqAt, parseDomainBounds } from './utils';

/* ------------------------------------------------------------------ palette sampling */

function samplePalette(name: string, t: number): [number, number, number] {
  const stops = PALETTE_DEFINITIONS[name] ?? PALETTE_DEFINITIONS['blue'] ?? [[0, 0, 128], [0, 0, 255]];
  if (!stops.length) return [0, 0, 255];
  const tc = Math.max(0, Math.min(1, t));
  const pos = tc * (stops.length - 1);
  const lo = Math.floor(pos), hi = Math.min(stops.length - 1, lo + 1), f = pos - lo;
  return [
    Math.round(stops[lo][0] * (1 - f) + stops[hi][0] * f),
    Math.round(stops[lo][1] * (1 - f) + stops[hi][1] * f),
    Math.round(stops[lo][2] * (1 - f) + stops[hi][2] * f),
  ];
}

/* ------------------------------------------------------------------ types */

/** Mirrors App.tsx DetectorGrid (kept local to avoid a shared module) */
type DetectorGrid = {
  objectId: string;
  uDivisions: number;
  vDivisions: number;
  counts: Float32Array;
  totalHits: number;
  maxCount: number;
};

export type DetectorLegendProps = {
  /* palette legend */
  paletteGradient: string;
  paletteName: string;
  totalHits: number;
  maxHits: number;
  rangeMinNorm: number;
  rangeMaxNorm: number;
  rangeRef: React.MutableRefObject<{ min: number; max: number }>;
  onChangePalette: (name: string) => void;
  onChangeRange: (minNorm: number, maxNorm: number) => void;

  /* histogram – optional; omit to hide histogram panel */
  detectorGridsRef?: React.MutableRefObject<Map<string, DetectorGrid>>;
  detectorObject?: SceneObjectType | null;
  domains?: PhysicsDomain[];        // all domains – histogram picks the one containing the detector
  parameters?: CustomParameter[];
  globalConstants?: GlobalConstant[];
  projectVariables?: ProjectDerivedVariable[];
  particles?: ParticleDefinition[];
  simulationTimeRef?: React.MutableRefObject<number>;
  timeScale?: number;
  sceneObjects?: SceneObjectType[];
};

/* ----------------------------------------------------------------- face axis metadata */

/** Must match ParticleComputeGPU.tsx hit detection UV flip logic */
const FACE_INFO: Record<string, {
  uWorldAxis: 'x' | 'y' | 'z';
  uFlipped: boolean;
  vWorldAxis: 'x' | 'y' | 'z';
  normalAxis: 'x' | 'y' | 'z';
  normalSign: number;
}> = {
  front:  { uWorldAxis: 'x', uFlipped: false, vWorldAxis: 'y', normalAxis: 'z', normalSign:  1 },
  back:   { uWorldAxis: 'x', uFlipped: true,  vWorldAxis: 'y', normalAxis: 'z', normalSign: -1 },
  right:  { uWorldAxis: 'z', uFlipped: true,  vWorldAxis: 'y', normalAxis: 'x', normalSign:  1 },
  left:   { uWorldAxis: 'z', uFlipped: false, vWorldAxis: 'y', normalAxis: 'x', normalSign: -1 },
  top:    { uWorldAxis: 'x', uFlipped: false, vWorldAxis: 'z', normalAxis: 'y', normalSign:  1 },
  bottom: { uWorldAxis: 'x', uFlipped: false, vWorldAxis: 'z', normalAxis: 'y', normalSign: -1 },
};

const WORLD_AXIS_LABEL: Record<'x' | 'y' | 'z', string> = { x: 'X', y: 'Y', z: 'Z' };

/* ----------------------------------------------------------------- helpers */

/** Project a 2D detector grid counts array onto U or V axis. */
function project1D(grid: DetectorGrid, axis: 'u' | 'v'): Float32Array {
  const { uDivisions: uD, vDivisions: vD, counts } = grid;
  if (axis === 'u') {
    const bins = new Float32Array(uD);
    for (let u = 0; u < uD; u++) {
      let s = 0;
      for (let v = 0; v < vD; v++) s += counts[v * uD + u];
      bins[u] = s;
    }
    return bins;
  } else {
    const bins = new Float32Array(vD);
    for (let v = 0; v < vD; v++) {
      let s = 0;
      for (let u = 0; u < uD; u++) s += counts[v * uD + u];
      bins[v] = s;
    }
    return bins;
  }
}

/** World-space position at the centre of bin `i` along `axis` on the detector face. */
function binWorldPos(
  obj: SceneObjectType,
  face: string,
  axis: 'u' | 'v',
  binIdx: number,
  nBins: number,
): { x: number; y: number; z: number } {
  const info = FACE_INFO[face] ?? FACE_INFO['front'];
  const [cx, cy, cz] = obj.position;
  const [sx, sy, sz] = obj.scale;
  const half: Record<'x' | 'y' | 'z', number> = { x: sx * 0.5, y: sy * 0.5, z: sz * 0.5 };
  const size: Record<'x' | 'y' | 'z', number> = { x: sx, y: sy, z: sz };
  const origin: Record<'x' | 'y' | 'z', number> = {
    x: cx - sx * 0.5,
    y: cy - sy * 0.5,
    z: cz - sz * 0.5,
  };
  const pos: Record<'x' | 'y' | 'z', number> = { x: cx, y: cy, z: cz };

  // Sample just INSIDE the domain — on the incoming face of the detector
  // (the face opposite the outward normal).  The outward face is at
  // center + normalSign*half which sits at or beyond the domain boundary
  // so ψ evaluates to zero there.  Stepping inward (−normalSign) places
  // the sample safely inside the active wave domain.
  const normalIdx = ['x', 'y', 'z'].indexOf(info.normalAxis) as 0 | 1 | 2;
  const centre3 = [cx, cy, cz];
  pos[info.normalAxis] = centre3[normalIdx] - info.normalSign * (half[info.normalAxis] + 0.02);

  if (axis === 'u') {
    const wAx = info.uWorldAxis;
    if (info.uFlipped) {
      pos[wAx] = origin[wAx] + size[wAx] - (binIdx + 0.5) / nBins * size[wAx];
    } else {
      pos[wAx] = origin[wAx] + (binIdx + 0.5) / nBins * size[wAx];
    }
  } else {
    const wAx = info.vWorldAxis;
    pos[wAx] = origin[wAx] + (binIdx + 0.5) / nBins * size[wAx];
  }
  return pos;
}

/* ----------------------------------------------------------------- canvas draw */

interface DrawHistogramArgs {
  canvas: HTMLCanvasElement;
  bins: Float32Array;
  psi2: Float32Array | null;
  palette: string;
  axisLabel: string;
}

function drawHistogram({ canvas, bins, psi2, palette, axisLabel }: DrawHistogramArgs) {
  const N = bins.length;
  const W = canvas.width;
  const H = canvas.height;
  const sc = W / 280;
  const PAD_L = Math.round(40 * sc), PAD_R = Math.round(12 * sc);
  const PAD_T = Math.round(22 * sc), PAD_B = Math.round(24 * sc);
  const cW = W - PAD_L - PAD_R;
  const cH = H - PAD_T - PAD_B;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // dark background
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, W, H);

  if (N === 0) return;

  const HEADROOM = 0.90;
  const binMax = Math.max(1, ...Array.from(bins));
  const effMax = binMax / HEADROOM;

  const binW = cW / N;
  const DOT_R = Math.max(2 * sc, Math.min(5 * sc, binW * 0.4));
  const CAP_W = Math.max(2 * sc, Math.min(6 * sc, binW * 0.3));
  const FONT_SM = `${Math.round(9 * sc)}px Inter,sans-serif`;
  const LINE_W_MAIN = sc;

  // subtle horizontal grid
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = sc;
  for (let g = 1; g <= 4; g++) {
    const gy = PAD_T + cH - (g / 4) * cH;
    ctx.beginPath(); ctx.moveTo(PAD_L, gy); ctx.lineTo(PAD_L + cW, gy); ctx.stroke();
  }

  // |ψ|² curve — area-normalised to match hit counts; peak-normalised to 1 when no hits
  if (psi2 && psi2.length === N) {
    const psiSum = psi2.reduce((a, b) => a + b, 0);
    const binSum = bins.reduce((a, b) => a + b, 0);
    let scale: number;
    if (binSum > 0) {
      scale = psiSum > 1e-30 ? binSum / psiSum : 1;
    } else {
      // No hits yet: normalise so the peak of |ψ|² sits at HEADROOM height
      const psiMax = psi2.reduce((a, b) => (b > a ? b : a), 0);
      scale = psiMax > 1e-30 ? (effMax * HEADROOM) / psiMax : 1;
    }
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 1.8 * sc;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const px = PAD_L + (i + 0.5) * binW;
      const py = PAD_T + cH - (psi2[i] * scale / effMax) * cH;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // palette fill bars (35% opacity) behind dots
  for (let i = 0; i < N; i++) {
    const count = bins[i];
    if (count === 0) continue;
    const bx = PAD_L + i * binW;
    const barTop = PAD_T + cH - (count / effMax) * cH;
    const barH = (count / effMax) * cH;
    const [r, g, b] = samplePalette(palette, count / effMax);
    ctx.fillStyle = `rgba(${r},${g},${b},0.35)`;
    ctx.fillRect(bx + binW * 0.1, barTop, binW * 0.8, barH);
  }

  // error bars (±√count) then dot on top
  for (let i = 0; i < N; i++) {
    const count = bins[i];
    if (count === 0) continue;
    const cx2 = PAD_L + (i + 0.5) * binW;
    const dotY = PAD_T + cH - (count / effMax) * cH;
    const errPx = (Math.sqrt(count) / effMax) * cH;
    const y0 = Math.max(PAD_T, dotY - errPx);
    const y1 = Math.min(PAD_T + cH, dotY + errPx);

    // vertical bar
    ctx.strokeStyle = 'rgba(210,210,210,0.85)';
    ctx.lineWidth = LINE_W_MAIN;
    ctx.beginPath();
    ctx.moveTo(cx2, y0); ctx.lineTo(cx2, y1);
    ctx.stroke();

    // end caps
    ctx.beginPath();
    ctx.moveTo(cx2 - CAP_W, y0); ctx.lineTo(cx2 + CAP_W, y0);
    ctx.moveTo(cx2 - CAP_W, y1); ctx.lineTo(cx2 + CAP_W, y1);
    ctx.stroke();

    // filled dot
    ctx.beginPath();
    ctx.arc(cx2, dotY, DOT_R, 0, Math.PI * 2);
    ctx.fillStyle = '#111111';
    ctx.fill();
    ctx.strokeStyle = 'rgba(220,220,220,0.95)';
    ctx.lineWidth = 1.3 * sc;
    ctx.stroke();
  }

  // axes
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = sc;
  ctx.beginPath();
  ctx.moveTo(PAD_L, PAD_T); ctx.lineTo(PAD_L, PAD_T + cH);
  ctx.lineTo(PAD_L + cW, PAD_T + cH);
  ctx.stroke();

  // y-axis tick labels
  ctx.fillStyle = '#888';
  ctx.font = FONT_SM;
  ctx.textAlign = 'right';
  ctx.fillText(binMax.toFixed(0), PAD_L - 3 * sc, PAD_T + cH * (1 - HEADROOM) + 5 * sc);
  ctx.fillText('0', PAD_L - 3 * sc, PAD_T + cH + 4 * sc);

  // x-axis label
  ctx.textAlign = 'center';
  ctx.fillStyle = '#999';
  ctx.fillText(axisLabel, PAD_L + cW / 2, PAD_T + cH + 16 * sc);

  // legend markers
  ctx.font = FONT_SM;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(PAD_L + 5 * sc, PAD_T - 9 * sc, 3 * sc, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(210,210,210,0.85)';
  ctx.lineWidth = sc;
  ctx.stroke();
  ctx.fillStyle = '#aaa';
  ctx.fillText('hits', PAD_L + 11 * sc, PAD_T - 5 * sc);
  if (psi2) {
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 1.8 * sc;
    ctx.beginPath(); ctx.moveTo(PAD_L + 42 * sc, PAD_T - 9 * sc); ctx.lineTo(PAD_L + 54 * sc, PAD_T - 9 * sc); ctx.stroke();
    ctx.fillStyle = '#4caf50';
    ctx.fillText('|ψ|²', PAD_L + 57 * sc, PAD_T - 5 * sc);
  }
}

/* ----------------------------------------------------------------- HistogramPanel */

interface HistogramPanelProps {
  detectorGridsRef: React.MutableRefObject<Map<string, DetectorGrid>>;
  detectorObject: SceneObjectType;
  palette: string;
  globalMax: number;
  totalHits: number;
  panelScale: number;
  domains: PhysicsDomain[];
  parameters: CustomParameter[];
  globalConstants: GlobalConstant[];
  projectVariables: ProjectDerivedVariable[];
  particles: ParticleDefinition[];
  simulationTimeRef: React.MutableRefObject<number>;
  timeScale: number;
  sceneObjects: SceneObjectType[];
}

const HistogramPanel: React.FC<HistogramPanelProps> = ({
  detectorGridsRef, detectorObject, palette, globalMax, totalHits, panelScale,
  domains, parameters, globalConstants, projectVariables, particles,
  simulationTimeRef, timeScale, sceneObjects,
}) => {
  const [axis, setAxis] = useState<'u' | 'v'>('u');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const BASE_W = 280, BASE_H = 150;
  const CHART_W = Math.round(BASE_W * panelScale);
  const CHART_H = Math.round(BASE_H * panelScale);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cfg = detectorObject.detector!;
    const face = cfg.face ?? 'front';
    const grid = detectorGridsRef.current.get(detectorObject.id);

    // Use real counts if hits exist, otherwise use zeros so ψ² curve still renders
    const nDiv = axis === 'u' ? cfg.uDivisions : cfg.vDivisions;
    const bins = grid ? project1D(grid, axis) : new Float32Array(nDiv ?? 64);
    const N = bins.length;
    const info = FACE_INFO[face] ?? FACE_INFO['front'];
    const worldAxis = axis === 'u' ? info.uWorldAxis : info.vWorldAxis;
    const axisLabel = `${WORLD_AXIS_LABEL[worldAxis]} (${nDiv} bins)`;

    // compute |ψ|² — find the domain whose rules place the detector face inside it
    let psi2: Float32Array | null = null;
    if (domains && domains.length > 0) {
      try {
        const staticScope = buildEvaluationScope(sceneObjects, globalConstants);
        const t = simulationTimeRef.current;

        // The detector wall sits at the domain boundary (not strictly inside any domain).
        // Use distanceToPoint from the detector CENTER — the domain whose bounding box
        // is nearest is the one feeding into the detector.
        const [cx2, cy2, cz2] = detectorObject.position;
        const detCenter = new THREE.Vector3(cx2, cy2, cz2);

        let activeDomain: PhysicsDomain | null = null;
        let minDist = Infinity;
        for (const d of domains) {
          if (!d.waveEquation?.isValidated) continue;
          const bounds = parseDomainBounds(d, sceneObjects, null, globalConstants, particles);
          if (bounds.isEmpty()) continue;
          const dist = bounds.distanceToPoint(detCenter);
          if (dist < minDist) { minDist = dist; activeDomain = d; }
        }
        if (activeDomain) {
          const arr = new Float32Array(N);
          for (let i = 0; i < N; i++) {
            const wPos = binWorldPos(detectorObject, face, axis, i, N);
            arr[i] = evaluateWaveMagnitudeSqAt(
              activeDomain, activeDomain.waveEquation!, staticScope,
              parameters, projectVariables, particles,
              wPos, t, timeScale, false,
            ) ?? 0;
          }
          psi2 = arr;
        }
      } catch {
        // wave eval failure – skip curve
      }
    }

    drawHistogram({ canvas, bins, psi2, palette, axisLabel });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalHits, axis, palette, globalMax, detectorObject.id, CHART_W, CHART_H, parameters, projectVariables, globalConstants, sceneObjects]);

  const btnFontSize = Math.round(10 * panelScale);
  const labelFontSize = Math.round(10 * panelScale);

  return (
    <div style={{ marginBottom: 6 }}>
      {/* axis toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 4, alignItems: 'center' }}>
        <span style={{ fontSize: labelFontSize, color: '#aaa', marginRight: 4 }}>Projection:</span>
        {(['u', 'v'] as const).map(a => (
          <button
            key={a}
            onClick={() => setAxis(a)}
            style={{
              padding: `${Math.round(2 * panelScale)}px ${Math.round(9 * panelScale)}px`,
              fontSize: btnFontSize,
              borderRadius: 4,
              border: `1px solid ${axis === a ? '#61dafb' : 'rgba(120,120,120,0.5)'}`,
              background: axis === a ? 'rgba(97,218,251,0.15)' : 'rgba(40,40,40,0.6)',
              color: axis === a ? '#61dafb' : '#bbb',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
          >
            {a.toUpperCase()}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={CHART_W}
        height={CHART_H}
        style={{
          display: 'block',
          width: CHART_W,
          height: CHART_H,
          borderRadius: 4,
          border: '1px solid rgba(120,120,120,0.3)',
          background: 'rgba(15,15,15,0.85)',
        }}
      />
    </div>
  );
};

/* ----------------------------------------------------------------- palette colours */

const ALL_PALETTES: Record<string, string> = Object.keys(PALETTE_DEFINITIONS).reduce(
  (acc, key) => { acc[key] = getCssGradient(key); return acc; },
  {} as Record<string, string>,
);

/* ================================================================= main export */

export const DetectorLegend: React.FC<DetectorLegendProps> = ({
  paletteGradient, paletteName, totalHits, maxHits,
  rangeMinNorm, rangeMaxNorm, rangeRef,
  onChangePalette, onChangeRange,
  detectorGridsRef, detectorObject,
  domains = [], parameters = [], globalConstants = [],
  projectVariables = [], particles = [],
  simulationTimeRef, timeScale = 1,
  sceneObjects = [],
}) => {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const legendRef = useRef<HTMLDivElement>(null);

  /* ---- range handle state ---- */
  const [localMin, setLocalMin] = useState(rangeMinNorm);
  const [localMax, setLocalMax] = useState(rangeMaxNorm);
  useEffect(() => { setLocalMin(rangeMinNorm); }, [rangeMinNorm]);
  useEffect(() => { setLocalMax(rangeMaxNorm); }, [rangeMaxNorm]);

  /* ---- drag state ---- */
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const panelDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const onDragDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    panelDragRef.current = { startX: e.clientX, startY: e.clientY, origX: offset.x, origY: offset.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!panelDragRef.current) return;
    const dx = e.clientX - panelDragRef.current.startX;
    const dy = e.clientY - panelDragRef.current.startY;
    setOffset({ x: panelDragRef.current.origX + dx, y: panelDragRef.current.origY + dy });
  };
  const onDragUp = () => { panelDragRef.current = null; };

  /* ---- scale state ---- */
  const [panelScale, setPanelScale] = useState(1.0);
  const scaleDragRef = useRef<{ startY: number; origScale: number } | null>(null);

  const onScaleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    scaleDragRef.current = { startY: e.clientY, origScale: panelScale };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onScaleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scaleDragRef.current) return;
    const dy = scaleDragRef.current.startY - e.clientY; // drag up → bigger
    const ns = Math.max(0.4, Math.min(2.5, scaleDragRef.current.origScale + dy * 0.006));
    setPanelScale(ns);
  };
  const onScaleUp = () => { scaleDragRef.current = null; };

  /* close popover on outside click */
  useEffect(() => {
    if (!paletteOpen) return;
    const handler = (e: MouseEvent) => {
      if (legendRef.current && !legendRef.current.contains(e.target as Node)) {
        setPaletteOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [paletteOpen]);

  /* double-handle range slider logic */
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<'min' | 'max' | null>(null);
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  const ptrToNorm = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width < 1) return 0;
    return clamp01((clientX - rect.left) / rect.width);
  }, []);

  const makeHandleHandlers = (handle: 'min' | 'max') => ({
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      dragging.current = handle;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragging.current !== handle) return;
      const n = ptrToNorm(e.clientX);
      if (handle === 'min') {
        const v = clamp01(Math.min(n, localMax));
        setLocalMin(v);
        rangeRef.current.min = v;
      } else {
        const v = clamp01(Math.max(n, localMin));
        setLocalMax(v);
        rangeRef.current.max = v;
      }
    },
    onPointerUp: () => {
      dragging.current = null;
      onChangeRange(rangeRef.current.min, rangeRef.current.max);
    },
    onPointerCancel: () => {
      dragging.current = null;
      onChangeRange(rangeRef.current.min, rangeRef.current.max);
    },
  });

  const fmtHits = (n: number) => n >= 10000 ? `${(n / 1000).toFixed(1)}k` : n.toLocaleString();
  const minPct = localMin * 100;
  const maxPct = localMax * 100;
  const minLabel = maxHits > 0 ? Math.round(localMin * maxHits) : 0;
  const maxLabel = maxHits > 0 ? Math.round(localMax * maxHits) : 0;

  const showHistogram =
    !!detectorGridsRef && !!detectorObject?.detector?.enabled && !!simulationTimeRef;

  return (
    <div
      className="dl-root"
      ref={legendRef}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <div
        className="dl-panel"
        style={{ width: Math.round(295 * panelScale), fontSize: Math.round(11 * panelScale) }}
      >
        {/* ---- drag handle ---- */}
        <div
          className="dl-drag-handle"
          onPointerDown={onDragDown}
          onPointerMove={onDragMove}
          onPointerUp={onDragUp}
          onPointerCancel={onDragUp}
          title="Drag to move"
        >
          <span className="dl-drag-dots">⋮⋮</span>
          <button
            style={{ background: 'none', border: 'none', color: 'rgba(180,180,180,0.6)', fontSize: 9, cursor: 'pointer', padding: '0 2px', lineHeight: 1, userSelect: 'none', flexShrink: 0 }}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); setMinimized(v => !v); }}
            title={minimized ? 'Expand' : 'Minimize'}
          >
            {minimized ? '▲' : '▼'}
          </button>
        </div>

        {!minimized && (<>

        {/* ---- histogram panel (above palette) ---- */}
        {showHistogram && (
          <HistogramPanel
            detectorGridsRef={detectorGridsRef!}
            detectorObject={detectorObject!}
            palette={paletteName}
            globalMax={maxHits}
            totalHits={totalHits}
            panelScale={panelScale}
            domains={domains ?? []}
            parameters={parameters}
            globalConstants={globalConstants}
            projectVariables={projectVariables}
            particles={particles}
            simulationTimeRef={simulationTimeRef!}
            timeScale={timeScale}
            sceneObjects={sceneObjects}
          />
        )}

        {/* ---- header row ---- */}
        <div className="dl-header">
          <span>Detector</span>
          <span className="dl-total">{fmtHits(totalHits)} hits</span>
        </div>

        {/* ---- palette bar + range handles ---- */}
        <div className="dl-bar-wrap" ref={trackRef}>
          <div
            className="dl-gradient-bar"
            style={{ backgroundImage: paletteGradient }}
            onClick={() => setPaletteOpen(v => !v)}
            title="Click to change palette"
          />
          <div
            className="dl-handle dl-handle-min"
            style={{ left: `calc(${minPct}% - 17px)` }}
            {...makeHandleHandlers('min')}
            title={`Min: ${minLabel}`}
          >
            <svg width="14" height="11" viewBox="0 0 14 11">
              <polygon points="7,0 0,11 14,11" fill="#ffffff" />
            </svg>
          </div>
          <div
            className="dl-handle dl-handle-max"
            style={{ left: `calc(${maxPct}% - 17px)` }}
            {...makeHandleHandlers('max')}
            title={`Max: ${maxLabel}`}
          >
            <svg width="14" height="11" viewBox="0 0 14 11">
              <polygon points="7,0 0,11 14,11" fill="#ffffff" />
            </svg>
          </div>
          <div className="dl-dim" style={{ left: 0, width: `${minPct}%` }} />
          <div className="dl-dim" style={{ left: `${maxPct}%`, right: 0 }} />
        </div>

        {/* ---- numeric labels ---- */}
        <div className="dl-labels">
          <span className="dl-label-min" style={{ left: `${minPct}%` }}>{fmtHits(minLabel)}</span>
          <span className="dl-label-max" style={{ left: `${maxPct}%` }}>{fmtHits(maxLabel)}</span>
        </div>

        {/* ---- palette popover ---- */}
        {paletteOpen && (
          <div className="dl-popover">
            {Object.entries(ALL_PALETTES).map(([name, grad]) => (
              <div
                key={name}
                className={`dl-popover-item${name === paletteName ? ' dl-popover-item-active' : ''}`}
                onClick={() => { onChangePalette(name); setPaletteOpen(false); }}
                title={name}
              >
                <div className="dl-popover-gradient" style={{ backgroundImage: grad }} />
              </div>
            ))}
          </div>
        )}

        {/* ---- scale handle (bottom bar) ---- */}
        <div
          className="dl-scale-bar"
          onPointerDown={onScaleDown}
          onPointerMove={onScaleMove}
          onPointerUp={onScaleUp}
          onPointerCancel={onScaleUp}
          title="Drag up/down to resize"
        >
          <span style={{ fontSize: 9, letterSpacing: 2, opacity: 0.5 }}>⇕ resize</span>
        </div>
        </>)}
      </div>
    </div>
  );
};
