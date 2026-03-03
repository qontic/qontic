# Domain Transition Solution: Transparent Pass-Through

## User Request

> "I want particles in certain surfaces (volumes) to only emit particles when they receive a particles. I am thinking it would be more natural if particles could just transition from one domain to another just pure kinematics (just move it from one to another). That is why things happen in 'Real Life'. In that case, we would only have the source in domain source. Can we make the slits transparent so when particles reach them, they just keep going to the following domain."

## Problem Statement

### Current Behavior (Discontinuous)

1. **Domain 1 (Source to Screen)**:
   - Particles spawn at SquareBox surface
   - Travel toward Screen
   - **DIE** when reaching domain boundary (Screen z-position)

2. **Domain 2 (Screen to Wall)**:
   - Particles spawn at SlitTop surface (manually configured)
   - No coordination with Domain 1 arrival
   - User must set up emission-on-receive logic (doesn't exist yet)

### Desired Behavior (Continuous)

1. **Domain 1**: Particles spawn at source
2. **Transition**: Particles cross Screen boundary **without dying**
3. **Domain 2**: Same particles continue with new wave equation/velocity field
4. **No spawning at slits** - particles just pass through

## Solution Components

### 1. Domain Boundary Transparency

Instead of killing particles at domain boundaries, check if particle is entering another domain:

```typescript
// Current:
if (x < bounds.min.x || x > bounds.max.x || ...) {
  lifetime = -1.0; // Kill
}

// Proposed:
if (outsideBounds && !enteringAnotherDomain(position)) {
  lifetime = -1.0; // Only kill if exiting simulation entirely
}
```

### 2. Cross-Domain Particle Transfer

**Option A: Shared Particle Pool** (Simpler)
- All domains share one global particle texture
- Each particle has a `currentDomainId` field
- Update shader samples from whichever domain particle is currently in

**Option B: Domain Handoff** (More Complex)
- Each domain maintains its own particle system (current approach)
- When particle crosses boundary, copy state to target domain's texture
- Mark as "transferred" in source domain

### 3. Physics-Transparent Objects

Use existing `physicsTransparent` flag to:
- Mark objects like slits that should NOT spawn particles
- Filter injection surfaces: only create them for non-transparent objects
- In Test Model 4: SlitTop and SlitBottom already have this flag

### 4. Wave Equation Continuity

When particle enters new domain:
- Switch to new domain's velocity field (v = particle equation)
- Maintain position and momentum (continuous trajectory)
- No need for re-spawning logic

## Implementation Strategy

### Phase 1: Detect Adjacent Domains

```typescript
// In ParticleComputeGPU or higher level
function findDomainAtPosition(
  position: THREE.Vector3,
  allDomains: PhysicsDomain[],
  sceneObjects: SceneObjectType[]
): PhysicsDomain | null {
  for (const domain of allDomains) {
    const bounds = parseDomainBounds(domain, sceneObjects, ...);
    if (bounds.containsPoint(position)) {
      return domain;
    }
  }
  return null;
}
```

### Phase 2: Multi-Domain Particle System

**Approach**: Extend ParticleComputeGPU to be **multi-domain aware**

Current: Each domain has separate `ParticleGPUBridge` → `ParticleComputeGPU`

Proposed: One `MultiDomainParticleCompute` that:
- Tracks which domain each particle is in
- Samples velocity from appropriate domain's wave equation
- Allows particles to transition between domains

### Phase 3: Filter Injection Surfaces

```typescript
// In injectionSurfaces.ts or ParticleGPUBridge.tsx
function shouldCreateInjectionSurface(
  surface: InjectionSurface,
  sceneObjects: SceneObjectType[]
): boolean {
  const sourceObj = sceneObjects.find(o => o.id === surface.sourceObjectId);
  return !sourceObj?.physicsTransparent;
}
```

## Architecture Decision: Single vs Multi Particle System

### Option 1: Single Global Particle System (RECOMMENDED)

**Pros**:
- Natural continuous motion across domains
- No transfer logic needed
- Simpler state management
- Easier to debug

**Cons**:
- Bigger architectural change
- Need to refactor per-domain particle systems

**Implementation**:
- Move `ParticleComputeGPU` up to SceneView level
- Pass array of all domains
- Shader selects domain based on particle position
- Use if/else or domain ID lookup in GLSL

### Option 2: Per-Domain with Transfer

**Pros**:
- Minimal changes to existing structure
- Domains remain independent

**Cons**:
- Complex handoff logic
- Risk of particle duplication or loss
- Performance overhead checking boundaries every frame

## Recommended Path Forward

1. **Create experimental multi-domain particle compute**
   - New component: `UnifiedParticleSystem.tsx`
   - Takes all domains as input
   - Single particle texture for entire scene

2. **Add domain ID to particle state**
   - Current: `vec4(x, y, z, lifetime)`
   - Proposed: Use separate texture or pack domain ID into unused bits

3. **Dynamic velocity evaluation**
   - GLSL: Look up which domain particle is in
   - Sample that domain's wave equation
   - Evaluate velocity from correct equation

4. **Respect physicsTransparent flag**
   - Filter injection surfaces at creation time
   - Only spawn particles at opaque sources

## Test Model 4 Expected Outcome

After implementation:
- Particles spawn only at SquareBox (source)
- Travel through Domain 1 to Screen
- Pass through slits (SlitTop/SlitBottom are transparent)
- Enter Domain 2 automatically
- Follow two-slit wave equation in Domain 2
- Continue to Wall
- No manual spawning at slits needed

## Files to Modify

1. `src/ParticleComputeGPU.tsx` - Add multi-domain support or create new version
2. `src/ParticleGPUBridge.tsx` - Filter transparent injection surfaces
3. `src/SceneView.tsx` - Potentially unify particle systems
4. `src/types.ts` - May need to add `currentDomainId` to particle state
5. `models/Test_Model_4.json` - Remove SlitTop injection surface

## Questions to Resolve

1. **Performance**: How expensive is per-particle domain lookup in GLSL?
2. **Wave equation switching**: Can we compile multiple wave equations into one shader?
3. **Boundary precision**: How to handle particles exactly at domain boundary?
4. **Backwards compatibility**: Should old per-domain mode still work?
