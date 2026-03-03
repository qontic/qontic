# Particle Emission System

## Current Architecture (Test Model 4)

### Domain Structure

Test Model 4 has a two-domain setup simulating a double-slit experiment:

1. **Domain 1: "Source to Screen"**
   - Bounds: `z > Source.z and z < Screen.z - Screen.dz/2`
   - Wave equation: Spherical wave from SquareBox
   - Particle injection: Front face of SquareBox targeting Screen
   - Purpose: Particles travel from source toward the screen with slits

2. **Domain 2: "Screen to Wall"**
   - Bounds: `z > Screen.z + Screen.dz/2 and z < Wall.z - Wall.dz/2`
   - Wave equation: Two-slit interference pattern
   - Particle injection: Front face of SlitTop
   - Purpose: Particles that pass through slits travel toward wall

### Objects with `physicsTransparent` Flag

- **SlitTop** and **SlitBottom**: Both have `"physicsTransparent": true`
- This flag is defined in `types.ts` but **not currently used** in particle physics calculations
- Visual opacity is 0.25 (semi-transparent)

### Current Particle Behavior

#### Spawning (in ParticleComputeGPU.tsx)

```typescript
// Lines 1088-1150
if (emitterSamples && emitterSamples.length > 0) {
  injectionAccumulatorRef.current += injectionRateSim * delta;
  
  while (injectionAccumulatorRef.current >= 1.0) {
    // Find free slot
    // Spawn particle at random position from emitterSamples
    const spawnPos = new THREE.Vector3(
      ...emitterSamples[Math.floor(Math.random() * emitterSamples.length)]
    );
    
    data[base] = spawnPos.x;
    data[base + 1] = spawnPos.y;
    data[base + 2] = spawnPos.z;
    data[base + 3] = 0; // Start lifetime at 0
  }
}
```

#### Domain Boundary Killing (GPU Shader, lines 271-277)

```glsl
// Kill particles outside bounds
if (x < u_bounds_min.x || x > u_bounds_max.x ||
    y < u_bounds_min.y || y > u_bounds_max.y ||
    z < u_bounds_min.z || z > u_bounds_max.z) {
  lifetime = -1.0;  // Particle dies
}
```

#### CPU Mirror of Boundary Check (lines 898-903)

```typescript
if (
  x < domainBounds.min.x || x > domainBounds.max.x ||
  y < domainBounds.min.y || y > domainBounds.max.y ||
  z < domainBounds.min.z || z > domainBounds.max.z
) {
  lifetime = -1.0;  // Kill particle
  break;
}
```

### Problem with Current System

**Discontinuous Domain Transitions**: When particles reach the boundary of Domain 1:
1. Particles die (lifetime = -1)
2. Domain 2 must spawn **new** particles at its injection surface (SlitTop)
3. There is **no coordination** - Domain 2 doesn't "know" when Domain 1 particles arrive
4. This creates the need for emission-on-receive logic (which user wants to remove)

### Key Finding

**The `physicsTransparent` property exists but is not used in particle physics**. It's defined in the type system but no code checks it when determining particle collisions or domain transitions.

## Injection Surfaces

Defined in `injectionSurfaces.ts`, these generate sample points on geometric surfaces:

- **rect**: Box face projections
- **sphereProjected**: Sphere surface projections
- **cylinderSection**: Cylinder/tube curved surfaces

Each domain's `injectionSurfaces` array specifies where particles spawn in that domain.

## Related Files

- `src/ParticleComputeGPU.tsx`: Main particle physics (GPU + CPU fallback)
- `src/ParticleGPUBridge.tsx`: Connects compute to rendering
- `src/DomainParticlesGPU.tsx`: Instanced mesh renderer for particles
- `src/injectionSurfaces.ts`: Geometric surface sampling
- `src/types.ts`: Type definitions including `physicsTransparent`
