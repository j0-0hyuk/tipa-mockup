import { authenticatedApi } from '@/api/authenticated/instance';
import type {
  GetProductFilesRequest,
  GetProductFilesResponse
} from '@/schema/api/products/getTemplates';
import type { UploadProductTemplateRequest } from '@/schema/api/products/uploadTemplate';

export interface UploadTemplateParams {
  file: File;
  contents: UploadProductTemplateRequest;
}

export const uploadTemplateFormat = async ({
  file,
  contents
}: UploadTemplateParams): Promise<void> => {
  const formData = new FormData();
  formData.append('documentFormat', file);
  formData.append(
    'contents',
    new Blob([JSON.stringify(contents)], { type: 'application/json' })
  );
  await authenticatedApi.post('admin/products/files', {
    body: formData
  });
};

export const getProductFiles = async (
  request: GetProductFilesRequest = { page: 0, size: 10 }
): Promise<GetProductFilesResponse> => {
  const searchParams = new URLSearchParams({
    page: request.page.toString(),
    size: request.size.toString()
  });

  if (request.fileType) {
    searchParams.append('fileType', request.fileType);
  }

  return await authenticatedApi
    .get(`admin/products/files?${searchParams}`)
    .json();
};

export const deleteTemplateFormat = async (productFileId: number): Promise<void> => {
  await authenticatedApi.delete(`admin/products/files/${productFileId}`);
};

export interface UpdateTemplateMetaRequest {
  templateViewerUrl?: string | null;
  postingUrl?: string | null;
  templatePrompt?: string | null;
  templateMarkdown?: string | null;
  organizingAgency?: string | null;
  deadline?: string | null;
}

export const updateTemplateMeta = async (
  productFileId: number,
  request: UpdateTemplateMetaRequest
): Promise<void> => {
  await authenticatedApi.patch(`admin/products/files/${productFileId}/meta`, {
    json: request
  });
};

export interface ReorderTemplateRequest {
  targetPosition: number;
}

export const reorderTemplate = async (
  productFileId: number,
  request: ReorderTemplateRequest
): Promise<void> => {
  await authenticatedApi.patch(`admin/products/files/${productFileId}/reorder`, {
    json: request
  });
};

export const replaceTemplateFile = async (productFileId: number, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('documentFormat', file);
  await authenticatedApi.put(`admin/products/files/${productFileId}/file`, { body: formData });
};

export const downloadTemplateFile = async (productFileId: number): Promise<Blob> => {
  return await authenticatedApi.get(`admin/products/files/${productFileId}/download`).blob();
};
