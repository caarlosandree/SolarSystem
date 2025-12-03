import { useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Vector3 } from 'three';
import { useSolarSystem } from '@/contexts/SolarSystemContext';

export default function BloomEffect() {
  const { state } = useSolarSystem();
  const { camera, gl, scene, size } = useThree();
  const [intensity, setIntensity] = useState(0.5);
  const [ready, setReady] = useState(false);

  const sunPosition = useMemo(() => new Vector3(0, 0, 0), []);

  // Verificar se o contexto WebGL está pronto e ativo
  const isWebGLContextReady = () => {
    if (!gl || !gl.domElement) return false;
    
    // Verificar o contexto WebGL através do renderer (não criar um novo)
    try {
      const context = gl.getContext();
      if (!context) return false;
      
      // Verificar se o contexto não foi perdido
      const isContextLost = context.isContextLost ? context.isContextLost() : false;
      if (isContextLost) return false;
      
      return true;
    } catch (error) {
      // Se houver erro ao acessar o contexto, considerar não pronto
      return false;
    }
  };

  // Usar useEffect para garantir que o contexto está pronto antes de renderizar
  useEffect(() => {
    // Verificar se todos os componentes necessários estão disponíveis
    if (
      gl &&
      gl.domElement &&
      scene &&
      camera &&
      size.width > 0 &&
      size.height > 0 &&
      isWebGLContextReady()
    ) {
      // Aguardar múltiplos frames para garantir que o EffectComposer pode ser inicializado
      let frameCount = 0;
      let animationFrameId: number;
      
      const checkReady = () => {
        frameCount++;
        // Verificar novamente a cada frame para garantir que o contexto ainda está válido
        if (frameCount >= 5 && isWebGLContextReady()) {
          setReady(true);
        } else if (isWebGLContextReady()) {
          animationFrameId = requestAnimationFrame(checkReady);
        } else {
          setReady(false);
        }
      };
      
      animationFrameId = requestAnimationFrame(checkReady);
      
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    } else {
      setReady(false);
    }
  }, [gl, scene, camera, size]);

  useFrame(() => {
    if (!ready) return;

    let targetIntensity = 0;

    if (state.isBloomManual) {
      targetIntensity = state.bloomStrength;
    } else {
      // Auto calculation logic
      const distanceToSun = camera.position.distanceTo(sunPosition);
      const maxDistance = 100;
      const minDistance = 10;
      const normalizedDistance = Math.max(
        0,
        Math.min(1, (distanceToSun - minDistance) / (maxDistance - minDistance))
      );

      targetIntensity = 0.5 + (1 - normalizedDistance) * 1.0;
    }

    // Smooth interpolation (prevents jumping)
    setIntensity((prev) => prev + (targetIntensity - prev) * 0.1);
  });

  // Verificação final antes de renderizar
  if (
    !ready ||
    !gl ||
    !gl.domElement ||
    !scene ||
    !camera ||
    size.width <= 0 ||
    size.height <= 0 ||
    !isWebGLContextReady()
  ) {
    return null;
  }

  return (
    <EffectComposer 
      disableNormalPass
      multisampling={0}
      resolutionScale={1}
    >
      <Bloom
        luminanceThreshold={0.05}
        luminanceSmoothing={0.6}
        radius={0.6}
        intensity={intensity}
        mipmapBlur={true}
      />
    </EffectComposer>
  );
}

