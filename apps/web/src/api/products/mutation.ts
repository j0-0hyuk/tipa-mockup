import {
  postProductsRequestSchema,
  postProductsContentsRequestSchema,
  postProductsResponseSchema,
  type PostProductsRequestParams,
  postProductsExportRequestSchema,
  postProductsExportResponseSchema,
  type PostProductsExportRequestParams,
  type PostProductsExportResponse
} from '@/schema/api/products/products';
import {
  postProductImagePresignedUrlRequestSchema,
  postProductImagePresignedUrlResponseSchema,
  patchProductImageCompleteRequestSchema,
  patchProductImageCompleteResponseSchema,
  postProductImageDescriptionRequestSchema,
  postProductImageDescriptionResponseSchema,
  type PostProductImagePresignedUrlResponse,
  type PatchProductImageCompleteResponse,
  type PostProductImageDescriptionRequestParams,
  type PostProductImageDescriptionResponse
} from '@/schema/api/products/image';
import {
  postProductChatMessagesRequestSchema,
  type PostProductChatMessagesRequestParams
} from '@/schema/api/products/chat';
import { authenticatedApi } from '@/api/instance';
import {
  patchProductMetaSchema,
  type PatchProductMetaRequestParams
} from '@/schema/api/products/meta';
import {
  postProductFormatRequestSchema,
  type PostProductFormatRequestParams,
  postExportProductRequestSchema,
  type PostExportProductRequestParams
} from '@/schema/api/products/export';
import {
  postVisualSuggestionsContentsSchema,
  postVisualSuggestionsResponseSchema,
  type PostVisualSuggestionsRequestParams,
  type PostVisualSuggestionsResponse
} from '@/schema/api/products/visualSuggestions';
import i18n from '@/i18n';
import {
  detailInputFormBaseSchema,
  type DetailInputForm
} from '@/schema/main/detailInput';

const isContentsRequestParams = (
  params: DetailInputForm | PostProductsRequestParams
): params is PostProductsRequestParams => 'contents' in params;

export const postProducts = async (
  params: DetailInputForm | PostProductsRequestParams
) => {
  let contents: Record<string, unknown>;
  let files: File[] | undefined;

  if (isContentsRequestParams(params)) {
    const validated = postProductsContentsRequestSchema.parse(params);
    contents = validated.contents;
    files = validated.files;
  } else {
    const validatedParams = detailInputFormBaseSchema.parse(params);
    const { files: validatedFiles, ...rest } = validatedParams;

    const normalizedItemDescription =
      rest.itemDescription ||
      (validatedFiles?.length
        ? i18n.t('main:mainPrompt.fileDescription')
        : i18n.t('main:document.emptyMethodDescription'));

    contents = postProductsRequestSchema.parse({
      ...rest,
      itemDescription: normalizedItemDescription
    });
    files = validatedFiles;
  }

  const formData = new FormData();
  formData.append('contents', JSON.stringify(contents));
  if (files) {
    files.forEach((file) => formData.append('files', file));
  }

  const response = await authenticatedApi
    .post('products/v3.1', {
      body: formData,
      timeout: 300000
    })
    .json();

  return postProductsResponseSchema.parse(response);
};

// document 수정 api 요청입니다.
export const patchProduct = async (productId: number, patch: string) => {
  const response = await authenticatedApi
    .patch(`products/${productId}/content`, {
      json: patch
    })
    .json();
  return response;
};

// document 삭제 api 요청입니다.
export const deleteProduct = async (productId: number): Promise<void> =>
  await authenticatedApi.delete(`products/${productId}`).json();

export const patchProductMeta = async (
  productId: number,
  params: PatchProductMetaRequestParams
) => {
  const { themeColor, itemName } = patchProductMetaSchema.parse(params);

  return authenticatedApi
    .patch(`products/${productId}/meta`, {
      json: { themeColor, itemName }
    })
    .json();
};

/**
 * @deprecated This API will be deprecated. Use postTemplateFile in @/api/template instead.
 */
export const postProductFormat = async (
  productId: number,
  params: PostProductFormatRequestParams
) => {
  const { documentFormat } = postProductFormatRequestSchema.parse(params);

  const formData = new FormData();
  formData.append('documentFormat', documentFormat);

  return authenticatedApi
    .post(`products/${productId}/format`, {
      body: formData,
      timeout: false
    })
    .json();
};

/**
 * @deprecated This API will be deprecated. Use postExportProductV3_3 instead.
 */
export const postExportProduct = async (
  productId: number,
  params: PostExportProductRequestParams
) => {
  const { contents, images } = postExportProductRequestSchema.parse(params);

  const formData = new FormData();
  formData.append(
    'contents',
    new Blob([JSON.stringify(contents)], {
      type: 'application/json'
    })
  );
  images.forEach((image) => {
    formData.append('images', image);
  });

  return authenticatedApi
    .post(`products/${productId}/export`, {
      body: formData,
      timeout: false
    })
    .json();
};

export const deleteProductFile = async (
  productId: number,
  productFilePathMapId: number
) => {
  return authenticatedApi
    .delete(`products/${productId}/files/${productFilePathMapId}`)
    .json();
};

export const postRegenerateProduct = async (productId: number) => {
  return authenticatedApi.post(`products/${productId}/regenerate`).json();
};

export const postProductImagePresignedUrl = async (
  productId: number,
  fileName: string
): Promise<PostProductImagePresignedUrlResponse> => {
  const validatedRequest = postProductImagePresignedUrlRequestSchema.parse({
    fileName
  });

  const response = await authenticatedApi
    .post(`products/${productId}/image/presign`, {
      json: validatedRequest
    })
    .json();

  return postProductImagePresignedUrlResponseSchema.parse(response);
};

export const patchProductImageComplete = async (
  productId: number,
  productFilePathMapId: number
): Promise<PatchProductImageCompleteResponse> => {
  const validatedRequest = patchProductImageCompleteRequestSchema.parse({
    productFilePathMapId
  });

  const response = await authenticatedApi
    .patch(`products/${productId}/image/complete`, {
      json: validatedRequest
    })
    .json();

  return patchProductImageCompleteResponseSchema.parse(response);
};

export const postProductImageDescription = async (
  productId: number,
  params: PostProductImageDescriptionRequestParams
): Promise<PostProductImageDescriptionResponse> => {
  const validatedRequest =
    postProductImageDescriptionRequestSchema.parse(params);

  const response = await authenticatedApi
    .post(`products/${productId}/image/description`, {
      json: validatedRequest
    })
    .json();

  return postProductImageDescriptionResponseSchema.parse(response);
};

export const postProductChatMessages = async (
  productId: number,
  params: PostProductChatMessagesRequestParams
) => {
  const validatedRequest = postProductChatMessagesRequestSchema.parse(params);

  return authenticatedApi
    .post(`products/${productId}/chat/messages`, {
      json: validatedRequest
    })
    .json();
};

// --- v3.3 내문서 삭제 api ---
export const deleteProductsFile = async (
  productFileId: number
): Promise<void> => {
  await authenticatedApi.delete(`products/files/${productFileId}`).json();
};

export const postVisualSuggestions = async (
  params: PostVisualSuggestionsRequestParams
): Promise<PostVisualSuggestionsResponse> => {
  const contents = postVisualSuggestionsContentsSchema.parse(params.contents);

  const formData = new FormData();
  formData.append(
    'contents',
    new Blob([JSON.stringify(contents)], { type: 'application/json' })
  );

  if (params.referenceFiles) {
    for (const file of params.referenceFiles) {
      formData.append('referenceFiles', file);
    }
  }

  const response = await authenticatedApi
    .post('products/export/images/suggestions', {
      body: formData,
      timeout: 180_000
    })
    .json();

  return postVisualSuggestionsResponseSchema.parse(response);
};

export const postProductsExport = async (
  params: PostProductsExportRequestParams
): Promise<PostProductsExportResponse> => {
  const { contents, referenceFiles, productImages } =
    postProductsExportRequestSchema.parse(params);

  const formData = new FormData();
  formData.append(
    'contents',
    new Blob([JSON.stringify(contents)], {
      type: 'application/json'
    })
  );

  if (referenceFiles) {
    referenceFiles.forEach((file) => {
      formData.append('referenceFiles', file);
    });
  }

  if (productImages) {
    productImages.forEach((image) => {
      formData.append('productImages', image);
    });
  }

  const response = await authenticatedApi
    .post('products/export', {
      body: formData,
      timeout: false
    })
    .json();

  return postProductsExportResponseSchema.parse(response);
};
