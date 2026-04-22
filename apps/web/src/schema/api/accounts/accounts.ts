import { z } from 'zod';
import type { Theme } from '@docshunt/docs-editor-wasm';

const themeSchema: z.ZodType<Theme> = z.object({
  character: z.record(z.string(), z.any()),
  paragraph: z.record(z.string(), z.any()),
  border: z.record(z.string(), z.any()),
  style: z.record(z.string(), z.any())
}) as z.ZodType<Theme>;

export const getMyAccountResponseSchema = z
  .object({
    data: z.object({
      id: z.number(),
      provider: z.string(),
      email: z.string(),
      name: z.string().nullish(),
      language: z.enum(['ko', 'en']),
      role: z.enum(['FREE', 'SUB', 'ADMIN', 'SEASON_PASS', 'MONTHLY_PASS']),
      freeCredit: z.number(),
      paidCredit: z.number(),
      paddleCustomerId: z.string().nullish(),
      createdAt: z.string(),
      termsConsents: z.array(
        z.object({
          termsCode: z.string(),
          title: z.string(),
          isRequired: z.boolean(),
          agreed: z.boolean(),
          agreedAt: z.string().nullish()
        })
      ),
      hasProAccess: z.boolean(),
      productCreationCredit: z.number(),
      productExportCredit: z.number(),
      hasLowCreditProductProcess: z.boolean(),
      theme: themeSchema.nullish()
    })
  })
  .transform((data) => data.data);

export type GetMyAccountResponse = z.infer<typeof getMyAccountResponseSchema>;

export const updateAccountRequestSchema = z.object({
  name: z.string().nullish(),
  language: z.enum(['ko', 'en']).nullish(),
  theme: themeSchema.nullish()
});

export type UpdateAccountRequest = z.input<typeof updateAccountRequestSchema>;
