import * as THREE from 'three';
import { useMemo, useLayoutEffect, useRef, useEffect } from 'react';
import { useFrame, createPortal, useThree } from '@react-three/fiber';
import type { PhysicsDomain, SceneObjectType, GlobalConstant, CustomParameter, PhysicsEquation, ParticleDefinition, ProjectDerivedVariable } from './types';
import { evaluateExpressionWithScope, buildEvaluationScope } from './utils';
import { findObjectByName } from './utils';
import { transpileToGLSL, complexMathLib, customFunctionLib, findObjectReferencesInExpression } from './expressionTranspiler';

/**
 * WaveCompute: GPU-based 3D wave function computation
 * 
 * PERFORMANCE NOTE: This component renders the wave by computing one Z-slice at a time
 * in a loop. With resolution=32, that's 32 GPU render passes per update. This is a fundamental
 * limitation of WebGL2's lack of compute shaders. For smoother performance:
 * - In 3D: Use lower resolution (16-24) for real-time updates
 * - In 2D: Resolution doesn't affect performance (only 1 slice computed)
 * - Reduce updatesPerSecond to 20-30 for complex wave equations
 */

type Props = {
  domain: PhysicsDomain;
  sceneObjects: SceneObjectType[];
  particles: ParticleDefinition[];
  globalConstants: GlobalConstant[];
  parameters: CustomParameter[];
  bounds: THREE.Box3; // THE FIX: Receive bounds directly
  sceneBounds: THREE.Box3 | null; // <-- FIX: Add sceneBounds to props
  isCalculating: boolean;
  isVisible: boolean; // <-- NEW: To control computation
  resolution: number;
  simulationTimeRef: React.MutableRefObject<number>; // THE FIX: Receive time ref
  updatesPerSecond: number; // --- NEW: Performance throttle ---
  onTextureReady: (texture: THREE.Data3DTexture) => void;
  onPerformanceUpdate: (domainId: string, updatesPerSecond: number) => void; // NEW: Callback for performance metrics
  onMagnitudeRangeComputed?: (domainId: string, range: { min: number; max: number; logMin: number }) => void; // NEW: GPU-based normalization callback
  projectVariables?: ProjectDerivedVariable[];
  timeScale: number;
};

// --- NEW: Helper to make parameter names GLSL-safe ---
const sanitizeNameForGLSL = (name: string) => name.replace(/[^a-zA-Z0-9_]/g, '_');

// This is our GPU "compute" shader.
// For now, it's a simple placeholder that calculates sin(x+z+t).
// Later, we will dynamically generate this from the user's expression.
const generateComputeFragmentShader = (waveEquation: PhysicsEquation, parameters: CustomParameter[], sceneObjects: SceneObjectType[], globalConstants: GlobalConstant[], projectVariables: ProjectDerivedVariable[] = []) =>`
  precision highp float;

  uniform float u_time;
  uniform float u_particle_mass;
  uniform float u_z_slice; // The current Z-slice we are computing
  uniform vec3 u_bounds_min;
  uniform vec3 u_bounds_max;
  uniform float u_resolution;

  // --- NEW: Dynamically add uniforms for each parameter ---
  ${parameters.map(p => `uniform float u_${sanitizeNameForGLSL(p.name)};`).join('\n  ')}

  // --- NEW: Dynamically add uniforms for each global constant ---
  ${globalConstants.map(c => `uniform float u_${sanitizeNameForGLSL(c.name)};`).join('\n  ')}

  // --- NEW: Dynamically add uniforms for referenced scene objects ---
  ${(() => {
    const allExpressions = [
      waveEquation.expression,
      ...(waveEquation.derivedVariables?.map(v => v.expression) || [])
    ];
    const allObjectRefs = new Set<string>();
    allExpressions.forEach(expr => findObjectReferencesInExpression(expr).forEach(ref => allObjectRefs.add(ref)));
    return Array.from(allObjectRefs).map(name => `uniform vec3 u_${sanitizeNameForGLSL(name)}_position;`).join('\n  ');
  })()}

  // --- NEW: Project-level derived variables as uniforms ---
  ${projectVariables.map(v => `uniform float u_${sanitizeNameForGLSL(v.name)};`).join('\n  ')}

  // --- NEW: Complex number math library ---
  ${complexMathLib}
  // --- NEW: Custom function library (e.g., for distance) ---
  ${customFunctionLib}

  void main() {
    // gl_FragCoord.xy gives us the pixel coordinate (i, j) for this run.
    // This corresponds to the (x, y) position in our grid.
    vec2 pixel_coord = gl_FragCoord.xy;

    // Calculate world coordinates (x, y, z) from pixel coordinates
    vec3 size = u_bounds_max - u_bounds_min;
    float x = u_bounds_min.x + (pixel_coord.x / (u_resolution-1.)) * size.x;
    float y = u_bounds_min.y + (pixel_coord.y / (u_resolution-1.)) * size.y;
    float z = u_bounds_min.z + (u_z_slice / (u_resolution-1.)) * size.z;
    vec3 current_pos = vec3(x, y, z);

    // --- NEW: Execute the transpiled user code ---
    ${transpileToGLSL(waveEquation, parameters, sceneObjects, globalConstants, projectVariables)}

    // Write the complex number (real, imag) to the output texture.
    gl_FragColor = vec4(result.x, result.y, 0.0, 1.0);
  }
`; // <-- FIX: Added the missing closing backtick here

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`; // <-- FIX: Added the missing closing backtick here

export function WaveCompute({ domain, sceneObjects, parameters, resolution, isCalculating, isVisible, simulationTimeRef, updatesPerSecond, onTextureReady, bounds, onPerformanceUpdate, particles, globalConstants, projectVariables = [], timeScale, onMagnitudeRangeComputed }: Props) {
  const { waveEquation } = domain;
  const materialRef = useRef<THREE.ShaderMaterial | null>(null); // --- FIX: Stable ref for the material ---
  const gl = useThree(state => state.gl);
  // --- PERFORMANCE DEBUG: Add counters ---
  const computeCounter = useRef(0);
  const lastLogTime = useRef(performance.now());
  // --- End of debug ---
  const lastUpdateTime = useRef(0); // --- NEW: For throttling ---
  const rangeComputedRef = useRef(false); // NEW: Ensure GPU normalization runs once per domain instance
  // One-shot recompute when parameters change while not actively calculating
  const paramChangedRef = useRef(false);
  useEffect(() => {
    paramChangedRef.current = true;
  }, [parameters, projectVariables]);

  // Buffer reused for reading back one Z-slice from the render target when computing normalization
  const readbackBufferRef = useRef<Float32Array | null>(null);

  // A separate scene and camera for our off-screen computation
  const computeScene = useMemo(() => new THREE.Scene(), []);
  const computeCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  // --- OPTIMIZATION: Cache object references found in expressions ---
  const objectRefs = useMemo(() => {
    if (!waveEquation) return [];
    const allExpressions = [
      waveEquation.expression,
      ...(waveEquation.derivedVariables?.map(v => v.expression) || [])
    ];
    const refs = new Set<string>();
    allExpressions.forEach(expr => findObjectReferencesInExpression(expr).forEach(ref => refs.add(ref)));
    return Array.from(refs);
  }, [waveEquation]);

  // --- OPTIMIZATION: Precompute static scope (only when dependencies change) ---
  const staticScope = useMemo(() => {
    return buildEvaluationScope(sceneObjects, globalConstants);
  }, [sceneObjects, globalConstants]);

  const { texture, renderTarget } = useMemo(() => {
    const tex = new THREE.Data3DTexture(new Float32Array(resolution * resolution * resolution * 4), resolution, resolution, resolution);
    tex.format = THREE.RGBAFormat;
    tex.type = THREE.FloatType;
    tex.minFilter = tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;

    // The WebGLRenderTarget is our "canvas" on the GPU.
    const rt = new THREE.WebGLRenderTarget(resolution, resolution);
    rt.texture.format = THREE.RGBAFormat;
    rt.texture.type = THREE.FloatType;

    return { texture: tex, renderTarget: rt };
  }, [resolution]);

  // --- FIX: Initialize the texture on the GPU as soon as it's created ---
  useLayoutEffect(() => {
    gl.initTexture(texture);
  }, [gl, texture]);

  // --- FIX: Call onTextureReady in an effect to avoid setState-in-render warning ---
  useLayoutEffect(() => {
    onTextureReady(texture);
  }, [texture, onTextureReady]);

  useMemo(() => {
    // --- THE FIX: Add a guard at the top of the memo ---
    if (!waveEquation) return null;

    // --- NEW: Compute physical time in ns using global timeScale (ns per sim-second) ---
    const currentTimeNs = simulationTimeRef.current * timeScale;

    // --- NEW: Dynamically generate uniforms based on parameters ---
    const uniforms: { [key: string]: THREE.IUniform } = {
      u_time: { value: currentTimeNs }, // Initialize with current (scaled) simulation time in ns
        u_z_slice: { value: 0 },
        u_resolution: { value: resolution },
        u_bounds_min: { value: bounds.min },
        u_bounds_max: { value: bounds.max },
    };
    for (const param of parameters) {
        uniforms[`u_${sanitizeNameForGLSL(param.name)}`] = { value: param.value };
    }

    // --- NEW: Add uniforms for global constants ---
    for (const constant of globalConstants) {
        uniforms[`u_${sanitizeNameForGLSL(constant.name)}`] = { value: constant.value };
    }

    // --- NEW: Add particle mass uniform (single unified name) ---
    const particleList = particles || [];
    const particleId = domain.selectedParticleId || (particleList.length > 0 ? particleList[0].id : undefined);
    const particle = particleList.find((p: ParticleDefinition) => p.id === particleId);
    const massValue = particle ? ((particle as any).mass ?? (particle as any).massKg ?? 0.0) : 0.0;
    uniforms['u_particle_mass'] = { value: massValue };

    // --- NEW: Find object references and add uniforms for them ---
    // --- FIX: Scan BOTH the main expression AND all derived variables for object references ---
    const allExpressions = [
      waveEquation.expression,
      ...(waveEquation.derivedVariables?.map(v => v.expression) || [])
    ];
    const allObjectRefs = new Set<string>();
    allExpressions.forEach(expr => findObjectReferencesInExpression(expr).forEach(ref => allObjectRefs.add(ref)));

    for (const name of allObjectRefs) {
      const obj = findObjectByName(sceneObjects, name);
      if (obj) {
        uniforms[`u_${sanitizeNameForGLSL(name)}_position`] = { value: new THREE.Vector3().fromArray(obj.position) };
      }
    }

    // --- NEW: Initialize project-level variable uniforms by evaluating their expressions in a shared CPU scope ---
    if (projectVariables && projectVariables.length > 0) {
      const baseScope = buildEvaluationScope(sceneObjects, globalConstants);
      const paramsScope = parameters.reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {} as Record<string, any>);
      const scope: Record<string, any> = { ...baseScope, ...paramsScope, t: currentTimeNs };
      if (massValue !== undefined) scope['mass'] = massValue;

      for (const pv of projectVariables) {
        const val = evaluateExpressionWithScope(pv.expression, scope);
        uniforms[`u_${sanitizeNameForGLSL(pv.name)}`] = { value: (val !== null ? val : 0.0) };
        if (val !== null) {
          scope[pv.name] = val;
        }
      }
    }

    // --- FIX: Create the material and assign it to the stable ref ---
    materialRef.current = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: generateComputeFragmentShader(waveEquation, parameters, sceneObjects, globalConstants, projectVariables),
      uniforms,
    });
    return materialRef.current;
  }, [resolution, bounds, parameters, waveEquation, sceneObjects, generateComputeFragmentShader, domain.selectedParticleId, particles, globalConstants, projectVariables, simulationTimeRef, timeScale]);

  // --- FIX: Add guard clause for when there is no wave equation ---
  if (!waveEquation) return null;


  // This is the core compute loop.
  // Simulation time is advanced in DomainWave; we only read it here.
  useFrame((state) => {
    // --- THE FIX: Add a robust guard to prevent race conditions on mount ---
    // The useFrame loop can start before useMemo has created the material.
    // This check ensures we don't proceed until the material is ready.
    const material = materialRef.current;
    if (!material) return;
    // Run continuously when calculating; run exactly one extra frame when params changed while paused
    const oneShot = !isCalculating && paramChangedRef.current;
    if (!isCalculating && !oneShot) return;

    // --- NEW: Throttle the computation to a fixed update rate ---
    const now = performance.now();
    const timeSinceLastUpdate = now - lastUpdateTime.current;
    const interval = 1000 / updatesPerSecond;

    if (!oneShot && timeSinceLastUpdate < interval) {
      return; // Skip this frame (throttle only applies to continuous mode)
    }
    // Consume the one-shot flag only once we're committed to running
    if (oneShot) {
      paramChangedRef.current = false;
      rangeComputedRef.current = false; // recompute magnitude range for new param values
    }
    lastUpdateTime.current = now - (timeSinceLastUpdate % interval); // Adjust for drift
    // --- End of throttling logic ---

    // --- PERFORMANCE DEBUG: Measure compute time ---
    const computeStartTime = performance.now();

    // --- PERFORMANCE DEBUG: Log compute rate ---
    computeCounter.current++;
    if (now - lastLogTime.current > 1000) {
      onPerformanceUpdate(domain.id, computeCounter.current); // NEW: Call the callback
      computeCounter.current = 0;
      lastLogTime.current = now;
    }
    // --- End of debug ---

    // --- NEW: Update parameter uniforms on every frame ---
    for (const param of parameters) { 
        const uniformName = `u_${sanitizeNameForGLSL(param.name)}`;
        if (material.uniforms[uniformName]) {
            material.uniforms[uniformName].value = param.value;
        }
    }
    // --- NEW: Update particle mass uniform ---
    const particleList = particles || [];
    const particleId = domain.selectedParticleId || (particleList.length > 0 ? particleList[0].id : undefined);
    const particle = particleList.find((p: ParticleDefinition) => p.id === particleId);
    if (material.uniforms['u_particle_mass']) {
      material.uniforms['u_particle_mass'].value = (particle ? ((particle as any).mass ?? (particle as any).massKg ?? 0.0) : 0.0);
    }

    // --- NEW: Update project variable uniforms each frame, with shared scope so dependencies (e.g., omega on k) work ---
    const currentTimeNs = simulationTimeRef.current * timeScale;

    if (projectVariables && projectVariables.length > 0) {
      // Use cached static scope instead of rebuilding
      const paramsScope: Record<string, any> = {};
      for (let i = 0; i < parameters.length; i++) {
        paramsScope[parameters[i].name] = parameters[i].value;
      }
      const scope: Record<string, any> = { ...staticScope, ...paramsScope, t: currentTimeNs };
      if (material.uniforms['u_particle_mass']) scope['mass'] = material.uniforms['u_particle_mass'].value;

      for (const pv of projectVariables) {
        const uName = `u_${sanitizeNameForGLSL(pv.name)}`;
        if (!material.uniforms[uName]) continue;
        const val = evaluateExpressionWithScope(pv.expression, scope);
        material.uniforms[uName].value = (val !== null ? val : 0.0);
        if (val !== null) {
          scope[pv.name] = val;
        }
      }
    }

    // --- NEW: Update object position uniforms on every frame ---
    // Use cached object references instead of recomputing
    for (let i = 0; i < objectRefs.length; i++) {
      const name = objectRefs[i];
      const obj = findObjectByName(sceneObjects, name);
      const uniformName = `u_${sanitizeNameForGLSL(name)}_position`;
      if (obj && material.uniforms[uniformName]) {
        material.uniforms[uniformName].value.fromArray(obj.position);
      }
    }

    // Map simulation time (seconds) to physical time in ns using global timeScale (ns per sim-second).
    // Simulation time itself is advanced in DomainWave's useFrame so it stays smooth
    // even when GPU updates are throttled.
    const currentTimeNs2 = simulationTimeRef.current * timeScale;
    material.uniforms.u_time.value = currentTimeNs2;

    // Determine whether we should compute GPU-based normalization on this pass
    const shouldComputeRange =
      !rangeComputedRef.current &&
      !!onMagnitudeRangeComputed &&
      !!waveEquation?.isValidated &&
      (domain.minMagnitude === undefined || domain.maxMagnitude === undefined || domain.logMinMagnitude === undefined);

    let minMag = Infinity;
    let maxMag = 0;
    let logMinMag = Infinity;

    // Prepare readback buffer if we'll be sampling the render target
    if (shouldComputeRange) {
      const expectedSize = resolution * resolution * 4;
      if (!readbackBufferRef.current || readbackBufferRef.current.length !== expectedSize) {
        readbackBufferRef.current = new Float32Array(expectedSize);
      }
    }

    const readbackBuffer = readbackBufferRef.current;

    // Loop through each Z-slice of our 3D texture
    for (let k = 0; k < resolution; k++) {
      material.uniforms.u_z_slice.value = k;
      state.gl.setRenderTarget(renderTarget);
      state.gl.render(computeScene, computeCamera);

      // Copy the 2D result into the correct Z-slice of the 3D texture
      // --- FIX: Use the underlying WebGL context to perform the copy ---
      const context = gl.getContext() as WebGL2RenderingContext; // Assert that we have a WebGL2 context
      if (!context) {
        console.error("WaveCompute requires a WebGL2 context.");
        return;
      }
      const webglTexture = (state.gl.properties.get(texture) as any).__webglTexture;

      // --- FIX: Use the context to bind the texture ---
      context.bindTexture(context.TEXTURE_3D, webglTexture);
      context.copyTexSubImage3D(context.TEXTURE_3D, 0, 0, 0, k, 0, 0, resolution, resolution);

      // --- NEW: GPU-based magnitude range estimation using the render target data ---
      if (shouldComputeRange && readbackBuffer) {
        // Read back the current slice from the render target into CPU memory
        state.gl.readRenderTargetPixels(
          renderTarget,
          0,
          0,
          resolution,
          resolution,
          readbackBuffer
        );

        const numPixels = resolution * resolution;
        for (let idx = 0; idx < numPixels; idx++) {
          const base = idx * 4;
          const re = readbackBuffer[base];
          const im = readbackBuffer[base + 1];
          const mag = Math.hypot(re, im);

          // Skip non-finite magnitudes (e.g., infinities from singularities like 1/0)
          if (!Number.isFinite(mag)) continue;

          if (mag < minMag) minMag = mag;
          if (mag > maxMag) maxMag = mag;
          if (mag > 1e-9 && mag < logMinMag) logMinMag = mag;
        }
      }
    }

    state.gl.setRenderTarget(null); // Reset to default render target (the screen)

    // Finalize GPU-based normalization after all slices are processed
    if (shouldComputeRange) {
      const range = {
        min: isFinite(minMag) ? minMag : 0,
        max: maxMag > 0 ? maxMag : 1.0,
        logMin: isFinite(logMinMag) ? logMinMag : 0.001,
      };

      onMagnitudeRangeComputed?.(domain.id, range);
      rangeComputedRef.current = true;
    }

    // --- PERFORMANCE DEBUG: Log compute time ---
    const computeTime = performance.now() - computeStartTime;
    if (computeTime > 10) { // Only log if it takes more than 10ms
      console.log(`[WaveCompute ${domain.name}] Resolution ${resolution}: ${computeTime.toFixed(2)}ms for ${resolution} passes`);
    }
  });

  // createPortal lets us render our compute scene off-screen
  if (!materialRef.current) return null;

  return createPortal(<mesh material={materialRef.current}><planeGeometry args={[2, 2]} /></mesh>, computeScene);
}