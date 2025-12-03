import { useFollowCamera } from '@/hooks/useFollowCamera';
import { useEffect } from 'react';

export default function CameraController() {
  const { resetCamera } = useFollowCamera();

  // Expose resetCamera to window for keyboard shortcuts
  useEffect(() => {
    (window as any).__resetCamera = resetCamera;
    return () => {
      delete (window as any).__resetCamera;
    };
  }, [resetCamera]);

  return null;
}

