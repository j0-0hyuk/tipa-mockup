import { apiErrorResponseSchema } from '@/schema/api/error';
import ky, { HTTPError } from 'ky';
import { auth } from '@/service/auth/instance';

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
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

export const authenticatedApi = api.extend({
  retry: {
    limit: 2,
    methods: ['get', 'post', 'put', 'delete', 'options', 'trace'],
    statusCodes: [401],
    afterStatusCodes: [401]
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const storedAccessToken = auth.accessToken;
        if (typeof storedAccessToken === 'string' && storedAccessToken) {
          request.headers.set('Authorization', `Bearer ${storedAccessToken}`);
        }
      }
    ],
    beforeRetry: [
      async ({ request, error }) => {
        if (error instanceof HTTPError && error.response.status === 401) {
          await auth.refresh();
          request.headers.set('Authorization', `Bearer ${auth.accessToken}`);
        }
      }
    ]
  }
});
