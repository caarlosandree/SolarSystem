import type { CometObject } from '@/services/nasaApi';

/**
 * Dados de um cometa para renderização 3D
 */
export interface CometRenderData {
  comet: CometObject;
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

