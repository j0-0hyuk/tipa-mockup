import { QueryClient } from '@tanstack/react-query';

const MIN = 60 * 1000;

export const docsQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: MIN * 5,
      gcTime: MIN * 2,
      throwOnError: true,
      refetchOnWindowFocus: false
    }
  }
});
