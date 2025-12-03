import { useQuery } from '@tanstack/react-query';
import { fetchComets, type CometObject } from '@/services/nasaApi';

/**
 * Hook customizado para buscar cometas
 * @returns Query result com lista de cometas
 */
export const useComets = () => {
  return useQuery<CometObject[]>({
    queryKey: ['comets'],
    queryFn: fetchComets,
    staleTime: 60 * 60 * 1000, // 1 hora
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

