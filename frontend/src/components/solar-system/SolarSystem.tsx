import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Suspense } from 'react';
import { Color, BackSide } from 'three';
import Sun from './Sun';
import Planet from './Planet';
import BloomEffect from './BloomEffect';
import AsteroidBelt from './AsteroidBelt';
import RealAsteroids from './RealAsteroids';
import Comets from './Comets';
import PlanetClickHandler from './PlanetClickHandler';
import CameraController from './CameraController';
import KeyboardShortcutsHandler from './KeyboardShortcutsHandler';
import EclipseTour from './EclipseTour';
import DistantStars from './DistantStars';
import { celestialBodies } from '@/utils/constants';

function Skyfield() {
  const skyTexture = useTexture('/textures/stars.jpg');
  
  return (
    <mesh>
      <sphereGeometry args={[190, 64, 64]} />
      <meshBasicMaterial
        map={skyTexture}
        side={BackSide}
        toneMapped={false}
        transparent
        opacity={0.3}
        color={new Color(0.8, 0.9, 1.0)}
      />
    </mesh>
  );
}

export default function SolarSystem() {
  return (
    <Canvas
      gl={{ antialias: false, toneMappingExposure: 1.2 }}
      camera={{ position: [0, 30, 70], fov: 75 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} color={new Color(0.13, 0.13, 0.13)} />
        <pointLight position={[0, 0, 0]} intensity={10} distance={1000} decay={0.5} />
        <pointLight position={[50, 50, -100]} intensity={2} distance={100} decay={1} color={new Color(0.2, 0.4, 1.0)} />
        
        <DistantStars />
        
        <Suspense fallback={null}>
          <Skyfield />
        </Suspense>
        
        <fog attach="fog" args={[new Color(0x000814), 180, 250]} />
        
        <Sun />
        
        {celestialBodies.map((body) => (
          <Planet key={body.name} body={body} />
        ))}
        
        <AsteroidBelt beltType="inner" />
        <AsteroidBelt beltType="middle" />
        <AsteroidBelt beltType="outer" />
        <AsteroidBelt beltType="trojans" />
        <AsteroidBelt beltType="kuiper" />
        <AsteroidBelt beltType="scattered" />
        <AsteroidBelt beltType="oort" />
        
        <RealAsteroids />
        <Comets />
        
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.3}
          zoomSpeed={0.8}
          panSpeed={0.5}
          minDistance={8}
          maxDistance={200}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
        
        <PlanetClickHandler />
        <CameraController />
        <KeyboardShortcutsHandler />
        <EclipseTour />
        
        <BloomEffect />
      </Suspense>
    </Canvas>
  );
}

