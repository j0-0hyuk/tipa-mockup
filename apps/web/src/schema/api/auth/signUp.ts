import {
  authCodeSchemaProducer,
  emailSchemaProducer,
  passwordSchemaProducer
} from '@/schema/data';
import { termsSchema } from '@/schema/terms';
import { z } from 'zod';
import i18next from 'i18next';

export const createSignUpRequestFormSchema = () => {
  return z
    .object({
      email: emailSchemaProducer(i18next.t('auth:signUp.form.email.error')),
      authCode: authCodeSchemaProducer(
        i18next.t('auth:signUp.form.authCode.error')
      ),
      password: passwordSchemaProducer(
        i18next.t('auth:signUp.form.password.error')
      ),
      passwordConfirm: z.string(),
      terms: termsSchema
    })
    .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
      message: i18next.t('auth:signUp.form.passwordConfirm.error'),
      path: ['passwordConfirm']
    });
};

export const signUpRequestFormSchema = createSignUpRequestFormSchema();

export const signUpRequestSchema = signUpRequestFormSchema.transform(
  ({ email, password }) => ({
    email,
    password,
    language: window.navigator.language,
    clientId: 'temp',
    clientInfo: 'temp'
  })
);

export type SignUpRequestForm = z.infer<typeof signUpRequestFormSchema>;
export type SignUpRequestParams = z.input<typeof signUpRequestSchema>;
