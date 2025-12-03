import { useQuery } from '@tanstack/react-query';
import { fetchNEOs, type NEOObject } from '@/services/nasaApi';

/**
 * Hook customizado para buscar Near Earth Objects (NEOs)
 * @returns Query result com lista de objetos próximos à Terra
 */
export const useNEOs = () => {
  return useQuery<NEOObject[]>({
    queryKey: ['asteroids', 'neo'],
    queryFn: fetchNEOs,
    staleTime: 60 * 60 * 1000, // 1 hora
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

