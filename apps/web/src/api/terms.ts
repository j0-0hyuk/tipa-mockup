import { authenticatedApi } from '@/api/instance';
import type { PostTermsRequestParams } from '@/schema/api/terms/terms';

/** 약관 동의 */
export const postTerms = async (params: PostTermsRequestParams) => {
  const { termsAgreements } = params;

  return await authenticatedApi
    .post('terms', { json: { termsAgreements } })
    .json();
};
