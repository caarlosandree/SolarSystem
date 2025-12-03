import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Mesh, Color } from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

export default function Sun() {
  const meshRef = useRef<Mesh>(null);
  const sunTexture = useTexture('/textures/sun.jpg');
  const textureFlare0 = useTexture('/textures/lensflare0.png');
  const textureFlare2 = useTexture('/textures/lensflare2.png');

  useEffect(() => {
    if (meshRef.current) {
      const lensflare = new Lensflare();
      lensflare.addElement(new LensflareElement(textureFlare0, 512, 0, new Color(1, 0.9, 0.8)));
      lensflare.addElement(new LensflareElement(textureFlare2, 128, 0.2, new Color(1, 1, 0.6)));
      lensflare.addElement(new LensflareElement(textureFlare2, 64, 0.4, new Color(0.8, 0.8, 1)));
      lensflare.addElement(new LensflareElement(textureFlare2, 32, 0.6, new Color(1, 0.8, 0.6)));
      meshRef.current.add(lensflare);

      return () => {
        if (meshRef.current) {
          meshRef.current.remove(lensflare);
          lensflare.dispose();
        }
      };
    }
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
      />
    </mesh>
  );
}

