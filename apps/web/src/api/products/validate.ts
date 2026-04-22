import { authenticatedApi } from '@/api/instance';
import {
  postFileValidateResponseSchema,
  type FilePurpose
} from '@/schema/api/products/validate';

export const postFileValidate = async (file: File, purpose: FilePurpose) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('purpose', purpose);

  const response = await authenticatedApi
    .post('products/files/validate', {
      body: formData,
      timeout: false
    })
    .json();

  return postFileValidateResponseSchema.parse(response);
};
