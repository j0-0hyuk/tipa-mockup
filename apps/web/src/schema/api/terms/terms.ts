import { z } from 'zod';

export const termsCodeEnum = z.enum([
  'PRIVACY_POLICY',
  'SERVICE_TERMS',
  'MARKETING_CONSENT'
]);

export const termsAgreementSchema = z.object({
  termsCode: termsCodeEnum,
  agreed: z.boolean()
});

export const postTermsRequestSchema = z.object({
  termsAgreements: z.array(termsAgreementSchema)
});

export type PostTermsRequestParams = z.input<typeof postTermsRequestSchema>;
export type TermsAgreement = z.input<typeof termsAgreementSchema>;
export type TermsCode = z.input<typeof termsCodeEnum>;
