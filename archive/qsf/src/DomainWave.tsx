import { useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import type { PhysicsDomain, SceneObjectType, GlobalConstant, CustomParameter, ParticleDefinition, ProjectDerivedVariable } from './types';
import { WaveCompute } from './WaveCompute';
import { WaveRenderer } from './WaveRenderer';
import { parseDomainBounds } from './utils';

type Props = {
  domain: PhysicsDomain;
  particles: ParticleDefinition[];
  sceneObjects: SceneObjectType[];
  globalConstants: GlobalConstant[];
  parameters: CustomParameter[];
  sceneBounds: THREE.Box3 | null;
  isCalculating: boolean;
  cameraView: '3D' | 'xy' | 'xz' | 'yz';
  sceneScale?: [number, number, number]; // NEW: Optional scene scale
  isVisible: boolean; // <-- NEW: To control rendering without unmounting
  simulationTimeRef: React.MutableRefObject<number>; // THE FIX: Receive time ref
  persistOnStop?: boolean; // --- NEW: Flag to prevent texture disposal ---
  waveResolution: number; // --- NEW: Configurable resolution ---
  clippingPlanes?: THREE.Plane[];
  onPerformanceUpdate: (domainId: string, updatesPerSecond: number) => void; // NEW: Callback for performance metrics  
  setSimulationTime: (time: number) => void;
  projectVariables?: ProjectDerivedVariable[]; // NEW: Pass project-level derived vars
  timeScale: number;
  onMagnitudeRangeComputed?: (domainId: string, range: { min: number; max: number; logMin: number }) => void; // NEW: GPU-based normalization callback
};

export function DomainWave({ domain, particles, isCalculating, isVisible, sceneObjects, globalConstants, sceneBounds, sceneScale, simulationTimeRef, onPerformanceUpdate, waveResolution, projectVariables, timeScale, onMagnitudeRangeComputed, updatesPerSecond = 60, ...rest }: Props & { updatesPerSecond?: number }) {
  // --- THE FIX: Calculate bounds here to generate a key for the compute component ---
  const bounds = useMemo(() => {
    return parseDomainBounds(domain, sceneObjects, sceneBounds, globalConstants, particles);
  }, [domain, sceneObjects, sceneBounds, globalConstants, particles]);
  const boundsKey = `${bounds.min.toArray().join(',')}-${bounds.max.toArray().join(',')}`;

  // --- NEW: Determine mode ---
  const is3D = rest.cameraView === '3D';

  // --- REFACTORED: This component now manages its own texture state ---
  const [texture, setTexture] = useState<THREE.Data3DTexture | null>(null);

  // --- REFACTORED: Create a stable callback for the compute component ---
  // This is the key to the simplification. The callback is created once and
  // updates the local state of this component.
  const handleTextureReady = useCallback((newTexture: THREE.Data3DTexture) => {
    setTexture(newTexture);
  }, []); // Empty dependency array means this function is stable

  // If the wave equation is not validated, do nothing.
  if (!domain.waveEquation?.isValidated) {
    return null;
  }

  return (
    <>
      {/* --- Compute is ONLY needed for 3D views --- */}
      {/* Always mount when is3D so the compute loop (and UPS counter) keeps running
           even when the wave renderer is hidden. isVisible only controls the renderer. */}
      {is3D && (
        <WaveCompute
          key={`compute-${boundsKey}`} // THE FIX: Add a unique prefix to the key
          domain={domain}
          isCalculating={isCalculating}
          isVisible={true} // Keep computing regardless of wave visibility so UPS stays live
          simulationTimeRef={simulationTimeRef} // Pass down the time ref
          bounds={bounds} // Pass calculated bounds directly
          updatesPerSecond={updatesPerSecond}
          resolution={waveResolution} // Use the prop from the UI
          onTextureReady={handleTextureReady} // Pass the stable local callback
          sceneObjects={sceneObjects}
          onPerformanceUpdate={onPerformanceUpdate}
          onMagnitudeRangeComputed={onMagnitudeRangeComputed}
          particles={particles}
          globalConstants={globalConstants}
          parameters={rest.parameters}
          timeScale={timeScale}
          projectVariables={projectVariables}
          sceneBounds={sceneBounds}
        />
      )}
      {/* --- Render: Use Analytic for 2D, Precomputed for 3D --- */}
      {(texture || !is3D) && (
        <WaveRenderer
          // --- THE DEFINITIVE FIX ---
          // By including relevant visualization props in the key, we force React to create a new
          // instance of WaveRenderer when they change, ensuring the shader gets the new uniforms.          
          key={`render-${boundsKey}-${domain.id}-${domain.opacityFactor}-${domain.amplitudeMode}-${domain.colorPalette}-${is3D ? '3d' : '2d'}-${sceneScale ? sceneScale.join(',') : '1,1,1'}`}
          texture={texture}
          backend={is3D ? 'precomputed' : 'analytic'}
          bounds={bounds} // Pass calculated bounds directly
          isVisible={isVisible} // <-- NEW: Pass down visibility
          domain={domain}
          cameraView={rest.cameraView}
          clippingPlanes={rest.clippingPlanes}
          globalConstants={globalConstants}
          particles={particles}
          projectVariables={projectVariables}
          // --- NEW: Pass data needed for analytic rendering ---
          sceneScale={sceneScale} // NEW: Pass scene scale
          waveEquation={domain.waveEquation}
          parameters={rest.parameters}
          sceneObjects={sceneObjects}
          simulationTime={simulationTimeRef.current} // Pass current value for init, ref is used in loop
          simulationTimeRef={simulationTimeRef} // NEW: Pass ref for smooth updates
          timeScale={timeScale}
          persistOnStop={rest.persistOnStop}
        />
      )}
    </>
  );
}
