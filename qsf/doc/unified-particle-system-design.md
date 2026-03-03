# Unified Multi-Domain Particle System Design

## Architecture

### Current: Per-Domain Particle Systems
```
SceneView
├── Domain 1
│   └── ParticleGPUBridge
│       ├── ParticleComputeGPU (texture1, bounds1 equation1)
│       └── DomainParticlesGPU (renders texture1)
└── Domain 2
    └── ParticleGPUBridge
        ├── ParticleComputeGPU (texture2, bounds2, equation2)
        └── DomainParticlesGPU (renders texture2)
```

**Problem**: Particles in texture1 cannot move to texture2

### Proposed: Unified Particle System
```
SceneView
└── UnifiedParticleSystem
    ├── MultiDomainParticleCompute (one texture, all domains, switches equation by position)
    └── DomainParticlesGPU (renders unified texture)
```

**Solution**: All particles share one texture, domain selection is dynamic

## Key Design Decisions

### 1. Domain Selection Strategy

**GPU Shader Approach**:
```glsl
int getDomainIndex(vec3 position) {
  // Check each domain's bounds in order
  if (inBounds(position, u_domain1_min, u_domain1_max)) return 0;
  if (inBounds(position, u_domain2_min, u_domain2_max)) return 1;
  // ... more domains
  return -1; // Outside all domains
}
```

**Limitations**: 
- GLSL doesn't support dynamic array indexing for uniforms well
- Need fixed maximum number of domains
- Each domain needs separate uniforms for bounds and equation parameters

**Alternative**: Use texture-based domain map
- Pre-compute 3D texture marking which domain each voxel belongs to
- Sample domain ID from texture
- More flexible but adds complexity

### 2. Equation Switching

**Challenge**: Each domain may have completely different wave equations

**Option A: Compile all equations into one shader**
```glsl
vec3 getVelocity(vec3 pos, int domainIndex) {
  if (domainIndex == 0) {
    // Domain 1 equation
    return evaluateDomain1Velocity(pos);
  } else if (domainIndex == 1) {
    // Domain 2 equation
    return evaluateDomain2Velocity(pos);
  }
  return vec3(0.0);
}
```

**Option B: Shader  recompilation** (current approach per domain)
- Less suitable for unified system
- Would require dynamic shader switching

**Recommendation**: Go with Option A, inline all domains into one mega-shader

### 3. Injection Surfaces

**Current**: Each domain defines its own injection surfaces

**Unified approach**: 
- Only spawn particles at injection surfaces in domains marked as "sources"
- Or: filter by `physicsTransparent` flag (already implemented)
- Test_Model_4: Only SquareBox surface should spawn, slits are transparent

### 4. Particle State Format

**Current**: `vec4(x, y, z, lifetime)`

**Unified options**:

**Option A**: Keep same format, infer domain from position
- Pros: No state format change- Cons: Must check all domains every frame

**Option B**: Add explicit domain ID
- Store in separate texture channel or separate texture
- Pros: Faster domain lookup
- Cons: More memory, state complexity

**Recommendation**: Start with Option A (infer from position) for simplicity

## Implementation Plan

### Phase 1: Create UnifiedParticleSystem Component

**File**: `src/UnifiedParticleSystem.tsx`

```typescript
interface UnifiedParticleSystemProps {
  allDomains: PhysicsDomain[];
  sceneObjects: SceneObjectType[];
  parameters: CustomParameter[];
  globalConstants: GlobalConstant[];
  particles: ParticleDefinition[];
  projectVariables?: ProjectDerivedVariable[];
  simulationTimeRef: React.MutableRefObject<number>;
  timeScale: number;
  maxParticles: number;
  // ... other rendering props
}
```

### Phase 2: Multi-Domain Shader Generation

**Challenge**: Generate single shader that includes all domain equations

```typescript
function generateUnifiedParticleShader(
  domains: PhysicsDomain[],
  parameters: CustomParameter[],
  sceneObjects: SceneObjectType[],
  globalConstants: GlobalConstant[],
  projectVariables: ProjectDerivedVariable[]
): string {
  let shader = `
    precision highp float;
    // ... common uniforms
  `;
  
  // Add bounds uniforms for each domain
  for (let i = 0; i < domains.length; i++) {
    shader += `
      uniform vec3 u_domain${i}_min;
      uniform vec3 u_domain${i}_max;
    `;
  }
  
  // Generate equation functions for each domain
  for (let i = 0; i < domains.length; i++) {
    const eq = domains[i].particleEquation;
    if (!eq) continue;
    
    const glsl = transpileToGLSL(eq, ...);
    shader += `
      vec3 evalDomain${i}Velocity(vec3 pos) {
        float x = pos.x;
        float y = pos.y;
        float z = pos.z;
        ${glsl}
        return result; // from transpiled code
      }
    `;
  }
  
  // Main function with domain selection
  shader += `
    void main() {
      // ... read particle state
      
      int domainIdx = -1;
      ${domains.map((d, i) => `
        if (x >= u_domain${i}_min.x && x <= u_domain${i}_max.x &&
            y >= u_domain${i}_min.y && y <= u_domain${i}_max.y &&
            z >= u_domain${i}_min.z && z <= u_domain${i}_max.z) {
          domainIdx = ${i};
        }
      `).join('')}
      
      vec3 velocity = vec3(0.0);
      ${domains.map((d, i) => `
        if (domainIdx == ${i}) {
          velocity = evalDomain${i}Velocity(vec3(x, y, z));
        }
      `).join(' else ')}
      
      if (domainIdx == -1) {
        lifetime = -1.0; // Kill if outside all domains
      } else {
        x += velocity.x * u_delta_time;
        y += velocity.y * u_delta_time;
        z += velocity.z * u_delta_time;
        lifetime += u_delta_time;
      }
      
      gl_FragColor = vec4(x, y, z, lifetime);
    }
  `;
  
  return shader;
}
```

### Phase 3: Unified Injection Surface Handling

```typescript
function collectAllInjectionSamples(
  allDomains: PhysicsDomain[],
  sceneObjects: SceneObjectType[]
): THREE.Vector3[] {
  const samples: THREE.Vector3[] = [];
  
  for (const domain of allDomains) {
    const patch = buildInjectionSurfacePatch(domain, sceneObjects);
    if (patch && patch.samples.length > 0) {
      samples.push(...patch.samples);
    }
  }
  
  return samples;
}
```

Since `buildInjectionSurfacePatch` now filters transparent objects, only non-transparent sources will contribute samples.

### Phase 4: Integration with SceneView

**Replace**:
```tsx
physicsDomains.map(domain => (
  <ParticleGPUBridge
    domain={domain}
    ...
  />
))
```

**With**:
```tsx
<UnifiedParticleSystem
  allDomains={physicsDomains}
  sceneObjects={sceneObjects}
  ...
/>
```

## Test Plan with Test_Model_4

### Setup
1. Remove SlitTop injection surface from Domain 2 (or keep it but it's filtered due to `physicsTransparent`)
2. Only SquareBox in Domain 1 spawns particles

### Expected Behavior
1. Particles spawn at SquareBox front face
2. Travel through Domain 1 with spherical wave velocity
3. Cross Screen boundary (z = 0) without dying
4. Enter Domain 2 automatically
5. Velocity switches to two-slit wave equation
6. SlitTop and SlitBottom are transparent (no spawning)
7. Particles continue to Wall

### Validation
- No particles should spawn at slits
- Trajectories should be continuous across domain boundary
- Particle count should be conserved (no duplication or loss)
- Velocity field should change smoothly at domain transition

## Performance Considerations

### Shader Complexity
- **Issue**: Large shader with N domain equations may hit size limits
- **Mitigation**: 
  - Use shared helper functions
  - Optimize transpiled GLSL
  - Test with 2-3 domains first

### Bounds Checking
- **Issue**: Checking N domain bounds per particle per frame
- **Mitigation**:
  - Sort domains spatially
  - Early exit on first match
  - For Test_Model_4: Only 2 domains, negligible cost

### Memory
- **Current**: N domains × M particles = N textures
- **Unified**: 1 texture for all particles
- **Win**: Reduced memory footprint

## Risks & Fallbacks

### Risk: Shader compilation failure with many domains
**Fallback**: Limit to 4-5 domains, show error for more

### Risk: Equation transpilation incompatibilities
**Fallback**: Require domains to use compatible equation types

### Risk: Performance degradation
**Fallback**: Make unified system optional, keep per-domain mode

## Future Enhancements

1. **Domain ID tracking**: Store explicit domain ID in particle state for efficiency
2. **CPU particle physics**: Mirror GPU multi-domain logic for debugging
3. **Domain priority**: Handle overlapping domains with priority rules
4. **Conditional injection**: Spawn particles based on wave function magnitude at injection surface
