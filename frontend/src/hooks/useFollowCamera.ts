import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useSolarSystem } from '@/contexts/SolarSystemContext';

export function useFollowCamera() {
  const { camera } = useThree();
  const { state } = useSolarSystem();
  const lastPositionRef = useRef<Vector3>(new Vector3(0, 0, 0));
  const followOffsetRef = useRef<Vector3>(new Vector3(10, 5, 10));
  const isInitializedRef = useRef(false);

  // Reset camera function
  const resetCamera = () => {
    camera.position.set(0, 30, 70);
    camera.lookAt(0, 0, 0);
    lastPositionRef.current.set(0, 0, 0);
    isInitializedRef.current = false;
  };

  useFrame(() => {
    if (!state.followingBody) {
      isInitializedRef.current = false;
      return;
    }

    // Find the target position
    const body = state.followingBody;
    let targetPosition = new Vector3(0, 0, 0);

    // Calculate planet position based on orbital mechanics
    const angle = body.initialAngle + (Date.now() * 0.0001 * body.speed * state.speed);
    const x = Math.cos(angle) * body.dist;
    const z = Math.sin(angle) * body.dist;
    targetPosition.set(x, 0, z);

    // Calculate follow offset based on body size
    const distance = Math.max(body.size * 8, 15);
    followOffsetRef.current.set(distance, distance * 0.5, distance);

    // Calculate desired camera position
    const desiredPosition = targetPosition.clone().add(followOffsetRef.current);

    if (!isInitializedRef.current) {
      // Initialize camera position immediately
      camera.position.copy(desiredPosition);
      camera.lookAt(targetPosition);
      lastPositionRef.current.copy(targetPosition);
      isInitializedRef.current = true;
    } else {
      // Smoothly follow the target
      const movement = targetPosition.clone().sub(lastPositionRef.current);
      camera.position.add(movement);
      camera.lookAt(targetPosition);
      lastPositionRef.current.copy(targetPosition);
    }
  });

  // Reset when following body changes
  useEffect(() => {
    if (!state.followingBody) {
      resetCamera();
    } else {
      isInitializedRef.current = false;
    }
  }, [state.followingBody]);

  return { resetCamera };
}

