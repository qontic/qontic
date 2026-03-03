import * as THREE from 'three';
import { useMemo } from 'react';
import type { PhysicsDomain, SceneObjectType, GlobalConstant, ParticleDefinition } from './types';
import { parseDomainBounds } from './utils';

type Props = {
  domain: PhysicsDomain;
  sceneObjects: SceneObjectType[];
  sceneBounds: THREE.Box3 | null;
  sceneScale?: [number, number, number]; // NEW
  globalConstants: GlobalConstant[]; // Pass constants for the scope
  particles: ParticleDefinition[];
};

/**
 * Renders a semi-transparent box representing a PhysicsDomain for preview purposes.
 * This component is used when you click "Preview on Scene" in the Setup Editor.
 */export function DomainRenderer({ domain, sceneObjects, sceneBounds, globalConstants, particles, sceneScale }: Props) {
  const box = useMemo(() => {
    return parseDomainBounds(domain, sceneObjects, sceneBounds, globalConstants, particles);
  }, [domain, sceneObjects, sceneBounds, globalConstants, particles]);

  if (!box || box.isEmpty()) {
    return null;
  }

  // Now that the debug test passed, we restore the original logic.
  const size = box.getSize(new THREE.Vector3());

  // --- FIX: Position the mesh more robustly to avoid floating point errors. ---
  // Instead of using the calculated center directly, we start from the box's
  // minimum corner and shift it by half of its size.
  const position = new THREE.Vector3().addVectors(box.min, size.clone().multiplyScalar(0.5));

  // --- NEW: Conditionally render geometry based on domain shape ---
  const geometry = <boxGeometry args={[size.x, size.y, size.z]} />;

  // --- NEW: Apply scene scale if provided ---
  const finalPosition = sceneScale ? position.clone().multiply(new THREE.Vector3(...sceneScale)) : position;
  const finalScale = sceneScale ? new THREE.Vector3(...sceneScale) : undefined;

  return (
    // --- FIX: Use position but not scale, as geometry now has the correct size ---
    <mesh position={finalPosition} scale={finalScale}>
      {/* The geometry is now determined dynamically */}
      {geometry}
      <meshStandardMaterial
        color="#00aaff"
        opacity={0.3}
        transparent
        side={THREE.DoubleSide} // See inside the box
        // --- FIX for Z-Fighting ---
        // This nudges the preview box slightly away from the camera from the
        // renderer's perspective, allowing objects at the same depth to be visible.
        polygonOffset={true}
        polygonOffsetFactor={-1.0}
      />
    </mesh>
  );
}