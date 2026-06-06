"use client";

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

function ParticleSwarm() {
  const ref = useRef<THREE.Points>(null);
  const { theme, systemTheme } = useTheme();
  const activeTheme = theme === 'system' ? systemTheme : theme;
  const starColor = activeTheme === 'light' ? '#782604' : '#6366f1';
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1 (R3F style coordinates)
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      // Slow down default rotation to make the mouse gravity effect stand out
      ref.current.rotation.y -= delta / 25;
      ref.current.rotation.x -= delta / 35;

      const positionsArr = ref.current.geometry.attributes.position.array as Float32Array;
      const mouseX = (mouse.current.x * state.viewport.width) / 2;
      const mouseY = (mouse.current.y * state.viewport.height) / 2;

      for (let i = 0; i < 2000; i++) {
        const px = positionsArr[i * 3];
        const py = positionsArr[i * 3 + 1];
        const pz = positionsArr[i * 3 + 2];
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];

        // Vector from current particle position to the mouse
        const dx = mouseX - px;
        const dy = mouseY - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const maxDist = 5.0; // Radius of mouse gravity influence

        if (dist < maxDist) {
          // Stronger pull close to the center
          const pull = Math.pow(1 - (dist / maxDist), 2);

          // Gravitational pull directly towards mouse
          positionsArr[i * 3] += dx * pull * 0.18;
          positionsArr[i * 3 + 1] += dy * pull * 0.18;

          // Gravitational orbital swirl (perpendicular force)
          const swirl = pull * 0.08;
          positionsArr[i * 3] -= dy * swirl;
          positionsArr[i * 3 + 1] += dx * swirl;
        }

        // Spring-like restoring force back to original resting coordinates
        positionsArr[i * 3] += (ox - positionsArr[i * 3]) * 0.04;
        positionsArr[i * 3 + 1] += (oy - positionsArr[i * 3 + 1]) * 0.04;
        positionsArr[i * 3 + 2] += (oz - positionsArr[i * 3 + 2]) * 0.04;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          key={activeTheme}
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-70">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ParticleSwarm />
      </Canvas>
    </div>
  );
}
