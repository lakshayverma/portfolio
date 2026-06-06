"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

function ParticleSwarm() {
  const ref = useRef<THREE.Points>(null);
  const { resolvedTheme } = useTheme();
  const starColor = resolvedTheme === 'dark' ? '#6366f1' : '#a5b4fc';

  // Generate 2000 random points within a sphere
  const originalPositions = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const radius = 10 * Math.cbrt(Math.random());
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = z;
    }
    return p;
  }, []);

  const positions = useMemo(() => new Float32Array(originalPositions), [originalPositions]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta / 10;
      ref.current.rotation.x -= delta / 15;

      const positionsArr = ref.current.geometry.attributes.position.array as Float32Array;
      const mouseX = (state.pointer.x * state.viewport.width) / 2;
      const mouseY = (state.pointer.y * state.viewport.height) / 2;
      
      for (let i = 0; i < 2000; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        
        const dx = mouseX - ox;
        const dy = mouseY - oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const maxDist = 4;
        if (dist < maxDist) {
          const pull = Math.pow(1 - (dist / maxDist), 2);
          positionsArr[i * 3] += (ox + dx * pull * 0.6 - positionsArr[i * 3]) * 0.1;
          positionsArr[i * 3 + 1] += (oy + dy * pull * 0.6 - positionsArr[i * 3 + 1]) * 0.1;
        } else {
          positionsArr[i * 3] += (ox - positionsArr[i * 3]) * 0.05;
          positionsArr[i * 3 + 1] += (oy - positionsArr[i * 3 + 1]) * 0.05;
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={starColor}
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-70">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ParticleSwarm />
      </Canvas>
    </div>
  );
}
