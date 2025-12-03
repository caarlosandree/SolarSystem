import { useQuery } from '@tanstack/react-query';
import { fetchFamousAsteroids, type FamousAsteroidData } from '@/services/nasaApi';

/**
 * Hook customizado para buscar asteroides famosos com elementos orbitais
 * Cache mais agressivo pois dados de asteroides mudam raramente
 * @returns Query result com dados dos asteroides famosos
 */
export const useFamousAsteroids = () => {
  return useQuery<FamousAsteroidData[]>({
    queryKey: ['asteroids', 'famous'],
    queryFn: fetchFamousAsteroids,
    staleTime: 24 * 60 * 60 * 1000, // 24 horas - dados de asteroides mudam muito pouco
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 dias no cache
    retry: 1, // Reduzido pois a função já tem retry interno
    retryDelay: (attemptIndex) => Math.min(5000 * 2 ** attemptIndex, 60000),
  });
};

