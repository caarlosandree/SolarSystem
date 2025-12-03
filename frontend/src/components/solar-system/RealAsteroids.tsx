import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Mesh, SphereGeometry, MeshStandardMaterial, Color } from 'three';
import { useSolarSystem } from '@/contexts/SolarSystemContext';
import { useFamousAsteroids } from '@/hooks/queries/useFamousAsteroids';
import { useNEOs } from '@/hooks/queries/useNEOs';
import { useSentryObjects } from '@/hooks/queries/useSentryObjects';
import { keplerToCartesian } from '@/utils/orbital';
import { AU_TO_SCENE, getAssetPath } from '@/utils/constants';
import type { FamousAsteroidData } from '@/services/nasaApi';
import type { NEOObject, SentryObject } from '@/services/nasaApi';

interface RealAsteroid {
  mesh: Mesh;
  name: string;
  type: 'famous' | 'neo' | 'sentry';
  data: FamousAsteroidData | NEOObject | SentryObject;
}

export default function RealAsteroids() {
  const { state } = useSolarSystem();
  const asteroidsRef = useRef<RealAsteroid[]>([]);
  
  // Load rock texture for realistic asteroid appearance
  const rockTexture = useTexture(getAssetPath('/textures/mars.jpg'));

  // Fetch asteroids using custom hooks
  const { data: famousAsteroids } = useFamousAsteroids();
  const { data: neoObjects } = useNEOs();
  const { data: sentryObjects } = useSentryObjects();

  const asteroids = useMemo(() => {
    const newAsteroids: RealAsteroid[] = [];

    // Add famous asteroids (realistic rocky appearance)
    if (famousAsteroids) {
      famousAsteroids.forEach((asteroidData) => {
        if (asteroidData.orb) {
          const pos = keplerToCartesian(asteroidData.orb);
          const size = 0.2 + Math.random() * 0.1;
          
          // Varied rocky colors for famous asteroids
          const colorVariation = Math.random();
          const baseColor = colorVariation < 0.4 
            ? new Color(0.4, 0.26, 0.13)  // C-type (carbonaceous) - dark brown
            : colorVariation < 0.7
            ? new Color(0.6, 0.6, 0.6)    // S-type (silicate) - gray
            : new Color(0.5, 0.4, 0.3);   // M-type (metallic) - brownish
          
          const geometry = new SphereGeometry(size, 12, 12);
          const material = new MeshStandardMaterial({
            map: rockTexture,
            color: baseColor,
            roughness: 1.0,
            metalness: colorVariation > 0.7 ? 0.3 : 0.1,
            emissive: baseColor.clone().multiplyScalar(0.1),
            emissiveIntensity: 0.15,
          });
          
          const mesh = new Mesh(geometry, material);
          mesh.position.set(
            pos.x * AU_TO_SCENE,
            pos.y * AU_TO_SCENE,
            pos.z * AU_TO_SCENE
          );
          
          // Random initial rotation
          mesh.rotation.x = Math.random() * Math.PI;
          mesh.rotation.y = Math.random() * Math.PI;
          mesh.rotation.z = Math.random() * Math.PI;
          
          newAsteroids.push({
            mesh,
            name: asteroidData.name,
            type: 'famous',
            data: asteroidData,
          });
        }
      });
    }

    // Add NEOs (realistic rocky appearance) - limit to 30
    if (neoObjects && neoObjects.length > 0) {
      const limit = Math.min(30, neoObjects.length);
      for (let i = 0; i < limit; i++) {
        const neo = neoObjects[i];
        const size = 0.15 + Math.random() * 0.1;
        
        // Rocky colors for NEOs (reddish-brown tones)
        const colorVariation = Math.random();
        const baseColor = colorVariation < 0.5
          ? new Color(0.5, 0.35, 0.25)  // Reddish-brown
          : new Color(0.4, 0.3, 0.2);   // Darker brown
        
        const geometry = new SphereGeometry(size, 8, 8);
        const material = new MeshStandardMaterial({
          map: rockTexture,
          color: baseColor,
          roughness: 1.0,
          metalness: 0.1,
          emissive: baseColor.clone().multiplyScalar(0.1),
          emissiveIntensity: 0.15,
        });
        
        const mesh = new Mesh(geometry, material);
        // Simplified positioning for NEOs (would need orbital elements)
        const distance = 8 + Math.random() * 5;
        const angle = Math.random() * Math.PI * 2;
        mesh.position.set(
          Math.cos(angle) * distance,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * distance
        );
        
        // Random initial rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;
        
        newAsteroids.push({
          mesh,
          name: neo.name || `NEO-${i}`,
          type: 'neo',
          data: neo,
        });
      }
    }

    // Add Sentry objects (realistic rocky appearance) - limit to 20
    if (sentryObjects && sentryObjects.length > 0) {
      const limit = Math.min(20, sentryObjects.length);
      for (let i = 0; i < limit; i++) {
        const obj = sentryObjects[i];
        const size = 0.18 + Math.random() * 0.1;
        
        // Rocky colors for Sentry objects (orange-brown tones)
        const colorVariation = Math.random();
        const baseColor = colorVariation < 0.5
          ? new Color(0.6, 0.4, 0.25)   // Orange-brown
          : new Color(0.5, 0.35, 0.2);  // Darker orange-brown
        
        const geometry = new SphereGeometry(size, 8, 8);
        const material = new MeshStandardMaterial({
          map: rockTexture,
          color: baseColor,
          roughness: 1.0,
          metalness: 0.15,
          emissive: baseColor.clone().multiplyScalar(0.1),
          emissiveIntensity: 0.15,
        });
        
        const mesh = new Mesh(geometry, material);
        // Simplified positioning for Sentry objects
        const distance = 8 + Math.random() * 5;
        const angle = Math.random() * Math.PI * 2;
        mesh.position.set(
          Math.cos(angle) * distance,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * distance
        );
        
        // Random initial rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;
        
        newAsteroids.push({
          mesh,
          name: obj.des || `Sentry-${i}`,
          type: 'sentry',
          data: obj,
        });
      }
    }

    return newAsteroids;
  }, [famousAsteroids, neoObjects, sentryObjects, rockTexture]);

  asteroidsRef.current = asteroids;

  useFrame((_, delta) => {
    if (!state.isPaused) {
      // Rotate asteroids slowly for more realistic appearance
      asteroidsRef.current.forEach((asteroid) => {
        asteroid.mesh.rotation.x += 0.01 * delta * 60;
        asteroid.mesh.rotation.y += 0.015 * delta * 60;
      });
    }
  });

  if (!state.showRealAsteroids) return null;

  return (
    <>
      {asteroids.map((asteroid, index) => (
        <primitive key={`real-asteroid-${asteroid.type}-${index}`} object={asteroid.mesh} />
      ))}
    </>
  );
}

