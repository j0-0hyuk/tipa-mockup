import { api } from '@/api/instance';
import { authResponseSchema } from '@/schema/api/auth/auth';
import {
  googleSignInRequestSchema,
  type GoogleSignInRequestParams
} from '@/schema/api/auth/googleSignIn';
import {
  emailSignInRequestSchema,
  type EmailSignInRequestParams
} from '@/schema/api/auth/emailSignIn';

const authApi = api.extend({
  prefixUrl: `${import.meta.env.VITE_API_URL}/auth`
});

export const postGoogleSignIn = async (params: GoogleSignInRequestParams) => {
  const { code, clientId, clientInfo } =
    googleSignInRequestSchema.parse(params);
  const response = await authApi
    .post('signIn/google', {
      headers: {
        Authorization: `Bearer ${code}`
      },
      json: {
        clientId,
        clientInfo
      }
    })
    .json();

  return authResponseSchema.parse(response);
};

export const postEmailSignIn = async (params: EmailSignInRequestParams) => {
  const { email, password, clientId, clientInfo } =
    emailSignInRequestSchema.parse(params);
  const response = await authApi
    .post('signIn/email', {
      json: {
        email,
        password,
        clientId,
        clientInfo
      }
    })
    .json();

  return authResponseSchema.parse(response);
};

export const postRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken') ?? '';

  const response = await authApi
    .post('refresh', {
      headers: {
        Authorization: `Bearer ${JSON.parse(refreshToken)}`
      }
    })
    .json();

  return authResponseSchema.parse(response);
};

export const postSignOut = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }
  return await authApi
    .post('signout', {
      headers: {
        Authorization: `Bearer ${JSON.parse(refreshToken)}`
      }
    })
    .json();
};
