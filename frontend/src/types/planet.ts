import { Color } from 'three';

export type CelestialBodyType = 'planet' | 'dwarf' | 'asteroid' | 'tno' | 'comet';

export interface Moon {
  name: string;
  size: number;
  dist: number;
  speed: number;
  color?: Color;
  info: string;
  initialAngle: number;
}

export interface CelestialBody {
  name: string;
  size: number;
  dist: number;
  speed: number;
  initialAngle: number;
  texture?: string;
  color?: Color;
  hasRings?: boolean;
  roughness: number;
  metalness: number;
  type: CelestialBodyType;
  info: string;
  discoveryYear: string;
  moons: Moon[];
}

export interface PlanetData extends CelestialBody {
  orbitalPeriod?: string;
  distanceFromSun?: string;
  sizeRelative?: string;
}

