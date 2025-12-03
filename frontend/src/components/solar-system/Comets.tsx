import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, SphereGeometry, ConeGeometry, MeshStandardMaterial, MeshBasicMaterial, Color, Vector3 } from 'three';
import { useSolarSystem } from '@/contexts/SolarSystemContext';
import { useComets } from '@/hooks/queries/useComets';
import type { CometObject } from '@/services/nasaApi';

interface Comet {
  mesh: Mesh;
  tail: Mesh;
  name: string;
  data: CometObject;
}

export default function Comets() {
  const { state } = useSolarSystem();
  const cometsRef = useRef<Comet[]>([]);

  // Fetch comets using custom hook
  const { data: comets } = useComets();

  const cometObjects = useMemo(() => {
    const newComets: Comet[] = [];

    if (comets && comets.length > 0) {
      const limit = Math.min(15, comets.length);
      
      for (let i = 0; i < limit; i++) {
        const comet = comets[i];
        
        // Comet body
        const bodyGeometry = new SphereGeometry(0.25, 8, 8);
        const bodyMaterial = new MeshStandardMaterial({
          color: new Color(0x55aaff), // Blue
          emissive: new Color(0x002233),
        });
        const bodyMesh = new Mesh(bodyGeometry, bodyMaterial);
        
        // Comet tail
        const tailGeometry = new ConeGeometry(0.08, 3, 8);
        const tailMaterial = new MeshBasicMaterial({
          color: new Color(0x88ccff),
          transparent: true,
          opacity: 0.7,
        });
        const tailMesh = new Mesh(tailGeometry, tailMaterial);
        tailMesh.rotation.z = Math.PI;
        tailMesh.position.x = -1.5;
        bodyMesh.add(tailMesh);
        
        // Position comet (simplified - in reality would use orbital elements)
        const distance = 30 + Math.random() * 40;
        const angle = Math.random() * Math.PI * 2;
        bodyMesh.position.set(
          Math.cos(angle) * distance,
          (Math.random() - 0.5) * 10,
          Math.sin(angle) * distance
        );
        
        newComets.push({
          mesh: bodyMesh,
          tail: tailMesh,
          name: comet.des || `Comet-${i}`,
          data: comet,
        });
      }
    }

    return newComets;
  }, [comets]);

  cometsRef.current = cometObjects;

  useFrame(() => {
    if (!state.isPaused) {
      // Rotate tail to always point away from sun
      cometsRef.current.forEach((comet) => {
        const sunPosition = new Vector3(0, 0, 0);
        const direction = sunPosition.clone().sub(comet.mesh.position).normalize();
        comet.tail.lookAt(comet.mesh.position.clone().add(direction));
      });
    }
  });

  if (!state.showComets) return null;

  return (
    <>
      {cometObjects.map((comet, index) => (
        <primitive key={`comet-${index}`} object={comet.mesh} />
      ))}
    </>
  );
}

