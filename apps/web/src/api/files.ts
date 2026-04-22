import type { Theme } from '@docshunt/docs-editor-wasm';
import { authenticatedApi } from '@/api/instance';
import {
  type ChatFile,
  type GetDocumentChatMessagesResponse,
  type PostDocumentChatMessagesRequestParams,
  getDocumentChatMessagesResponseSchema,
  postDocumentChatMessagesRequestSchema,
  postDocumentChatFilesResponseSchema
} from '@/schema/api/document-chat/chat';
/** 파일을 HTML로 변환 */
export const postFileToHtml = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await authenticatedApi
    .post('files/to-html', {
      body: formData,
      timeout: 60000
    })
    .text();

  return response;
};

/** 문서 파일 바이너리 교체 */
export const putProductFile = async (
  productFileId: number,
  file: File,
  theme?: Theme
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  if (theme) {
    formData.append('theme', JSON.stringify(theme));
  }

  await authenticatedApi.put(`products/files/${productFileId}/file`, {
    body: formData
  });
};

/** 문서 파일 초기화 (원본으로 되돌리기) */
export const postProductFileReset = async (
  productFileId: number
) => {
  const response = await authenticatedApi
    .post(`products/files/${productFileId}/reset`)
    .json<{ success: boolean; data: { productFileId: number; filePath: string; status: string; createdAt: string; theme: string } }>();

  return response;
};

/** 문서 채팅 파일 업로드 */
export const postDocumentChatFiles = async (
  fileId: number,
  files: File[]
): Promise<ChatFile[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await authenticatedApi
    .post(`document-chat/${fileId}/files`, {
      body: formData,
      timeout: 60000
    })
    .json();

  return postDocumentChatFilesResponseSchema.parse(response);
};

/** 문서 채팅 파일 삭제 */
export const deleteDocumentChatFile = async (
  fileId: number,
  chatFileId: string
): Promise<void> => {
  await authenticatedApi.delete(
    `document-chat/${fileId}/files/${chatFileId}`
  );
};

/** 문서 채팅 메시지 조회 */
export const getDocumentChatMessages = async (
  fileId: number
): Promise<GetDocumentChatMessagesResponse> => {
  const response = await authenticatedApi
    .get(`document-chat/${fileId}/messages`)
    .json();

  return await getDocumentChatMessagesResponseSchema.parseAsync(response);
};

/** 문서 채팅 메시지 저장 */
export const postDocumentChatMessages = async (
  fileId: number,
  params: PostDocumentChatMessagesRequestParams
) => {
  const validatedRequest = postDocumentChatMessagesRequestSchema.parse(params);

  return authenticatedApi
    .post(`document-chat/${fileId}/messages`, {
      json: validatedRequest
    })
    .json();
};
