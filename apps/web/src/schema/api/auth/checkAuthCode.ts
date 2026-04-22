import { authCodeSchemaProducer, emailSchemaProducer } from '@/schema/data';
import i18next from 'i18next';
import { z } from 'zod';

export const createCheckAuthCodeRequestSchema = () => {
  return z.object({
    email: emailSchemaProducer(i18next.t('auth:signUp.form.email.error')),
    code: authCodeSchemaProducer(i18next.t('auth:signUp.form.authCode.error'))
  });
};

export const checkAuthCodeRequestSchema = createCheckAuthCodeRequestSchema();

export type CheckAuthCodeRequestParams = z.infer<
  typeof checkAuthCodeRequestSchema
>;
