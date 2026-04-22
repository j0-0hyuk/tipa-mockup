import {
  getProducts,
  getProductFiles,
  getProduct,
  getProductChatMessages,
  getProductsFiles,
  getProductFileDownload,
  getProductFileStatus
} from '@/api/products/query';
import { getTemplateFiles } from '@/api/template';
import { getProductPrices } from '@/api/products/prices';
import { getDocumentChatMessages } from '@/api/files';
import { queryOptions } from '@tanstack/react-query';
import type { GetProductFilesRequestParams } from '@/schema/api/products/export';
import type {
  GetProductsFilesRequestParams,
  ProductFilePathMapContents
} from '@/schema/api/products/products';

export const getProductsQueryOptions = () => {
  return queryOptions({
    queryKey: ['products'],
    queryFn: () => getProducts()
  });
};

/**
 * 상품 가격 정보 Query Options
 * - 토스페이먼츠 결제용 상품 가격/이름 정보
 */
export const getProductPricesQueryOptions = () => {
  return queryOptions({
    queryKey: ['products', 'prices'],
    queryFn: getProductPrices
  });
};

export const getDocumentOptions = (productId: number) => {
  return queryOptions({
    queryKey: ['document', productId],
    queryFn: () => getProduct(productId),
    staleTime: Infinity,
    refetchInterval: (query) => {
      const status = query.state.data?.generationStatus;
      if (status === 'PENDING' || status === 'PROGRESS') {
        return 10000;
      }
      return false;
    }
  });
};

// --- deprecated ---
export const getProductFilesQueryOptions = (
  productId: number,
  params: GetProductFilesRequestParams
) => {
  return queryOptions({
    queryKey: ['productFiles', productId, params],
    queryFn: () => getProductFiles(productId, params),
    refetchInterval: (query) => {
      if (
        query.state.data?.some(
          (item) => item.status === 'PENDING' || item.status === 'PROGRESS'
        )
      ) {
        return 10000;
      }
      return false;
    }
  });
};

export const getProductChatMessagesOptions = (productId: number) => {
  return queryOptions({
    queryKey: ['productChatMessages', productId],
    queryFn: () => getProductChatMessages(productId)
  });
};

// --- v3.3 문서 조회 ---
export const getProductsFilesOptions = (
  params?: GetProductsFilesRequestParams
) => {
  return queryOptions({
    queryKey: ['productsFiles', params],
    queryFn: () => getProductsFiles(params)
  });
};

const TEMPLATE_FETCH_PAGE_SIZE = 100;
const TEMPLATE_FETCH_PAGE_CONCURRENCY = 3;

const fetchAllTemplateFiles = async (
  signal?: AbortSignal
): Promise<ProductFilePathMapContents[]> => {
  const first = await getTemplateFiles({
    page: 0,
    size: TEMPLATE_FETCH_PAGE_SIZE,
    signal
  });

  const firstPage = first.data.templates;
  if (!firstPage) return [];

  const all = [...firstPage.content];

  for (
    let startPage = 1;
    startPage < firstPage.totalPages;
    startPage += TEMPLATE_FETCH_PAGE_CONCURRENCY
  ) {
    const requests = Array.from(
      {
        length: Math.min(
          TEMPLATE_FETCH_PAGE_CONCURRENCY,
          firstPage.totalPages - startPage
        )
      },
      (_, index) =>
        getTemplateFiles({
          page: startPage + index,
          size: TEMPLATE_FETCH_PAGE_SIZE,
          signal
        })
    );

    const responses = await Promise.all(requests);
    all.push(
      ...responses.flatMap((response) => response.data.templates?.content || [])
    );
  }

  const deduped = new Map<number, ProductFilePathMapContents>();
  for (const template of all) {
    deduped.set(template.productFileId, template);
  }

  return Array.from(deduped.values());
};

export const getAllTemplateFilesQueryOptions = () =>
  queryOptions({
    queryKey: ['productsFiles', 'templates', 'all'],
    queryFn: ({ signal }) => fetchAllTemplateFiles(signal),
    staleTime: 5 * 60 * 1000
  });

// --- v3.3 상태 폴링 ---
export const getProductFileStatusPollingOptions = (productFileId: number) => {
  return queryOptions({
    queryKey: ['productFileStatus', productFileId],
    queryFn: () => {
      if (!productFileId) {
        throw new Error('productFileId is required');
      }
      return getProductFileStatus(productFileId);
    },
    enabled: !!productFileId,
    refetchOnMount: 'always',
    refetchInterval: (query) => {
      const data = query.state.data;
      const status = data?.data.status;
      if (!data || status === 'PENDING' || status === 'PROGRESS') {
        return 10000;
      }
      return false;
    },
    retry: false
  });
};

// --- 문서 채팅 메시지 조회 ---
export const getDocumentChatMessagesOptions = (fileId: number) => {
  return queryOptions({
    queryKey: ['documentChatMessages', fileId],
    queryFn: () => getDocumentChatMessages(fileId)
  });
};

// --- v3.3 다운로드 (deprecated: blob 직접 반환, polling 부적합) ---
// 새 API는 blob을 직접 반환하므로 getProductFileDownload를 직접 호출하세요
// @deprecated 이 옵션 대신 getProductFileDownload를 직접 호출하세요
export const getProductFileDownloadPollingOptions = (productFileId: number) => {
  return queryOptions({
    queryKey: ['productFileDownload', productFileId],
    queryFn: () => {
      if (!productFileId) {
        throw new Error('productFileId is required');
      }
      return getProductFileDownload(productFileId);
    },
    enabled: !!productFileId,
    staleTime: 0,
    gcTime: 0,
    retry: false
  });
};
