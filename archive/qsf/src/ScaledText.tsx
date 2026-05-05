import { Text, Billboard } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useMemo, forwardRef, useRef, useImperativeHandle } from 'react';
import type { ComponentProps } from 'react';
import * as THREE from 'three';

type ScaledTextProps = Omit<ComponentProps<typeof Text>, 'children' | 'fontSize'> & {
  value?: number;
  text?: string;
  depthTest?: boolean;
  labelTextSize?: number;
  renderOrder?: number;
};

/**
 * A <Text> component that:
 * - keeps a constant apparent screen size (via manual scaling)
 * - still lives in world space for positioning
 * - displays numeric tick values or custom text.
 */
export const ScaledText = forwardRef<any, ScaledTextProps>(
  ({ value = 0, text, depthTest, renderOrder, labelTextSize = 0.01, ...props }, ref) => {
    const { camera } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    useImperativeHandle(ref, () => groupRef.current);

    const worldPosRef = useRef(new THREE.Vector3());
    const parentScaleRef = useRef(new THREE.Vector3());
    const { position, ...restProps } = props;

    const displayText = useMemo(() => {
      if (text !== undefined) {
        return text;
      }

      const abs = Math.abs(value);
      const rounded = Math.round(value);

      // If the value is effectively an integer, show it as an integer.
      if (abs > 0 && Math.abs(value - rounded) < 1e-6) {
        return String(rounded);
      }

      // For small magnitudes, keep one decimal place so values like
      // 1.5, 2.5, etc. don't get rounded to 2, 3 and create duplicates.
      if (abs < 10) {
        return value.toFixed(1);
      }

      // For larger values, integer formatting is usually sufficient.
      return value.toFixed(0);
    }, [text, value]);

    // Adjust scale to keep roughly constant screen size
    useFrame(() => {
      if (!groupRef.current) return;

      let scale = 1;
      if (camera.type === 'OrthographicCamera') {
        const orthoCam = camera as THREE.OrthographicCamera;
        const frustumHeight = orthoCam.top - orthoCam.bottom;
        scale = (frustumHeight / orthoCam.zoom) * labelTextSize;
      } else {
        const worldPos = worldPosRef.current;
        groupRef.current.getWorldPosition(worldPos);
        const dist = worldPos.distanceTo(camera.position);
        scale = dist * labelTextSize;
      }

      // --- FIX: Compensate for parent scaling to prevent distortion ---
      const parent = groupRef.current.parent;
      if (parent) {
        const parentScale = parentScaleRef.current;
        parent.getWorldScale(parentScale);
        
        // Prevent division by zero
        if (Math.abs(parentScale.x) < 0.0001) parentScale.x = 1;
        if (Math.abs(parentScale.y) < 0.0001) parentScale.y = 1;
        if (Math.abs(parentScale.z) < 0.0001) parentScale.z = 1;

        groupRef.current.scale.set(
          scale / parentScale.x,
          scale / parentScale.y,
          scale / parentScale.z
        );
      } else {
        groupRef.current.scale.setScalar(scale);
      }
    });

    return (
      <group ref={groupRef} position={position}>
        <Billboard>
          <Text
            {...restProps}
            // This fontSize is an internal base; actual size comes from group scaling
            fontSize={1}
            material-depthTest={depthTest}
            renderOrder={renderOrder}
          >
            {displayText}
          </Text>
        </Billboard>
      </group>
    );
  }
);

ScaledText.displayName = 'ScaledText';
