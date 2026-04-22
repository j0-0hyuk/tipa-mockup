import { z } from 'zod';
import i18n from '@/i18n';

export const createTermsSchema = () =>
  z
    .object({
      all: z.boolean(),
      term: z.boolean(),
      personal: z.boolean(),
      marketing: z.boolean()
    })
    .refine(
      ({ all, term, personal }) => {
        if (all) return true;
        return term && personal;
      },
      {
        message: i18n.t('auth:terms.requiredAgreement'),
        path: ['all']
      }
    );

export const termsSchema = createTermsSchema();

export const checkboxInfos = [
  {
    name: 'term',
    required: true,
    url: 'https://docshunt.ai/terms'
  },
  {
    name: 'personal',
    required: true,
    url: 'https://docshunt.ai/privacy_policy'
  },
  {
    name: 'marketing',
    required: false,
    url: 'https://docshunt.ai/marketing_consent'
  }
] as const;
