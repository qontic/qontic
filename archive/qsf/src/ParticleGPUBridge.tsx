import React, { useState, useCallback, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ParticleComputeGPU } from './ParticleComputeGPU';
import { DomainParticlesGPU } from './DomainParticlesGPU';
import {
  buildInjectionSurfacePatch,
  flattenSceneObjects,
  buildPsi2CDF,
  QuantumPoolManager,
  type SpawnSurface,
  type DirectSurfaceCdf,
} from './injectionSurfaces';
import {
  parseDomainBounds,
  buildEvaluationScope,
  evaluateWaveMagnitudeSqAt,
} from './utils';
import type {
  PhysicsDomain,
  SceneObjectType,
  CustomParameter,
  GlobalConstant,
  ParticleDefinition,
  ProjectDerivedVariable,
} from './types';

export type ParticleGPUBridgeProps = {
  domainId: string;
  domain: PhysicsDomain;
  allDomains?: PhysicsDomain[];
  sceneObjects: SceneObjectType[];
  maxParticles: number;
  showParticles: boolean;
  sceneScale: [number, number, number];
  particleShape: 'sphere' | 'cube';
  particleSize: number;
  particleColor: string;
  showParticleTrajectories?: boolean;
  trajectoryColor?: string;
  emitterOrigin?: [number, number, number];
  emitterDirection?: [number, number, number];
  parameters: CustomParameter[];
  globalConstants: GlobalConstant[];
  particles: ParticleDefinition[];
  projectVariables?: ProjectDerivedVariable[];
  simulationTimeRef: React.MutableRefObject<number>;
  timeScale: number;
  timeScaleFactor: number;
  injectionRateSim: number;
  trajectoryMinDistance?: number;
  persistTrailsOnDeath?: boolean;
  isWaveRunning: boolean;
  sceneBounds: THREE.Box3 | null;
  clippingPlanes?: THREE.Plane[];
  onParticleCountChange?: (domainId: string, activeCount: number, totalInjected: number) => void;
  onDetectorHit?: (domainId: string, detectorObjectId: string, uIndex: number, vIndex: number) => void;
  /**
   * Shared pending-injections map (keyed by crossing-object scene-object id).
   * Upstream domain increments entries; this bridge drains them during spawning.
   */
  pendingInjectionsRef?: React.MutableRefObject<Map<string, number>>;
  /**
   * Scene-object ids that, when a particle in THIS domain dies inside them,
   * fire the onDomainCrossing callback (to increment pendingInjectionsRef in
   * the downstream domain).
   */
  crossingObjectIds?: string[];
  /** App-level callback: upstream domain fires this when a particle crosses. */
  onDomainCrossing?: (crossingObjectId: string) => void;
};

/**
 * ParticleGPUBridge
 *
 * Wires ParticleCompute (GPU particle state manager) to DomainParticlesGPU (instanced renderer).
 * Also builds a QuantumPoolManager when any injection surface uses spawnMode='quantum'.
 */
export const ParticleGPUBridge: React.FC<ParticleGPUBridgeProps> = ({
  domainId,
  domain,
  allDomains,
  sceneObjects,
  maxParticles,
  showParticles,
  sceneScale,
  particleShape,
  particleSize,
  particleColor,
  showParticleTrajectories = false,
  trajectoryColor = '#ffa500',
  emitterOrigin,
  parameters,
  globalConstants,
  particles,
  projectVariables,
  simulationTimeRef,
  timeScale,
  timeScaleFactor,
  injectionRateSim,
  trajectoryMinDistance,
  persistTrailsOnDeath,
  isWaveRunning,
  sceneBounds,
  clippingPlanes = [],
  onParticleCountChange,
  onDetectorHit,
  pendingInjectionsRef,
  crossingObjectIds,
  onDomainCrossing,
}) => {
  const [textureInfo, setTextureInfo] = useState<{
    texture: THREE.DataTexture;
    textureSize: number;
    trajectories: THREE.Vector3[][];
  } | null>(null);

  const handleStateReady = useCallback((info: {
    texture: THREE.DataTexture;
    textureSize: number;
    trajectories: THREE.Vector3[][];
  }) => {
    setTextureInfo(info);
  }, []);

  const allObjects = useMemo<SceneObjectType[]>(() => flattenSceneObjects(sceneObjects || []), [sceneObjects]);

  const patch = useMemo(() => buildInjectionSurfacePatch(domain, allObjects || []), [domain, allObjects]);

  const resolvedOrigin = useMemo<[number, number, number]>(() => {
    if (emitterOrigin) return emitterOrigin;
    if (patch && patch.samples.length > 0) {
      const acc = patch.samples.reduce(
        (sum, p) => { sum.x += p.x; sum.y += p.y; sum.z += p.z; return sum; },
        new THREE.Vector3(0, 0, 0),
      );
      const n = patch.samples.length;
      return [acc.x / n, acc.y / n, acc.z / n];
    }
    if (domain.center) return [domain.center[0], domain.center[1], domain.center[2]];
    return [0, 0, 0];
  }, [emitterOrigin, domain, patch]);

  const emitterSamples = useMemo<[number, number, number][] | undefined>(() => {
    if (!patch || patch.samples.length === 0) return undefined;
    return patch.samples.map(p => [p.x, p.y, p.z] as [number, number, number]);
  }, [patch]);

  const spawnSurfaces = useMemo<SpawnSurface[] | undefined>(
    () => (patch?.spawnSurfaces.length ? patch.spawnSurfaces : undefined),
    [patch],
  );

  const domainBounds = useMemo(() => {
    return parseDomainBounds(domain, allObjects, sceneBounds, globalConstants, particles || []);
  }, [domain, allObjects, sceneBounds, globalConstants, particles]);

  // ----- Quantum pool --------------------------------------------------------
  // Stable ref so the pool survives re-renders without being reset.
  const quantumPoolRef = useRef<QuantumPoolManager | null>(null);

  // Routes crossing-object ids to the spawn-surface index they trigger.
  // Any spawn mode can use domain-crossing trigger; linkedFromDomainIds controls
  // the trigger, spawnMode only controls how positions are sampled.
  const crossingToSurfaceMap = useMemo<Map<string, number> | undefined>(() => {
    const surfaces = Array.isArray(domain.injectionSurfaces) ? domain.injectionSurfaces : [];
    const crossingSurfaces = surfaces.filter(s => s.linkedFromDomainIds?.length);
    if (!crossingSurfaces.length) return undefined;

    // Find the SpawnSurface index for each InjectionSurface by matching
    // the exact order buildInjectionSurfacePatch uses (valid sourceObj, any kind).
    // We must count ALL surface kinds — not just 'rect' — so indices stay aligned.
    const spawnSurfaceOrder: string[] = [];
    for (const s of surfaces) {
      const obj = allObjects.find(o => o.id === s.sourceObjectId);
      if (!obj) continue;
      spawnSurfaceOrder.push(s.id); // mirrors buildInjectionSurfacePatch iteration
    }

    const map = new Map<string, number>();
    for (const s of crossingSurfaces) {
      const idx = spawnSurfaceOrder.indexOf(s.id);
      if (idx < 0) continue;
      // Map this surface's sourceObjectId → spawn surface index so
      // domain-crossing events from upstream can find the right queue.
      map.set(s.sourceObjectId, idx);
    }
    return map.size ? map : undefined;
  }, [domain.injectionSurfaces, allObjects]);

  // Build / rebuild the QuantumPoolManager whenever parameters or domain change.
  useMemo(() => {
    if (!spawnSurfaces?.length) { quantumPoolRef.current = null; return; }

    const surfaces = Array.isArray(domain.injectionSurfaces) ? domain.injectionSurfaces : [];
    const hasQuantum = surfaces.some(s => s.spawnMode === 'quantum');
    if (!hasQuantum) { quantumPoolRef.current = null; return; }

    // Find the first quantum surface declaration.
    const qSurf = surfaces.find(s => s.spawnMode === 'quantum');
    if (!qSurf) { quantumPoolRef.current = null; return; }

    const poolSize = qSurf.quantumPoolSize ?? 200;
    const injN = Math.max(2, qSurf.uSegments ?? 24);
    const staticScope = buildEvaluationScope(allObjects, globalConstants);

    // ── Build |ψ|² CDFs directly on each injection surface ──────────────────
    // This is the primary (and correct) sampling strategy: evaluate |ψ|² at
    // the injection surface itself, so spawn positions are distributed with
    // exactly the right quantum probability without any geometric approximation.
    // physicsTransparent objects (slits) are fully valid injection surfaces.
    const directSurfaceCdfs: DirectSurfaceCdf[] = [];
    for (const ss of spawnSurfaces) {
      if (ss.kind !== 'rect') {
        directSurfaceCdfs.push({
          cdf: new Float32Array([1]),
          N: 1,
          origin: new THREE.Vector3(),
          halfU: new THREE.Vector3(),
          halfV: new THREE.Vector3(),
        });
        continue;
      }
      const ssOrigin  = new THREE.Vector3(...ss.origin);
      const ssHalfU   = new THREE.Vector3(...ss.halfU);
      const ssHalfV   = new THREE.Vector3(...ss.halfV);
      const injPsi2   = new Float32Array(injN * injN);
      for (let row = 0; row < injN; row++) {
        for (let col = 0; col < injN; col++) {
          const u = (col + 0.5) / injN * 2 - 1;
          const v = (row + 0.5) / injN * 2 - 1;
          const wp = ssOrigin.clone()
            .addScaledVector(ssHalfU, u)
            .addScaledVector(ssHalfV, v);
          const val = evaluateWaveMagnitudeSqAt(
            domain, domain.waveEquation, staticScope,
            parameters, projectVariables, particles,
            { x: wp.x, y: wp.y, z: wp.z },
            0, timeScale, false,
          );
          injPsi2[row * injN + col] = val ?? 0;
        }
      }
      directSurfaceCdfs.push({
        cdf: buildPsi2CDF(injPsi2),
        N: injN,
        origin: ssOrigin,
        halfU: ssHalfU,
        halfV: ssHalfV,
      });
    }

    // ── Legacy back-propagation fields (only built when targetObjectId is set) ──
    // These are kept as a fallback in case direct CDFs are unavailable for any
    // surface, but the direct mode above takes priority.
    const targetObj = qSurf.targetObjectId
      ? allObjects.find(o => o.id === qSurf.targetObjectId)
      : null;

    let targetOrigin = new THREE.Vector3();
    let targetHalfU  = new THREE.Vector3(1, 0, 0);
    let targetHalfV  = new THREE.Vector3(0, 1, 0);
    let cdf = buildPsi2CDF(new Float32Array([1]));
    let N = 1;
    const evaluateVelocity = (_p: THREE.Vector3): THREE.Vector3 | null => null;

    if (targetObj) {
      const tgtNode = new THREE.Object3D();
      tgtNode.position.set(...targetObj.position);
      tgtNode.rotation.set(...targetObj.rotation);
      tgtNode.scale.set(...targetObj.scale);
      tgtNode.updateMatrixWorld(true);

      const tgtCenter = new THREE.Vector3();
      tgtNode.getWorldPosition(tgtCenter);

      const anySourceObj = allObjects.find(o => o.id === qSurf.sourceObjectId);
      const normalLocal = new THREE.Vector3(0, 0, 1);
      const normalWorld = normalLocal.clone();
      tgtNode.localToWorld(normalWorld).sub(tgtCenter).normalize();
      const toSource = anySourceObj
        ? new THREE.Vector3(...anySourceObj.position).sub(tgtCenter).normalize()
        : tgtCenter.clone().negate().normalize();
      const useBack = normalWorld.dot(toSource) < 0;
      const zFace = useBack ? -0.5 : 0.5;

      const faceCenter = tgtNode.localToWorld(new THREE.Vector3(0, 0, zFace));
      const facePlusU  = tgtNode.localToWorld(new THREE.Vector3(0.5, 0, zFace));
      const facePlusV  = tgtNode.localToWorld(new THREE.Vector3(0, 0.5, zFace));
      targetOrigin = faceCenter.clone();
      targetHalfU  = new THREE.Vector3().subVectors(facePlusU, faceCenter);
      targetHalfV  = new THREE.Vector3().subVectors(facePlusV, faceCenter);

      N = Math.max(2, qSurf.uSegments ?? 24);
      const psi2Values = new Float32Array(N * N);
      for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
          const u = (col + 0.5) / N * 2 - 1;
          const v = (row + 0.5) / N * 2 - 1;
          const wp = targetOrigin.clone()
            .addScaledVector(targetHalfU, u)
            .addScaledVector(targetHalfV, v);
          const val = evaluateWaveMagnitudeSqAt(
            domain, domain.waveEquation, staticScope,
            parameters, projectVariables, particles,
            { x: wp.x, y: wp.y, z: wp.z },
            0, timeScale, false,
          );
          psi2Values[row * N + col] = val ?? 0;
        }
      }
      cdf = buildPsi2CDF(psi2Values);
    }

    quantumPoolRef.current = new QuantumPoolManager({
      spawnSurfaces: spawnSurfaces,
      cdf,
      N,
      targetOrigin,
      targetHalfU,
      targetHalfV,
      evaluateVelocity,
      poolSize,
      lowWater: Math.floor(poolSize * 0.25),
      directSurfaceCdfs,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain.injectionSurfaces, domain.particleEquation, domain.waveEquation,
      parameters, projectVariables, particles, spawnSurfaces, allObjects,
      globalConstants, timeScale]);

  return (
    <>
      <ParticleComputeGPU
        domainId={domainId}
        domain={domain}
        allDomains={allDomains}
        maxParticles={maxParticles}
        emitterOrigin={resolvedOrigin}
        emitterSamples={emitterSamples}
        spawnSurfaces={spawnSurfaces}
        injectionRateSim={injectionRateSim}
        simulationTimeRef={simulationTimeRef}
        isWaveRunning={isWaveRunning}
        domainBounds={domainBounds}
        sceneObjects={allObjects}
        parameters={parameters}
        globalConstants={globalConstants}
        projectVariables={projectVariables}
        particles={particles}
        timeScale={timeScale}
        timeScaleFactor={timeScaleFactor}
        trajectoryMinDistance={trajectoryMinDistance}
        persistTrailsOnDeath={persistTrailsOnDeath}
        onStateTextureReady={handleStateReady}
        onParticleCountChange={onParticleCountChange}
        onDetectorHit={onDetectorHit}
        quantumPoolRef={quantumPoolRef}
        pendingInjectionsRef={pendingInjectionsRef}
        crossingObjectIds={crossingObjectIds}
        onDomainCrossing={onDomainCrossing}
        crossingToSurfaceMap={crossingToSurfaceMap}
      />
      {textureInfo && (
        <DomainParticlesGPU
          particleStateTexture={textureInfo.texture}
          textureSize={textureInfo.textureSize}
          trajectories={textureInfo.trajectories}
          showParticles={showParticles}
          showParticleTrajectories={showParticleTrajectories}
          maxParticles={maxParticles}
          sceneScale={sceneScale}
          particleShape={particleShape}
          particleSize={particleSize}
          particleColor={particleColor}
          trajectoryColor={trajectoryColor}
          clippingPlanes={clippingPlanes}
        />
      )}
    </>
  );
};

export default ParticleGPUBridge;
