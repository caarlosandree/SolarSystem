import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, SphereGeometry, MeshStandardMaterial, Color } from 'three';
import { useSolarSystem } from '@/contexts/SolarSystemContext';
import { useUI } from '@/contexts/UIContext';

interface Asteroid {
  mesh: Mesh;
  rotationSpeed: { x: number; y: number; z: number };
  orbitSpeed: number;
  radius: number;
  angle: number;
  type: string;
}

interface AsteroidBeltProps {
  beltType: 'inner' | 'middle' | 'outer' | 'trojans' | 'kuiper' | 'scattered' | 'oort';
}

export default function AsteroidBelt({ beltType }: AsteroidBeltProps) {
  const { state } = useSolarSystem();
  const { state: uiState } = useUI();
  const asteroidsRef = useRef<Asteroid[]>([]);

  const asteroids = useMemo(() => {
    const newAsteroids: Asteroid[] = [];
    let count = 0;
    let innerRadius = 0;
    let outerRadius = 0;
    let baseOrbitSpeed = 0;

    // Configure belt parameters
    switch (beltType) {
      case 'inner':
        count = 150;
        innerRadius = 19.5;
        outerRadius = 21.5;
        baseOrbitSpeed = 0.003;
        break;
      case 'middle':
        count = 200;
        innerRadius = 21.5;
        outerRadius = 23.5;
        baseOrbitSpeed = 0.0025;
        break;
      case 'outer':
        count = 150;
        innerRadius = 23.5;
        outerRadius = 25.5;
        baseOrbitSpeed = 0.002;
        break;
      case 'trojans':
        count = 100;
        innerRadius = 23; // Around Jupiter distance
        outerRadius = 27;
        baseOrbitSpeed = 0.000084;
        break;
      case 'kuiper':
        count = 200;
        innerRadius = 44;
        outerRadius = 58;
        baseOrbitSpeed = 0.0000015;
        break;
      case 'scattered':
        count = 80;
        innerRadius = 58;
        outerRadius = 80;
        baseOrbitSpeed = 0.0000008;
        break;
      case 'oort':
        count = 50;
        innerRadius = 80;
        outerRadius = 120;
        baseOrbitSpeed = 0.0000003;
        break;
    }

    for (let i = 0; i < count; i++) {
      let angle: number;
      let radius: number;
      let size: number;
      let color: Color;

      if (beltType === 'trojans') {
        // Special positioning for Trojans (L4 and L5 points)
        const isL4 = i < count / 2;
        const baseAngle = isL4 ? Math.PI / 3 : -Math.PI / 3;
        angle = baseAngle + (Math.random() - 0.5) * 1.0;
        radius = 25 + (Math.random() - 0.5) * 4; // Around Jupiter
        size = 0.02 + Math.random() * 0.05;
        color = new Color(0.35, 0.25, 0.15);
      } else if (beltType === 'scattered' || beltType === 'oort') {
        // Random angles for scattered disk and Oort cloud
        angle = Math.random() * Math.PI * 2;
        radius = innerRadius + Math.random() * (outerRadius - innerRadius);
        size = beltType === 'oort' ? 0.05 + Math.random() * 0.12 : 0.04 + Math.random() * 0.1;
        color = beltType === 'oort' 
          ? new Color(0.8, 0.6, 0.9) 
          : new Color(0.6, 0.3, 0.2);
      } else {
        // Regular belt asteroids
        angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        radius = innerRadius + Math.random() * (outerRadius - innerRadius);
        size = 0.01 + Math.random() * 0.08;
        
        // Asteroid type colors (C-type, S-type, M-type)
        const asteroidType = Math.random();
        if (beltType === 'kuiper') {
          if (asteroidType < 0.3) {
            color = new Color(0.6, 0.7, 0.8); // Icy blue-white
          } else if (asteroidType < 0.6) {
            color = new Color(0.5, 0.4, 0.3); // Rocky brown
          } else {
            color = new Color(0.7, 0.5, 0.4); // Reddish
          }
        } else {
          if (asteroidType < 0.5) {
            color = new Color(0.4, 0.26, 0.13); // C-type
          } else if (asteroidType < 0.8) {
            color = new Color(0.6, 0.6, 0.6); // S-type
          } else {
            color = new Color(0.5, 0.4, 0.3); // M-type
          }
        }
      }

      const geometry = new SphereGeometry(size, 6, 6);
      const material = new MeshStandardMaterial({
        color: color,
        emissive: color.clone().multiplyScalar(beltType === 'kuiper' ? 0.2 : 0.1),
        emissiveIntensity: beltType === 'kuiper' ? 0.4 : 0.15,
        roughness: 1.0,
        metalness: beltType === 'kuiper' ? 0.05 : (Math.random() > 0.8 ? 0.3 : 0.1),
        toneMapped: false,
      });

      const mesh = new Mesh(geometry, material);
      const yOffset = beltType === 'kuiper' ? (Math.random() - 0.5) * 3.0 :
                     beltType === 'scattered' ? (Math.random() - 0.5) * 10.0 :
                     beltType === 'oort' ? (Math.random() - 0.5) * 20.0 :
                     (Math.random() - 0.5) * 1.2;

      mesh.position.set(
        Math.cos(angle) * radius,
        yOffset,
        Math.sin(angle) * radius
      );

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;

      newAsteroids.push({
        mesh,
        rotationSpeed: {
          x: (Math.random() - 0.5) * (beltType === 'oort' ? 0.005 : 0.02),
          y: (Math.random() - 0.5) * (beltType === 'oort' ? 0.005 : 0.02),
          z: (Math.random() - 0.5) * (beltType === 'oort' ? 0.005 : 0.02),
        },
        orbitSpeed: baseOrbitSpeed + Math.random() * (baseOrbitSpeed * 0.5),
        radius,
        angle,
        type: beltType,
      });
    }

    return newAsteroids;
  }, [beltType]);

  asteroidsRef.current = asteroids;

  useFrame(() => {
    if (!state.isPaused) {
      const realTimeMultiplier = state.speed === 0 ? 0.0001 : state.speed;
      // Apply cinematic factor during eclipse tour (0.06 = 6% speed)
      const cinematicFactor = uiState.isEclipseTourActive ? 0.06 : 1.0;
      
      asteroidsRef.current.forEach((asteroid) => {
        asteroid.mesh.rotation.x += asteroid.rotationSpeed.x * realTimeMultiplier;
        asteroid.mesh.rotation.y += asteroid.rotationSpeed.y * realTimeMultiplier;
        asteroid.mesh.rotation.z += asteroid.rotationSpeed.z * realTimeMultiplier;

        asteroid.angle += asteroid.orbitSpeed * realTimeMultiplier * cinematicFactor;
        asteroid.mesh.position.x = Math.cos(asteroid.angle) * asteroid.radius;
        asteroid.mesh.position.z = Math.sin(asteroid.angle) * asteroid.radius;
      });
    }
  });

  // Check visibility based on belt type
  const isVisible = 
    beltType === 'inner' || beltType === 'middle' || beltType === 'outer'
      ? state.asteroidBeltVisibility.main
      : state.asteroidBeltVisibility[beltType];

  if (!isVisible) return null;

  return (
    <>
      {asteroids.map((asteroid, index) => (
        <primitive key={`${beltType}-${index}`} object={asteroid.mesh} />
      ))}
    </>
  );
}

