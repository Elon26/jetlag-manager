import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnMount: false,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours,
    },
  },
});
