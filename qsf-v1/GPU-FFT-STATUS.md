# GPU FFT Implementation - Testing & Verification Guide

## Current Status

### ✓ Completed
- WebGL 1.0 compatible GPU FFT framework with butterfly shader operations
- WebGL 1.0 shader fixes (removed bitwise operators, while loops)
- CPU reference FFT implementation (verified working with zero roundtrip error)
- Texture management and FBO operations
- Forward FFT verification (DC component correct)
- IFFT parameter system (`skipBitReverse` flag)
- Separable 2D FFT with per-dimension bit-reversal

### 🔄 In Progress
- Testing separable bit-reversal fix (horizontal → vertical)
- Verifying IFFT doesn't rebit-reverse FFT output
- Roundtrip error validation

### ⚠️ Known Issues & Solutions
1. **Original Issue**: IFFT producing ~10% error instead of <0.1%
   - **Root Cause**: Bit-reversal strategy was flawed
   - **Solution Implemented**: Changed from full 2D bit-reversal to separable (per-row, per-column)
   - **Logic**: 
     - Separable FFT requires bit-reversal within each 1D vector (row or column)
     - Not a full 2D permutation across all dimensions

2. **IFFT Bit-Reversal**: IFFT should NOT re-bit-reverse forward FFT output
   - **Solution**: Added `skipBitReverse` parameter to `fft2D()`
   - IFFT now called with `skipBitReverse=true` to skip the input bit-reversal

## Test Files

### 1. `test-gpu-fft-constant.html` (NEW - Recommended)
**Purpose**: Clean, focused test for constant signal roundtrip
- **What it tests**: FFT of all-ones signal → IFFT → recover all-ones
- **Expected results**:
  - Forward FFT DC = 64 (for 8×8 grid)
  - Non-DC components ≈ 0
  - IFFT max error < 1e-4
- **How to run**: `python3 -m http.server 8000` then `http://localhost:8000/test-gpu-fft-constant.html`

### 2. `test-gpu-fft-minimal.html` (Updated)
**Purpose**: Complete FFT/IFFT test with detailed diagnostics
- Now tests with constant signal (all pixels = 1.0)
- Shows FFT DC component and non-DC values
- Detailed IFFT roundtrip error analysis

### 3. `test-cpu-fft-ref.html` (Reference)
**Purpose**: CPU reference FFT (validates algorithm correctness)
- Pure JavaScript implementation
- Known to work perfectly (zero roundtrip error)
- Can be used to compare GPU results

## Technical Details

### Separable 2D FFT Algorithm (After Fix)
```
Forward FFT:
  1. Bit-reverse HORIZONTALLY (within each row)
  2. Apply horizontal butterflies (row-by-row)
  3. Bit-reverse VERTICALLY (within each column)
  4. Apply vertical butterflies (column-by-column)

Inverse FFT:
  1. Apply inverse vertical butterflies
  2. Apply inverse horizontal butterflies
  3. Scale by 1/(width × height)
```

### Why This Fix Matters
- **Old approach**: Full 2D bit-reversal permuted elements across rows/columns
- **New approach**: Separable bit-reversal preserves 2D structure
- **Result**: Should fix the ~10% error → near-zero error

### Butterfly Shader Twiddle Factor
```glsl
float angle = -2.0 * PI * float(k) / float(butterflySpan);
if (u_direction == 1) angle = -angle;  // Inverse FFT
```
- Forward: angle = -2π*k/N (standard)
- Inverse: angle = +2π*k/N (negated)

### IFFT Normalization
```javascript
if (inverse) {
   const scale = 1.0 / (width * height);
   scaleTexture(srcTex, dstFBO, width, height, scale);
}
```

## Validation Checklist

### Phase 1: DC Component Verification
- [ ] FFT of 8×8 all-ones texture produced DC = 64
- [ ] Non-DC components are near zero

### Phase 2: Roundtrip Error Check
- [ ] IFFT of FFT result recovers original (max error < 1e-4)
- [ ] Error is uniform across all pixels
- [ ] Scaling is applied correctly

### Phase 3: Larger Grid Test
- [ ] Test works on 16×16 grid
- [ ] Test works on 256×256 grid (deployment target)

### Phase 4: Integration
- [ ] Create `spectral-solver-gpu.js` module
- [ ] Integrate into `double-slit.js`
- [ ] Compare with CPU solver accuracy

## Next Steps

1. **Immediate**: Test constant signal roundtrip in browser
   - Open `test-gpu-fft-constant.html`
   - Check console for roundtrip error
   - Expected: max_err < 1e-4

2. **If test passes**:
   - Create `spectral-solver-gpu.js` using GPU FFT
   - Integrate circular wavefront logic
   - Create quantum simulator test

3. **If test fails**:
   - Check browser console for errors
   - Add debug output in butterfly shader
   - Consider texture format issues (currently RGBA float)

## Code Location Reference

- **GPU FFT Core**: `js/gpu-fft.js` (534 lines)
- **Bit-reversal Logic**: Lines 353-398 (separable approach)
- **IFFT Scaling**: Lines 431-434
- **Test Files**: `test-gpu-fft-*.html`

## Performance Notes

- Butterfly stages: O(log N) per dimension
- Total complexity: O(N² log N) for N×N grid (like CPU FFT)
- GPU advantages: Memory bandwidth, parallel pixel writes
- Current bottleneck: CPU → GPU texture transfer, GPU → CPU readback

## References

- Cooley-Tukey FFT algorithm
- Separable 2D FFT for image processing
- WebGL 1.0 compatibility constraints
