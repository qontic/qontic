import * as THREE from 'three';
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, createPortal } from '@react-three/fiber';
import type { SceneObjectType, PhysicsDomain, CustomParameter, GlobalConstant, ProjectDerivedVariable, ParticleDefinition } from './types';
import { transpileExpression, complexMathLib, sanitizeNameForGLSL } from './expressionTranspiler';
import { buildEvaluationScope, buildPhysicsScopeAt, expandMacro, evaluateExpressionWithScope, evaluateWaveMagnitudeSqAt, parseDomainBounds } from './utils';
import type { SpawnSurface } from './injectionSurfaces';
import type { QuantumPoolManager } from './injectionSurfaces';

// Debug/quality toggles
// - USE_DEBUG_CONSTANT_VELOCITY: override analytic velocity with a simple constant (off by default)
// - ENABLE_PARTICLE_DEBUG_LOGS: enable verbose console logging (off by default)
// - PARTICLE_SUBSTEPS: number of Euler substeps per frame to smooth GPU trajectories
// - INTEGRATION_MODE: runtime switch between GPU and CPU particle integrators.
//   The CPU path is kept as a reference implementation for debugging only;
//   in normal use we always run with 'gpu'. To enable the CPU integrator for
//   experiments, temporarily change this constant to 'cpu'.
const USE_DEBUG_CONSTANT_VELOCITY = false;
// Set this to true temporarily when debugging GPU/CPU parity; it
// controls all verbose logs and diagnostic snapshots.
const ENABLE_PARTICLE_DEBUG_LOGS = false;
// When true, runs an extra GPU pass that evaluates the instantaneous
// velocity field into a separate render target for CPU-side comparison.
// This is useful for deep debugging but adds extra GPU work and a
// readback, so keep it disabled in normal runs.
const ENABLE_GPU_VELOCITY_SNAPSHOT = false;
// Base substep count at timeScale = 1e9 ns/s (timeScaleFactor ≈ 1).
// The actual substep count scales linearly with timeScale so that the
// per-substep physical displacement stays constant regardless of sim speed.
// At timeScaleFactor=4 this gives 16 substeps; at timeScaleFactor=15 → 60.
// RK4 needs far fewer substeps than Euler for the same accuracy (O(h^4) vs O(h)).
// BASE=1 at ~60fps means ceil(1 × factor) substeps per frame; at 30fps this would
// be doubled automatically because deltaSeconds is twice as large on slower machines.
// Total GPU evals/s = fps × ceil(BASE × factor) × 4 (4 RK4 stages).
const PARTICLE_SUBSTEPS_BASE = 1;
const INTEGRATION_MODE: 'gpu' | 'cpu' = 'gpu';
// Fixed texture dimension for the particle state. Using a constant avoids
// tearing down and re-creating all GPU resources when maxParticles changes.
// 32×32 = 1024 slots, which comfortably covers the UI max of 1000 particles.
const PARTICLE_TEXTURE_SIZE = 32;
// Fraction of domain diagonal used as the per-step displacement cap.
// Sized relative to the domain so that normal particle motion is never throttled
// regardless of sim speed, while catastrophic blowups near wave nodes are still
// caught (which are orders of magnitude larger than normal steps).
const MAX_GPU_STEP_FRACTION = 0.005; // 0.5% of domain diagonal per substep
const MAX_GPU_STEP_FALLBACK = 0.5;  // nm fallback when domain size is unavailable
// Reusable temp vector to avoid per-frame allocations when computing domain size.
const _particleSizeTmp = new THREE.Vector3();

export type ParticleComputeGPUProps = {
  domainId: string;
  domain: PhysicsDomain;
  allDomains?: PhysicsDomain[]; // NEW: All domains for cross-domain transitions
  maxParticles: number;
  emitterOrigin?: [number, number, number];
  emitterSamples?: [number, number, number][];
  spawnSurfaces?: SpawnSurface[];
  injectionRateSim: number;
  simulationTimeRef: React.MutableRefObject<number>;
  isWaveRunning: boolean;
  domainBounds: THREE.Box3;
  sceneObjects: SceneObjectType[];
  parameters: CustomParameter[];
  globalConstants: GlobalConstant[];
  projectVariables?: ProjectDerivedVariable[];
  particles: ParticleDefinition[];
  timeScale: number;
  timeScaleFactor: number;
  // When true, keep trajectory paths even after particles leave the
  // domain or are killed. When false, trajectories are cleared when
  // particles die so that only active particles have visible tracks.
  persistTrailsOnDeath?: boolean;
  trajectoryMaxLength?: number;
  trajectoryMinDistance?: number;
  onStateTextureReady: (info: {
    texture: THREE.DataTexture;
    textureSize: number;
    trajectories: THREE.Vector3[][];
  }) => void;
  onParticleCountChange?: (domainId: string, activeCount: number, totalInjected: number) => void;
  // Optional callback for detector hits; the integrator will call this
  // whenever a particle in this domain is absorbed by a detector object
  // (i.e., transitions from alive to dead while inside that object's
  // volume). The parent can accumulate hits into a 2D histogram.
  onDetectorHit?: (domainId: string, detectorObjectId: string, uIndex: number, vIndex: number) => void;
  /**
   * Quantum pool manager built by ParticleGPUBridge when any injection
   * surface on this domain uses spawnMode='quantum'. Indexed by
   * spawn-surface index (same order as spawnSurfaces prop).
   */
  quantumPoolRef?: React.MutableRefObject<QuantumPoolManager | null>;
  /**
   * Pending injection counts keyed by crossing-object scene-object id.
   * Upstream domain increments this when a particle dies inside that object;
   * this domain drains it during the spawn loop.
   */
  pendingInjectionsRef?: React.MutableRefObject<Map<string, number>>;
  /**
   * Scene-object ids that act as crossing triggers for downstream domains.
   * When a particle in THIS domain dies inside one of these objects the
   * onDomainCrossing callback is fired.
   */
  crossingObjectIds?: string[];
  /** Fired when a particle dies inside a crossing object. */
  onDomainCrossing?: (crossingObjectId: string) => void;
  /**
   * Maps crossing-object scene-object id → spawn-surface index.
   * Used to route domain-crossing events to the correct quantum surface queue.
   */
  crossingToSurfaceMap?: Map<string, number>;
};

// Helper to split "[vx, vy, vz]" vector expressions so we can
// reuse the same parsing for both GLSL generation and CPU debugging.
const splitVectorExpression = (expr: string): [string, string, string] => {
  const trimmed = (expr || '').trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    return [trimmed || '0.0', '0.0', '0.0'];
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
  while (parts.length < 3) parts.push('0.0');
  return [parts[0], parts[1], parts[2]];
};

/**
 * Generate GPU fragment shader for particle physics updates
 * If allDomains is provided, generates multi-domain shader that switches equations based on position
 */
const generateParticleUpdateShader = (
  particleEquation: any,
  waveEquation: any,
  parameters: CustomParameter[],
  sceneObjects: SceneObjectType[],
  globalConstants: GlobalConstant[],
  projectVariables: ProjectDerivedVariable[] = [],
  allDomains?: PhysicsDomain[],
  currentDomainId?: string
) => {
  if (!particleEquation || !particleEquation.expression) {
    console.warn('[ParticleGPU Shader] No particleEquation.expression found for domain; using pass-through shader.');
    return `
      precision highp float;
      uniform sampler2D u_particles;
      uniform vec2 u_resolution;
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        gl_FragColor = texture2D(u_particles, uv);
      }
    `;
  }

  // Split and transpile velocity components for current domain
  const [vxExpr, vyExpr, vzExpr] = splitVectorExpression(particleEquation.expression);

  const vx = transpileExpression(
    vxExpr,
    particleEquation,
    parameters,
    sceneObjects,
    globalConstants,
    projectVariables
  );

  const vy = transpileExpression(
    vyExpr,
    particleEquation,
    parameters,
    sceneObjects,
    globalConstants,
    projectVariables
  );

  const vz = transpileExpression(
    vzExpr,
    particleEquation,
    parameters,
    sceneObjects,
    globalConstants,
    projectVariables
  );

  // Extract real part if expression is complex (contains I)
  const vxFinal = vx.includes('I') ? `(${vx}).x` : vx;
  const vyFinal = vy.includes('I') ? `(${vy}).x` : vy;
  const vzFinal = vz.includes('I') ? `(${vz}).x` : vz;

  const velocityExprFromEquation = `vec3(${vxFinal}, ${vyFinal}, ${vzFinal})`;
  
  // Generate per-domain velocity GLSL functions for multi-domain setups.
  // Each function encapsulates the domain's derived variables and velocity equation
  // so the shader can switch velocity based on the particle position.
  let domainVelocityFunctions = '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let currentDomainIndex = -1;
  
  if (allDomains && allDomains.length > 1) {
    currentDomainIndex = allDomains.findIndex(d => d.id === currentDomainId);
    
    for (let idx = 0; idx < allDomains.length; idx++) {
      const d = allDomains[idx];
      if (!d.particleEquation || !d.particleEquation.expression) continue;
      
      // Transpile this domain's velocity components
      const [dVxExpr, dVyExpr, dVzExpr] = splitVectorExpression(d.particleEquation.expression);
      const dVx = transpileExpression(dVxExpr, d.particleEquation, parameters, sceneObjects, globalConstants, projectVariables);
      const dVy = transpileExpression(dVyExpr, d.particleEquation, parameters, sceneObjects, globalConstants, projectVariables);
      const dVz = transpileExpression(dVzExpr, d.particleEquation, parameters, sceneObjects, globalConstants, projectVariables);
      const dVxFinal = dVx.includes('I') ? `(${dVx}).x` : dVx;
      const dVyFinal = dVy.includes('I') ? `(${dVy}).x` : dVy;
      const dVzFinal = dVz.includes('I') ? `(${dVz}).x` : dVz;
      
      // Transpile this domain's derived variables (local to the function)
      const domainDerivedVars = [
        ...(d.waveEquation?.derivedVariables || []),
        ...(d.particleEquation.derivedVariables || [])
      ];
      const derivedLines = domainDerivedVars.map((v: any) => {
        const sanitizedName = sanitizeNameForGLSL(v.name);
        const transpiledExpr = transpileExpression(v.expression, d.particleEquation!, parameters, sceneObjects, globalConstants, projectVariables);
        return `  float ${sanitizedName} = ${transpiledExpr};`;
      }).join('\n      ');
      
      // Add float t_param argument and shadow u_time locally so the analytic
      // expressions evaluate the wave at the correct time for each RK4 stage.
      domainVelocityFunctions += `
    vec3 domainVelocity_${idx}(float x, float y, float z, float t_param) {
      float u_time = t_param; // Shadow global uniform for time-parameterised eval
      vec3 current_pos = vec3(x, y, z);
      ${derivedLines}
      return vec3(${dVxFinal}, ${dVyFinal}, ${dVzFinal});
    }
`;
    }
  }

  // TEMP DEBUG: allow forcing a constant, clearly visible velocity field
  const velocityExpr = USE_DEBUG_CONSTANT_VELOCITY
    ? 'vec3(0.0, 0.0, 1.0)'
    : velocityExprFromEquation;

  // Optional debugging; keep quiet in normal runs.
  if (ENABLE_PARTICLE_DEBUG_LOGS) {
    if (USE_DEBUG_CONSTANT_VELOCITY) {
      console.warn('[ParticleGPU Shader] USING DEBUG CONSTANT VELOCITY vec3(0,0,1)');
      console.log('[ParticleGPU Shader] Velocity (raw from equation):', velocityExprFromEquation);
      console.log('[ParticleGPU Shader] vx:', vx);
      console.log('[ParticleGPU Shader] vy:', vy);
      console.log('[ParticleGPU Shader] vz:', vz);
    } else {
      console.log('[ParticleGPU Shader] particleEquation.expression:', particleEquation.expression);
      console.log('[ParticleGPU Shader] GLSL velocity expression:', velocityExprFromEquation);
    }
  }

  // Include derived variables from both wave equation and particle equation
  const allDerivedVars = [
    ...(waveEquation?.derivedVariables || []),
    ...(particleEquation.derivedVariables || [])
  ];
  
  const derivedVariableLines = allDerivedVars.map((v: any) => {
    const sanitizedName = sanitizeNameForGLSL(v.name);
    const transpiledExpr = transpileExpression(v.expression, particleEquation, parameters, sceneObjects, globalConstants, projectVariables);
    return `float ${sanitizedName} = ${transpiledExpr};`;
  }).join('\n    ');

  return `
    precision highp float;
    
    uniform sampler2D u_particles;
    uniform vec2 u_resolution;
    uniform float u_delta_time;
    uniform float u_time;
    uniform float u_particle_mass;
    uniform float u_velocity_scale;
    uniform float u_max_step;
    uniform int u_debug_velocity_only;
    uniform vec3 u_bounds_min;
    uniform vec3 u_bounds_max;
    
    ${allDomains && allDomains.length > 1 ? allDomains.map((d: PhysicsDomain, idx: number) => {
      if (d.id === currentDomainId) return ''; // Skip current domain
      return `uniform vec3 u_domain${idx}_min;
    uniform vec3 u_domain${idx}_max;`;
    }).join('\n    ') : ''}
    
    ${parameters.map(p => `uniform float u_${sanitizeNameForGLSL(p.name)};`).join('\n    ')}
    ${globalConstants.map(c => `uniform float u_${sanitizeNameForGLSL(c.name)};`).join('\n    ')}
    ${projectVariables.map(v => `uniform float u_${sanitizeNameForGLSL(v.name)};`).join('\n    ')}
    ${sceneObjects.filter(obj => obj.name).map(obj => `uniform vec3 u_${sanitizeNameForGLSL(obj.name!)}_position;`).join('\n    ')}
    ${sceneObjects.filter(obj => obj.name).map(obj => `uniform vec3 u_${sanitizeNameForGLSL(obj.name!)}_scale;`).join('\n    ')}
    
    ${complexMathLib}
    
    // Check if a point is inside a box (AABB collision)
    bool pointInBox(vec3 point, vec3 center, vec3 halfSize) {
      vec3 offset = abs(point - center);
      return offset.x <= halfSize.x && offset.y <= halfSize.y && offset.z <= halfSize.z;
    }
    
    ${domainVelocityFunctions}

    // Unified velocity evaluator accepting explicit time for RK4 sub-evaluations.
    // For multi-domain setups delegates to the appropriate domainVelocity_N function;
    // for single-domain setups evaluates the expression inline with shadowed u_time.
    vec3 evalVelocityRaw(float x, float y, float z, float t_param) {
      float u_time = t_param; // Shadow global uniform
      vec3 current_pos = vec3(x, y, z);
      ${allDomains && allDomains.length > 1 && currentDomainIndex >= 0 ? `
      bool resolvedV = false;
      vec3 vr = vec3(0.0);
      ${allDomains.map((_d: PhysicsDomain, idx: number) => {
        if (idx === currentDomainIndex) {
          return `
      if (!resolvedV && x >= u_bounds_min.x && x <= u_bounds_max.x &&
          y >= u_bounds_min.y && y <= u_bounds_max.y &&
          z >= u_bounds_min.z && z <= u_bounds_max.z) {
        vr = domainVelocity_${idx}(x, y, z, t_param); resolvedV = true;
      }`;
        }
        return `
      if (!resolvedV && x >= u_domain${idx}_min.x && x <= u_domain${idx}_max.x &&
          y >= u_domain${idx}_min.y && y <= u_domain${idx}_max.y &&
          z >= u_domain${idx}_min.z && z <= u_domain${idx}_max.z) {
        vr = domainVelocity_${idx}(x, y, z, t_param); resolvedV = true;
      }`;
      }).join('')}
      if (!resolvedV) { vr = domainVelocity_${currentDomainIndex}(x, y, z, t_param); }
      return vr;
      ` : `
      ${derivedVariableLines}
      vec3 vResult = ${velocityExpr};
      if (isnan(vResult.x)||isnan(vResult.y)||isnan(vResult.z)||
          isinf(vResult.x)||isinf(vResult.y)||isinf(vResult.z)) vResult = vec3(0.0);
      return vResult;
      `}
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      vec4 state = texture2D(u_particles, uv);
      
      float x = state.x;
      float y = state.y;
      float z = state.z;
      float lifetime = state.w;
      
      // Current position for velocity evaluation
      vec3 current_pos = vec3(x, y, z);
      
      // Debug mode: snapshot instantaneous raw velocity (no integration).
      if (u_debug_velocity_only == 1) {
        vec3 vsnap = evalVelocityRaw(x, y, z, u_time);
        gl_FragColor = vec4(vsnap, lifetime);
        return;
      }

      // Skip dead particles
      if (lifetime < 0.0) {
        gl_FragColor = state;
        return;
      }

      // --------------- RK4 integration ---------------
      // velocity is in nm/ns (raw), scaled to nm/sim-s by u_velocity_scale.
      // u_time is in physical ns; h_ns advances wave time per step.
      float h_sim = u_delta_time;                   // simulation-seconds per step
      float h_ns  = h_sim * u_velocity_scale;       // physical ns per step (for wave)
      float t0    = u_time;

      vec3 k1 = evalVelocityRaw(x, y, z, t0) * u_velocity_scale;
      if (isnan(k1.x)||isnan(k1.y)||isnan(k1.z)||isinf(k1.x)||isinf(k1.y)||isinf(k1.z)) k1 = vec3(0.0);

      vec3 p2 = vec3(x, y, z) + 0.5 * h_sim * k1;
      vec3 k2 = evalVelocityRaw(p2.x, p2.y, p2.z, t0 + 0.5 * h_ns) * u_velocity_scale;
      if (isnan(k2.x)||isnan(k2.y)||isnan(k2.z)||isinf(k2.x)||isinf(k2.y)||isinf(k2.z)) k2 = k1;

      vec3 p3 = vec3(x, y, z) + 0.5 * h_sim * k2;
      vec3 k3 = evalVelocityRaw(p3.x, p3.y, p3.z, t0 + 0.5 * h_ns) * u_velocity_scale;
      if (isnan(k3.x)||isnan(k3.y)||isnan(k3.z)||isinf(k3.x)||isinf(k3.y)||isinf(k3.z)) k3 = k2;

      vec3 p4 = vec3(x, y, z) + h_sim * k3;
      vec3 k4 = evalVelocityRaw(p4.x, p4.y, p4.z, t0 + h_ns) * u_velocity_scale;
      if (isnan(k4.x)||isnan(k4.y)||isnan(k4.z)||isinf(k4.x)||isinf(k4.y)||isinf(k4.z)) k4 = k3;

      vec3 dpos = (h_sim / 6.0) * (k1 + 2.0*k2 + 2.0*k3 + k4);

      // Cap final displacement to prevent rare node-singularity blowups.
      float dposLen = length(dpos);
      if (dposLen > u_max_step) dpos = dpos * (u_max_step / dposLen);

      x += dpos.x;
      y += dpos.y;
      z += dpos.z;
      
      // Collision detection: check transparent objects first.
      // If the particle is inside ANY transparent object (e.g. a slit),
      // it is allowed through even if it also overlaps an opaque object
      // (e.g. the screen the slit is cut into).
      vec3 newPos = vec3(x, y, z);
      bool inTransparentObject = false;
      ${sceneObjects.filter(obj => obj.name && obj.physicsTransparent).map(obj => {
        const name = sanitizeNameForGLSL(obj.name!);
        return `
      if (pointInBox(newPos, u_${name}_position, u_${name}_scale * 0.5)) {
        inTransparentObject = true;
      }`;
      }).join('')}
      
      if (!inTransparentObject) {
        ${sceneObjects.filter(obj => obj.name && !obj.physicsTransparent && obj.type !== 'axes' && obj.type !== 'sphere').map(obj => {
          const name = sanitizeNameForGLSL(obj.name!);
          return `
        if (pointInBox(newPos, u_${name}_position, u_${name}_scale * 0.5)) {
          lifetime = -1.0; // Kill particle on collision with opaque object
        }`;
        }).join('')}
      }
      
      // Kill particles outside bounds (with multi-domain support)
      bool inCurrentDomain = (
        x >= u_bounds_min.x && x <= u_bounds_max.x &&
        y >= u_bounds_min.y && y <= u_bounds_max.y &&
        z >= u_bounds_min.z && z <= u_bounds_max.z
      );
      
      if (!inCurrentDomain) {
        // Check if particle is in ANY domain before killing
        bool inAnyDomain = false;
        ${allDomains && allDomains.length > 1 ? allDomains.map((d: PhysicsDomain, idx: number) => {
          if (d.id === currentDomainId) return ''; // Skip current domain
          return `
        // Check domain: ${d.name}
        if (!inAnyDomain) {
          bool inDomain${idx} = (
            x >= u_domain${idx}_min.x && x <= u_domain${idx}_max.x &&
            y >= u_domain${idx}_min.y && y <= u_domain${idx}_max.y &&
            z >= u_domain${idx}_min.z && z <= u_domain${idx}_max.z
          );
          if (inDomain${idx}) {
            inAnyDomain = true;
          }
        }`;
        }).join('') : ''}
        
        if (!inAnyDomain) {
          lifetime = -1.0; // Kill only if outside ALL domains
        }
      }
      
      if (lifetime >= 0.0) {
        lifetime += u_delta_time;
      }
      
      gl_FragColor = vec4(x, y, z, lifetime);
    }
  `;
};

export const ParticleComputeGPU: React.FC<ParticleComputeGPUProps> = ({
  domainId,
  domain,
  allDomains,
  maxParticles,
  emitterSamples,
  spawnSurfaces,
  injectionRateSim,
  simulationTimeRef,
  isWaveRunning,
  domainBounds,
  sceneObjects,
  parameters,
  globalConstants,
  projectVariables,
  particles,
  timeScale,
  timeScaleFactor,
  trajectoryMaxLength = 1000,
  trajectoryMinDistance = 0.02,
  persistTrailsOnDeath = false,
  onStateTextureReady,
  onParticleCountChange,
  onDetectorHit,
  quantumPoolRef,
  pendingInjectionsRef,
  crossingObjectIds,
  onDomainCrossing,
  crossingToSurfaceMap,
}) => {
  const particleEquation = domain.particleEquation;

  // Static scope for evaluating project-level derived variables (k, omega, etc.)
  const staticScope = useMemo(() => {
    return buildEvaluationScope(sceneObjects, globalConstants);
  }, [sceneObjects, globalConstants]);

  // Fixed texture size: does NOT depend on maxParticles so the GPU resources
  // (texture, render targets, trajectory buffers) are never torn down when the
  // user changes the max-particles slider.
  const textureSize = PARTICLE_TEXTURE_SIZE;

  // CPU-side texture for reading back trajectories
  const texture = useMemo(() => {
    const size = textureSize;
    const texelCount = size * size;
    const data = new Float32Array(texelCount * 4);
    for (let i = 0; i < texelCount; i++) {
      data[i * 4 + 3] = -1; // all dead initially
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    tex.needsUpdate = true;
    return tex;
  }, [textureSize]);

  // Trajectory storage
  const trajectoriesRef = useRef<THREE.Vector3[][]>([]);
  const nextParticleIndexRef = useRef(0);
  // Track which particles were alive in the previous physics step so we
  // can detect transitions from alive -> dead (used for detector hits).
  const prevAliveRef = useRef<Uint8Array | null>(null);
  // Becomes true once the first upstream crossing event fires, enabling
  // rate-based spawning in quantum crossing-triggered domains.
  const crossingActivatedRef = useRef(false);
  
  useLayoutEffect(() => {
    trajectoriesRef.current = Array.from({ length: textureSize * textureSize }, () => []);
    // Reset total injected count when re-initializing (e.g., on Reset or waveVersion change)
    totalInjectedRef.current = 0;
    crossingActivatedRef.current = false;
    prevAliveRef.current = new Uint8Array(textureSize * textureSize);
    // Force render-target re-seed on next physics frame so ghost particles
    // at (0,0,0) don't reappear after a reset.
    rtInitializedRef.current = false;
  }, [textureSize]);

  useLayoutEffect(() => {
    onStateTextureReady({ texture, textureSize, trajectories: trajectoriesRef.current });
  }, [texture, textureSize, onStateTextureReady]);

  // GPU render targets (ping-pong)
  const renderTargets = useMemo(() => {
    const createRT = () => new THREE.WebGLRenderTarget(textureSize, textureSize, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
    return [createRT(), createRT()];
  }, [textureSize]);

  // Separate render target for optional GPU velocity snapshot diagnostics
  const velocityTarget = useMemo(() => {
    return new THREE.WebGLRenderTarget(textureSize, textureSize, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });
  }, [textureSize]);

  const pingPongIndex = useRef(0);
  const isInitialized = useRef(false);
  const totalInjectedRef = useRef(0);

  // Initialize GPU render targets with CPU texture data
  useLayoutEffect(() => {
    if (!isInitialized.current && texture && renderTargets[0] && renderTargets[1]) {
      // Simply mark as initialized - particles will be spawned via CPU and uploaded each frame
      isInitialized.current = true;
    }
  }, [texture, renderTargets]);

  // GPU shader material
  const waveEquation = domain.waveEquation;
  
  // Create stable key for allDomains to prevent shader rebuilds
  const allDomainsKey = useMemo(() => {
    if (!allDomains || allDomains.length <= 1) return 'single';
    return allDomains.map(d => `${d.id}_${d.particleEquation?.expression || ''}_${d.waveEquation?.expression || ''}`).sort().join('|');
  }, [allDomains]);
  
  // Compute other domain bounds once  
  const otherDomainBounds = useMemo(() => {
    if (!allDomains || allDomains.length <= 1) return [];
    const result = [];
    for (let idx = 0; idx < allDomains.length; idx++) {
      const d = allDomains[idx];
      if (d.id !== domainId) {
        result.push({
          idx,
          domain: d,  // Keep reference to full domain for velocity evaluation
          name: d.name,
          bounds: parseDomainBounds(d, sceneObjects, null, globalConstants, particles || [])
        });
      }
    }
    return result;
  }, [allDomainsKey]); // Only recompute when domain equations change
  
  const gpuMaterial = useMemo(() => {
    const shader = generateParticleUpdateShader(
      particleEquation,
      waveEquation,
      parameters,
      sceneObjects,
      globalConstants,
      projectVariables || [],
      allDomains,
      domainId
    );

    const bounds = domainBounds;
    const baseUniforms: Record<string, any> = {
      u_particles: { value: null },
      u_resolution: { value: new THREE.Vector2(textureSize, textureSize) },
      u_delta_time: { value: 0 },
      u_time: { value: 0 },
      u_particle_mass: { value: 0 },
      u_velocity_scale: { value: 1 },
      u_max_step: { value: MAX_GPU_STEP_FALLBACK },
      u_debug_velocity_only: { value: 0 },
      u_bounds_min: { value: bounds.min },
      u_bounds_max: { value: bounds.max },
    };
    
    // Add other domain bounds if multi-domain
    otherDomainBounds.forEach((other: any) => {
      if (other) {
        baseUniforms[`u_domain${other.idx}_min`] = { value: other.bounds.min };
        baseUniforms[`u_domain${other.idx}_max`] = { value: other.bounds.max };
      }
    });
    
    return new THREE.ShaderMaterial({
      uniforms: {
        ...baseUniforms,
        ...Object.fromEntries(parameters.map(p => [`u_${sanitizeNameForGLSL(p.name)}`, { value: p.value }])),
        ...Object.fromEntries(globalConstants.map(c => [`u_${sanitizeNameForGLSL(c.name)}`, { value: c.value }])),
        ...Object.fromEntries((projectVariables || []).map(v => [`u_${sanitizeNameForGLSL(v.name)}`, { value: 0 }])),
        ...Object.fromEntries(sceneObjects.filter(obj => obj.name).map(obj => [`u_${sanitizeNameForGLSL(obj.name!)}_position`, { value: new THREE.Vector3(...obj.position) }])),
        ...Object.fromEntries(sceneObjects.filter(obj => obj.name).map(obj => [`u_${sanitizeNameForGLSL(obj.name!)}_scale`, { value: new THREE.Vector3(...obj.scale) }])),
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: shader,
    });
  }, [particleEquation, waveEquation, parameters, textureSize, domainBounds.min, domainBounds.max, domainId, allDomainsKey]);
  // Note: Using domainBounds.min/.max instead of domainBounds to avoid reference changes
  // Note: otherDomainBounds, sceneObjects, globalConstants, projectVariables, particles used in closure

  // Compute scene
  const computeScene = useMemo(() => {
    const scene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), gpuMaterial);
    scene.add(quad);
    return scene;
  }, [gpuMaterial]);

  // Simple copy (blit) material & scene to upload CPU texture to a render target
  const copyMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_particles: { value: null },
        u_resolution: { value: new THREE.Vector2(textureSize, textureSize) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D u_particles;
        uniform vec2 u_resolution;
        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution;
          gl_FragColor = texture2D(u_particles, uv);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });
  }, [textureSize]);

  const copyScene = useMemo(() => {
    const scene = new THREE.Scene();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), copyMaterial);
    scene.add(quad);
    return scene;
  }, [copyMaterial]);

  const computeCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  const injectionAccumulatorRef = useRef(1.0); // Start at 1 so first particle spawns immediately
  const lastUpdateTime = useRef(performance.now());
  const lastSimTimeAtUpdate = useRef<number | null>(null);
  const lastLogTime = useRef(performance.now());
  const updateCounter = useRef(0);
  const totalFrames = useRef(0);
  const lastParticlePos = useRef<THREE.Vector3 | null>(null);
  const lastParticleSampleSimTime = useRef<number | null>(null);
  const spawnedThisFrameRef = useRef(false);
  const didLogInitRef = useRef(false);
  // Tracks whether the GPU render targets have been seeded with the
  // all-dead CPU texture. Without this, the zero-initialised WebGL
  // textures look like a live particle at (0,0,0) on the very first frame.
  const rtInitializedRef = useRef(false);

  useFrame((state, delta) => {
    if (!gpuMaterial) return;

    // When the wave is paused, we still want particle positions and
    // trajectories to remain visible and stable, but we should not
    // advance the physics state. Skip the update work in that case.
    if (!isWaveRunning) {
      return;
    }

    // Debug: Log once when the GPU loop actually starts running
    if (ENABLE_PARTICLE_DEBUG_LOGS && !didLogInitRef.current) {
      console.log(`[GPU Init] useFrame started, isWaveRunning=${isWaveRunning}, gpuMaterial=${!!gpuMaterial}`);
      didLogInitRef.current = true;
    }

    // Run every render frame to maximise trajectory point density.
    // (Previously throttled to 30 UPS, but that caused sparse trajectory
    // points and visible kinks at high sim speeds.  Total GPU work per
    // second is unchanged because deltaSeconds is proportionally smaller
    // each call, so the substep count stays the same on average.)
    const now = performance.now();
    const msSinceLast = now - lastUpdateTime.current;
    if (msSinceLast < 4) return; // still skip frames closer than ~240fps to avoid zero-delta
    lastUpdateTime.current = now;

    const startTime = performance.now();
    updateCounter.current++;
    totalFrames.current++;

    const simTime = simulationTimeRef.current;

    // Use the change in simulation time since the last physics update as the
    // effective integration step. This keeps GPU/CPU particle dynamics in
    // sync with the wave's notion of time even though we throttle the
    // physics loop to a lower UPS than the render loop.
    const prevSimTime = lastSimTimeAtUpdate.current ?? simTime;
    let deltaSeconds = simTime - prevSimTime;
    if (!(deltaSeconds > 0)) {
      // Fallback to the frame delta if simulation time did not advance or
      // went backwards (e.g., on reset).
      deltaSeconds = delta;
    }
    lastSimTimeAtUpdate.current = simTime;

    const physicalTimeNs = simTime * timeScale;
    const physicalDeltaNs = deltaSeconds * timeScale;

    // Scale particle velocities using the same global timeScale used for the wave.
    // This makes velocities expressed in "per physical ns" behave consistently
    // when integrated over simulation seconds.
    const velocityScale = USE_DEBUG_CONSTANT_VELOCITY ? 1.0 : timeScale;

    // Debug: Log delta time occasionally
    if (ENABLE_PARTICLE_DEBUG_LOGS && updateCounter.current % 30 === 0) {
      console.log(
        `[GPU Update] delta=${deltaSeconds.toFixed(6)}s, timeScale=${timeScale}, ` +
          `physicalDeltaNs=${physicalDeltaNs.toFixed(3)}ns, velocityScale=${velocityScale}`
      );
    }

    // Update uniforms (including bounds which may change)
    // u_delta_time is now in simulation seconds; u_time remains in physical ns
    gpuMaterial.uniforms.u_delta_time.value = deltaSeconds;
    gpuMaterial.uniforms.u_time.value = physicalTimeNs;
    gpuMaterial.uniforms.u_velocity_scale.value = velocityScale;
    gpuMaterial.uniforms.u_bounds_min.value.copy(domainBounds.min);
    gpuMaterial.uniforms.u_bounds_max.value.copy(domainBounds.max);
    // Dynamic max-step: scale with domain size so particles aren't throttled
    // at high sim speeds while node-singularity blowups are still capped.
    const _domainDiag = domainBounds.getSize(_particleSizeTmp).length();
    gpuMaterial.uniforms.u_max_step.value = _domainDiag > 0
      ? _domainDiag * MAX_GPU_STEP_FRACTION
      : MAX_GPU_STEP_FALLBACK;

    if (particles && particles.length > 0) {
      const particle = particles.find(p => p.id === (domain.selectedParticleId || particles[0].id));
      if (particle) {
        const mass = (particle as any).mass ?? (particle as any).massKg;
        if (mass !== undefined) gpuMaterial.uniforms.u_particle_mass.value = mass;
      }
    }

    for (const param of parameters) {
      const uniformName = `u_${sanitizeNameForGLSL(param.name)}`;
      if (gpuMaterial.uniforms[uniformName]) {
        gpuMaterial.uniforms[uniformName].value = param.value;
      }
    }

    // Update project-level derived variable uniforms (e.g., k, omega) each frame,
    // using the same mechanism as WaveCompute so that particle velocities see
    // the correct values instead of the default 0.0.
    if (projectVariables && projectVariables.length > 0) {
      const currentTimeNs = simTime * timeScale;
      const paramsScope: Record<string, any> = {};
      for (let i = 0; i < parameters.length; i++) {
        paramsScope[parameters[i].name] = parameters[i].value;
      }
      const scope: Record<string, any> = { ...staticScope, ...paramsScope, t: currentTimeNs };
      if (gpuMaterial.uniforms['u_particle_mass']) {
        scope['mass'] = gpuMaterial.uniforms['u_particle_mass'].value;
      }

      for (const pv of projectVariables) {
        const uName = `u_${sanitizeNameForGLSL(pv.name)}`;
        const uniform = gpuMaterial.uniforms[uName];
        if (!uniform) continue;
        const val = evaluateExpressionWithScope(pv.expression, scope);
        uniform.value = val !== null ? val : 0.0;
        if (val !== null) {
          scope[pv.name] = val;
        }
      }
    }

    for (const obj of sceneObjects.filter(o => o.name)) {
      const uniformName = `u_${sanitizeNameForGLSL(obj.name!)}_position`;
      if (gpuMaterial.uniforms[uniformName]) {
        gpuMaterial.uniforms[uniformName].value.set(...obj.position);
      }
    }

    // Declare data early so it can be used throughout the function
    const data = (texture.image as any).data as Float32Array;

    // Optional GPU velocity snapshot pass for diagnostics. This renders the
    // instantaneous velocity field into a separate render target without
    // modifying the main particle state, and compares it to the CPU analytic
    // velocity at the same approximate position/time.
    if (ENABLE_GPU_VELOCITY_SNAPSHOT && INTEGRATION_MODE === 'gpu') {
      gpuMaterial.uniforms.u_debug_velocity_only.value = 1;
      gpuMaterial.uniforms.u_delta_time.value = deltaSeconds;
      gpuMaterial.uniforms.u_particles.value = renderTargets[pingPongIndex.current].texture;

      state.gl.setRenderTarget(velocityTarget);
      state.gl.render(computeScene, computeCamera);
      state.gl.setRenderTarget(null);

      gpuMaterial.uniforms.u_debug_velocity_only.value = 0;

      if (ENABLE_PARTICLE_DEBUG_LOGS) {
        const velBuf = new Float32Array(4);
        state.gl.readRenderTargetPixels(velocityTarget, 0, 0, 1, 1, velBuf);
        // GPU snapshot now holds the *raw* analytic velocity in distance/ns.
        const vgxRaw = velBuf[0];
        const vgyRaw = velBuf[1];
        const vgzRaw = velBuf[2];

        // Approximate matching CPU analytic velocity at the same position/time
        let vcx: number | null = null;
        let vcy: number | null = null;
        let vcz: number | null = null;

        if (particleEquation && particleEquation.expression && data) {
          const base = 0; // first texel
          const px = data[base];
          const py = data[base + 1];
          const pz = data[base + 2];

          try {
            const [vxExpr, vyExpr, vzExpr] = splitVectorExpression(particleEquation.expression as string);
            const waveEqForCPU = domain.waveEquation;
            const { scope, numParticles } = buildPhysicsScopeAt(
              domain,
              waveEqForCPU,
              staticScope,
              parameters,
              projectVariables,
              particles,
              { x: px, y: py, z: pz },
              simTime,
              timeScale,
            );

            const evalComponent = (expr: string | undefined): number | null => {
              const trimmed = (expr || '').trim();
              if (!trimmed) return 0.0;
              const expanded = expandMacro(trimmed, numParticles);
              const raw = evaluateExpressionWithScope(expanded, scope, true as any);
              if (raw == null) return null;
              if (typeof raw === 'number') return isFinite(raw) ? raw : null;
              if (typeof raw === 'object' && (raw as any).isComplex) {
                const re = (raw as any).re;
                return typeof re === 'number' && isFinite(re) ? re : null;
              }
              return null;
            };

            vcx = evalComponent(vxExpr);
            vcy = evalComponent(vyExpr);
            vcz = evalComponent(vzExpr);
          } catch (err) {
            console.warn('[Velocity Snapshot] CPU velocity evaluation failed:', err);
          }
        }

        const scale = timeScale;
        const vcxScaled = vcx == null ? null : vcx * scale;
        const vcyScaled = vcy == null ? null : vcy * scale;
        const vczScaled = vcz == null ? null : vcz * scale;

        // Optional: wave intensity at this snapshot sample
        let psiMag2: number | null = null;
        if (domain.waveEquation) {
          psiMag2 = evaluateWaveMagnitudeSqAt(
            domain,
            domain.waveEquation,
            staticScope,
            parameters,
            projectVariables,
            particles,
            { x: data[0], y: data[1], z: data[2] },
            simTime,
            timeScale,
            false,
          );
        }

        // Compute error metrics between instantaneous GPU and CPU velocities.
        // We compare *raw* velocities here (distance/ns) so that any
        // discrepancy is purely due to the analytic expression, not
        // the external timeScale used for integration.
        let snapshotErrAbs = 0;
        let snapshotErrRel = 0;
        const hasCpuSnapshot =
          vcxScaled != null && vcyScaled != null && vczScaled != null;

        if (hasCpuSnapshot) {
          const dx = vgxRaw - (vcx as number);
          const dy = vgyRaw - (vcy as number);
          const dz = vgzRaw - (vcz as number);
          const cpuNorm = Math.sqrt(
            (vcx as number) * (vcx as number) +
              (vcy as number) * (vcy as number) +
              (vcz as number) * (vcz as number),
          );
          const diffNorm = Math.sqrt(dx * dx + dy * dy + dz * dz);
          snapshotErrAbs = diffNorm;
          snapshotErrRel = cpuNorm > 1e-6 ? diffNorm / cpuNorm : 0;
        }

        // Only log "interesting" mismatches to keep spam down in steady
        // state, but during early frames we always log so we can see the
        // absolute GPU/CPU values even when they match closely.
        const SNAPSHOT_ABS_THRESHOLD = 0.25; // absolute speed units
        const SNAPSHOT_REL_THRESHOLD = 0.01; // 1% relative error

        const alwaysLogEarly = totalFrames.current < 50;

        if (
          alwaysLogEarly ||
          !hasCpuSnapshot ||
          snapshotErrAbs > SNAPSHOT_ABS_THRESHOLD ||
          snapshotErrRel > SNAPSHOT_REL_THRESHOLD
        ) {
          console.log(
            `[Velocity Snapshot] pos=(${data[0].toFixed(4)}, ${data[1].toFixed(4)}, ${data[2].toFixed(4)}), ` +
              `|psi|^2=${psiMag2 === null ? 'null' : psiMag2.toExponential(4)}, ` +
              `v_gpu_raw_per_ns=(${vgxRaw.toExponential(4)}, ${vgyRaw.toExponential(4)}, ${vgzRaw.toExponential(4)})` +
              ` v_cpu_raw_per_ns=(${vcx === null ? 'null' : vcx.toExponential(4)}, ` +
              `${vcy === null ? 'null' : vcy.toExponential(4)}, ` +
              `${vcz === null ? 'null' : vcz.toExponential(4)})` +
              ` v_cpu_scaled_per_s=(${vcxScaled === null ? 'null' : vcxScaled.toExponential(4)}, ` +
              `${vcyScaled === null ? 'null' : vcyScaled.toExponential(4)}, ` +
              `${vczScaled === null ? 'null' : vczScaled.toExponential(4)})` +
              (hasCpuSnapshot
                ? ` err_abs=${snapshotErrAbs.toExponential(4)}, err_rel=${snapshotErrRel.toExponential(4)}`
                : ' (CPU snapshot unavailable)'),
          );
        }
      }
    }

    // --- Integration step ---
    // Either integrate on the GPU via the fragment shader (default) or on the
    // CPU using the same analytic velocity expression. In both cases, the
    // authoritative state for rendering/trajectories ends up in `data`.
    let activeParticles = 0;

    if (INTEGRATION_MODE === 'gpu') {
      // Ping-pong GPU update with optional substepping for smoother trajectories
      let readIndex = pingPongIndex.current;
      let writeIndex = 1 - readIndex;
      
      // Upload CPU particle state to GPU read buffer
      // This ensures CPU-spawned particles from the previous frame are visible to the GPU shader
      if (data) {
        // On the very first physics frame, seed BOTH render targets with the
        // all-dead CPU texture so no ghost particle appears at (0,0,0).
        if (!rtInitializedRef.current && copyMaterial && copyScene) {
          texture.needsUpdate = true;
          copyMaterial.uniforms.u_particles.value = texture;
          (copyMaterial.uniforms.u_resolution.value as THREE.Vector2).set(textureSize, textureSize);
          for (const rt of renderTargets) {
            state.gl.setRenderTarget(rt);
            state.gl.render(copyScene, computeCamera);
          }
          state.gl.setRenderTarget(null);
          rtInitializedRef.current = true;
        }

        // If particles were spawned last frame, upload the CPU texture to GPU first
        if (spawnedThisFrameRef.current) {
          if (ENABLE_PARTICLE_DEBUG_LOGS) {
            console.log('[Upload] Blitting CPU texture to GPU render target', readIndex);
          }

          // Mark DataTexture as updated so WebGL uploads the latest CPU-side Float32Array
          texture.needsUpdate = true;

          if (copyMaterial && copyScene) {
            // Bind CPU DataTexture as source
            copyMaterial.uniforms.u_particles.value = texture;
            (copyMaterial.uniforms.u_resolution.value as THREE.Vector2).set(textureSize, textureSize);

            // Render a full-screen quad that just copies u_particles into the render target
            state.gl.setRenderTarget(renderTargets[readIndex]);
            state.gl.render(copyScene, computeCamera);
            state.gl.setRenderTarget(null);

            if (ENABLE_PARTICLE_DEBUG_LOGS) {
              console.log('[Upload] CPU data blitted into GPU read buffer');
            }
          } else {
            console.warn('[Upload] copyMaterial or copyScene not ready; skipping upload');
          }
        }
        
        // Perform one or more Euler integration substeps this frame.
        // Scale substep count with timeScaleFactor (the user speed multiplier) so
        // the per-substep physical displacement is constant at all sim speeds.
        // timeScaleFactor is model-independent: timeScaleBase already normalises
        // for each model's wave speed, so only the user speedup matters here.
        const steps = Math.max(PARTICLE_SUBSTEPS_BASE, Math.ceil(PARTICLE_SUBSTEPS_BASE * timeScaleFactor));
        const stepDt = deltaSeconds / steps;

        const stepPhysicalNs = stepDt * timeScale; // physical ns advanced per substep
        for (let s = 0; s < steps; s++) {
          // Advance u_time each substep so the velocity field reflects the wave
          // at the correct time for that sub-interval. Without this, all substeps
          // use a stale wave snapshot from the start of the frame, causing
          // trajectory kinks at high sim speeds.
          gpuMaterial.uniforms.u_time.value = physicalTimeNs + s * stepPhysicalNs;
          gpuMaterial.uniforms.u_delta_time.value = stepDt;
          gpuMaterial.uniforms.u_particles.value = renderTargets[readIndex].texture;

          state.gl.setRenderTarget(renderTargets[writeIndex]);
          state.gl.render(computeScene, computeCamera);
          state.gl.setRenderTarget(null);

          // Swap buffers for next substep
          const tmp = readIndex;
          readIndex = writeIndex;
          writeIndex = tmp;
        }

        // After substepping, the latest state is in renderTargets[readIndex]
        pingPongIndex.current = readIndex;
      } else {
        // Fallback when no data
        gpuMaterial.uniforms.u_delta_time.value = deltaSeconds;
        gpuMaterial.uniforms.u_particles.value = renderTargets[readIndex].texture;
        state.gl.setRenderTarget(renderTargets[writeIndex]);
        state.gl.render(computeScene, computeCamera);
        state.gl.setRenderTarget(null);
        pingPongIndex.current = writeIndex;
      }

      // Read back GPU results for trajectories (BEFORE spawning new particles)
      if (data) {
        state.gl.readRenderTargetPixels(renderTargets[pingPongIndex.current], 0, 0, textureSize, textureSize, data);
        // Mark the DataTexture as updated so the visual particle markers
        // (which sample from this texture) follow the latest GPU-integrated
        // positions every physics step, not only when new particles spawn.
        texture.needsUpdate = true;
      }
    } else if (INTEGRATION_MODE === 'cpu' && data && particleEquation && particleEquation.expression) {
      // Pure CPU integration using the analytic velocity expression. This
      // bypasses the GPU physics shader and updates `data` directly. We
      // mirror the GPU integrator: same substeps and the same per-step
      // displacement clamp based on MAX_GPU_STEP.
      const [vxExpr, vyExpr, vzExpr] = splitVectorExpression(particleEquation.expression as string);
      const waveEquationForCPU = domain.waveEquation;

      const steps = Math.max(PARTICLE_SUBSTEPS_BASE, Math.ceil(PARTICLE_SUBSTEPS_BASE * timeScaleFactor));
      const stepDt = deltaSeconds / steps;

      for (let i = 0; i < textureSize * textureSize; i++) {
        const base = i * 4;
        let lifetime = data[base + 3];
        if (lifetime < 0) continue;

        let x = data[base];
        let y = data[base + 1];
        let z = data[base + 2];

        const evalComponent = (
          expr: string | undefined,
          scope: Record<string, any>,
          numParticles: number,
        ): number => {
          const trimmed = (expr || '').trim();
          if (!trimmed) return 0.0;
          const expanded = expandMacro(trimmed, numParticles);
          const raw = evaluateExpressionWithScope(expanded, scope, true as any);
          if (raw == null) return 0.0;
          if (typeof raw === 'number') return isFinite(raw) ? raw : 0.0;
          if (typeof raw === 'object' && (raw as any).isComplex) {
            const re = (raw as any).re;
            return typeof re === 'number' && isFinite(re) ? re : 0.0;
          }
          return 0.0;
        };

        // Perform the same number of Euler substeps as the GPU, using the
        // same time step and the same max-step clamp based on the *scaled*
        // velocity (distance/s) and stepDt (simulation seconds).
        for (let s = 0; s < steps; s++) {
          if (lifetime < 0) break;

          // Advance time each substep to match the GPU fix: velocity field
          // reflects the correct wave configuration for each sub-interval.
          const substepSimTime = simTime + s * stepDt;

          const { scope, numParticles } = buildPhysicsScopeAt(
            domain,
            waveEquationForCPU,
            staticScope,
            parameters,
            projectVariables,
            particles,
            { x, y, z },
            substepSimTime,
            timeScale,
          );

          const vx = evalComponent(vxExpr, scope, numParticles);
          const vy = evalComponent(vyExpr, scope, numParticles);
          const vz = evalComponent(vzExpr, scope, numParticles);

          // Convert from distance/ns to distance/s.
          let vxScaled = vx * timeScale;
          let vyScaled = vy * timeScale;
          let vzScaled = vz * timeScale;

          // Apply the same displacement clamp as the GPU shader.
          const _cpuDomainDiag = domainBounds.getSize(_particleSizeTmp).length();
          const _cpuMaxStep = _cpuDomainDiag > 0
            ? _cpuDomainDiag * MAX_GPU_STEP_FRACTION
            : MAX_GPU_STEP_FALLBACK;
          let stepLen = Math.sqrt(
            vxScaled * vxScaled +
              vyScaled * vyScaled +
              vzScaled * vzScaled,
          ) * stepDt;
          if (stepLen > _cpuMaxStep) {
            const safeScale = _cpuMaxStep / Math.max(stepLen, 1e-6);
            vxScaled *= safeScale;
            vyScaled *= safeScale;
            vzScaled *= safeScale;
            stepLen = _cpuMaxStep;
          }

          x += vxScaled * stepDt;
          y += vyScaled * stepDt;
          z += vzScaled * stepDt;
          lifetime += stepDt;

          // Bounds and lifetime handling mirrors the GPU shader.
          if (
            x < domainBounds.min.x || x > domainBounds.max.x ||
            y < domainBounds.min.y || y > domainBounds.max.y ||
            z < domainBounds.min.z || z > domainBounds.max.z
          ) {
            lifetime = -1.0;
            break;
          }
        }

        data[base] = x;
        data[base + 1] = y;
        data[base + 2] = z;
        data[base + 3] = lifetime;
      }

      // Mark DataTexture as updated so DomainParticlesGPU sees latest CPU state
      texture.needsUpdate = true;
    }

    // At this point, `data` holds the latest particle state for either
    // integration mode. First, fire detector hit callbacks for any
    // particles that have just transitioned from alive -> dead while
    // inside a detector object; then update trajectories and diagnostics.
    if (data) {

      const prevAlive = prevAliveRef.current;

      // --- Detector hit detection (CPU side) ---
      // We approximate a "hit" as a particle that was alive on the
      // previous physics step, is now dead (lifetime < 0), and whose
      // final position lies inside a detector object's volume. We then
      // project that position onto the configured detector face to pick
      // a (u,v) bin and notify the parent via onDetectorHit.
      if (prevAlive && onDetectorHit) {
        const detectors = sceneObjects.filter(o => o.detector && o.detector.enabled);

        if (detectors.length > 0) {
          const totalSlots = textureSize * textureSize;

          for (let i = 0; i < totalSlots; i++) {
            const base = i * 4;
            const lifetime = data[base + 3];
            const wasAlive = prevAlive[i] === 1;
            const isAlive = lifetime >= 0;

            // Particle just died this step: check for detector intersection
            if (wasAlive && !isAlive) {
              const px = data[base];
              const py = data[base + 1];
              const pz = data[base + 2];

              // --- Domain-crossing event detection ---
              if (crossingObjectIds && crossingObjectIds.length > 0 && onDomainCrossing) {
                for (const coId of crossingObjectIds) {
                  const co = sceneObjects.find(o => o.id === coId);
                  if (!co) continue;
                  const [cx2, cy2, cz2] = co.position;
                  const [sx2, sy2, sz2] = co.scale;
                  const hx = sx2 * 0.5, hy = sy2 * 0.5, hz = sz2 * 0.5;
                  // Full AABB check
                  if (
                    Math.abs(px - cx2) > hx ||
                    Math.abs(py - cy2) > hy ||
                    Math.abs(pz - cz2) > hz
                  ) continue;

                  // For crossing-triggered surfaces, only fire when the particle
                  // has reached the exit-face half of the slit/screen box.
                  // `face` on the injection surface is the exit face — the side
                  // particles emerge into the downstream domain.
                  const injSurfaces = domain.injectionSurfaces ?? [];
                  const matchingSurf = injSurfaces.find(s => s.sourceObjectId === coId);
                  if (matchingSurf?.linkedFromDomainIds?.length) {
                    const exitFace = matchingSurf.face ?? 'front';
                    let passed = false;
                    switch (exitFace) {
                      case 'front':  passed = pz >= cz2; break;
                      case 'back':   passed = pz <= cz2; break;
                      case 'left':   passed = px <= cx2; break;
                      case 'right':  passed = px >= cx2; break;
                      case 'top':    passed = py >= cy2; break;
                      case 'bottom': passed = py <= cy2; break;
                    }
                    if (!passed) continue;
                  }

                  onDomainCrossing(coId);
                  break; // one crossing event per particle death
                }
              }

              for (const det of detectors) {
                const cfg = det.detector!;
                const [cx, cy, cz] = det.position;
                const [sx, sy, sz] = det.scale;
                const halfX = sx * 0.5;
                const halfY = sy * 0.5;
                const halfZ = sz * 0.5;

                // Quick AABB check: only consider particles inside the box
                if (Math.abs(px - cx) > halfX || Math.abs(py - cy) > halfY || Math.abs(pz - cz) > halfZ) {
                  continue;
                }

                const minX = cx - halfX;
                const minY = cy - halfY;
                const minZ = cz - halfZ;

                let u = 0;
                let v = 0;
                let valid = true;

                switch (cfg.face) {
                  case 'front': // -Z face: rotation.y=π flips local X → world -X, so UV.u=0 is at world maxX. Flip u.
                    u = 1 - (px - minX) / sx;
                    v = (py - minY) / sy;
                    break;
                  case 'back':  // +Z face: use X/Y. Plane has no rotation; UV.u=0 at world minX.
                    u = (px - minX) / sx;
                    v = (py - minY) / sy;
                    break;
                  case 'left':  // -X face: rotation.y=-π/2 → local +X = world +Z. UV.u=0 at world minZ. No flip.
                    u = (pz - minZ) / sz;
                    v = (py - minY) / sy;
                    break;
                  case 'right': // +X face: rotation.y=+π/2 → local +X = world -Z. UV.u=0 at world maxZ. Flip u.
                    u = 1 - (pz - minZ) / sz;
                    v = (py - minY) / sy;
                    break;
                  case 'top':   // +Y face: rotation.x=-π/2 → UV.u=0 at world minX, UV.v=0 at world minZ. No flip.
                    u = (px - minX) / sx;
                    v = (pz - minZ) / sz;
                    break;
                  case 'bottom': // -Y face: rotation.x=+π/2 → UV.u=0 at world minX, UV.v=0 at world minZ. No flip.
                    u = (px - minX) / sx;
                    v = (pz - minZ) / sz;
                    break;
                  default:
                    valid = false;
                    break;
                }

                if (!valid) continue;
                // Use > 1 (not >= 1) so that hits exactly on the maximum edge
                // are included; the Math.min clamp below handles them correctly.
                if (u < 0 || u > 1 || v < 0 || v > 1) continue;

                const uDiv = Math.max(1, cfg.uDivisions || 1);
                const vDiv = Math.max(1, cfg.vDivisions || 1);

                const uIndex = Math.min(uDiv - 1, Math.max(0, Math.floor(u * uDiv)));
                const vIndex = Math.min(vDiv - 1, Math.max(0, Math.floor(v * vDiv)));

                onDetectorHit(domainId, det.id, uIndex, vIndex);
              }
            }

            // Keep previous alive/dead state in sync with current frame
            prevAlive[i] = lifetime >= 0 ? 1 : 0;
          }
        } else {
          // No detectors this frame; just keep prevAlive in sync
          const totalSlots = textureSize * textureSize;
          for (let i = 0; i < totalSlots; i++) {
            const lifetime = data[i * 4 + 3];
            prevAlive[i] = lifetime >= 0 ? 1 : 0;
          }
        }
      }

      // Update trajectories
      const pos = new THREE.Vector3();
      let debuggedFirst = false;
      for (let i = 0; i < textureSize * textureSize; i++) {
        const base = i * 4;
        const lifetime = data[base + 3];

        // If the particle is dead, optionally keep or clear its
        // trajectory based on the persistTrailsOnDeath flag. When
        // false (default), we clear trails for dead particles so that
        // only active particles have visible tracks.
        if (lifetime < 0) {
          if (!persistTrailsOnDeath) {
            trajectoriesRef.current[i] = [];
          }
          continue;
        }

        activeParticles++;

        // RGB holds position
        pos.set(data[base], data[base + 1], data[base + 2]);
        
        // Debug: Track first particle's movement and compare GPU vs CPU velocity
        if (ENABLE_PARTICLE_DEBUG_LOGS && activeParticles === 1 && !debuggedFirst) {
          // Log every N frames so we see the evolution without spamming
          if (totalFrames.current % 10 === 0) {
            const movement = lastParticlePos.current ? pos.distanceTo(lastParticlePos.current) : 0;

            // Approximate GPU velocity from successive GPU positions
            let vgx = 0, vgy = 0, vgz = 0;
            const simTimeNow = simulationTimeRef.current;
            if (lastParticlePos.current != null && lastParticleSampleSimTime.current != null) {
              const dtSim = simTimeNow - lastParticleSampleSimTime.current;
              if (dtSim > 0) {
                vgx = (pos.x - lastParticlePos.current.x) / dtSim;
                vgy = (pos.y - lastParticlePos.current.y) / dtSim;
                vgz = (pos.z - lastParticlePos.current.z) / dtSim;
              }
            }

            // CPU-side velocity from the analytic expression, evaluated in the
            // same physics scope used for the wave, including projectVariables
            // like k and omega and derived variables like r_s. This returns
            // the *physical* velocity in distance units per physical nanosecond,
            // matching the units used before the GPU multiplies by timeScale.
            let vcx: number | null = null;
            let vcy: number | null = null;
            let vcz: number | null = null;

            if (particleEquation && particleEquation.expression) {
              try {
                const [vxExpr, vyExpr, vzExpr] = splitVectorExpression(particleEquation.expression as string);

                const waveEquation = domain.waveEquation;
                const { scope, numParticles } = buildPhysicsScopeAt(
                  domain,
                  waveEquation,
                  staticScope,
                  parameters,
                  projectVariables,
                  particles,
                  { x: pos.x, y: pos.y, z: pos.z },
                  simulationTimeRef.current,
                  timeScale,
                );

                const evalComponent = (expr: string | undefined): number | null => {
                  const trimmed = (expr || '').trim();
                  if (!trimmed) return 0.0;
                  const expanded = expandMacro(trimmed, numParticles);
                  const raw = evaluateExpressionWithScope(expanded, scope, true as any);
                  if (raw == null) return null;
                  if (typeof raw === 'number') return isFinite(raw) ? raw : null;
                  // math.js complex: take real part to mirror GLSL .x behavior
                  if (typeof raw === 'object' && (raw as any).isComplex) {
                    const re = (raw as any).re;
                    return typeof re === 'number' && isFinite(re) ? re : null;
                  }
                  return null;
                };

                vcx = evalComponent(vxExpr);
                vcy = evalComponent(vyExpr);
                vcz = evalComponent(vzExpr);
              } catch (err) {
                console.warn('[Particle Debug] CPU velocity evaluation failed:', err);
              }
            }

            // Convert CPU velocity from distance/ns to distance/s so it can
            // be compared directly to v_gpu (which is distance/s derived from
            // positions over simulation seconds).
            const scale = timeScale;
            const vcxScaled = vcx == null ? null : vcx * scale;
            const vcyScaled = vcy == null ? null : vcy * scale;
            const vczScaled = vcz == null ? null : vcz * scale;

            // Compare effective GPU velocity (from trajectory) against
            // analytic CPU velocity at the same point in time.
            let motionErrAbs = 0;
            let motionErrRel = 0;
            const hasCpuMotion =
              vcxScaled != null && vcyScaled != null && vczScaled != null;

            if (hasCpuMotion) {
              const dx = vgx - (vcxScaled as number);
              const dy = vgy - (vcyScaled as number);
              const dz = vgz - (vczScaled as number);
              const cpuNorm = Math.sqrt(
                (vcxScaled as number) * (vcxScaled as number) +
                  (vcyScaled as number) * (vcyScaled as number) +
                  (vczScaled as number) * (vczScaled as number),
              );
              const diffNorm = Math.sqrt(dx * dx + dy * dy + dz * dz);
              motionErrAbs = diffNorm;
              motionErrRel = cpuNorm > 1e-6 ? diffNorm / cpuNorm : 0;
            }

            const MOTION_ABS_THRESHOLD = 0.25;
            const MOTION_REL_THRESHOLD = 0.01;

            if (
              !hasCpuMotion ||
              motionErrAbs > MOTION_ABS_THRESHOLD ||
              motionErrRel > MOTION_REL_THRESHOLD
            ) {
              console.log(
                `[Particle Motion] pos=(${pos.x.toFixed(4)}, ${pos.y.toFixed(4)}, ${pos.z.toFixed(4)}), ` +
                  `lifetime=${data[base + 3].toFixed(2)}s, moved=${movement.toFixed(6)}, ` +
                  `v_gpu=(${vgx.toExponential(4)}, ${vgy.toExponential(4)}, ${vgz.toExponential(4)}), ` +
                  `v_cpu_raw_per_ns=(${vcx === null ? 'null' : vcx.toExponential(4)}, ` +
                    `${vcy === null ? 'null' : vcy.toExponential(4)}, ` +
                    `${vcz === null ? 'null' : vcz.toExponential(4)}), ` +
                  `v_cpu_scaled_per_s=(${vcxScaled === null ? 'null' : vcxScaled.toExponential(4)}, ` +
                    `${vcyScaled === null ? 'null' : vcyScaled.toExponential(4)}, ` +
                    `${vczScaled === null ? 'null' : vczScaled.toExponential(4)})` +
                  (hasCpuMotion
                    ? ` err_abs=${motionErrAbs.toExponential(4)}, err_rel=${motionErrRel.toExponential(4)}`
                    : ' (CPU motion velocity unavailable)')
              );
            }
          }
          lastParticlePos.current = pos.clone();
          lastParticleSampleSimTime.current = simulationTimeRef.current;
          debuggedFirst = true;
        }
        
        const traj = trajectoriesRef.current[i];
        
        if (traj.length === 0 || pos.distanceTo(traj[traj.length - 1]) >= trajectoryMinDistance) {
          traj.push(pos.clone());
          if (traj.length > trajectoryMaxLength) traj.shift();
        }
      }
      
      // Reset spawn flag now that we've processed results
      spawnedThisFrameRef.current = false;
    }

    // Particle spawning (CPU-side)  
    // Only spawn particles if we have a spawn surface or emitter samples.
    if ((spawnSurfaces && spawnSurfaces.length > 0) || (emitterSamples && emitterSamples.length > 0)) {
      // Debug: Log emitter samples on first frame
      if (ENABLE_PARTICLE_DEBUG_LOGS && totalFrames.current === 1) {
        console.log(`[Spawn] emitterSamples count: ${emitterSamples?.length}`);
        console.log(`[Spawn] First 3 samples:`, emitterSamples?.slice(0, 3));
      }

      // When this domain's injection surfaces are all driven by domain-crossing
      // events (crossingToSurfaceMap is present), determine spawn strategy:
      // - Quantum mode surfaces: use rate-based spawning (positions from |ψ|²)
      //   activated by the first crossing event. Slit width shapes the |ψ|²
      //   distribution but does not affect the spawn rate.
      // - Freeform mode surfaces: keep 1:1 crossing-to-spawn (handled below).
      const isCrossingOnlyDomain = !!(crossingToSurfaceMap && crossingToSurfaceMap.size > 0);
      const crossingSurfaces = (domain.injectionSurfaces ?? []).filter(s => s.linkedFromDomainIds?.length);
      const allCrossingQuantum = isCrossingOnlyDomain && crossingSurfaces.length > 0 &&
        crossingSurfaces.every(s => s.spawnMode === 'quantum');
      // Rate-based spawning is allowed when: not a crossing domain, OR it's a
      // quantum crossing domain that has already received its first crossing signal.
      const useRateBasedSpawning = !isCrossingOnlyDomain || (allCrossingQuantum && crossingActivatedRef.current);

      if (isWaveRunning && useRateBasedSpawning) {
        const totalSlots = textureSize * textureSize;
        injectionAccumulatorRef.current += injectionRateSim * deltaSeconds;
        let spawned = 0;

        while (injectionAccumulatorRef.current >= 1.0) {
          if (activeParticles + spawned >= maxParticles) {
            injectionAccumulatorRef.current = 0; // discard excess accumulation
            break;
          }
          // Find a free (dead) slot to spawn into. If all slots are
          // active, stop spawning so we don't prematurely overwrite
          // existing particles and truncate their trajectories.
          let spawnIndex = -1;
          for (let attempt = 0; attempt < totalSlots; attempt++) {
            const idx = nextParticleIndexRef.current;
            nextParticleIndexRef.current = (nextParticleIndexRef.current + 1) % totalSlots;
            const baseCheck = idx * 4;
            const lifetime = data[baseCheck + 3];
            if (lifetime < 0) {
              spawnIndex = idx;
              break;
            }
          }

          if (spawnIndex === -1) {
            // No free slots available; keep the accumulator so we'll
            // try again later, but don't evict any active particles.
            break;
          }

          const base = spawnIndex * 4;

          // Generate spawn position — use parametric surface for truly continuous
          // uniform distribution; fall back to pre-computed sample pool otherwise.
          let spawnPos: THREE.Vector3;
          if (spawnSurfaces && spawnSurfaces.length > 0) {
            // Pick a surface: prefer quantum pool when available (it routes each
            // point to the correct surface automatically), otherwise uniform random.
            const pool = quantumPoolRef?.current;
            let pickedSurfIdx = Math.floor(Math.random() * spawnSurfaces.length);
            let quantumPos: THREE.Vector3 | null = null;

            if (pool) {
              // Try each surface in order; consume from the first non-empty queue.
              // The pool's internal partitioning ensures the point matches the surface.
              for (let si = 0; si < spawnSurfaces.length; si++) {
                const q = pool.consume(si);
                if (q) { quantumPos = q; pickedSurfIdx = si; break; }
              }
              // Trigger a background refill when pool is running low
              if (pool.needsRefill()) pool.refillBatch();
            }

            if (quantumPos) {
              spawnPos = quantumPos;
            } else {
              const surf = spawnSurfaces[pickedSurfIdx];
              if (surf.kind === 'rect') {
                const t = Math.random() * 2 - 1; // -1..1
                const s = Math.random() * 2 - 1;
                spawnPos = new THREE.Vector3(
                  surf.origin[0] + t * surf.halfU[0] + s * surf.halfV[0],
                  surf.origin[1] + t * surf.halfU[1] + s * surf.halfV[1],
                  surf.origin[2] + t * surf.halfU[2] + s * surf.halfV[2],
                );
              } else {
                // sphereProject: random point on target face → project onto sphere
                const t = Math.random() * 2 - 1;
                const s = Math.random() * 2 - 1;
                const tx = surf.targetOrigin[0] + t * surf.targetHalfU[0] + s * surf.targetHalfV[0];
                const ty = surf.targetOrigin[1] + t * surf.targetHalfU[1] + s * surf.targetHalfV[1];
                const tz = surf.targetOrigin[2] + t * surf.targetHalfU[2] + s * surf.targetHalfV[2];
                const dx = tx - surf.sphereCenter[0];
                const dy = ty - surf.sphereCenter[1];
                const dz = tz - surf.sphereCenter[2];
                const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
                spawnPos = new THREE.Vector3(
                  surf.sphereCenter[0] + (dx / len) * surf.sphereRadius,
                  surf.sphereCenter[1] + (dy / len) * surf.sphereRadius,
                  surf.sphereCenter[2] + (dz / len) * surf.sphereRadius,
                );
              }
            }
          } else {
            spawnPos = new THREE.Vector3(
              ...emitterSamples![Math.floor(Math.random() * emitterSamples!.length)]
            );
          }

          // Check if spawn position is in bounds
          const inBounds =
            spawnPos.x >= domainBounds.min.x && spawnPos.x <= domainBounds.max.x &&
            spawnPos.y >= domainBounds.min.y && spawnPos.y <= domainBounds.max.y &&
            spawnPos.z >= domainBounds.min.z && spawnPos.z <= domainBounds.max.z;

          data[base] = spawnPos.x;
          data[base + 1] = spawnPos.y;
          data[base + 2] = spawnPos.z;
          data[base + 3] = 0; // Start lifetime at 0

          spawned++;
          totalInjectedRef.current++;
          spawnedThisFrameRef.current = true;
          if (ENABLE_PARTICLE_DEBUG_LOGS && spawned === 1) {
            console.log(
              `[Spawn] pos=(${spawnPos.x.toFixed(2)}, ${spawnPos.y.toFixed(2)}, ${spawnPos.z.toFixed(2)}), inBounds=${inBounds}, index=${spawnIndex}`
            );
          }

          trajectoriesRef.current[spawnIndex] = [spawnPos.clone()];
          injectionAccumulatorRef.current -= 1.0;
        }
        
        // Mark texture as needing upload if particles were spawned
        if (spawned > 0) {
          texture.needsUpdate = true;
        }
      }

      // --- Event-triggered spawning (domain-crossing) ---
      // Crossing-triggered spawning.
      // For quantum-mode crossing surfaces: just use crossings as an activation
      // signal — rate-based spawning above handles actual particle creation.
      // For freeform crossing surfaces: spawn 1:1 per crossing event.
      if (isWaveRunning && pendingInjectionsRef && crossingToSurfaceMap && spawnSurfaces && spawnSurfaces.length > 0) {
        const pending = pendingInjectionsRef.current;
        const pool = quantumPoolRef?.current ?? null;
        let spawned = 0;

        if (allCrossingQuantum) {
          // Quantum mode: drain pending counts as activation signal only.
          let anyPending = false;
          for (const [crossObjId, count] of pending.entries()) {
            if (count > 0) { anyPending = true; pending.delete(crossObjId); }
          }
          if (anyPending) crossingActivatedRef.current = true;
        } else {
          // Freeform mode: spawn 1:1 per crossing event.
          for (const [crossObjId, count] of pending.entries()) {
          if (count <= 0) continue;
          const surfIdx = crossingToSurfaceMap.get(crossObjId);
          if (surfIdx === undefined) continue;

          const totalSlots = textureSize * textureSize;
          let drained = 0;

          while (drained < count) {
            if (activeParticles + spawned >= maxParticles) break;

            let spawnIndex = -1;
            for (let attempt = 0; attempt < totalSlots; attempt++) {
              const idx = nextParticleIndexRef.current;
              nextParticleIndexRef.current = (nextParticleIndexRef.current + 1) % totalSlots;
              if (data[idx * 4 + 3] < 0) { spawnIndex = idx; break; }
            }
            if (spawnIndex === -1) break;

            // Obtain spawn position: quantum pool first, then freeform fallback
            let crossSpawnPos: THREE.Vector3 | null = pool ? pool.consume(surfIdx) : null;
            if (!crossSpawnPos) {
              const ss = spawnSurfaces[surfIdx];
              if (ss && ss.kind === 'rect') {
                const tu = Math.random() * 2 - 1;
                const sv = Math.random() * 2 - 1;
                crossSpawnPos = new THREE.Vector3(
                  ss.origin[0] + tu * ss.halfU[0] + sv * ss.halfV[0],
                  ss.origin[1] + tu * ss.halfU[1] + sv * ss.halfV[1],
                  ss.origin[2] + tu * ss.halfU[2] + sv * ss.halfV[2],
                );
              } else {
                // Surface not found or wrong kind – skip this crossing event
                break;
              }
            }

            const base2 = spawnIndex * 4;
            data[base2]     = crossSpawnPos.x;
            data[base2 + 1] = crossSpawnPos.y;
            data[base2 + 2] = crossSpawnPos.z;
            data[base2 + 3] = 0;
            trajectoriesRef.current[spawnIndex] = [crossSpawnPos.clone()];
            spawned++;
            totalInjectedRef.current++;
            spawnedThisFrameRef.current = true;
            drained++;
          }

          // Reduce the pending count by how many we successfully drained
          const remaining = count - drained;
          if (remaining <= 0) pending.delete(crossObjId);
          else pending.set(crossObjId, remaining);
          } // end for loop
        } // end freeform crossing block

        // Trigger refill if the pool is low after draining
        if (pool && pool.needsRefill()) pool.refillBatch();
        if (spawned > 0) texture.needsUpdate = true;
      }
    }

    // Performance logging (debug-only).
    // Scanning all particles once per second can cause visible hitches,
    // so we only do this work when verbose debug logs are enabled.
    if (ENABLE_PARTICLE_DEBUG_LOGS && now - lastLogTime.current > 1000) {
      const bounds = domainBounds;
      // Count CPU-side particles for comparison
      let cpuActiveCount = 0;
      if (data) {
        for (let i = 0; i < textureSize * textureSize; i++) {
          if (data[i * 4 + 3] >= 0) cpuActiveCount++;
        }
      }

      console.log(
        `[ParticleCompute GPU] ${updateCounter.current} ups, ${(performance.now() - startTime).toFixed(2)}ms, GPU:${activeParticles} CPU:${cpuActiveCount} active`
      );
      console.log(
        `[Bounds] min=(${bounds.min.x.toFixed(1)}, ${bounds.min.y.toFixed(1)}, ${bounds.min.z.toFixed(1)}), max=(${bounds.max.x.toFixed(1)}, ${bounds.max.y.toFixed(1)}, ${bounds.max.z.toFixed(1)})`
      );

      // Debug: Log first few particles to see their state
      if (data && activeParticles === 0 && cpuActiveCount > 0) {
        console.log(
          `[Debug] CPU has ${cpuActiveCount} active but GPU has 0! First particle: pos=(${data[0].toFixed(2)}, ${data[1].toFixed(2)}, ${data[2].toFixed(2)}), lifetime=${data[3].toFixed(3)}`
        );
      }

      updateCounter.current = 0;
      lastLogTime.current = now;
    }

    // Report particle counts to parent
    if (onParticleCountChange) {
      onParticleCountChange(domainId, activeParticles, totalInjectedRef.current);
    }
  });

  return createPortal(null, computeScene);
};

export default ParticleComputeGPU;
