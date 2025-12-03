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
    const handleInteraction = (clientX: number, clientY: number, target: HTMLElement) => {
      // Check if clicking/touching on UI elements
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

      // Calculate position in normalized device coordinates
      mouse.current.x = (clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(clientY / window.innerHeight) * 2 + 1;

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

    const handleClick = (event: MouseEvent) => {
      handleInteraction(event.clientX, event.clientY, event.target as HTMLElement);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      // Prevent default to avoid double-tap zoom and other unwanted behaviors
      event.preventDefault();
      
      if (event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        handleInteraction(touch.clientX, touch.clientY, event.target as HTMLElement);
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [camera, scene, selectBody, openPlanetInfo]);
}

