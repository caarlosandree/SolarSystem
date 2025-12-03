import { useQuery } from '@tanstack/react-query';
import { fetchSentryObjects, type SentryObject } from '@/services/nasaApi';

/**
 * Hook customizado para buscar objetos do sistema Sentry (objetos com risco de impacto)
 * @returns Query result com lista de objetos monitorados pelo Sentry
 */
export const useSentryObjects = () => {
  return useQuery<SentryObject[]>({
    queryKey: ['asteroids', 'sentry'],
    queryFn: fetchSentryObjects,
    staleTime: 60 * 60 * 1000, // 1 hora
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

