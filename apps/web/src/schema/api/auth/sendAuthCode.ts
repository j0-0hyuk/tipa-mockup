import { emailSchemaProducer } from '@/schema/data';
import { z } from 'zod';
import i18next from 'i18next';

export const createSendAuthCodeRequestSchema = () => {
  return z.object({
    email: emailSchemaProducer(i18next.t('auth:signUp.form.email.error')),
    purpose: z.enum(['SIGN_UP', 'RESET_PASSWORD']).default('SIGN_UP')
  });
};

export const sendAuthCodeRequestSchema = createSendAuthCodeRequestSchema();

export type SendAuthCodeRequestParams = z.input<
  typeof sendAuthCodeRequestSchema
>;
