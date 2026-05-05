// SceneObject.tsx
import type { ThreeEvent } from '@react-three/fiber';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Geometries } from './GeometryScene.tsx';
import type { SceneObjectType } from './types.ts';
import type { CameraViewType } from './types';
import { DetailedAxes } from './DetailedAxes.tsx';

interface SceneObjectProps {
  data: SceneObjectType;
  selectedId: string | null;
  setObjectRef: (id: string, node: THREE.Object3D | null) => void;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, newProps: Partial<SceneObjectType>) => void;
  cameraView: CameraViewType;
  isSelectionEnabled: boolean;
  clippingPlanes?: THREE.Plane[];
  showAxisLabels?: boolean;
}

export function SceneObject(props: SceneObjectProps) {
  const {
    data,
    selectedId,
    setObjectRef,
    onSelect,
    onUpdate,
    cameraView,
    isSelectionEnabled,
    showAxisLabels,
    clippingPlanes,
  } = props;

  const {
    id,
    type,
    position,
    rotation,
    scale,
    color,
    opacity,
    detector: _detector,
    children = [],
    size = 5,
    labelTextSize,
  } = data;

  const isSelected = selectedId === id;
  const GeometryComponent = Geometries[type as keyof typeof Geometries];

  // Local ref to the actual Three object for axes
  const localRef = useRef<THREE.Object3D | null>(null);
  const worldScale = useRef(new THREE.Vector3(1, 1, 1));

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (cameraView === '3D' && isSelectionEnabled) {
      e.stopPropagation();
      onSelect(id);
    }
  };

  // Update worldScale ref every frame for axes
  useFrame(() => {
    if (type === 'axes' && localRef.current) {
      localRef.current.getWorldScale(worldScale.current);
    }
  });

  return (
    <>
      {type === 'axes' ? (
        <group
          ref={(node) => {
            setObjectRef(id, node);
            localRef.current = node;
          }}
          position={position}
          rotation={rotation}
          // Make axes non-interactive so they never block OrbitControls.
          // Users place axes via the UI controls instead of clicking them.
          raycast={() => null}
        >
          <DetailedAxes
            size={size}
            ticks={5}
            cameraView={cameraView}
            worldScale={worldScale.current}
            labelTextSize={labelTextSize}
            showAxisLabels={showAxisLabels}
          />
          {/* Invisible bounding box for selection */}
          <mesh
            position={[size / 2, size / 2, size / 2]}
            // Also disable raycasting on the helper box
            raycast={() => null}
          >
            <boxGeometry args={[size, size, size]} />
            <meshBasicMaterial
              transparent
              opacity={0}
              depthWrite={false}
              colorWrite={false}
            />
          </mesh>
        </group>
      ) : (
        <GeometryComponent
          ref={(node: THREE.Object3D | null) => setObjectRef(id, node)}
          position={position}
          rotation={rotation}
          scale={scale}
          onClick={handleClick}
          userData={{ isSceneObject: true, tubeInnerRadius: data.tubeInnerRadius }}
          castShadow
          receiveShadow
        >
          {type !== 'group' && (
            <meshStandardMaterial
              key={`mat-${id}-${(opacity ?? 1) < 1}`}
              color={isSelected ? 'yellow' : color}
              opacity={opacity ?? 1}
              transparent={true}
              roughness={0.6}
              metalness={0.2}
              side={type === 'tube' ? THREE.DoubleSide : THREE.FrontSide}
              depthWrite={(opacity ?? 1) >= 1}
              clippingPlanes={clippingPlanes}
            />
          )}
          {children.map((child) => (
            <SceneObject
              key={child.id}
              data={child}
              selectedId={selectedId}
              setObjectRef={setObjectRef}
              onSelect={onSelect}
              onUpdate={onUpdate}
              cameraView={cameraView}
              isSelectionEnabled={isSelectionEnabled}
              clippingPlanes={clippingPlanes}
            />
          ))}
        </GeometryComponent>
      )}
    </>
  );
}
