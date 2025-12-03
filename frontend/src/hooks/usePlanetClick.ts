import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2, Object3D } from 'three';
import { useSolarSystem } from '@/contexts/SolarSystemContext';
import { useUI } from '@/contexts/UIContext';
import { celestialBodies } from '@/utils/constants';

export function usePlanetClick() {
  const { camera, scene } = useThree();
  const { selectBody } = useSolarSystem();
  const { openPlanetInfo } = useUI();
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Check if clicking on UI elements
      const target = event.target as HTMLElement;
      if (
        target.closest('.controls') ||
        target.closest('.celestial-panel') ||
        target.closest('.info') ||
        target.closest('.planet-info-card') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select')
      ) {
        return;
      }

      // Calculate mouse position in normalized device coordinates
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update raycaster
      raycaster.current.setFromCamera(mouse.current, camera);

      // Get all clickable objects (planets, sun)
      const clickableObjects: Object3D[] = [];
      
      // Find sun
      scene.traverse((object) => {
        if (object.userData?.isSun) {
          clickableObjects.push(object);
        }
      });

      // Find planets
      scene.traverse((object) => {
        if (object.userData?.isPlanet) {
          clickableObjects.push(object);
        }
      });

      // Perform raycasting
      const intersects = raycaster.current.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        
        // Check if it's the sun
        if (intersectedObject.userData?.isSun) {
          // Handle sun click - could trigger follow sun
          console.log('Sol clicado');
          return;
        }

        // Check if it's a planet
        if (intersectedObject.userData?.isPlanet) {
          const planetName = intersectedObject.userData.planetName;
          const body = celestialBodies.find((b) => b.name === planetName);
          
          if (body) {
            selectBody(body);
            openPlanetInfo();
          }
        }
      } else {
        // Click on empty space - close planet info
        selectBody(null);
      }
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [camera, scene, selectBody, openPlanetInfo]);
}

