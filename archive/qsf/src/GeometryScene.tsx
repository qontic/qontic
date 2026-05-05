import { Box, Sphere, Cylinder } from '@react-three/drei';
import type { ComponentProps } from 'react';
import * as THREE from 'three';
import { useMemo } from 'react';

// Custom Tube component with wall thickness
function ThickTube({ innerRadiusFraction = 0.8, ...props }: ComponentProps<typeof Cylinder> & { innerRadiusFraction?: number }) {
  const geometry = useMemo(() => {
    const outerRadius = 0.5;
    const innerRadius = outerRadius * innerRadiusFraction;
    const height = 1;
    const radialSegments = 32;
    
    // Create a tube geometry by combining outer and inner cylinders
    const shape = new THREE.Shape();
    
    // Outer circle
    for (let i = 0; i <= radialSegments; i++) {
      const angle = (i / radialSegments) * Math.PI * 2;
      const x = Math.cos(angle) * outerRadius;
      const y = Math.sin(angle) * outerRadius;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    
    // Inner circle (hole)
    const hole = new THREE.Path();
    for (let i = 0; i <= radialSegments; i++) {
      const angle = (i / radialSegments) * Math.PI * 2;
      const x = Math.cos(angle) * innerRadius;
      const y = Math.sin(angle) * innerRadius;
      if (i === 0) {
        hole.moveTo(x, y);
      } else {
        hole.lineTo(x, y);
      }
    }
    shape.holes.push(hole);
    
    const extrudeSettings = {
      steps: 1,
      depth: height,
      bevelEnabled: false,
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.rotateX(Math.PI / 2);
    
    return geometry;
  }, [innerRadiusFraction]);
  
  // Destructure to remove 'args' which conflicts with custom geometry
  const { args, ...meshProps } = props as any;
  return <mesh {...meshProps} geometry={geometry} />;
}

export const Geometries = {
  box: (props: ComponentProps<typeof Box>) => <Box {...props} />,
  sphere: (props: ComponentProps<typeof Sphere>) => <Sphere {...props} />,
  cylinder: (props: ComponentProps<typeof Cylinder>) => (
    <Cylinder args={[0.5, 0.5, 1, 32]} {...props} />
  ),
  tube: (props: ComponentProps<typeof Cylinder> & { userData?: { tubeInnerRadius?: number } }) => {
    const innerRadiusFraction = props.userData?.tubeInnerRadius ?? 0.8;
    return <ThickTube innerRadiusFraction={innerRadiusFraction} {...props} />;
  },
  group: (props: ComponentProps<'group'>) => <group {...props} />,
};

export type GeometryType = keyof typeof Geometries;
