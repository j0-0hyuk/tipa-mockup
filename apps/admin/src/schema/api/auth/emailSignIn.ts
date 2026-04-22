import { emailSchemaProducer } from '@/schema/data';
import { z } from 'zod/v4';

export const emailSignInRequestFormSchema = z.object({
  email: emailSchemaProducer(),
  password: z.string()
});

export const emailSignInRequestSchema = emailSignInRequestFormSchema.transform(
  (data) => ({
    email: data.email,
    password: data.password,
    clientId: 'temp',
    clientInfo: 'temp'
  })
);

export type EmailSignInRequestForm = z.infer<
  typeof emailSignInRequestFormSchema
>;
export type EmailSignInRequestParams = z.input<typeof emailSignInRequestSchema>;
