import { authenticatedApi } from '@/api/instance';
import {
  getProductsFilesRequestSchema,
  getProductsFilesResponseSchema,
  postProductTemplateRequestSchema,
  postProductTemplateResponseSchema,
  templateInterestApiResponseSchema,
  templateInterestResponseSchema,
  type GetProductsFilesResponse,
  type PostProductTemplateRequestParams,
  type PostProductTemplateResponse,
  type TemplateInterestResponse
} from '@/schema/api/products/products';
import { z } from 'zod';

interface GetTemplateFilesRequestParams {
  page?: number;
  size?: number;
  signal?: AbortSignal;
}

export const getTemplateFiles = async (
  params?: GetTemplateFilesRequestParams
): Promise<GetProductsFilesResponse> => {
  const { page, size } = getProductsFilesRequestSchema.parse({
    page: params?.page,
    size: params?.size,
    fileType: 'TEMPLATE'
  });

  const response = await authenticatedApi
    .get('products/files', {
      searchParams: {
        page,
        size,
        fileType: 'TEMPLATE'
      },
      signal: params?.signal
    })
    .json();

  return await getProductsFilesResponseSchema.parseAsync(response);
};

export const postTemplateFile = async (
  params: PostProductTemplateRequestParams
): Promise<PostProductTemplateResponse> => {
  const { documentFormat } = postProductTemplateRequestSchema.parse(params);

  const formData = new FormData();
  formData.append('documentFormat', documentFormat);

  const response = await authenticatedApi
    .post('products/format', {
      body: formData,
      timeout: false
    })
    .json();

  return postProductTemplateResponseSchema.parse(response);
};

export const postTemplateInterest = async (
  templateFileId: number
): Promise<TemplateInterestResponse> => {
  const response = await authenticatedApi
    .post(`products/files/templates/${templateFileId}/interest`)
    .json();

  const parsed = z
    .union([templateInterestApiResponseSchema, templateInterestResponseSchema])
    .parse(response);

  return 'data' in parsed ? parsed.data : parsed;
};

export const deleteTemplateInterest = async (
  templateFileId: number
): Promise<TemplateInterestResponse> => {
  const response = await authenticatedApi
    .delete(`products/files/templates/${templateFileId}/interest`)
    .json();

  const parsed = z
    .union([templateInterestApiResponseSchema, templateInterestResponseSchema])
    .parse(response);

  return 'data' in parsed ? parsed.data : parsed;
};
