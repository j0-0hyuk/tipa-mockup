import { z } from 'zod/v4';

export const googleSignInRequestSchema = z
  .object({
    code: z.string()
  })
  .transform(({ code }) => ({
    code,
    clientId: 'temp',
    clientInfo: 'temp'
  }));

export type GoogleSignInRequestParams = z.input<
  typeof googleSignInRequestSchema
>;
