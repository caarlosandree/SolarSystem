import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh, Group, Color } from 'three';
import type { Moon as MoonType } from '@/types/planet';
import { useSolarSystem } from '@/contexts/SolarSystemContext';
import { useUI } from '@/contexts/UIContext';

interface MoonProps {
  moon: MoonType;
  parentSize: number;
}

export default function Moon({ moon, parentSize }: MoonProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const { state } = useSolarSystem();
  const { state: uiState } = useUI();

  const color = moon.color || new Color(0.5, 0.5, 0.5);
  const angle = useMemo(() => moon.initialAngle, [moon.initialAngle]);

  useFrame((_, delta) => {
    if (groupRef.current && !state.isPaused) {
      // Apply cinematic factor during eclipse tour (0.06 = 6% speed)
      const moonCinematic = uiState.isEclipseTourActive ? 0.06 : 1.0;
      const adjustedMoonSpeed = moon.speed * moonCinematic;
      groupRef.current.rotation.y += adjustedMoonSpeed * state.speed * delta * 60;
    }
    if (meshRef.current) {
      const cinematicFactor = uiState.isEclipseTourActive ? 0.6 : 1.0;
      meshRef.current.rotation.y += 0.02 * delta * 60 * cinematicFactor;
    }
  });

  const x = Math.cos(angle) * (moon.dist + parentSize);
  const z = Math.sin(angle) * (moon.dist + parentSize);

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[moon.size, 32, 32]} />
        <meshStandardMaterial color={color} roughness={1.0} metalness={0.1} />
      </mesh>
      {state.showMoonLabels && (
        <Html
          position={[0, moon.size + 0.5, 0]}
          center
          transform
          occlude
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            className="moon-label"
            style={{
              color: '#fff',
              fontSize: '10px',
              fontFamily: 'Arial, sans-serif',
              textShadow: '0 0 8px rgba(255,255,255,0.4)',
              whiteSpace: 'nowrap',
              padding: '2px 6px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '3px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {moon.name}
          </div>
        </Html>
      )}
    </group>
  );
}

