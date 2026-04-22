import { z } from 'zod';
import { termsSchema } from '@/schema/terms';

export const selectOnboardingSchema = z.object({
  // termsAgreement
  terms: termsSchema

  // howToGenerate
  //   method: z.enum(['manualInput', 'uploadFile'])
});

export const selectOnboardingTermsAgreementSchema =
  selectOnboardingSchema.partial();

// export const selectOnboardingHowToGenerateSchema =
//   selectOnboardingSchema.required({
//     terms: true
//   });

export const selectOnboardingTermsAgreementFormSchema =
  selectOnboardingSchema.pick({
    terms: true
  });

// export const selectOnboardingHowToGenerateFormSchema =
//   selectOnboardingSchema.pick({
//     method: true
//   });

export type SelectOnboardingTermsAgreementForm = z.infer<
  typeof selectOnboardingTermsAgreementFormSchema
>;
