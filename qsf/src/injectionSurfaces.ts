import * as THREE from 'three';
import type { PhysicsDomain, SceneObjectType, InjectionSurface } from './types';

// ---------------------------------------------------------------------------
// Quantum injection helpers
// ---------------------------------------------------------------------------

/**
 * Build a 1-D prefix-sum CDF over an array of non-negative weights
 * (|ψ|² values from a target-face N×N grid, stored in row-major order).
 * The returned array has the same length as `weights`; the last entry is
 * always 1.0 (normalised).  Zero-weight entries contribute nothing.
 */
export function buildPsi2CDF(weights: Float32Array): Float32Array {
  const n = weights.length;
  const cdf = new Float32Array(n);
  let sum = 0;
  for (let i = 0; i < n; i++) sum += Math.max(0, weights[i]);
  if (sum === 0) {
    // Uniform fallback when all weights are zero
    for (let i = 0; i < n; i++) cdf[i] = (i + 1) / n;
    return cdf;
  }
  let running = 0;
  for (let i = 0; i < n; i++) {
    running += Math.max(0, weights[i]);
    cdf[i] = running / sum;
  }
  cdf[n - 1] = 1.0; // guard
  return cdf;
}

/**
 * Sample a world-space point on a rectangular target face using the CDF.
 * `N` is the grid side length (total cells = N*N).
 * A tiny uniform jitter within the cell avoids re-using the exact same
 * grid point on every draw.
 */
export function sampleTargetPoint(
  cdf: Float32Array,
  N: number,
  targetOrigin: THREE.Vector3,
  targetHalfU: THREE.Vector3,
  targetHalfV: THREE.Vector3,
): THREE.Vector3 {
  // Binary-search CDF for a uniform [0,1) draw
  const r = Math.random();
  let lo = 0, hi = cdf.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cdf[mid] < r) lo = mid + 1; else hi = mid;
  }
  // lo is the chosen cell index in the flattened grid
  const row = Math.floor(lo / N);
  const col = lo % N;

  // Centre of the cell in [-1, 1]² parameter space, plus jitter
  const jU = (col + Math.random()) / N * 2 - 1; // -1..1
  const jV = (row + Math.random()) / N * 2 - 1;

  return targetOrigin.clone()
    .addScaledVector(targetHalfU, jU)
    .addScaledVector(targetHalfV, jV);
}

/**
 * Trace a reverse-Bohmian ray from `targetPoint` in direction `-velocity`
 * and find which spawn-surface rectangle it hits first (t > 0).
 * Returns { surfaceIndex, hitPoint } or null if no surface is hit.
 */
export function traceReverseRay(
  targetPoint: THREE.Vector3,
  velocity: THREE.Vector3,
  spawnSurfaces: SpawnSurface[],
): { surfaceIndex: number; hitPoint: THREE.Vector3 } | null {
  const _u = new THREE.Vector3();
  const _v = new THREE.Vector3();
  const _n = new THREE.Vector3();
  const _toP = new THREE.Vector3();

  let bestT = Infinity;
  let bestIdx = -1;
  let bestHit: THREE.Vector3 | null = null;

  for (let idx = 0; idx < spawnSurfaces.length; idx++) {
    const ss = spawnSurfaces[idx];
    if (ss.kind !== 'rect') continue;

    const O = new THREE.Vector3(...ss.origin);
    _u.set(...ss.halfU);
    _v.set(...ss.halfV);
    _n.crossVectors(_u, _v).normalize();

    // Ray: Q(t) = targetPoint - t * velocity  (reverse direction)
    // Plane: n · (Q - O) = 0  →  t = n·(P - O) / n·v
    const nDotV = _n.dot(velocity);
    if (Math.abs(nDotV) < 1e-10) continue; // parallel

    _toP.subVectors(targetPoint, O);
    const t = _toP.dot(_n) / nDotV;
    if (t <= 0) continue; // hit is behind us

    // Intersection in world space
    const hit = targetPoint.clone().addScaledVector(velocity, -t);

    // Check local [-1,1]² coords
    const hitLocal = hit.clone().sub(O);
    const uLen2 = _u.lengthSq();
    const vLen2 = _v.lengthSq();
    if (uLen2 < 1e-20 || vLen2 < 1e-20) continue;
    const lu = hitLocal.dot(_u) / uLen2;
    const lv = hitLocal.dot(_v) / vLen2;
    if (lu < -1 || lu > 1 || lv < -1 || lv > 1) continue;

    if (t < bestT) {
      bestT = t;
      bestIdx = idx;
      bestHit = hit;
    }
  }

  if (bestIdx < 0 || !bestHit) return null;
  return { surfaceIndex: bestIdx, hitPoint: bestHit };
}

// ---------------------------------------------------------------------------
// QuantumPoolManager
// ---------------------------------------------------------------------------

const QUANTUM_POOL_DEFAULT_SIZE = 200;
const QUANTUM_POOL_LOW_WATER = 50;
const QUANTUM_REFILL_BATCH = 50;

/**
 * Per-surface descriptor used by the direct-sampling mode.
 * Contains a pre-built |ψ|² CDF evaluated ON the injection surface itself,
 * so that particles can be spawned directly without any back-propagation.
 */
export type DirectSurfaceCdf = {
  cdf: Float32Array;
  N: number;
  origin: THREE.Vector3;
  halfU: THREE.Vector3;
  halfV: THREE.Vector3;
};

export class QuantumPoolManager {
  /** Per-surface queues of pre-traced spawn positions. */
  private pools: Map<number, THREE.Vector3[]> = new Map();
  private readonly spawnSurfaces: SpawnSurface[];
  // --- back-propagation mode fields ---
  private readonly cdf: Float32Array;
  private readonly N: number;
  private readonly targetOrigin: THREE.Vector3;
  private readonly targetHalfU: THREE.Vector3;
  private readonly targetHalfV: THREE.Vector3;
  private readonly evaluateVelocity: (p: THREE.Vector3) => THREE.Vector3 | null;
  // --- direct-sampling mode fields ---
  private readonly directSurfaceCdfs: DirectSurfaceCdf[] | null;
  private readonly poolSize: number;
  private readonly lowWater: number;

  constructor(opts: {
    spawnSurfaces: SpawnSurface[];
    cdf: Float32Array;
    N: number;
    targetOrigin: THREE.Vector3;
    targetHalfU: THREE.Vector3;
    targetHalfV: THREE.Vector3;
    evaluateVelocity: (p: THREE.Vector3) => THREE.Vector3 | null;
    poolSize?: number;
    lowWater?: number;
    /**
     * When provided, the pool operates in "direct mode":
     * particles are spawned by sampling each injection surface directly
     * weighted by |ψ|² evaluated AT that surface (one entry per SpawnSurface).
     * This avoids the straight-line back-propagation approximation which
     * causes a central bias when outer-fringe reverse rays miss the slit.
     */
    directSurfaceCdfs?: DirectSurfaceCdf[];
  }) {
    this.spawnSurfaces = opts.spawnSurfaces;
    this.cdf = opts.cdf;
    this.N = opts.N;
    this.targetOrigin = opts.targetOrigin;
    this.targetHalfU = opts.targetHalfU;
    this.targetHalfV = opts.targetHalfV;
    this.evaluateVelocity = opts.evaluateVelocity;
    this.directSurfaceCdfs = opts.directSurfaceCdfs ?? null;
    this.poolSize = opts.poolSize ?? QUANTUM_POOL_DEFAULT_SIZE;
    this.lowWater = opts.lowWater ?? QUANTUM_POOL_LOW_WATER;

    // Initialise empty queues for every rect surface
    for (let i = 0; i < this.spawnSurfaces.length; i++) {
      if (this.spawnSurfaces[i].kind === 'rect') this.pools.set(i, []);
    }

    // Pre-fill on construction
    this.refillBatch(this.poolSize);
  }

  /**
   * Return (and permanently discard) one pre-traced spawn point for
   * `surfaceIndex`.  Returns null if the queue is currently empty; the
   * caller should fall back to freeform sampling in that case.
   */
  consume(surfaceIndex: number): THREE.Vector3 | null {
    const q = this.pools.get(surfaceIndex);
    if (!q || q.length === 0) return null;
    return q.pop()!;
  }

  /**
   * Fill up to `batchSize` new spawn points.
   *
   * Direct mode (directSurfaceCdfs provided — preferred):
   *   Samples each injection surface directly, weighted by |ψ|² evaluated
   *   AT that surface.  By Bohmian equivariance this produces the correct
   *   downstream distribution without any geometric approximation.
   *
   * Back-propagation mode (legacy):
   *   Samples the target face by |ψ|², evaluates the Bohmian velocity there,
   *   and traces a straight-line ray back to an injection surface.  This can
   *   produce a central bias when the slit is narrow and outer-fringe rays
   *   miss the slit opening.
   */
  refillBatch(batchSize: number = QUANTUM_REFILL_BATCH): void {
    // ── Direct mode ─────────────────────────────────────────────────────────
    if (this.directSurfaceCdfs && this.directSurfaceCdfs.length > 0) {
      const numSurfaces = this.directSurfaceCdfs.length;
      // Distribute the batch evenly across surfaces
      const perSurface = Math.max(1, Math.ceil(batchSize / numSurfaces));
      for (let si = 0; si < numSurfaces; si++) {
        const sc = this.directSurfaceCdfs[si];
        const q = this.pools.get(si);
        if (!q) continue;
        if (q.length >= this.poolSize * 2) continue;
        const toAdd = Math.min(perSurface, this.poolSize * 2 - q.length);
        for (let k = 0; k < toAdd; k++) {
          const pt = sampleTargetPoint(sc.cdf, sc.N, sc.origin, sc.halfU, sc.halfV);
          q.push(pt);
        }
      }
      return;
    }

    // ── Back-propagation mode (legacy) ───────────────────────────────────────
    let traced = 0;
    let attempts = 0;
    const maxAttempts = batchSize * 8; // avoid infinite loop if geometry is degenerate

    while (traced < batchSize && attempts < maxAttempts) {
      attempts++;

      const tp = sampleTargetPoint(
        this.cdf, this.N,
        this.targetOrigin, this.targetHalfU, this.targetHalfV,
      );

      const vel = this.evaluateVelocity(tp);
      if (!vel || vel.lengthSq() < 1e-20) continue;

      const result = traceReverseRay(tp, vel, this.spawnSurfaces);
      if (!result) continue;

      const { surfaceIndex, hitPoint } = result;
      const q = this.pools.get(surfaceIndex);
      if (!q) continue;

      // Only add if this surface queue still has room
      if (q.length < this.poolSize * 2) {
        q.push(hitPoint);
        traced++;
      }
    }
  }

  /** True when any surface pool is below the low-water threshold. */
  needsRefill(): boolean {
    for (const q of this.pools.values()) {
      if (q.length < this.lowWater) return true;
    }
    return false;
  }

  totalQueued(): number {
    let n = 0;
    for (const q of this.pools.values()) n += q.length;
    return n;
  }

  numSurfaces(): number {
    return this.pools.size;
  }
}

/**
 * Parametric description of an injection surface, used to generate
 * truly continuous random spawn positions (no pre-computed discrete pool).
 */
export type SpawnSurface =
  | { kind: 'rect'; origin: [number, number, number]; halfU: [number, number, number]; halfV: [number, number, number] }
  | { kind: 'sphereProject'; sphereCenter: [number, number, number]; sphereRadius: number; targetOrigin: [number, number, number]; targetHalfU: [number, number, number]; targetHalfV: [number, number, number] };

// Helper: flatten scene object tree so we can look up objects by id.
export const flattenSceneObjects = (roots: SceneObjectType[]): SceneObjectType[] => {
  const result: SceneObjectType[] = [];
  const walk = (objs: SceneObjectType[] | undefined) => {
    if (!objs) return;
    for (const o of objs) {
      result.push(o);
      if (o.children) walk(o.children);
    }
  };
  walk(roots);
  return result;
};

// Shared helper: build a mesh patch for geometric injection surfaces.
export const buildInjectionSurfacePatch = (
  domain: PhysicsDomain,
  sceneObjects: SceneObjectType[],
): { samples: THREE.Vector3[]; indices: Uint32Array; spawnSurfaces: SpawnSurface[] } | null => {
  const raw = domain.injectionSurfaces;
  const surfaces = (Array.isArray(raw) ? raw : []) as InjectionSurface[];
  if (!surfaces || surfaces.length === 0) return null;

  const allObjects = flattenSceneObjects(sceneObjects);
  const samples: THREE.Vector3[] = [];
  const indices: number[] = [];
  const spawnSurfaces: SpawnSurface[] = [];

  const makeObject3D = (obj: SceneObjectType): THREE.Object3D => {
    const node = new THREE.Object3D();
    node.position.set(obj.position[0], obj.position[1], obj.position[2]);
    node.rotation.set(obj.rotation[0], obj.rotation[1], obj.rotation[2]);
    node.scale.set(obj.scale[0], obj.scale[1], obj.scale[2]);
    return node;
  };

  for (const s of surfaces) {
    const sourceObj = allObjects.find(o => o.id === s.sourceObjectId);
    if (!sourceObj) continue;

    // NOTE: physicsTransparent only means the object does not kill particles on contact.
    // It does NOT prevent the object from being used as an explicit injection surface.
    // A user can configure a slit opening as a spawn surface on purpose.

    // Box face surfaces (screens, slits, etc.)
    if (s.kind === 'rect') {
      const srcNode = makeObject3D(sourceObj);
      const segments = (s.uSegments && s.uSegments > 1
        ? s.uSegments
        : s.vSegments && s.vSegments > 1
          ? s.vSegments
          : 24);
      const uSeg = segments;
      const vSeg = segments;

      const face = s.face || 'front';

      const startIndex = samples.length;

      // Small offset so preview geometry sits slightly "in front of"
      // the underlying box surface, avoiding z-fighting.
      const faceOffset = 0.002;

      // Check if we have a target to project onto the source face
      const hasTarget = !!s.targetObjectId;
      const targetObj = hasTarget ? allObjects.find(o => o.id === s.targetObjectId) : undefined;

      if (hasTarget && targetObj) {
        // Project the target's face onto the source box face.
        // This creates injection samples by:
        // 1. Sampling points on the target (e.g., Screen)
        // 2. Casting rays from the source center through those target points
        // 3. Intersecting rays with the source box face

        const tgtNode = makeObject3D(targetObj);
        const tgtCenter = new THREE.Vector3();
        tgtNode.getWorldPosition(tgtCenter);

        const srcCenter = new THREE.Vector3();
        srcNode.getWorldPosition(srcCenter);

        // Determine which face of the target to sample (front or back based on orientation)
        const normalLocal = new THREE.Vector3(0, 0, 1);
        const normalWorld = normalLocal.clone();
        tgtNode.localToWorld(normalWorld).sub(tgtCenter).normalize();

        const toSource = srcCenter.clone().sub(tgtCenter).normalize();
        const useBack = normalWorld.dot(toSource) < 0;
        const zFace = useBack ? -0.5 : 0.5;

        // Get the normal of the source face in world space
        let sourceFaceNormalLocal: THREE.Vector3;
        let sourceFaceDistLocal: number; // distance from origin along normal
        switch (face) {
          case 'back': // -z
            sourceFaceNormalLocal = new THREE.Vector3(0, 0, -1);
            sourceFaceDistLocal = -0.5;
            break;
          case 'left': // -x
            sourceFaceNormalLocal = new THREE.Vector3(-1, 0, 0);
            sourceFaceDistLocal = -0.5;
            break;
          case 'right': // +x
            sourceFaceNormalLocal = new THREE.Vector3(1, 0, 0);
            sourceFaceDistLocal = 0.5;
            break;
          case 'top': // +y
            sourceFaceNormalLocal = new THREE.Vector3(0, 1, 0);
            sourceFaceDistLocal = 0.5;
            break;
          case 'bottom': // -y
            sourceFaceNormalLocal = new THREE.Vector3(0, -1, 0);
            sourceFaceDistLocal = -0.5;
            break;
          case 'front':
          default: // +z
            sourceFaceNormalLocal = new THREE.Vector3(0, 0, 1);
            sourceFaceDistLocal = 0.5;
            break;
        }

        for (let j = 0; j < vSeg; j++) {
          const v = (j + 0.5) / vSeg - 0.5;
          for (let i = 0; i < uSeg; i++) {
            const u = (i + 0.5) / uSeg - 0.5;

            // Sample point on target face in local unit box
            const localTgt = new THREE.Vector3(u, v, zFace);
            const worldTgt = localTgt.clone();
            tgtNode.localToWorld(worldTgt);

            // Ray from source center through target point
            const rayDir = worldTgt.clone().sub(srcCenter).normalize();

            // Convert ray to source box's local space
            const rayOriginLocal = srcCenter.clone();
            srcNode.worldToLocal(rayOriginLocal);

            const rayDirLocal = rayDir.clone();
            const srcNodeWorldToLocal = srcNode.matrixWorld.clone().invert();
            rayDirLocal.transformDirection(srcNodeWorldToLocal).normalize();

            // Intersect ray with the source face plane in local space
            // Plane equation: n · p = d, where n is normal, d is distance
            const denom = sourceFaceNormalLocal.dot(rayDirLocal);
            if (Math.abs(denom) > 1e-6) {
              const t = (sourceFaceDistLocal - sourceFaceNormalLocal.dot(rayOriginLocal)) / denom;
              if (t > 0) {
                // Intersection point in local space
                const intersectLocal = rayOriginLocal.clone().addScaledVector(rayDirLocal, t);
                
                // Add small offset along face normal to avoid z-fighting
                intersectLocal.addScaledVector(sourceFaceNormalLocal, faceOffset);

                // Convert to world space
                const world = intersectLocal.clone();
                srcNode.localToWorld(world);
                samples.push(world);
              } else {
                // Ray doesn't hit the face (pointing away), use center as fallback
                const world = srcCenter.clone();
                samples.push(world);
              }
            } else {
              // Ray parallel to face, use center as fallback
              const world = srcCenter.clone();
              samples.push(world);
            }
          }
        }
      } else {
        // No target: sample the source face directly (original behavior)
        for (let j = 0; j < vSeg; j++) {
          const v = (j + 0.5) / vSeg - 0.5;
          for (let i = 0; i < uSeg; i++) {
            const u = (i + 0.5) / uSeg - 0.5;

            // Local coordinates are defined on the unit cube [-0.5, 0.5]^3.
            // We place points on the requested face of the box and let the
            // Object3D's scale+transform produce the actual world-space patch.
            let local: THREE.Vector3;
            switch (face) {
              case 'back': // -z
                local = new THREE.Vector3(u, v, -0.5 - faceOffset);
                break;
              case 'left': // -x
                local = new THREE.Vector3(-0.5 - faceOffset, v, u);
                break;
              case 'right': // +x
                local = new THREE.Vector3(0.5 + faceOffset, v, u);
                break;
              case 'top': // +y
                local = new THREE.Vector3(u, 0.5 + faceOffset, v);
                break;
              case 'bottom': // -y
                local = new THREE.Vector3(u, -0.5 - faceOffset, v);
                break;
              case 'front':
              default: // +z
                local = new THREE.Vector3(u, v, 0.5 + faceOffset);
                break;
            }

            const world = local.clone();
            srcNode.localToWorld(world);
            samples.push(world);
          }
        }
      }

      for (let j = 0; j < vSeg - 1; j++) {
        for (let i = 0; i < uSeg - 1; i++) {
          const topLeft = startIndex + j * uSeg + i;
          const topRight = topLeft + 1;
          const bottomLeft = startIndex + (j + 1) * uSeg + i;
          const bottomRight = bottomLeft + 1;

          indices.push(topLeft, bottomLeft, topRight);
          indices.push(topRight, bottomLeft, bottomRight);
        }
      }

      // Store parametric rect surface for truly continuous random spawning.
      {
        let localOrigin: THREE.Vector3;
        let localPlusU: THREE.Vector3;
        let localPlusV: THREE.Vector3;
        const fo = 0.002;
        switch (face) {
          case 'back':
            localOrigin = new THREE.Vector3(0, 0, -0.5 - fo);
            localPlusU  = new THREE.Vector3(0.5, 0, -0.5 - fo);
            localPlusV  = new THREE.Vector3(0, 0.5, -0.5 - fo);
            break;
          case 'left':
            localOrigin = new THREE.Vector3(-0.5 - fo, 0, 0);
            localPlusU  = new THREE.Vector3(-0.5 - fo, 0, 0.5);
            localPlusV  = new THREE.Vector3(-0.5 - fo, 0.5, 0);
            break;
          case 'right':
            localOrigin = new THREE.Vector3(0.5 + fo, 0, 0);
            localPlusU  = new THREE.Vector3(0.5 + fo, 0, 0.5);
            localPlusV  = new THREE.Vector3(0.5 + fo, 0.5, 0);
            break;
          case 'top':
            localOrigin = new THREE.Vector3(0, 0.5 + fo, 0);
            localPlusU  = new THREE.Vector3(0.5, 0.5 + fo, 0);
            localPlusV  = new THREE.Vector3(0, 0.5 + fo, 0.5);
            break;
          case 'bottom':
            localOrigin = new THREE.Vector3(0, -0.5 - fo, 0);
            localPlusU  = new THREE.Vector3(0.5, -0.5 - fo, 0);
            localPlusV  = new THREE.Vector3(0, -0.5 - fo, 0.5);
            break;
          case 'front':
          default:
            localOrigin = new THREE.Vector3(0, 0, 0.5 + fo);
            localPlusU  = new THREE.Vector3(0.5, 0, 0.5 + fo);
            localPlusV  = new THREE.Vector3(0, 0.5, 0.5 + fo);
            break;
        }
        const wO = srcNode.localToWorld(localOrigin);
        const wU = srcNode.localToWorld(localPlusU);
        const wV = srcNode.localToWorld(localPlusV);
        spawnSurfaces.push({
          kind: 'rect',
          origin: wO.toArray() as [number, number, number],
          halfU: [wU.x - wO.x, wU.y - wO.y, wU.z - wO.z],
          halfV: [wV.x - wO.x, wV.y - wO.y, wV.z - wO.z],
        });
      }

      continue;
    }

    // Cylinder side surfaces (curved source walls). When a target is
    // provided, we project that target's surface onto the cylinder by
    // casting rays from the cylinder's central axis outwards through the
    // target and intersecting the curved wall. This mirrors the
    // sphereProjected behavior but uses the axis instead of a single
    // point.
    if (s.kind === 'cylinderSection') {
      if (sourceObj.type !== 'cylinder' && sourceObj.type !== 'tube') continue;

      const srcNode = makeObject3D(sourceObj);

      const uSeg = s.uSegments && s.uSegments > 1 ? s.uSegments : 32;
      const vSeg = s.vSegments && s.vSegments > 1 ? s.vSegments : 24;

      // Base radius in the cylinder's local space (GeometryScene uses 0.5)
      const baseRadius = 0.5;
      const radius = baseRadius * 1.02; // slight expansion to avoid z-fighting

      const hasTarget = !!s.targetObjectId;
      const targetObj = hasTarget
        ? allObjects.find(o => o.id === s.targetObjectId)
        : undefined;

      // If we have a target, project its rectangular face onto the
      // cylinder side via rays from the central axis.
      if (hasTarget && targetObj) {
        const tgtNode = makeObject3D(targetObj);

        const tgtCenter = new THREE.Vector3();
        tgtNode.getWorldPosition(tgtCenter);

        // Assume a box-like target and pick the face oriented toward
        // the cylinder (front/back in local +z/-z).
        const normalLocal = new THREE.Vector3(0, 0, 1);
        const normalWorld = normalLocal.clone();
        tgtNode.localToWorld(normalWorld).sub(tgtCenter).normalize();

        const srcCenterWorld = new THREE.Vector3();
        srcNode.getWorldPosition(srcCenterWorld);

        const toSource = srcCenterWorld.clone().sub(tgtCenter).normalize();
        const useBack = normalWorld.dot(toSource) < 0;
        const zFace = useBack ? -0.5 : 0.5;

        for (let j = 0; j < vSeg; j++) {
          const v = (j + 0.5) / vSeg - 0.5;
          for (let i = 0; i < uSeg; i++) {
            const u = (i + 0.5) / uSeg - 0.5;

            // Sample a point on the target face in its local unit box.
            const localTgt = new THREE.Vector3(u, v, zFace * 0.5);
            const worldTgt = localTgt.clone();
            tgtNode.localToWorld(worldTgt);

            // Convert that point into the cylinder's local space so we
            // can project it radially from the central axis onto the
            // curved wall.
            const localOnCyl = worldTgt.clone();
            srcNode.worldToLocal(localOnCyl);

            const y = localOnCyl.y;
            const radial = new THREE.Vector3(localOnCyl.x, 0, localOnCyl.z);
            const rLen = radial.length();
            if (rLen < 1e-6) {
              // Degenerate (point nearly on axis); skip this sample.
              continue;
            }
            radial.divideScalar(rLen);

            const localOnSurface = new THREE.Vector3(
              radial.x * radius,
              y,
              radial.z * radius,
            );

            const worldSurface = localOnSurface.clone();
            srcNode.localToWorld(worldSurface);
            samples.push(worldSurface);
          }
        }

        const start = samples.length - uSeg * vSeg;
        if (start >= 0) {
          for (let j = 0; j < vSeg - 1; j++) {
            for (let i = 0; i < uSeg - 1; i++) {
              const topLeft = start + j * uSeg + i;
              const topRight = topLeft + 1;
              const bottomLeft = start + (j + 1) * uSeg + i;
              const bottomRight = bottomLeft + 1;

              indices.push(topLeft, bottomLeft, topRight);
              indices.push(topRight, bottomLeft, bottomRight);
            }
          }
        }

        continue;
      }

      // Fallback: if no target is specified, use a full cylindrical
      // side section as a generic source surface.
      const thetaMin = s.thetaMin !== undefined ? s.thetaMin : 0;
      const thetaMax = s.thetaMax !== undefined ? s.thetaMax : 2 * Math.PI;
      const thetaSpan = thetaMax - thetaMin;
      const isFullWrap = Math.abs(thetaSpan - 2 * Math.PI) < 1e-4;

      const startIndex = samples.length;

      for (let j = 0; j < vSeg; j++) {
        const v = (j + 0.5) / vSeg - 0.5; // local y in [-0.5, 0.5]
        for (let i = 0; i < uSeg; i++) {
          const u = (i + 0.5) / uSeg; // 0..1 along angle
          const theta = thetaMin + u * thetaSpan;

          const local = new THREE.Vector3(
            radius * Math.cos(theta),
            v,
            radius * Math.sin(theta),
          );

          const world = local.clone();
          srcNode.localToWorld(world);
          samples.push(world);
        }
      }

      for (let j = 0; j < vSeg - 1; j++) {
        for (let i = 0; i < uSeg - 1; i++) {
          const topLeft = startIndex + j * uSeg + i;
          const topRight = topLeft + 1;
          const bottomLeft = startIndex + (j + 1) * uSeg + i;
          const bottomRight = bottomLeft + 1;

          indices.push(topLeft, bottomLeft, topRight);
          indices.push(topRight, bottomLeft, bottomRight);
        }

        if (isFullWrap) {
          const seamTopLeft = startIndex + j * uSeg + (uSeg - 1);
          const seamTopRight = startIndex + j * uSeg + 0;
          const seamBottomLeft = startIndex + (j + 1) * uSeg + (uSeg - 1);
          const seamBottomRight = startIndex + (j + 1) * uSeg + 0;

          indices.push(seamTopLeft, seamBottomLeft, seamTopRight);
          indices.push(seamTopRight, seamBottomLeft, seamBottomRight);
        }
      }

      continue;
    }

    // Sphere-based surfaces (sources)
    if (s.kind === 'sphereProjected') {
      const srcNode = makeObject3D(sourceObj);
      const srcCenter = new THREE.Vector3();
      srcNode.getWorldPosition(srcCenter);

      const segments = (s.uSegments && s.uSegments > 1
        ? s.uSegments
        : s.vSegments && s.vSegments > 1
          ? s.vSegments
          : 24);
      const uSeg = segments;
      const vSeg = segments;
      // Slightly expand the preview radius so the Psi² surface mesh
      // sits just outside the underlying sphere geometry, avoiding
      // z-fighting / interference patterns.
      const baseRadius = (sourceObj.scale[0] + sourceObj.scale[1] + sourceObj.scale[2]) / 3;
      const radius = baseRadius * 1.02;

      const hasTarget = !!s.targetObjectId;
      const targetObj = hasTarget
        ? allObjects.find(o => o.id === s.targetObjectId)
        : undefined;

      // With a target: build the spherical patch as the exact
      // projection of the target geometry as seen from the source.
      //
      // - If the target is a box-like object, we project its front/back
      //   face onto the sphere via center-to-face rays (old behavior).
      // - If the target is a sphere, we instead build the spherical cap
      //   consisting of all rays from the source that intersect the
      //   target sphere, which produces a correctly sized circular patch.
      if (hasTarget && targetObj) {
        const tgtNode = makeObject3D(targetObj);

        const tgtCenter = new THREE.Vector3();
        tgtNode.getWorldPosition(tgtCenter);

        // Special case: spherical target → circular cap on source sphere.
        if (targetObj.type === 'sphere') {
          const startIndex = samples.length;

          const toTarget = tgtCenter.clone().sub(srcCenter);
          const dist = toTarget.length();
          if (dist > 0) {
            const dirCenter = toTarget.clone().divideScalar(dist); // unit vector from source to target center

            // Approximate target radius from its scale (same convention as source).
            const targetRadius = (targetObj.scale[0] + targetObj.scale[1] + targetObj.scale[2]) / 3;
            const sinArg = Math.min(1, Math.max(0, targetRadius / dist));
            const alpha = Math.asin(sinArg); // half-angle of the cone of rays hitting the target sphere

            // Build an orthonormal basis (xAxis, yAxis, zAxis=dirCenter).
            const zAxis = dirCenter.clone();
            const tmpUp = Math.abs(zAxis.y) < 0.99 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
            const xAxis = new THREE.Vector3().crossVectors(tmpUp, zAxis).normalize();
            const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();

            for (let j = 0; j < vSeg; j++) {
              const v = (j + 0.5) / vSeg; // 0..1
              const phi = v * alpha; // 0..alpha
              for (let i = 0; i < uSeg; i++) {
                const u = (i + 0.5) / uSeg; // 0..1
                const theta = u * 2 * Math.PI; // 0..2pi

                const sinPhi = Math.sin(phi);
                const dirLocal = new THREE.Vector3(
                  sinPhi * Math.cos(theta),
                  sinPhi * Math.sin(theta),
                  Math.cos(phi),
                );

                const dirWorld = new THREE.Vector3()
                  .addScaledVector(xAxis, dirLocal.x)
                  .addScaledVector(yAxis, dirLocal.y)
                  .addScaledVector(zAxis, dirLocal.z)
                  .normalize();

                const worldSphere = srcCenter.clone().addScaledVector(dirWorld, radius);
                samples.push(worldSphere);
              }
            }

            for (let j = 0; j < vSeg - 1; j++) {
              for (let i = 0; i < uSeg - 1; i++) {
                const topLeft = startIndex + j * uSeg + i;
                const topRight = topLeft + 1;
                const bottomLeft = startIndex + (j + 1) * uSeg + i;
                const bottomRight = bottomLeft + 1;

                indices.push(topLeft, bottomLeft, topRight);
                indices.push(topRight, bottomLeft, bottomRight);
              }
            }
          }

          continue;
        }

        // Default: project a rectangular face (screens, walls, etc.).
        const normalLocal = new THREE.Vector3(0, 0, 1);
        const normalWorld = normalLocal.clone();
        tgtNode.localToWorld(normalWorld).sub(tgtCenter).normalize();

        const toSource = srcCenter.clone().sub(tgtCenter).normalize();
        const useBack = normalWorld.dot(toSource) < 0;
        const zFace = useBack ? -0.5 : 0.5;

        const startIndex = samples.length;

        for (let j = 0; j < vSeg; j++) {
          // Add per-cell random jitter so the effective injection positions
          // are continuously distributed across the target face rather than
          // sitting on a fixed grid. Without jitter, a mismatch between the
          // injection segment count (e.g. 24) and the detector cell count
          // (e.g. 20) causes some detector rows to receive systematically
          // more hits than others, producing apparent blank rows.
          const v = (j + Math.random()) / vSeg - 0.5;
          for (let i = 0; i < uSeg; i++) {
            const u = (i + Math.random()) / uSeg - 0.5;
            // As with box faces, work in the unit cube and let the
            // Object3D's scale produce the actual world-space extent
            // of the target rectangle.
            const localTgt = new THREE.Vector3(u, v, zFace * 0.5);
            const worldTgt = localTgt.clone();
            tgtNode.localToWorld(worldTgt);

            const dir = worldTgt.clone().sub(srcCenter).normalize();
            const worldSphere = srcCenter.clone().addScaledVector(dir, radius);
            samples.push(worldSphere);
          }
        }

        for (let j = 0; j < vSeg - 1; j++) {
          for (let i = 0; i < uSeg - 1; i++) {
            const topLeft = startIndex + j * uSeg + i;
            const topRight = topLeft + 1;
            const bottomLeft = startIndex + (j + 1) * uSeg + i;
            const bottomRight = bottomLeft + 1;

            indices.push(topLeft, bottomLeft, topRight);
            indices.push(topRight, bottomLeft, bottomRight);
          }
        }

        // Store parametric surface so the spawner can generate truly
        // continuous random positions instead of picking from a discrete pool.
        {
          const _c = tgtNode.localToWorld(new THREE.Vector3(0, 0, zFace));
          const _u = tgtNode.localToWorld(new THREE.Vector3(0.5, 0, zFace));
          const _v = tgtNode.localToWorld(new THREE.Vector3(0, 0.5, zFace));
          spawnSurfaces.push({
            kind: 'sphereProject',
            sphereCenter: srcCenter.toArray() as [number, number, number],
            sphereRadius: radius,
            targetOrigin: _c.toArray() as [number, number, number],
            targetHalfU: [_u.x - _c.x, _u.y - _c.y, _u.z - _c.z],
            targetHalfV: [_v.x - _c.x, _v.y - _c.y, _v.z - _c.z],
          });
        }

        continue;
      }

      // Without a target: sample the full sphere surface.
      const startIndex = samples.length;
      for (let j = 0; j < vSeg; j++) {
        const v = (j + 0.5) / vSeg; // 0..1
        const phi = v * Math.PI; // 0..pi
        for (let i = 0; i < uSeg; i++) {
          const u = (i + 0.5) / uSeg; // 0..1
          const theta = u * 2 * Math.PI; // 0..2pi
          const dir = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta),
          );
          const worldSphere = srcCenter.clone().addScaledVector(dir, radius);
          samples.push(worldSphere);
        }
      }

      for (let j = 0; j < vSeg - 1; j++) {
        for (let i = 0; i < uSeg - 1; i++) {
          const topLeft = startIndex + j * uSeg + i;
          const topRight = topLeft + 1;
          const bottomLeft = startIndex + (j + 1) * uSeg + i;
          const bottomRight = bottomLeft + 1;

          indices.push(topLeft, bottomLeft, topRight);
          indices.push(topRight, bottomLeft, bottomRight);
        }

        // Wrap-around to connect the last column back to the first
        // so the full-sphere patch has no open seam in theta.
        const seamTopLeft = startIndex + j * uSeg + (uSeg - 1);
        const seamTopRight = startIndex + j * uSeg + 0;
        const seamBottomLeft = startIndex + (j + 1) * uSeg + (uSeg - 1);
        const seamBottomRight = startIndex + (j + 1) * uSeg + 0;

        indices.push(seamTopLeft, seamBottomLeft, seamTopRight);
        indices.push(seamTopRight, seamBottomLeft, seamBottomRight);
      }

      continue;
    }
  }

  if (samples.length === 0 || indices.length === 0) return null;
  return { samples, indices: new Uint32Array(indices), spawnSurfaces };
};
