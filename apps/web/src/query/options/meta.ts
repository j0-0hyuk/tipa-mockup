import { queryOptions } from '@tanstack/react-query';
import { getMeta } from '@/api/meta';

export const getMetaQueryOptions = (url: string) =>
  queryOptions({
    queryKey: ['meta', url],
    queryFn: () => getMeta(url),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    throwOnError: false
  });
