import {
  getProductResponseSchema,
  getProductsResponseSchema,
  type GetProductResponse
} from '@/schema/api/products/products';
import {
  getProductChatMessagesResponseSchema,
  type GetProductChatMessagesResponse
} from '@/schema/api/products/chat';
import { authenticatedApi } from '@/api/instance';
import {
  getProductFilesResponseSchema,
  type GetProductFilesRequestParams,
  getProductFilesRequestSchema
} from '@/schema/api/products/export';
import {
  getProductsFilesRequestSchema,
  getProductsFilesResponseSchema,
  type GetProductsFilesRequestParams,
  type GetProductsFilesResponse,
  getProductFileStatusResponseSchema,
  type GetProductFileStatusResponse
} from '@/schema/api/products/products';

export const getProducts = async () => {
  const response = await authenticatedApi.get('products').json();

  return getProductsResponseSchema.parse(response);
};

export const getProduct = async (
  productId: number
): Promise<GetProductResponse> => {
  const response = await authenticatedApi.get(`products/${productId}`).json();

  return getProductResponseSchema.parse(response);
};

export const getProductFiles = async (
  productId: number,
  params: GetProductFilesRequestParams
) => {
  const { filter } = getProductFilesRequestSchema.parse(params);

  const response = await authenticatedApi
    .get(`products/${productId}/files`, {
      searchParams: { filter }
    })
    .json();

  return getProductFilesResponseSchema.parse(response);
};

export const getProductFile = async (
  productId: number,
  productFilePathMapId: number
): Promise<Blob> => {
  const response = await authenticatedApi
    .get(`products/${productId}/files/${productFilePathMapId}/download`);

  return response.blob();
};

export const getProductChatMessages = async (
  productId: number
): Promise<GetProductChatMessagesResponse> => {
  const response = await authenticatedApi
    .get(`products/${productId}/chat/messages`)
    .json();

  return await getProductChatMessagesResponseSchema.parseAsync(response);
};

// --- v3.3 내문서 조회 api ---
export const getProductsFiles = async (
  params?: GetProductsFilesRequestParams
): Promise<GetProductsFilesResponse> => {
  const { page, size, fileType } = getProductsFilesRequestSchema.parse(
    params || {}
  );
  const searchParams: Record<string, string | number> = {
    page,
    size
  };
  if (fileType) {
    searchParams.fileType = fileType;
  }
  const response = await authenticatedApi
    .get('products/files', {
      searchParams
    })
    .json();
  return await getProductsFilesResponseSchema.parseAsync(response);
};

// --- v3.3 내문서 다운로드 api ---
export const getProductFileDownload = async (
  productFileId: number
): Promise<Blob> => {
  const response = await authenticatedApi
    .get(`products/files/${productFileId}/download`);

  return response.blob();
};

// --- v3.3 내문서 상태 조회 api ---
export const getProductFileStatus = async (
  productFileId: number
): Promise<GetProductFileStatusResponse> => {
  const response = await authenticatedApi
    .get(`products/files/${productFileId}`)
    .json();

  try {
    return getProductFileStatusResponseSchema.parse(response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
