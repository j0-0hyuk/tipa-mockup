import { apiErrorResponseSchema } from '@/make/schema/api/error';
import ky from 'ky';

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_AI_API_URL,
  hooks: {
    beforeError: [
      async (error) => {
        const { success, data } = apiErrorResponseSchema.safeParse(
          await error.response.json()
        );
        if (success) {
          error.message = data.message;
        }
        return error;
      }
    ]
  }
});
