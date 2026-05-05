import * as THREE from 'three';
import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import type { PhysicsDomain, PhysicsEquation, CustomParameter, SceneObjectType, ParticleDefinition, GlobalConstant, ProjectDerivedVariable } from './types';
import { transpileToGLSL, complexMathLib, customFunctionLib, findObjectReferencesInExpression, sanitizeNameForGLSL } from './expressionTranspiler';
import { findObjectByName, evaluateExpressionWithScope, buildEvaluationScope } from './utils';
import { PALETTE_DEFINITIONS } from './colorPalettes';

// --- Helper: Collect opaque box objects for wave occlusion ---
function collectOpaqueBoxes(objects: SceneObjectType[]): SceneObjectType[] {
  const results: SceneObjectType[] = [];
  const walk = (list: SceneObjectType[]) => {
    for (const obj of list) {
      if (obj.name && obj.type === 'box' && !obj.physicsTransparent && obj.visible !== false) {
        results.push(obj);
      }
      if (obj.children) walk(obj.children);
    }
  };
  walk(objects);
  return results;
}

// Maximum number of occluder objects supported in wave shaders
const MAX_OCCLUDERS = 16;

type Props = {
  texture: THREE.Data3DTexture | null; // Allow null for analytic mode
  backend: 'precomputed' | 'analytic' | 'adaptive';
  domain: PhysicsDomain;
  particles?: ParticleDefinition[];
  cameraView: '3D' | 'xy' | 'xz' | 'yz';
  isVisible: boolean; // <-- NEW: To control rendering
  waveEquation?: PhysicsEquation; // Needed for analytic
  parameters: CustomParameter[]; // Needed for analytic
  globalConstants: GlobalConstant[]; // NEW
  sceneObjects?: SceneObjectType[]; // Needed for analytic
  bounds: THREE.Box3; // THE FIX: Receive bounds directly
  clippingPlanes?: THREE.Plane[];
  simulationTime?: number; // Needed for analytic
  simulationTimeRef?: MutableRefObject<number>; // NEW: For smooth animation without re-renders
  sceneScale?: [number, number, number]; // NEW: Scene scale for inverse transformation
  projectVariables?: ProjectDerivedVariable[]; // NEW
  timeScale?: number; // NEW: Global time scaling (sim seconds -> physical ns)
  persistOnStop?: boolean; // NEW: Distinguish main solver from transient previews
};

// --- Shaders for Volumetric Ray Marching ---

const vertexShader = `
  varying vec3 v_world_position;
  void main() {
    v_world_position = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
 precision highp float;
precision highp sampler3D;

varying vec3 v_world_position;

uniform vec3 u_bounds_min;
uniform vec3 u_bounds_max;
uniform sampler3D u_data_texture;
uniform vec3 u_camera_pos;
uniform int u_domain_shape;    // 0 = box, 1 = sphere, 2 = custom (for future use)
uniform vec3 u_scene_scale;    // NEW: Scene scale
uniform sampler2D u_colormap; // NEW: Colormap for phase coloring

// --- NEW: Opacity uniforms ---
uniform int u_amplitude_mode; // 0: flat, 1: linear, 2: log
uniform float u_opacity_factor;
uniform float u_min_mag; // NEW
uniform float u_max_mag; // NEW
uniform float u_log_min_mag; // NEW

// --- Object occlusion: hide wave behind opaque objects ---
uniform int u_num_occluders;
uniform vec3 u_occluder_pos[16];
uniform vec3 u_occluder_halfsize[16];

bool isInsideOccluder(vec3 pos) {
  for (int i = 0; i < 16; i++) {
    if (i >= u_num_occluders) break;
    vec3 d = abs(pos - u_occluder_pos[i]);
    if (d.x <= u_occluder_halfsize[i].x && d.y <= u_occluder_halfsize[i].y && d.z <= u_occluder_halfsize[i].z) {
      return true;
    }
  }
  return false;
}

bool isInsideDomain(vec3 pos) {
  if (u_domain_shape == 0) {
    // Box: everything inside u_bounds_min/max is valid.
    return all(greaterThanEqual(pos, u_bounds_min)) &&
           all(lessThanEqual(pos,  u_bounds_max));
  }

  // --- FIX: For custom rules, also treat as a box for now ---
  // This ensures that custom domains which are not spheres are still rendered.
  return all(greaterThanEqual(pos, u_bounds_min)) &&
         all(lessThanEqual(pos,  u_bounds_max));
}

void main() {

  // --- Ray setup ---
  // Transform world coordinates to unscaled physics space
  vec3 unscaled_cam_pos = u_camera_pos / u_scene_scale;
  vec3 unscaled_frag_pos = v_world_position / u_scene_scale;

  vec3 rayOrigin = unscaled_cam_pos;
  vec3 rayDirection = normalize(unscaled_frag_pos - unscaled_cam_pos);

  // --- Box intersection ---
  vec3 invRay = 1.0 / rayDirection;
  vec3 tMin = (u_bounds_min - rayOrigin) * invRay;
  vec3 tMax = (u_bounds_max - rayOrigin) * invRay;

  vec3 t1 = min(tMin, tMax);
  vec3 t2 = max(tMin, tMax);

  float tNear = max(max(t1.x, t1.y), t1.z);
  float tFar  = min(min(t2.x, t2.y), t2.z);

  // --- NEW: Limit the ray to stop at the first opaque occluder ---
  // This prevents the 3D wave volume from rendering "through" solid
  // objects (like the screen) along the view ray. We treat occluders
  // as solid boxes and clamp the march interval so that any ray that
  // hits an occluder stops at its front face.
  float occluderLimit = 1e20;
  for (int i = 0; i < 16; i++) {
    if (i >= u_num_occluders) break;

    vec3 o_min = u_occluder_pos[i] - u_occluder_halfsize[i];
    vec3 o_max = u_occluder_pos[i] + u_occluder_halfsize[i];

    vec3 tMinO = (o_min - rayOrigin) * invRay;
    vec3 tMaxO = (o_max - rayOrigin) * invRay;

    vec3 t1o = min(tMinO, tMaxO);
    vec3 t2o = max(tMinO, tMaxO);

    float tNearO = max(max(t1o.x, t1o.y), t1o.z);
    float tFarO  = min(min(t2o.x, t2o.y), t2o.z);

    // Valid intersection in front of the camera
    if (tFarO > 0.0 && tNearO < tFarO) {
      occluderLimit = min(occluderLimit, tNearO);
    }
  }

  if (occluderLimit < 1e19) {
    tFar = min(tFar, occluderLimit);
  }

  if (tNear >= tFar) discard;
  tNear = max(tNear, 0.0);

  // --- Marching setup ---
  const int MAX_STEPS = 64;
  float travel = tFar - tNear;
  float stepSize = travel / float(MAX_STEPS);

  vec3 pos = rayOrigin + rayDirection * tNear;
  vec4 accum = vec4(0.0);

  for (int i = 0; i < MAX_STEPS; i++) {
    // --- THE FIX: Check if the current sample point is inside the defined domain shape ---
    if (!isInsideDomain(pos)) {
       pos += rayDirection * stepSize;
       continue;
    }
    // --- Object occlusion: skip samples inside opaque objects ---
    if (isInsideOccluder(pos)) {
       pos += rayDirection * stepSize;
       continue;
    }

    vec3 uvw = (pos - u_bounds_min) / (u_bounds_max - u_bounds_min);
    uvw = clamp(uvw, 0.0, 1.0);

    vec4 sampleValue = texture(u_data_texture, uvw);
    float realPart = sampleValue.r;
    float imagPart = sampleValue.g;

// --- amplitude and phase ---
    float mag = length(vec2(realPart, imagPart));      // |ψ|
    float phase = atan(imagPart, realPart);            // [-π, π]
    float phaseNorm = (phase / 3.14159265 + 1.0) * 0.5; // [0,1]

    // --- NEW: Use colormap texture for phase color ---
    vec3 color = texture(u_colormap, vec2(phaseNorm, 0.5)).rgb;

// --- opacity ---
    // --- FIX: Remove arbitrary 0.1 scaling. Opacity factor is now the main sensitivity control. ---
    float alpha = u_opacity_factor; // Default for 'flat' mode

    if (u_amplitude_mode == 1) { // Linear
        float range = u_max_mag - u_min_mag;
        float normalized_mag = range > 0.0 ? (mag - u_min_mag) / range : 0.0;
        alpha = normalized_mag * u_opacity_factor;
    } else if (u_amplitude_mode == 2) { // Log
        // Protect against log(0) or log of very small numbers
        float log_range = log(u_max_mag) - log(u_log_min_mag);
        if (mag > u_log_min_mag && log_range > 0.0) {
            float normalized_log_mag = (log(mag) - log(u_log_min_mag)) / log_range;
            alpha = normalized_log_mag * u_opacity_factor;
        } else {
            alpha = 0.0; // If magnitude is below the min, treat as transparent
        }
    }

    alpha = clamp(alpha, 0.0, 1.0);

// --- compositing ---
    // --- DEFINITIVE FIX: Use standard front-to-back alpha compositing ---
    // The color contribution of the current sample is scaled by its alpha.
    // This prevents the wave from turning white or dark at low opacities.
    accum.rgb += (1.0 - accum.a) * color * alpha;
    accum.a += (1.0 - accum.a) * alpha;

    if (accum.a > 0.99) break;

    pos += rayDirection * stepSize;
  }

  //if (accum.a < 0.01) accum.a=0.0;
  gl_FragColor = accum;
}



`;

// --- NEW: Shaders for rendering a 2D slice of the 3D texture ---

const sliceVertexShader = `
  varying vec3 v_world_position;
  void main() {
    v_world_position = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sliceFragmentShader = `
  precision highp float;
  precision highp sampler3D;

  varying vec3 v_world_position;

  uniform vec3 u_bounds_min;
  uniform vec3 u_bounds_max;
  uniform sampler3D u_data_texture;
  uniform sampler2D u_colormap;
  uniform vec3 u_scene_scale; // NEW

  // --- THE FIX: Add opacity uniform to the 2D shader ---
  uniform float u_opacity_factor;

  // --- Object occlusion ---
  uniform int u_num_occluders;
  uniform vec3 u_occluder_pos[16];
  uniform vec3 u_occluder_halfsize[16];

  bool isInsideOccluder(vec3 pos) {
    for (int i = 0; i < 16; i++) {
      if (i >= u_num_occluders) break;
      vec3 d = abs(pos - u_occluder_pos[i]);
      if (d.x <= u_occluder_halfsize[i].x && d.y <= u_occluder_halfsize[i].y && d.z <= u_occluder_halfsize[i].z) {
        return true;
      }
    }
    return false;
  }

  void main() {
    vec3 unscaled_pos = v_world_position / u_scene_scale;

    // --- Object occlusion: discard if inside an opaque object ---
    if (isInsideOccluder(unscaled_pos)) discard;

    // Map world position to texture coordinates [0, 1]
    vec3 uvw = (unscaled_pos - u_bounds_min) / (u_bounds_max - u_bounds_min);

    // If we are outside the texture bounds, discard the fragment
    // Add a small epsilon to avoid artifacts at the edges.
    if (any(lessThan(uvw, vec3(-0.001))) || any(greaterThan(uvw, vec3(1.001)))) {
      discard;
    }
    
    // Clamp coordinates to be safe
    uvw = clamp(uvw, 0.0, 1.0);

    // Sample the 3D texture
    vec4 sampleValue = texture(u_data_texture, uvw);
    float realPart = sampleValue.r;
    float imagPart = sampleValue.g;

    // --- FIX: Always render phase for 2D slices now ---
    float phase = atan(imagPart, realPart); // atan2
    float normalizedValue = (phase / 3.14159 + 1.0) * 0.5;
    
    vec4 color = texture(u_colormap, vec2(normalizedValue, 0.5));

    // --- THE FIX: Apply the opacity factor to the alpha channel ---
    color.a *= u_opacity_factor;
    gl_FragColor = color;
  }
`;

// --- NEW: Analytic Fragment Shader Generator for 2D Slices ---
const generateAnalyticFragmentShader = (waveEquation: PhysicsEquation, parameters: CustomParameter[], sceneObjects: SceneObjectType[], globalConstants: GlobalConstant[], projectVariables: ProjectDerivedVariable[] = []) => `
  precision highp float;
  varying vec3 v_world_position;

  uniform float u_time;
  uniform float u_particle_mass;
  uniform vec3 u_bounds_min;
  uniform vec3 u_bounds_max;
  uniform sampler2D u_colormap;
  uniform float u_opacity_factor;
  uniform int u_domain_shape;
  uniform vec3 u_scene_scale; // NEW

  // --- Dynamic Uniforms ---
  ${parameters.map(p => `uniform float u_${sanitizeNameForGLSL(p.name)};`).join('\n  ')}
  // --- NEW: Add constant uniforms ---
  ${globalConstants.map(c => `uniform float u_${sanitizeNameForGLSL(c.name)};`).join('\n  ')}
  ${projectVariables.map(v => `uniform float u_${sanitizeNameForGLSL(v.name)};`).join('\n  ')}
  ${(() => {
    const allExpressions = [waveEquation.expression, ...(waveEquation.derivedVariables?.map(v => v.expression) || [])];
    const allObjectRefs = new Set<string>();
    allExpressions.forEach(expr => findObjectReferencesInExpression(expr).forEach(ref => allObjectRefs.add(ref)));
    return Array.from(allObjectRefs).map(name => `uniform vec3 u_${sanitizeNameForGLSL(name)}_position;`).join('\n  ');
  })()}

  // --- Math Libraries ---
  ${complexMathLib}
  ${customFunctionLib}

  // --- Object occlusion ---
  uniform int u_num_occluders;
  uniform vec3 u_occluder_pos[16];
  uniform vec3 u_occluder_halfsize[16];

  bool isInsideOccluder(vec3 pos) {
    for (int i = 0; i < 16; i++) {
      if (i >= u_num_occluders) break;
      vec3 d = abs(pos - u_occluder_pos[i]);
      if (d.x <= u_occluder_halfsize[i].x && d.y <= u_occluder_halfsize[i].y && d.z <= u_occluder_halfsize[i].z) {
        return true;
      }
    }
    return false;
  }

  void main() {
    // 1. Check Bounds
    vec3 current_pos = v_world_position / u_scene_scale; // Unscale first

    if (any(lessThan(current_pos, u_bounds_min)) || any(greaterThan(current_pos, u_bounds_max))) {
      discard;
    }

    // --- Object occlusion: discard if inside an opaque object ---
    if (isInsideOccluder(current_pos)) discard;

    // --- FIX: Define coordinate variables for user expressions ---
    float x = current_pos.x; // These are now unscaled physics coordinates
    float y = current_pos.y;
    float z = current_pos.z;

    // 2. Execute User Code (calculates 'vec2 result')
    ${transpileToGLSL(waveEquation, parameters, sceneObjects, globalConstants, projectVariables)}

    // 3. Visualization Logic (Phase & Magnitude)
    float realPart = result.x;
    float imagPart = result.y;
    
    // Phase for color
    float phase = atan(imagPart, realPart);
    float normalizedPhase = (phase / 3.14159265 + 1.0) * 0.5;
    vec4 color = texture(u_colormap, vec2(normalizedPhase, 0.5));

    // Magnitude for optional masking (optional, but good for consistency)
    // For 2D, we usually show everything, but we apply the global opacity.
    
    color.a *= u_opacity_factor;
    gl_FragColor = color;
  }
`;

const colormapCache: Record<string, THREE.DataTexture> = {};

function createColormapTexture(name: string): THREE.DataTexture {
  const stops = PALETTE_DEFINITIONS[name] || PALETTE_DEFINITIONS['phase'];
  const resolution = 256;
  const data = new Uint8Array(resolution * 4);

  for (let i = 0; i < resolution; i++) {
    const t = i / (resolution - 1);
    const segment = Math.floor(t * (stops.length - 1));
    const segmentT = (t * (stops.length - 1)) - segment;

    const c1 = stops[segment];
    const c2 = stops[Math.min(segment + 1, stops.length - 1)];

    data[i * 4 + 0] = c1[0] + (c2[0] - c1[0]) * segmentT; // R
    data[i * 4 + 1] = c1[1] + (c2[1] - c1[1]) * segmentT; // G
    data[i * 4 + 2] = c1[2] + (c2[2] - c1[2]) * segmentT; // B
    data[i * 4 + 3] = 255; // A
  }

  const cmap = new THREE.DataTexture(data, resolution, 1, THREE.RGBAFormat);
  cmap.needsUpdate = true;
  return cmap;
}

function getColormap(name = 'phase'): THREE.DataTexture {
  if (!colormapCache[name]) colormapCache[name] = createColormapTexture(name);
  return colormapCache[name];
}

export function WaveRenderer({ domain, particles, texture, backend, cameraView, isVisible, clippingPlanes = [], bounds, parameters, globalConstants, sceneObjects, simulationTime, simulationTimeRef, sceneScale = [1, 1, 1], projectVariables, timeScale = 1, persistOnStop }: Props) {
  // Access raw normalization values to tell whether they have been computed yet
  const rawMin = domain.minMagnitude;
  const rawMax = domain.maxMagnitude;
  const rawLogMin = domain.logMinMagnitude;

  const { waveEquation, opacityFactor = 1.0, amplitudeMode = 'linear', colorPalette, minMagnitude = 0.0, maxMagnitude = 1.0, logMinMagnitude = 0.001 } = domain;

  // Decide if this rendering path actually needs normalization before being shown
  // For the main 3D solver (persistOnStop=true), we require GPU-based
  // normalization before showing linear/log amplitudes. For transient
  // previews (e.g., Test Render), we allow rendering immediately using
  // default min/max so the user sees something even before normalization.
  const needsNormalization = backend === 'precomputed' && amplitudeMode !== 'flat' && !!persistOnStop;
  const hasNormalization = !needsNormalization || (rawMin !== undefined && rawMax !== undefined && rawLogMin !== undefined);

  // --- THE FIX: If not visible or normalization not ready (for 3D linear/log), render nothing. ---
  if (!isVisible || !hasNormalization) {
    return null;
  }

  // --- FIX: Use two separate refs for the two different shader materials ---
  const volumeShaderRef = useRef<THREE.ShaderMaterial>(null);
  const sliceShaderRef = useRef<THREE.ShaderMaterial>(null);
  const analyticShaderRef = useRef<THREE.ShaderMaterial>(null); // NEW ref
  const colormap = useMemo(() => getColormap(colorPalette), [colorPalette]);

  // --- OPTIMIZATION: Precompute static evaluation scope and object references for analytic mode ---
  const staticScope = useMemo(
    () => buildEvaluationScope(sceneObjects || [], globalConstants || []),
    [sceneObjects, globalConstants]
  );

  const analyticObjectRefs = useMemo(() => {
    const expressions = [waveEquation?.expression || '', ...(waveEquation?.derivedVariables?.map(v => v.expression) || [])];
    const refs = new Set<string>();
    expressions.forEach(expr => findObjectReferencesInExpression(expr).forEach(ref => refs.add(ref)));
    return Array.from(refs);
  }, [waveEquation]);

  // --- OPTIMIZATION: Precompute project variable values when controls/parameters change ---
  const staticProjectVariableValues = useMemo(() => {
    const result: Record<string, number> = {};
    if (!projectVariables || projectVariables.length === 0) return result;

    const paramsScope = parameters.reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {} as Record<string, any>);
    const scope: Record<string, any> = { ...staticScope, ...paramsScope, t: 0 };

    // Include particle mass in the scope (same selection logic as elsewhere)
    if (particles && particles.length > 0) {
      const particleId = domain.selectedParticleId || particles[0].id;
      const particle = particles.find(p => p.id === particleId) || particles[0];
      const massVal = (particle as any).mass ?? (particle as any).massKg;
      if (massVal !== undefined) scope['mass'] = massVal;
    }

    for (const pv of projectVariables) {
      const val = evaluateExpressionWithScope(pv.expression, scope);
      if (val !== null && isFinite(val)) {
        result[pv.name] = val;
        scope[pv.name] = val;
      }
    }
    return result;
  }, [projectVariables, parameters, staticScope, particles, domain.selectedParticleId]);

  // --- Collect opaque box objects for shader-based wave occlusion ---
  const opaqueBoxes = useMemo(() => collectOpaqueBoxes(sceneObjects || []), [sceneObjects]);

  // Helper to update occluder uniforms on a shader material
  const updateOccluderUniforms = (mat: THREE.ShaderMaterial) => {
    if (!mat.uniforms.u_num_occluders) return;
    const count = Math.min(opaqueBoxes.length, MAX_OCCLUDERS);
    mat.uniforms.u_num_occluders.value = count;
    for (let i = 0; i < count; i++) {
      const obj = opaqueBoxes[i];
      mat.uniforms.u_occluder_pos.value[i].fromArray(obj.position);
      mat.uniforms.u_occluder_halfsize.value[i].set(
        obj.scale[0] * 0.5, obj.scale[1] * 0.5, obj.scale[2] * 0.5
      );
    }
  };

  // This effect simply updates shader uniforms when props change
  useFrame(({ camera }) => {
    // Update the 3D volume shader
    if (volumeShaderRef.current) {
      // The camera position is only needed for the volumetric shader
      if (volumeShaderRef.current.uniforms.u_camera_pos) {
        volumeShaderRef.current.uniforms.u_camera_pos.value.copy(camera.position);
      }
      // --- FIX: Update scene scale uniform for 3D volume ---
      if (volumeShaderRef.current.uniforms.u_scene_scale) {
        volumeShaderRef.current.uniforms.u_scene_scale.value.set(...sceneScale);
      }
      updateOccluderUniforms(volumeShaderRef.current);
    }
    // Update the 2D slice shader
    if (sliceShaderRef.current) {
      // --- FIX: Update scene scale uniform for 2D slice ---
      if (sliceShaderRef.current.uniforms.u_scene_scale) {
        sliceShaderRef.current.uniforms.u_scene_scale.value.set(...sceneScale);
      }
      updateOccluderUniforms(sliceShaderRef.current);
    }
    // Update the analytic shader (2D)
    if (analyticShaderRef.current && parameters && sceneObjects) {
      const mat = analyticShaderRef.current;
      const currentSimTime = simulationTimeRef ? simulationTimeRef.current : (simulationTime ?? 0);
      const currentTimeNs = currentSimTime * timeScale; // timeScale is ns per sim-second
      // --- FIX: Prefer ref for smooth animation, fallback to prop ---
      mat.uniforms.u_time.value = currentTimeNs;
      
      // --- NEW: Update particle mass uniform ---
      if (particles && particles.length > 0) {
        const particleId = domain.selectedParticleId || particles[0].id;
        let particle = null;
        for (let i = 0; i < particles.length; i++) {
          if (particles[i].id === particleId) {
            particle = particles[i];
            break;
          }
        }
        if (mat.uniforms['u_particle_mass']) {
          mat.uniforms['u_particle_mass'].value = (particle ? ((particle as any).mass ?? (particle as any).massKg ?? 0.0) : 0.0);
        }
      }

      // Update parameter uniforms
      for (let i = 0; i < parameters.length; i++) {
        const p = parameters[i];
        const name = `u_${sanitizeNameForGLSL(p.name)}`;
        if (mat.uniforms[name]) mat.uniforms[name].value = p.value;
      }

      // --- NEW: Update project variable uniforms each frame with shared scope ---
      if (projectVariables && projectVariables.length > 0) {
        for (const pv of projectVariables) {
          const uName = `u_${sanitizeNameForGLSL(pv.name)}`;
          const uniform = mat.uniforms[uName];
          if (!uniform) continue;
          const val = staticProjectVariableValues[pv.name];
          if (typeof val === 'number' && isFinite(val)) {
            uniform.value = val;
          }
        }
      }

      // Update object position uniforms
      for (let i = 0; i < analyticObjectRefs.length; i++) {
        const name = analyticObjectRefs[i];
        const obj = findObjectByName(sceneObjects, name);
        const uName = `u_${sanitizeNameForGLSL(name)}_position`;
        if (obj && mat.uniforms[uName]) mat.uniforms[uName].value.fromArray(obj.position);
      }
      if (mat.uniforms.u_scene_scale) mat.uniforms.u_scene_scale.value.set(...sceneScale);
      updateOccluderUniforms(mat);
    }
  });

  // --- NEW: Determine if we are in a 2D view ---
  const is2D = cameraView !== '3D';
  let clipPlane = clippingPlanes.length > 0 ? clippingPlanes[0] : null;

  // If we are in 2D but have no clip plane (e.g. clipping disabled in UI),
  // we must default to a center slice to show *something* for the analytic wave.
  if (is2D && !clipPlane) {
     switch (cameraView) {
        case 'xy': clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); break;
        case 'xz': clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); break;
        case 'yz': clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0); break;
     }
  }

  // --- FIX: Guard against rendering if the backend requires a texture that isn't ready ---
  if (backend === 'precomputed' && !texture) {
    return null;
  }

  if (bounds.isEmpty()) {
    return null; // Don't render anything if the bounds are invalid
  }

  const size = bounds.getSize(new THREE.Vector3());
  const position = bounds.getCenter(new THREE.Vector3());

  // --- FIX: Slightly shrink the rendering box to prevent Z-fighting/flickering ---
  const renderBounds = useMemo(() => {
    if (bounds.isEmpty()) return bounds.clone();
    return bounds.clone().expandByScalar(-0.1);
  }, [bounds]);

  const uniforms = useMemo(() => ({
    u_camera_pos: { value: new THREE.Vector3() },
    u_bounds_min: { value: renderBounds.min.clone() },
    u_bounds_max: { value: renderBounds.max.clone() },
    u_data_texture: { value: texture },
    u_colormap: { value: colormap },
    u_debug_mode: { value: 0 },
    u_domain_shape: { value: 0 }, // Always a box for now
    u_amplitude_mode: { value: amplitudeMode === 'flat' ? 0 : amplitudeMode === 'linear' ? 1 : 2 },
    u_opacity_factor: { value: opacityFactor },
    u_min_mag: { value: minMagnitude ?? 0.0 }, // NEW: default-safe values
    u_max_mag: { value: (maxMagnitude ?? 1.0) <= 0.0 ? 1.0 : (maxMagnitude as number) }, // ensure positive range
    u_log_min_mag: { value: logMinMagnitude ?? 0.001 }, // NEW
    u_scene_scale: { value: new THREE.Vector3(...sceneScale) }, // NEW
    // --- Object occlusion uniforms ---
    u_num_occluders: { value: 0 },
    u_occluder_pos: { value: Array.from({ length: MAX_OCCLUDERS }, () => new THREE.Vector3()) },
    u_occluder_halfsize: { value: Array.from({ length: MAX_OCCLUDERS }, () => new THREE.Vector3()) },
  }), [renderBounds, texture, colormap, amplitudeMode, opacityFactor, minMagnitude, maxMagnitude, logMinMagnitude, sceneScale]);

  // --- FIX: The geometry for the ray-marching volume must match the domain shape ---
  // For 'box' and 'custom' shapes, we render the bounding box.
  const geometry = <boxGeometry args={[size.x, size.y, size.z]} />;

  // --- NEW: Conditional Rendering Logic ---
  if (is2D && clipPlane) {
    // --- Render a 2D Plane for orthographic views ---
    const boundsSize = bounds.getSize(new THREE.Vector3());
    const boundsCenter = bounds.getCenter(new THREE.Vector3());

    // --- NEW: Extract scale components for easier access ---
    const [sx, sy, sz] = sceneScale;

    // --- DEFINITIVE FIX: Correctly size and orient the 2D slice plane ---
    // We apply the scale directly to the geometry dimensions instead of the mesh.
    // This prevents issues where rotating the mesh causes the wrong axis to be scaled.
    let planeWidth, planeHeight;
    if (Math.abs(clipPlane.normal.x) > 0.5) { // YZ plane
        // Rotated around Y. Plane's X -> World's Z, Plane's Y -> World's Y.
        planeWidth = boundsSize.z * sz;
        planeHeight = boundsSize.y * sy;
    } else if (Math.abs(clipPlane.normal.y) > 0.5) { // XZ plane
        // Rotated around X. Plane's X -> World's X, Plane's Y -> World's Z.
        planeWidth = boundsSize.x * sx;
        planeHeight = boundsSize.z * sz;
    } else { // XY plane (no rotation from default)
        planeWidth = boundsSize.x * sx;
        planeHeight = boundsSize.y * sy;
    }

    // --- FIX: Calculate position entirely in Scaled World Space ---
    const scaledBoundsCenter = boundsCenter.clone().multiply(new THREE.Vector3(sx, sy, sz));
    const scaledSlicePos = new THREE.Vector3();
    clipPlane.projectPoint(scaledBoundsCenter, scaledSlicePos);

    if (backend === 'analytic' && waveEquation && parameters && sceneObjects && globalConstants) {
      // Create the analytic material
      // We use useMemo to recreate it only when the equation structure changes
      const analyticMaterial = useMemo(() => {
        const uniforms: Record<string, any> = {
          u_time: { value: 0 },
          u_bounds_min: { value: bounds.min },
          u_bounds_max: { value: bounds.max },
          u_colormap: { value: colormap },
          u_opacity_factor: { value: opacityFactor },
          u_domain_shape: { value: 0 },
          u_scene_scale: { value: new THREE.Vector3(...sceneScale) },
        };
        // Init dynamic uniforms
        parameters.forEach(p => uniforms[`u_${sanitizeNameForGLSL(p.name)}`] = { value: p.value });
        // --- NEW: Add constant uniforms ---
        globalConstants.forEach(c => uniforms[`u_${sanitizeNameForGLSL(c.name)}`] = { value: c.value });
        // --- NEW: Add particle mass uniform ---
        if (particles) {
          const particleId = domain.selectedParticleId || (particles.length > 0 ? particles[0].id : undefined);
          const particle = particles.find(p => p.id === particleId);
          const massValue = particle ? ((particle as any).mass ?? (particle as any).massKg ?? 0.0) : 0.0;
          uniforms['u_particle_mass'] = { value: massValue };
        }
        // --- NEW: Initialize project-level variable uniforms with shared scope so dependencies are respected ---
        if ((projectVariables || []).length > 0) {
          const baseScope = buildEvaluationScope(sceneObjects, globalConstants);
          const paramsScope = parameters.reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {} as Record<string, any>);
          const scope: Record<string, any> = { ...baseScope, ...paramsScope, t: 0 };
          if (uniforms['u_particle_mass'] !== undefined) scope['mass'] = uniforms['u_particle_mass'].value;

          for (const pv of projectVariables || []) {
            const val = evaluateExpressionWithScope(pv.expression, scope);
            uniforms[`u_${sanitizeNameForGLSL(pv.name)}`] = { value: (val !== null ? val : 0.0) };
            if (val !== null) {
              scope[pv.name] = val;
            }
          }
        }
        // --- Object occlusion uniforms ---
        uniforms['u_num_occluders'] = { value: 0 };
        uniforms['u_occluder_pos'] = { value: Array.from({ length: MAX_OCCLUDERS }, () => new THREE.Vector3()) };
        uniforms['u_occluder_halfsize'] = { value: Array.from({ length: MAX_OCCLUDERS }, () => new THREE.Vector3()) };

        // Init object uniforms (placeholder, updated in useFrame)
        const allExpressions = [waveEquation.expression, ...(waveEquation.derivedVariables?.map(v => v.expression) || [])];
        const allObjectRefs = new Set<string>();
        allExpressions.forEach(expr => findObjectReferencesInExpression(expr).forEach(ref => allObjectRefs.add(ref)));
        allObjectRefs.forEach(name => uniforms[`u_${sanitizeNameForGLSL(name)}_position`] = { value: new THREE.Vector3() });

        return new THREE.ShaderMaterial({
          vertexShader: sliceVertexShader, // Reuse the simple vertex shader
          fragmentShader: generateAnalyticFragmentShader(waveEquation, parameters, sceneObjects, globalConstants, projectVariables),
          uniforms: uniforms,
          transparent: true,
          side: THREE.DoubleSide,
          depthTest: false, // --- FIX: Always show wave overlay on top in 2D ---
          depthWrite: false, // --- FIX: Prevent occlusion of other overlays ---
        });
      }, [waveEquation, parameters.length, sceneObjects.length, colormap, opacityFactor, bounds, sceneScale, particles, domain.selectedParticleId, globalConstants, projectVariables]); // Rebuild if structure changes

      // Assign to ref for useFrame updates
      analyticShaderRef.current = analyticMaterial;

      return (
        <mesh position={scaledSlicePos} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), clipPlane.normal)} renderOrder={100}>
          <planeGeometry args={[planeWidth, planeHeight]} />
          <primitive object={analyticMaterial} attach="material" />
        </mesh>
      );
    }

    // --- Fallback: Precomputed (Texture-based) 2D Slice ---
    return (
      <mesh position={scaledSlicePos} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), clipPlane.normal)} renderOrder={100}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <shaderMaterial
          ref={sliceShaderRef}
          vertexShader={sliceVertexShader}
          fragmentShader={sliceFragmentShader}
          uniforms={uniforms}
          transparent // --- THE FIX: Enable transparency for the 2D plane material ---
          side={THREE.DoubleSide} // --- FIX: Ensure visibility from both sides ---
          depthTest={false} // --- FIX: Always show wave overlay on top in 2D ---
          depthWrite={false}
        />
      </mesh>
    );
  }

  // --- FIX: Calculate scaled position for the volume mesh ---
  const scaledPosition = position.clone().multiply(new THREE.Vector3(...sceneScale));

  // --- Render the 3D Volume for the perspective view ---
  // The ray-marcher handles its own occlusion via the occluder uniform system,
  // so we disable THREE.js depth testing entirely to prevent opaque scene objects
  // (e.g. the detector wall) from incorrectly masking wave content that is
  // physically in front of them.
  return (
    <mesh position={scaledPosition} scale={sceneScale} renderOrder={1200}>
      {/* The geometry is now determined dynamically */}
      {geometry}
      <shaderMaterial
        ref={volumeShaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}