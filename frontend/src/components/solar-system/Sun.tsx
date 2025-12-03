import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Mesh, Color, Texture } from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import { getAssetPath } from '@/utils/constants';

export default function Sun() {
  const meshRef = useRef<Mesh>(null);
  const lensflareRef = useRef<Lensflare | null>(null);
  const sunTexture = useTexture(getAssetPath('/textures/sun.jpg')) as Texture;
  const textureFlare0 = useTexture(getAssetPath('/textures/lensflare0.png')) as Texture;
  const textureFlare2 = useTexture(getAssetPath('/textures/lensflare2.png')) as Texture;

  // Configurar texturas corretamente
  useEffect(() => {
    if (sunTexture) {
      sunTexture.flipY = false;
      sunTexture.needsUpdate = true;
    }
    if (textureFlare0) {
      textureFlare0.flipY = false;
      textureFlare0.needsUpdate = true;
    }
    if (textureFlare2) {
      textureFlare2.flipY = false;
      textureFlare2.needsUpdate = true;
    }
  }, [sunTexture, textureFlare0, textureFlare2]);

  useEffect(() => {
    if (!meshRef.current || !textureFlare0 || !textureFlare2) return;

    // Usar requestAnimationFrame para garantir que o mesh está renderizado
    const frameId = requestAnimationFrame(() => {
      if (!meshRef.current) return;

      try {
        const lensflare = new Lensflare();
        lensflare.addElement(new LensflareElement(textureFlare0, 512, 0, new Color(1, 0.9, 0.8)));
        lensflare.addElement(new LensflareElement(textureFlare2, 128, 0.2, new Color(1, 1, 0.6)));
        lensflare.addElement(new LensflareElement(textureFlare2, 64, 0.4, new Color(0.8, 0.8, 1)));
        lensflare.addElement(new LensflareElement(textureFlare2, 32, 0.6, new Color(1, 0.8, 0.6)));
        
        meshRef.current.add(lensflare);
        lensflareRef.current = lensflare;
      } catch (error) {
        console.error('Erro ao criar lensflare:', error);
      }
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (lensflareRef.current && meshRef.current) {
        meshRef.current.remove(lensflareRef.current);
        lensflareRef.current.dispose();
        lensflareRef.current = null;
      }
    };
  }, [textureFlare0, textureFlare2]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} userData={{ isSun: true }}>
      <sphereGeometry args={[5, 64, 64]} />
      <meshBasicMaterial
        map={sunTexture}
        toneMapped={false}
        color={new Color(1.2, 1.1, 0.9)}
        transparent={false}
        opacity={1}
      />
    </mesh>
  );
}

