import { emailSchemaProducer } from '@/schema/data';
import { z } from 'zod';
import i18next from 'i18next';

export const passwordResetRequestFormSchema = z
  .object({
    email: emailSchemaProducer(
      i18next.t('auth:passwordReset.form.email.error')
    ),
    authCode: z
      .string()
      .min(1, i18next.t('auth:passwordReset.form.authCode.error')),
    password: z
      .string()
      .min(8, i18next.t('auth:passwordReset.form.password.minLength'))
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        i18next.t('auth:passwordReset.form.password.pattern')
      ),
    passwordConfirm: z
      .string()
      .min(1, i18next.t('auth:passwordReset.form.passwordConfirm.required'))
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: i18next.t('auth:passwordReset.form.passwordConfirm.mismatch'),
    path: ['passwordConfirm']
  });

export type PasswordResetRequestForm = z.input<
  typeof passwordResetRequestFormSchema
>;

export const passwordResetRequestSchema = z.object({
  email: emailSchemaProducer(i18next.t('auth:passwordReset.form.email.error')),
  code: z.string().min(1, i18next.t('auth:passwordReset.form.authCode.error')),
  newPassword: z
    .string()
    .min(8, i18next.t('auth:passwordReset.form.password.minLength'))
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      i18next.t('auth:passwordReset.form.password.pattern')
    )
});

export type PasswordResetRequestParams = z.input<
  typeof passwordResetRequestSchema
>;
