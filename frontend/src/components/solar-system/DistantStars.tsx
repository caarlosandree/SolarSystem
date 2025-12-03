import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Group } from 'three';
import { useUI } from '@/contexts/UIContext';

export default function DistantStars() {
  const groupRef = useRef<Group>(null);
  const { state: uiState } = useUI();

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Apply cinematic factor during eclipse tour (0.06 = 6% speed)
      const cinematicFactor = uiState.isEclipseTourActive ? 0.06 : 1.0;
      groupRef.current.rotation.y += 0.0001 * delta * 60 * cinematicFactor;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={200} depth={64} count={5000} factor={4} fade speed={1} />
    </group>
  );
}

