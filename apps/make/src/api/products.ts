import { api } from '@/make/api/instance';
import {
  postMakeProductsRequestSchema,
  postMakeProductsResponseSchema,
  type PostMakeProductsRequest,
  type PostMakeProductsResponse,
  postMakeExportRequestSchema,
  postMakeExportResponseSchema,
  type PostMakeExportRequest,
  type PostMakeExportResponse
} from '@/make/schema/api/products';

export const postMakeProducts = async (
  params: PostMakeProductsRequest
): Promise<PostMakeProductsResponse> => {
  postMakeProductsRequestSchema.parse(params);

  const formData = new FormData();
  if (params.referenceFiles && params.referenceFiles.length > 0) {
    params.referenceFiles.forEach((file) => {
      formData.append('referenceFiles', file);
    });
  }
  formData.append('documentFormat', params.documentFormat);
  formData.append('userPrompt', params.userPrompt);

  const response = await api
    .post('make/products', {
      body: formData,
      timeout: 1000000
    })
    .json();

  return postMakeProductsResponseSchema.parse(response);
};

export const postMakeExport = async (
  params: PostMakeExportRequest
): Promise<PostMakeExportResponse> => {
  postMakeExportRequestSchema.parse(params);

  const formData = new FormData();
  formData.append('documentFormat', params.documentFormat);

  if (params.productImages.length > 0) {
    params.productImages.forEach((file) => {
      formData.append('productImages', file);
    });
    const metaDataString = JSON.stringify(params.productImagesMetaData);
    formData.append('productImagesMetaData', metaDataString);
  }

  formData.append('userPrompt', params.userPrompt);

  const response = await api.post('make/export', {
    body: formData,
    timeout: 1000000
  });

  const filledFileBlob = await response.blob();

  return postMakeExportResponseSchema.parse({
    filled_file: filledFileBlob
  });
};
