import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import { Mesh, Color, Group, DoubleSide } from 'three';
import type { CelestialBody } from '@/types/planet';
import { useSolarSystem } from '@/contexts/SolarSystemContext';
import { useUI } from '@/contexts/UIContext';
import { getAssetPath } from '@/utils/constants';
import Moon from './Moon';
import Orbit from './Orbit';

interface PlanetProps {
  body: CelestialBody;
}

export default function Planet({ body }: PlanetProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const { state } = useSolarSystem();
  const { state: uiState } = useUI();

  // Always call useTexture hook, but use fallback when texture is missing
  // Using sun.jpg as fallback since it always exists
  const texturePath = body.texture 
    ? getAssetPath(`/textures/${body.texture}`) 
    : getAssetPath('/textures/sun.jpg');
  const texture = useTexture(texturePath);
  // Load ring texture only for planets with rings
  const ringTexturePath = body.hasRings 
    ? getAssetPath('/textures/saturn_ring.png') 
    : getAssetPath('/textures/sun.jpg');
  const ringTextureLoaded = useTexture(ringTexturePath);
  const ringTexture = body.hasRings ? ringTextureLoaded : null;
  const color = body.color || new Color(0.8, 0.8, 0.8);

  const angle = useMemo(() => body.initialAngle, [body.initialAngle]);

  useFrame((_, delta) => {
    if (groupRef.current && !state.isPaused) {
      // Apply cinematic factor during eclipse tour (0.08 = 8% speed)
      const cinematicFactor = uiState.isEclipseTourActive ? 0.08 : 1.0;
      groupRef.current.rotation.y += body.speed * state.speed * delta * 60 * cinematicFactor;
    }
    if (meshRef.current) {
      const cinematicFactor = uiState.isEclipseTourActive ? 0.08 : 1.0;
      meshRef.current.rotation.y += 0.01 * delta * 60 * cinematicFactor;
    }
  });

  const x = Math.cos(angle) * body.dist;
  const z = Math.sin(angle) * body.dist;

  return (
    <>
      <Orbit distance={body.dist} type={body.type} />
      <group ref={groupRef} position={[x, 0, z]}>
        <mesh
          ref={meshRef}
          userData={{ isPlanet: true, planetName: body.name }}
        >
          <sphereGeometry args={[body.size, 64, 64]} />
          {body.texture ? (
            <meshStandardMaterial
              map={texture}
              roughness={body.roughness}
              metalness={body.metalness}
            />
          ) : (
            <meshStandardMaterial
              color={color}
              roughness={body.roughness}
              metalness={body.metalness}
            />
          )}
        </mesh>
        {state.showLabels && (
          <Html
            position={[0, body.size + 1, 0]}
            center
            transform
            occlude
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div
              className="planet-label"
              style={{
                color: '#fff',
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                textShadow: '0 0 10px rgba(255,255,255,0.5)',
                whiteSpace: 'nowrap',
                padding: '4px 8px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {body.name}
            </div>
          </Html>
        )}
        {body.hasRings && ringTexture && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[body.size * 1.5, body.size * 2.5, 64]} />
            <meshBasicMaterial 
              map={ringTexture} 
              side={DoubleSide} 
              transparent 
              opacity={0.8}
              alphaTest={0.1}
            />
          </mesh>
        )}
        {state.showMoons &&
          body.moons.map((moon) => (
            <Moon key={moon.name} moon={moon} parentSize={body.size} />
          ))}
      </group>
    </>
  );
}

