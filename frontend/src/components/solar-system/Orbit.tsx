import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color, DoubleSide } from 'three';
import type { CelestialBodyType } from '@/types/planet';
import { useSolarSystem } from '@/contexts/SolarSystemContext';

interface OrbitProps {
  distance: number;
  type: CelestialBodyType;
}

export default function Orbit({ distance, type }: OrbitProps) {
  const meshRef = useRef<Mesh>(null);
  const { state } = useSolarSystem();

  // Calculate orbit color and properties based on type and distance
  const { orbitColor, glowIntensity, baseOpacity } = useMemo(() => {
    let color: Color;
    let glow: number;
    let opacity: number;

    if (type === 'dwarf') {
      color = new Color(0.8, 0.6, 0.0);
      glow = 0.08;
      opacity = 0.04;
    } else if (type === 'asteroid') {
      color = new Color(0.6, 0.3, 0.15);
      glow = 0.06;
      opacity = 0.03;
    } else if (type === 'tno') {
      color = new Color(0.4, 0.15, 0.5);
      glow = 0.1;
      opacity = 0.05;
    } else {
      // Planet
      if (distance < 20) {
        color = new Color(0.3, 0.5, 0.7);
        glow = 0.03;
        opacity = 0.02;
      } else if (distance < 35) {
        color = new Color(0.5, 0.4, 0.7);
        glow = 0.05;
        opacity = 0.03;
      } else {
        color = new Color(0.7, 0.3, 0.4);
        glow = 0.07;
        opacity = 0.04;
      }
    }

    // Enhance for distant objects
    if (distance > 45) {
      glow *= 1.2;
      opacity *= 1.3;
    }

    return { orbitColor: color, glowIntensity: glow, baseOpacity: opacity };
  }, [distance, type]);

  // Pulse effect for distant objects
  const shouldPulse = distance > 40;
  const pulsePhase = useMemo(() => Math.random() * Math.PI * 2, []);
  const pulseSpeed = useMemo(() => 0.002 + Math.random() * 0.003, []);

  useFrame(() => {
    if (meshRef.current && shouldPulse && meshRef.current.material) {
      const time = Date.now() * 0.001;
      const pulse = Math.sin(time * pulseSpeed + pulsePhase) * 0.3 + 0.7;
      const material = meshRef.current.material as any;
      
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = glowIntensity * pulse;
      }
      
      if (material.opacity !== undefined) {
        material.opacity = baseOpacity * (0.8 + pulse * 0.2);
      }
    }
  });

  if (!state.showOrbits) return null;

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <ringGeometry args={[distance - 0.05, distance + 0.05, 128]} />
      <meshBasicMaterial
        color={orbitColor}
        side={DoubleSide}
        transparent
        opacity={baseOpacity}
        toneMapped={false}
      />
    </mesh>
  );
}

