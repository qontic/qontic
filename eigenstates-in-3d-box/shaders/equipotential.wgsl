@group(0) @binding(1) var<storage, read> wave: array<WaveCell>;

struct EquipOut {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec3<f32>,
  @location(1) alpha: f32,
  @location(2) lineCoordPx: f32,
};

fn hiddenEquipOut() -> EquipOut {
  var out: EquipOut;
  out.position = vec4<f32>(2.0, 2.0, 2.0, 1.0);
  out.color = vec3<f32>(0.0);
  out.alpha = 0.0;
  out.lineCoordPx = 0.0;
  return out;
}
fn gridLogRho(xy: vec2<i32>, z: i32) -> f32 {
  let s = simResI();
  let q = clamp(xy, vec2<i32>(0), s.xy - vec2<i32>(1));
  let sliceZ = clamp(z, 0, s.z - 1);
  let spinor = waveSpinor(wave[voxelIndexI(vec3<i32>(q.x, q.y, sliceZ))]);
  return log(max(spinorRho(spinor), uni.contour1.x));
}
fn logRhoPatch(base: vec2<i32>, z: i32) -> mat4x4<f32> {
  return mat4x4<f32>(
    vec4<f32>(gridLogRho(base + vec2<i32>(-1, -1), z), gridLogRho(base + vec2<i32>(-1,  0), z), gridLogRho(base + vec2<i32>(-1,  1), z), gridLogRho(base + vec2<i32>(-1,  2), z)),
    vec4<f32>(gridLogRho(base + vec2<i32>( 0, -1), z), gridLogRho(base + vec2<i32>( 0,  0), z), gridLogRho(base + vec2<i32>( 0,  1), z), gridLogRho(base + vec2<i32>( 0,  2), z)),
    vec4<f32>(gridLogRho(base + vec2<i32>( 1, -1), z), gridLogRho(base + vec2<i32>( 1,  0), z), gridLogRho(base + vec2<i32>( 1,  1), z), gridLogRho(base + vec2<i32>( 1,  2), z)),
    vec4<f32>(gridLogRho(base + vec2<i32>( 2, -1), z), gridLogRho(base + vec2<i32>( 2,  0), z), gridLogRho(base + vec2<i32>( 2,  1), z), gridLogRho(base + vec2<i32>( 2,  2), z))
  );
}
fn cubic(a: f32, b: f32, c: f32, d: f32, t: f32) -> f32 {
  let p = (d - c) - (a - b);
  let q = (a - b) - p;
  let r = c - a;
  return ((p * t + q) * t + r) * t + b;
}
fn cubicDeriv(a: f32, b: f32, c: f32, d: f32, t: f32) -> f32 {
  let p = (d - c) - (a - b);
  let q = (a - b) - p;
  let r = c - a;
  return (3.0 * p * t + 2.0 * q) * t + r;
}
fn bicubicLogRho(samples: mat4x4<f32>, f: vec2<f32>) -> f32 {
  let row0 = cubic(samples[0][0], samples[1][0], samples[2][0], samples[3][0], f.x);
  let row1 = cubic(samples[0][1], samples[1][1], samples[2][1], samples[3][1], f.x);
  let row2 = cubic(samples[0][2], samples[1][2], samples[2][2], samples[3][2], f.x);
  let row3 = cubic(samples[0][3], samples[1][3], samples[2][3], samples[3][3], f.x);
  let smoothValue = cubic(row0, row1, row2, row3, f.y);
  let linearValue = mix(mix(samples[1][1], samples[2][1], f.x), mix(samples[1][2], samples[2][2], f.x), f.y);
  return mix(linearValue, smoothValue, 0.72);
}
fn bicubicGradLogRho(samples: mat4x4<f32>, f: vec2<f32>) -> vec2<f32> {
  let row0 = cubic(samples[0][0], samples[1][0], samples[2][0], samples[3][0], f.x);
  let row1 = cubic(samples[0][1], samples[1][1], samples[2][1], samples[3][1], f.x);
  let row2 = cubic(samples[0][2], samples[1][2], samples[2][2], samples[3][2], f.x);
  let row3 = cubic(samples[0][3], samples[1][3], samples[2][3], samples[3][3], f.x);
  let dx0 = cubicDeriv(samples[0][0], samples[1][0], samples[2][0], samples[3][0], f.x);
  let dx1 = cubicDeriv(samples[0][1], samples[1][1], samples[2][1], samples[3][1], f.x);
  let dx2 = cubicDeriv(samples[0][2], samples[1][2], samples[2][2], samples[3][2], f.x);
  let dx3 = cubicDeriv(samples[0][3], samples[1][3], samples[2][3], samples[3][3], f.x);
  let smoothGrad = vec2<f32>(
    cubic(dx0, dx1, dx2, dx3, f.y),
    cubicDeriv(row0, row1, row2, row3, f.y)
  );
  let linearGrad = vec2<f32>(
    mix(samples[2][1] - samples[1][1], samples[2][2] - samples[1][2], f.y),
    mix(samples[1][2] - samples[1][1], samples[2][2] - samples[2][1], f.x)
  );
  return mix(linearGrad, smoothGrad, 0.72);
}
fn crossesLevel(a: f32, b: f32, level: f32) -> bool {
  return (a < level && b >= level) || (b < level && a >= level);
}
fn edgeCrossing(pa: vec2<f32>, pb: vec2<f32>, va: f32, vb: f32, level: f32) -> vec2<f32> {
  let denom = vb - va;
  var t = 0.5;
  if (abs(denom) >= 1e-8) {
    t = clamp((level - va) / denom, 0.0, 1.0);
  }
  return mix(pa, pb, t);
}
fn contourColor(t: f32) -> vec3<f32> {
  let inner = vec3<f32>(0.74, 0.88, 0.58);
  let mid = vec3<f32>(0.25, 0.76, 0.70);
  let outer = vec3<f32>(0.18, 0.42, 0.58);
  if (t < 0.48) { return mix(inner, mid, smoothstep(0.0, 0.48, t)); }
  return mix(mid, outer, smoothstep(0.48, 1.0, t));
}
fn contourSliceZ(s: vec3<u32>) -> i32 {
  return i32(round(0.75 * f32(s.z - 1u)));
}
fn levelsetSliceZ(s: vec3<u32>, sliceId: u32, sliceCount: u32) -> i32 {
  if (${EQUIPOTENTIAL_PROJECT_TO_BOTTOM}u == 1u) {
    return contourSliceZ(s);
  }
  let sliceT = (f32(sliceId) + 0.5) / f32(sliceCount);
  return i32(round(sliceT * f32(s.z - 1u)));
}
fn levelsetRenderZ(sampleZ: i32) -> f32 {
  if (${EQUIPOTENTIAL_PROJECT_TO_BOTTOM}u == 1u) {
    return uni.contour1.y;
  }
  return f32(sampleZ) * uni.visual1.w;
}
fn levelsetSliceCount() -> u32 {
  if (${EQUIPOTENTIAL_PROJECT_TO_BOTTOM}u == 1u) {
    return 1u;
  }
  return max(1u, u32(round(uni.initState.w)));
}

@vertex
fn vs(@builtin(vertex_index) vertexIndex: u32) -> EquipOut {
  let levelCount = max(1u, u32(uni.contour0.x));
  let sliceCount = levelsetSliceCount();
  let subdiv = max(1u, u32(uni.contour0.y));
  let s = simResU();
  if (s.x < 2u || s.y < 2u || s.z < 1u) { return hiddenEquipOut(); }
  let cellsX = s.x - 1u;
  let cellsY = s.y - 1u;
  let subcellsPerCell = subdiv * subdiv;
  let quadVertex = vertexIndex % 6u;
  let segmentId = vertexIndex / 6u;
  let segmentInSubcell = segmentId % 2u;
  let subcellLevelId = segmentId / 2u;
  let levelId = subcellLevelId % levelCount;
  let sliceSubcellId = subcellLevelId / levelCount;
  let sliceId = sliceSubcellId % sliceCount;
  let subcellId = sliceSubcellId / sliceCount;
  let localSubcellId = subcellId % subcellsPerCell;
  let cellId = subcellId / subcellsPerCell;
  let x = cellId % cellsX;
  let y = cellId / cellsX;
  if (y >= cellsY) { return hiddenEquipOut(); }
  let subX = localSubcellId % subdiv;
  let subY = localSubcellId / subdiv;
  let z = levelsetSliceZ(s, sliceId, sliceCount);
  let level = uni.contour0.z - f32(levelId) * uni.contour0.w;
  let invSubdiv = 1.0 / f32(subdiv);
  let subBase = vec2<f32>(f32(subX), f32(subY)) * invSubdiv;
  let cellBase = vec2<f32>(f32(x), f32(y));
  let samples = logRhoPatch(vec2<i32>(i32(x), i32(y)), z);
  let f00 = subBase;
  let f10 = subBase + vec2<f32>(invSubdiv, 0.0);
  let f11 = subBase + vec2<f32>(invSubdiv, invSubdiv);
  let f01 = subBase + vec2<f32>(0.0, invSubdiv);
  let v00 = bicubicLogRho(samples, f00);
  let v10 = bicubicLogRho(samples, f10);
  let v11 = bicubicLogRho(samples, f11);
  let v01 = bicubicLogRho(samples, f01);
  let g00 = cellBase + f00;
  let g10 = cellBase + f10;
  let g11 = cellBase + f11;
  let g01 = cellBase + f01;
  var crossings: array<vec2<f32>, 4>;
  var count = 0u;
  if (crossesLevel(v00, v10, level)) { crossings[count] = edgeCrossing(g00, g10, v00, v10, level); count = count + 1u; }
  if (crossesLevel(v10, v11, level)) { crossings[count] = edgeCrossing(g10, g11, v10, v11, level); count = count + 1u; }
  if (crossesLevel(v11, v01, level)) { crossings[count] = edgeCrossing(g11, g01, v11, v01, level); count = count + 1u; }
  if (crossesLevel(v01, v00, level)) { crossings[count] = edgeCrossing(g01, g00, v01, v00, level); count = count + 1u; }
  let firstCrossing = segmentInSubcell * 2u;
  if (count < firstCrossing + 2u) { return hiddenEquipOut(); }
  let aGrid = crossings[firstCrossing];
  let bGrid = crossings[firstCrossing + 1u];
  let segment = bGrid - aGrid;
  if (dot(segment, segment) < 1e-8) { return hiddenEquipOut(); }
  let useB = quadVertex == 1u || quadVertex == 4u || quadVertex == 5u;
  let usePositiveSide = quadVertex == 2u || quadVertex == 3u || quadVertex == 5u;
  let side = select(-1.0, 1.0, usePositiveSide);
  let gridPos = select(aGrid, bGrid, useB);
  let localPos = clamp(gridPos - cellBase, vec2<f32>(0.0), vec2<f32>(1.0));
  let gradMag = length(bicubicGradLogRho(samples, localPos));
  let gradLight = smoothstep(0.025, 0.42, gradMag);
  let denom = max(1.0, f32(levelCount - 1u));
  let levelT = f32(levelId) / denom;
  let baseColor = contourColor(levelT);
  var out: EquipOut;
  out.color = baseColor * mix(0.38, 1.18, gradLight);
  out.alpha = mix(0.045, mix(0.52, 0.30, levelT), pow(gradLight, 0.75));
  let contourZ = levelsetRenderZ(z);
  let clipA = uni.viewProj * vec4<f32>(aGrid.x * uni.visual1.w, aGrid.y * uni.visual1.w, contourZ, 1.0);
  let clipB = uni.viewProj * vec4<f32>(bGrid.x * uni.visual1.w, bGrid.y * uni.visual1.w, contourZ, 1.0);
  var clip = clipA;
  if (useB) { clip = clipB; }
  let ndcA = clipA.xy / max(1e-6, clipA.w);
  let ndcB = clipB.xy / max(1e-6, clipB.w);
  let screenDir = (ndcB - ndcA) * uni.viewport.xy;
  let screenLen = length(screenDir);
  if (screenLen < 1e-4) { return hiddenEquipOut(); }
  let normalPx = vec2<f32>(-screenDir.y, screenDir.x) / screenLen;
  let halfWidthPx = max(0.5, 0.5 * uni.contour1.z);
  let aaPx = 1.25;
  let outerHalfWidthPx = halfWidthPx + aaPx;
  let ndcOffset = normalPx * side * outerHalfWidthPx * 2.0 / max(uni.viewport.xy, vec2<f32>(1.0));
  out.lineCoordPx = side * outerHalfWidthPx;
  out.position = vec4<f32>(
    clip.x + ndcOffset.x * clip.w,
    clip.y + ndcOffset.y * clip.w,
    clip.z,
    clip.w
  );
  return out;
}

@fragment
fn fs(in: EquipOut) -> @location(0) vec4<f32> {
  let halfWidthPx = max(0.5, 0.5 * uni.contour1.z);
  let aaPx = 1.25;
  let edge = 1.0 - smoothstep(halfWidthPx, halfWidthPx + aaPx, abs(in.lineCoordPx));
  return vec4<f32>(in.color, in.alpha * edge);
}
