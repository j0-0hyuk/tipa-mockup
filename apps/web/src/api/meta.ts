import ky from 'ky';
import { metaResponseSchema, type MetaResponse } from '@/schema/api/meta';

export async function getMeta(url: string): Promise<MetaResponse> {
  if (!url) throw new Error('url is required');

  const WORKER_API = import.meta.env.VITE_META_API_URL;

  if (!WORKER_API) {
    throw new Error('VITE_META_API_URL is not defined');
  }

  try {
    const data = await ky
      .get(WORKER_API, {
        searchParams: { url }
      })
      .json();

    return metaResponseSchema.parse(data);
  } catch (error) {
    console.error('Metadata fetch failed:', error);
    throw error;
  }
}
