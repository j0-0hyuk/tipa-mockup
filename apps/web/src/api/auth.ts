import { api } from '@/api/instance';
import { authResponseSchema } from '@/schema/api/auth/auth';
import {
  checkAuthCodeRequestSchema,
  type CheckAuthCodeRequestParams
} from '@/schema/api/auth/checkAuthCode';
import {
  googleSignInRequestSchema,
  type GoogleSignInRequestParams
} from '@/schema/api/auth/googleSignIn';
import {
  sendAuthCodeRequestSchema,
  type SendAuthCodeRequestParams
} from '@/schema/api/auth/sendAuthCode';
import {
  emailSignInRequestSchema,
  type EmailSignInRequestParams
} from '@/schema/api/auth/emailSignIn';
import { signUpRequestSchema } from '@/schema/api/auth/signUp';
import type { SignUpRequestParams } from '@/schema/api/auth/signUp';
import {
  passwordResetRequestSchema,
  type PasswordResetRequestParams
} from '@/schema/api/auth/passwordReset';

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

export const postSignUp = async (params: SignUpRequestParams) => {
  const { email, password, language, clientId, clientInfo } =
    signUpRequestSchema.parse(params);

  const response = await authApi
    .post('signUp', {
      json: { email, password, language, clientId, clientInfo }
    })
    .json();

  return authResponseSchema.parse(response);
};

export const postRefreshToken = async (refreshToken: string) => {
  const response = await authApi
    .post('refresh', {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    })
    .json();

  return authResponseSchema.parse(response);
};

export const postCheckAuthCode = async (params: CheckAuthCodeRequestParams) => {
  const { email, code } = checkAuthCodeRequestSchema.parse(params);
  return await authApi
    .post('check-code', {
      json: { email, code }
    })
    .json();
};

export const postSendAuthCode = async (params: SendAuthCodeRequestParams) => {
  const { email, purpose } = sendAuthCodeRequestSchema.parse(params);
  return await authApi
    .post('send-code', {
      json: { email, purpose }
    })
    .json();
};

export const postSignOut = async (refreshToken: string) => {
  return await authApi
    .post('signout', {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    })
    .json();
};

export const postPasswordReset = async (params: PasswordResetRequestParams) => {
  const { email, code, newPassword } = passwordResetRequestSchema.parse(params);
  return await api
    .post('account/reset-password', {
      json: { email, code, newPassword }
    })
    .json();
};
