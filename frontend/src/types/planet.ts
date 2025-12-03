import { Color } from 'three';

/**
 * Tipo de corpo celeste no sistema solar
 */
export type CelestialBodyType = 'planet' | 'dwarf' | 'asteroid' | 'tno' | 'comet';

/**
 * Lua ou satélite natural de um corpo celeste
 */
export interface Moon {
  /** Nome da lua */
  name: string;
  /** Tamanho relativo da lua */
  size: number;
  /** Distância do corpo pai */
  dist: number;
  /** Velocidade orbital */
  speed: number;
  /** Cor da lua (opcional) */
  color?: Color;
  /** Informações descritivas sobre a lua */
  info: string;
  /** Ângulo inicial da órbita */
  initialAngle: number;
}

/**
 * Corpo celeste genérico (planeta, planeta anão, asteroide, etc.)
 */
export interface CelestialBody {
  /** Nome do corpo celeste */
  name: string;
  /** Tamanho relativo */
  size: number;
  /** Distância do Sol */
  dist: number;
  /** Velocidade orbital */
  speed: number;
  /** Ângulo inicial da órbita */
  initialAngle: number;
  /** Caminho para textura (opcional) */
  texture?: string;
  /** Cor do corpo (opcional, usado quando não há textura) */
  color?: Color;
  /** Se o corpo possui anéis */
  hasRings?: boolean;
  /** Rugosidade do material (0-1) */
  roughness: number;
  /** Metalicidade do material (0-1) */
  metalness: number;
  /** Tipo de corpo celeste */
  type: CelestialBodyType;
  /** Informações descritivas */
  info: string;
  /** Ano de descoberta */
  discoveryYear: string;
  /** Lista de luas do corpo */
  moons: Moon[];
}

/**
 * Dados estendidos de um planeta
 */
export interface PlanetData extends CelestialBody {
  /** Período orbital (opcional) */
  orbitalPeriod?: string;
  /** Distância do Sol (opcional) */
  distanceFromSun?: string;
  /** Tamanho relativo (opcional) */
  sizeRelative?: string;
}

