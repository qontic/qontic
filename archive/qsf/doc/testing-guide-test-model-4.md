# Test Model 4 Cross-Domain Particle Flow - Testing Guide

## What Changed

### 1. Physics-Transparent Injection Filter
- **File**: `src/injectionSurfaces.ts`
- **Change**: Objects marked with `physicsTransparent: true` no longer create injection surfaces
- **Effect**: SlitTop and SlitBottom in Test Model 4 will NOT spawn particles

### 2. Cross-Domain Particle Movement
- **Files**: `src/ParticleComputeGPU.tsx`, `src/ParticleGPUBridge.tsx`, `src/SceneView.tsx`
- **Change**: Particles check ALL domain bounds before being killed
- **Effect**: Particles can move from Domain 1 to Domain 2 without dying

## How It Works (Simple Explanation)

**Before**:
1. Particle reaches edge of Domain 1 → **killed**
2. Domain 2 separately spawns particles at slits
3. No connection between domains

**After**:
1. Particle reaches edge of Domain 1
2. System checks: "Is particle still in Domain 2?" → **Yes**
3. Particle continues living, now using Domain 2's equations
4. Only dies if outside ALL domains

## Testing Steps

### 1. Load Test Model 4
```bash
# In the application, open Test_Model_4.json
```

### 2. Expected Behavior

**Particle Spawning**:
- ✅ Particles should spawn ONLY at SquareBox front face (Domain 1 source)
- ✅ NO particles should spawn at SlitTop or SlitBottom (they're transparent)

**Particle Motion**:
- ✅ Particles travel from SquareBox toward Screen (Domain 1)
- ✅ Particles cross Screen boundary (z = 0) WITHOUT dying
- ✅ Particles enter Domain 2 automatically
- ✅ Particles continue to Wall with two-slit interference pattern

**Trajectories**:
- ✅ Should be continuous across domain boundary (no breaks)
- ✅ Should show smooth paths from source through slits to wall

### 3. What to Check

1. **Injection surfaces**: Run with console open, look for:
   ```
   [InjectionSurface] Skipping transparent object "SlitTop" for injection
   [InjectionSurface] Skipping transparent object "SlitBottom" for injection
   ```

2. **Particle count**: 
   - Only Domain 1 should have non-zero "Total Injected" count initially
   - Domain 2 should show active particles but NOT inject new ones

3. **Visual flow**:
   - Watch particles travel from source → through slits → to wall
   - Should be one continuous stream, not separate spawn points

### 4. Troubleshooting

**If particles still die at Screen**:
- Check console for shader errors
- Verify allDomains prop is being passed
- Check that Domain 2 bounds include area past Screen

**If particles spawn at slits**:
- Verify SlitTop/SlitBottom have `"physicsTransparent": true` in model JSON
- Check console for "Skipping transparent object" messages

**If particles don't move correctly in Domain 2**:
- Verify Domain 2 particle equation is correct
- Check domain bounds overlap at Screen position

## Model Configuration

### Current Test_Model_4.json Setup

**Domain 1: "Source to Screen"**
- Rules: `z > Source.z and z < Screen.z - Screen.dz/2`
- Wave: Spherical wave from SquareBox
- Injection: SquareBox front face → Screen
- Particles: Should spawn here

**Domain 2: "Screen to Wall"**
- Rules: `z > Screen.z + Screen.dz/2 and z < Wall.z - Wall.dz/2`
- Wave: Two-slit interference
- Injection: ~~SlitTop front face~~ (now filtered out)
- Particles: Should receive from Domain 1

**Transparent Objects**:
- SlitTop: `physicsTransparent: true`
- SlitBottom: `physicsTransparent: true`

## Success Criteria

✅ Particles spawn only at source (SquareBox)
✅ No spawning at slits
✅ Continuous trajectories across domains
✅ Proper two-slit pattern emerges at wall
✅ No particle count discontinuities

## Advanced Testing

### Multi-Domain Edge Cases

1. **Particle at exact boundary**: Should not die
2. **Overlapping domains**: Particle remains alive
3. **Gap between domains**: Particle should die
4. **Three domains**: Should work with any number

### Performance

- Multi-domain checking adds small GPU cost
- For 2 domains (Test Model 4): negligible
- Monitor frame rate for large particle counts

## Rollback Instructions

If this causes issues, revert these changes:
1. `src/injectionSurfaces.ts` line ~44: Remove transparent check
2. `src/ParticleComputeGPU.tsx`: Restore original bounds-killing logic
3. Remove `allDomains` prop from chain

Or set a feature flag to disable multi-domain mode.
