import type { AsteroidOrbitalElements, NEOObject, SentryObject } from '@/services/nasaApi';

/**
 * Dados de um asteroide famoso com elementos orbitais
 */
export interface FamousAsteroidData {
  name: string;
  orb: AsteroidOrbitalElements | null;
}

/**
 * Dados completos de um asteroide famoso para renderização 3D
 */
export interface FamousAsteroidRenderData extends FamousAsteroidData {
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 * Dados de um objeto próximo à Terra (NEO)
 */
export interface NEORenderData {
  neo: NEOObject;
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 * Dados de um objeto do sistema Sentry
 */
export interface SentryRenderData {
  sentry: SentryObject;
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 * Tipo unificado para dados de asteroides em renderização
 */
export type AsteroidRenderData = 
  | { type: 'famous'; data: FamousAsteroidRenderData }
  | { type: 'neo'; data: NEORenderData }
  | { type: 'sentry'; data: SentryRenderData };

