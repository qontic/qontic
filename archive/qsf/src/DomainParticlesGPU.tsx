import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export type DomainParticlesGPUProps = {
  // Core GPU state
  particleStateTexture: THREE.DataTexture | null;
  textureSize: number; // width == height for now
  trajectories: THREE.Vector3[][];

  // Visual controls
  showParticles?: boolean;
  showParticleTrajectories?: boolean;
  maxParticles: number;
  sceneScale: [number, number, number];
  particleShape: 'sphere' | 'cube';
  particleSize: number;
  particleColor: string;
  trajectoryColor?: string;
  clippingPlanes?: THREE.Plane[];
};

/**
 * DomainParticlesGPU (render stub)
 *
 * This component renders particle markers entirely from a GPU state texture
 * using a single instanced mesh and a custom ShaderMaterial. Each instance
 * is positioned by sampling the particleStateTexture in the vertex shader
 * based on gl_InstanceID.
 *
 * For now, the texture is assumed to contain positions in texture.rgba.xyz
 * and a lifetime/status flag in .w. The actual compute & spawning logic
 * will be provided by ParticleCompute in the next iteration.
 */
export const DomainParticlesGPU: React.FC<DomainParticlesGPUProps> = ({
  particleStateTexture,
  textureSize,
  trajectories,
  showParticles = true,
  showParticleTrajectories = false,
  maxParticles: _maxParticles,
  sceneScale,
  particleShape,
  particleSize,
  particleColor,
  trajectoryColor = '#ffa500',
  clippingPlanes = [],
}) => {
  const instancedRef = useRef<THREE.InstancedMesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  // Keep a ref so the useFrame closure always sees current clippingPlanes
  // (used for trajectory LineBasicMaterial which relies on THREE.js clipping)
  const clippingPlanesRef = useRef(clippingPlanes);
  clippingPlanesRef.current = clippingPlanes;

  // OPTIMIZED: Single geometry for all trajectories instead of individual Line objects
  const allTrajectoriesRef = useRef<THREE.LineSegments | null>(null);
  const trajectoryBufferRef = useRef<Float32Array | null>(null);
  const trajectoryGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  
  const [sx, sy, sz] = sceneScale;

  // Use the full texture capacity for allocation so that changing maxParticles
  // (the runtime spawn cap) never causes the instanced mesh or trajectory
  // buffer to be torn down and re-created.
  const MAX_PARTICLES = textureSize * textureSize;
  const MAX_POINTS_PER_TRAJECTORY = 1000; // Increased from 500 for longer trajectories
  const TOTAL_TRAJECTORY_POINTS = MAX_PARTICLES * MAX_POINTS_PER_TRAJECTORY;

  // Simple vertex/fragment shaders that read position from a 2D texture
  // using gl_InstanceID and draw a colored marker.
  const vertexShader = useMemo(
    () => `
      uniform sampler2D u_particle_state;
      uniform float u_texture_size;
      uniform vec3 u_scene_scale;
      // Custom clip plane: xyz = normal, w = constant (same sign convention as THREE.Plane).
      // When u_clip_active > 0.5 and dot(worldPos, normal) + w < 0, push vertex off-screen.
      uniform vec4 u_clip_plane;
      uniform float u_clip_active;

      void main() {
        int idx = gl_InstanceID;
        float size = u_texture_size;

        // Map the 1D index to a texel in the square texture.
        float xIdx = mod(float(idx), size);
        float yIdx = floor(float(idx) / size);

        vec2 uv = (vec2(xIdx, yIdx) + 0.5) / size;
        vec4 state = texture2D(u_particle_state, uv);

        // state.xyz holds unscaled physics coordinates.
        vec3 worldPos = state.xyz * u_scene_scale;

        // lifetime/status in state.w: negative => dead, keep them collapsed.
        if (state.w < 0.0) {
          worldPos = vec3(1e6); // push off-screen
        }

        // Manual clip plane: push clipped particles off-screen.
        if (u_clip_active > 0.5 && dot(worldPos, u_clip_plane.xyz) + u_clip_plane.w < 0.0) {
          worldPos = vec3(1e6);
        }

        vec3 displaced = worldPos + position;
        vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    []
  );

  const fragmentShader = useMemo(
    () => `
      precision highp float;
      uniform vec3 u_color;
      void main() {
        gl_FragColor = vec4(u_color, 1.0);
      }
    `,
    []
  );

  const color = useMemo(() => new THREE.Color(particleColor), [particleColor]);

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_particle_state: { value: particleStateTexture },
        u_texture_size: { value: textureSize },
        u_scene_scale: { value: new THREE.Vector3(sx, sy, sz) },
        u_color: { value: color },
        u_clip_plane: { value: new THREE.Vector4(0, 0, 1, 0) },
        u_clip_active: { value: 0.0 },
      },
      transparent: false,
      depthTest: true,
    });
    materialRef.current = mat;
    return mat;
  }, [vertexShader, fragmentShader, particleStateTexture, textureSize, sx, sy, sz, color]);

  // Update clip uniforms synchronously during render — THREE.js reads uniforms
  // lazily at draw time (inside the R3F useFrame loop), which always comes after
  // React's synchronous render pass, so this is guaranteed to be current.
  if (material.uniforms.u_clip_active) {
    if (clippingPlanes.length > 0) {
      const p = clippingPlanes[0];
      (material.uniforms.u_clip_plane.value as THREE.Vector4).set(
        p.normal.x, p.normal.y, p.normal.z, p.constant
      );
      material.uniforms.u_clip_active.value = 1.0;
    } else {
      material.uniforms.u_clip_active.value = 0.0;
    }
  }

  // Combined useFrame for both particles and trajectories
  useFrame(() => {
    // Update particle material uniforms if particles are shown
    if (showParticles) {
      const mat = materialRef.current;
      if (mat) {
        if (particleStateTexture && mat.uniforms.u_particle_state) {
          mat.uniforms.u_particle_state.value = particleStateTexture;
        }
        if (mat.uniforms.u_texture_size) {
          mat.uniforms.u_texture_size.value = textureSize;
        }
        if (mat.uniforms.u_scene_scale) {
          (mat.uniforms.u_scene_scale.value as THREE.Vector3).set(sx, sy, sz);
        }
        if (mat.uniforms.u_color) {
          (mat.uniforms.u_color.value as THREE.Color).copy(color);
        }
      }
    }

    // Update all trajectories in a single buffer
    if (!showParticleTrajectories || trajectories.length === 0) {
      if (allTrajectoriesRef.current) {
        allTrajectoriesRef.current.visible = false;
      }
      return;
    }

    // Ensure we have the trajectory geometry and buffer
    if (!trajectoryGeometryRef.current) {
      // Create the buffer and geometry once
      const buffer = new Float32Array(TOTAL_TRAJECTORY_POINTS * 3);
      trajectoryBufferRef.current = buffer;
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(buffer, 3));
      geometry.setDrawRange(0, 0); // Start with nothing drawn
      trajectoryGeometryRef.current = geometry;
      
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(trajectoryColor),
        opacity: 0.6,
        transparent: true,
        clippingPlanes: clippingPlanesRef.current,
      });
      
      const lineSegments = new THREE.LineSegments(geometry, material);
      lineSegments.renderOrder = 1000;
      lineSegments.frustumCulled = false; // Prevent culling when zooming
      allTrajectoriesRef.current = lineSegments;
    }

    // Update the buffer with all trajectory points
    const buffer = trajectoryBufferRef.current!;
    let bufferIndex = 0;
    
    for (let particleIdx = 0; particleIdx < trajectories.length && particleIdx < MAX_PARTICLES; particleIdx++) {
      const trajectory = trajectories[particleIdx];
      if (!trajectory || trajectory.length < 2) continue;
      
      const pointCount = Math.min(trajectory.length, MAX_POINTS_PER_TRAJECTORY);
      
      // Write line segments (pairs of points)
      for (let i = 0; i < pointCount - 1; i++) {
        const p1 = trajectory[i];
        const p2 = trajectory[i + 1];
        
        // Add first point of segment
        buffer[bufferIndex++] = p1.x * sx;
        buffer[bufferIndex++] = p1.y * sy;
        buffer[bufferIndex++] = p1.z * sz;
        
        // Add second point of segment
        buffer[bufferIndex++] = p2.x * sx;
        buffer[bufferIndex++] = p2.y * sy;
        buffer[bufferIndex++] = p2.z * sz;
      }
    }
    
    // Update geometry
    const geometry = trajectoryGeometryRef.current;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    posAttr.needsUpdate = true;
    geometry.setDrawRange(0, bufferIndex / 3); // Number of vertices
    
    // Update material color and clipping planes
    const lineSegments = allTrajectoriesRef.current!;
    const lineMat = lineSegments.material as THREE.LineBasicMaterial;
    lineMat.color.set(trajectoryColor);
    lineMat.clippingPlanes = clippingPlanesRef.current;
    lineSegments.visible = true;
  });

  // Early return only if no state texture
  if (!particleStateTexture || textureSize <= 0) {
    return null;
  }

  return (
    <>
      {showParticles && (
        <instancedMesh 
          ref={instancedRef} 
          args={[undefined as any, undefined as any, MAX_PARTICLES]}
          renderOrder={1001}
          frustumCulled={false}
        >
          {particleShape === 'cube' ? (
            <boxGeometry args={[particleSize, particleSize, particleSize]} />
          ) : (
            <sphereGeometry args={[particleSize, 16, 16]} />
          )}
          <primitive object={material} attach="material" />
        </instancedMesh>
      )}
      
      {/* Render all trajectories in a single primitive */}
      {showParticleTrajectories && allTrajectoriesRef.current && (
        <primitive object={allTrajectoriesRef.current} />
      )}
    </>
  );
};

export default DomainParticlesGPU;
