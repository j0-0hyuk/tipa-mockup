import { docsQueryClient } from '@/query/client';

export const docsCacheClear = () => docsQueryClient.clear();
