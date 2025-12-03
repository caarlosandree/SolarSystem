import { Mesh } from 'three';
import { CelestialBody } from './planet';

export interface AsteroidBeltItem {
  mesh: Mesh;
  rotationSpeed: {
    x: number;
    y: number;
    z: number;
  };
  orbitSpeed: number;
  radius: number;
  angle: number;
  type: string;
}

export interface AsteroidBelts {
  main: AsteroidBeltItem[];
  inner: AsteroidBeltItem[];
  outer: AsteroidBeltItem[];
  middle: AsteroidBeltItem[];
  trojans: AsteroidBeltItem[];
  kuiper: AsteroidBeltItem[];
  scattered: AsteroidBeltItem[];
  oort: AsteroidBeltItem[];
}

export interface SolarSystemState {
  speed: number;
  isPaused: boolean;
  showOrbits: boolean;
  showMoons: boolean;
  showRealAsteroids: boolean;
  showComets: boolean;
  bloomStrength: number;
  isBloomManual: boolean;
  selectedBody: CelestialBody | null;
  followingBody: CelestialBody | null;
  showLabels: boolean;
  showMoonLabels: boolean;
  asteroidBeltVisibility: {
    all: boolean;
    main: boolean;
    inner: boolean;
    middle: boolean;
    outer: boolean;
    trojans: boolean;
    kuiper: boolean;
    scattered: boolean;
    oort: boolean;
  };
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  isFollowing: boolean;
}

