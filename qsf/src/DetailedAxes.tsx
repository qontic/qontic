// DetailedAxes.tsx
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';
import type { CameraViewType } from './types';
import { ScaledText } from './ScaledText';

interface DetailedAxesProps {
  size: number;
  ticks: number;
  cameraView: CameraViewType;
  worldScale?: THREE.Vector3;
  labelTextSize?: number;
  showAxisLabels?: boolean;
}

const getTickAndLabelDirection = (
  axis: 'x' | 'y' | 'z',
  view: CameraViewType
): THREE.Vector3 => {
  switch (view) {
    case 'xy':
      if (axis === 'x') return new THREE.Vector3(0, 1, 0);
      if (axis === 'y') return new THREE.Vector3(1, 0, 0);
      return new THREE.Vector3(1, 0, 0);
    case 'xz':
      if (axis === 'x') return new THREE.Vector3(0, 0, 1);
      if (axis === 'z') return new THREE.Vector3(1, 0, 0);
      return new THREE.Vector3(1, 0, 0);
    case 'yz':
      if (axis === 'y') return new THREE.Vector3(0, 0, 1);
      if (axis === 'z') return new THREE.Vector3(0, 1, 0);
      return new THREE.Vector3(0, 1, 0);
    case '3D':
    default:
      if (axis === 'x') return new THREE.Vector3(0, 1, 0);
      return new THREE.Vector3(1, 0, 0);
  }
};

type AxisProps = {
  direction: 'x' | 'y' | 'z';
  size: number;
  color: string;
  ticks: number;
  cameraView: CameraViewType;
  worldScale?: THREE.Vector3;
  labelTextSize?: number;
  showAxisLabels?: boolean;
};

const Axis = ({
  direction,
  size,
  color,
  ticks,
  cameraView,
  worldScale,
  labelTextSize,
  showAxisLabels = true,
}: AxisProps) => {
  const shouldRenderLabels = showAxisLabels && !(
    (cameraView === 'xy' && direction === 'z') ||
    (cameraView === 'xz' && direction === 'y') ||
    (cameraView === 'yz' && direction === 'x')
  );

  const scaleX = worldScale?.x ?? 1;
  const scaleY = worldScale?.y ?? 1;
  const scaleZ = worldScale?.z ?? 1;

  // Effective numeric length along this axis
  const effectiveSize =
    direction === 'x' ? size * scaleX :
    direction === 'y' ? size * scaleY :
                        size * scaleZ;

  // Generate tick values from 0..effectiveSize
  const tickValues = useMemo(() => {
    if (effectiveSize <= 0) return [];

    const targetTickCount = ticks;
    const rawInterval = effectiveSize / targetTickCount;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)));
    const residual = rawInterval / magnitude;

    let tickInterval;
    if (residual < 1.5) tickInterval = 1 * magnitude;
    else if (residual < 3.5) tickInterval = 2 * magnitude;
    else if (residual < 7.5) tickInterval = 5 * magnitude;
    else tickInterval = 10 * magnitude;

    const tickCount = Math.floor(effectiveSize / tickInterval);
    return Array.from({ length: tickCount }, (_, i) => (i + 1) * tickInterval);
  }, [effectiveSize, ticks]);

  // Map numeric tick value v ∈ [0, effectiveSize] to position along geometry [0, size]
  const valueToPosition = (v: number) =>
    effectiveSize === 0 ? 0 : (v / effectiveSize) * size;

  const tickSize = size * 0.05;

  const axisPoints = useMemo(() => {
    const end = new THREE.Vector3();
    end[direction] = size;
    return [new THREE.Vector3(0, 0, 0), end];
  }, [direction, size]);

  const labelPosition = useMemo(() => {
    const pos = new THREE.Vector3();
    pos[direction] = size + size * 0.1;
    return pos;
  }, [direction, size]);

  return (
    <group>
      {/* Axis line in geometry space (0..size) */}
      <Line points={axisPoints} color={color} lineWidth={1} />

      {/* Tick lines in geometry space, labels in numeric space */}
      {tickValues.map((val) => {
        const tickDir = getTickAndLabelDirection(direction, cameraView);
        const posAlong = valueToPosition(val);

        const tickPoints = [new THREE.Vector3(), new THREE.Vector3()];
        tickPoints[0][direction] = posAlong;
        tickPoints[1][direction] = posAlong;

        tickPoints[0].add(tickDir.clone().multiplyScalar(-tickSize));
        tickPoints[1].add(tickDir.clone().multiplyScalar(tickSize));

        return (
          <Line
            key={`tick-${direction}-${val}`}
            points={tickPoints}
            color={color}
            lineWidth={1}
          />
        );
      })}

      {/* Tick labels */}
      {shouldRenderLabels &&
        tickValues.map((val) => {
          const offsetDir = getTickAndLabelDirection(direction, cameraView);
          const posAlong = valueToPosition(val);

          const labelPos = new THREE.Vector3();
          labelPos[direction] = posAlong;
          labelPos.add(offsetDir.clone().multiplyScalar(tickSize * 2));

          return (
            <ScaledText
              key={`label-${direction}-${val}`}
              position={labelPos}
              color="white"
              anchorX="center"
              anchorY="middle"
              value={val}
              depthTest={false}
              labelTextSize={labelTextSize}
              renderOrder={1}
            />
          );
        })}

      {/* Axis label (X, Y, Z) */}
      {shouldRenderLabels && (
        <ScaledText
          position={labelPosition}
          color={color}
          anchorX="center"
          anchorY="middle"
          value={0}
          text={direction.toUpperCase()}
          depthTest={false}
          labelTextSize={labelTextSize}
          renderOrder={1}
        />
      )}
    </group>
  );
};

export function DetailedAxes({
  size,
  ticks,
  cameraView,
  worldScale,
  labelTextSize,
  showAxisLabels,
}: DetailedAxesProps) {
  return (
    <group>
      <Axis
        direction="x"
        size={size}
        color="red"
        ticks={ticks}
        cameraView={cameraView}
        labelTextSize={labelTextSize}
        showAxisLabels={showAxisLabels}
        worldScale={worldScale}
      />
      <Axis
        direction="y"
        size={size}
        color="green"
        ticks={ticks}
        cameraView={cameraView}
        labelTextSize={labelTextSize}
        showAxisLabels={showAxisLabels}
        worldScale={worldScale}
      />
      <Axis
        direction="z"
        size={size}
        color="blue"
        ticks={ticks}
        cameraView={cameraView}
        labelTextSize={labelTextSize}
        showAxisLabels={showAxisLabels}
        worldScale={worldScale}
      />
    </group>
  );
}
