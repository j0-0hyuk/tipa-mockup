import { api } from '@/api/instance';
import { HTTPError } from 'ky';
import { postRefreshToken } from '@/api/auth';

export const authenticatedApi = api.extend({
  retry: {
    limit: 2,
    methods: ['get', 'post', 'put', 'patch', 'delete', 'options', 'trace'],
    statusCodes: [401],
    afterStatusCodes: [401]
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const accessToken = JSON.parse(
          localStorage.getItem('accessToken') || '{}'
        );
        request.headers.set('Authorization', `Bearer ${accessToken}`);
      }
    ],
    beforeRetry: [
      async ({ request, error }) => {
        if (error instanceof HTTPError && error.response.status === 401) {
          try {
            const { accessToken, refreshToken } = await postRefreshToken();
            localStorage.setItem('accessToken', JSON.stringify(accessToken));
            localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

            request.headers.set('Authorization', `Bearer ${accessToken}`);
          } catch (error) {
            console.error(error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }
      }
    ]
  }
});
