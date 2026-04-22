import ky, { HTTPError } from 'ky';
import {
  generateAIRequestSchema,
  generateAIResponseSchema,
  type GenerateAIRequest,
  type GenerateAIResponse
} from '@/schema/api/ai';

const DEFAULT_AI_REQUEST_TIMEOUT_MS = 120000;

let aiApi: ReturnType<typeof ky.create> | null = null;

const getRequestTimeoutMs = () => {
  const rawTimeout = import.meta.env.VITE_AI_REQUEST_TIMEOUT_MS;
  if (!rawTimeout) return DEFAULT_AI_REQUEST_TIMEOUT_MS;
  const parsedTimeout = Number.parseInt(rawTimeout, 10);
  if (!Number.isFinite(parsedTimeout) || parsedTimeout <= 0) {
    return DEFAULT_AI_REQUEST_TIMEOUT_MS;
  }
  return parsedTimeout;
};

const getAiApi = () => {
  if (aiApi) return aiApi;

  const aiProxyUrl = import.meta.env.VITE_AI_PROXY_URL;
  if (!aiProxyUrl) {
    throw new Error('AI proxy URL is not configured.');
  }

  aiApi = ky.create({
    prefixUrl: aiProxyUrl,
    timeout: getRequestTimeoutMs()
  });

  return aiApi;
};

export const generateAI = async (
  params: GenerateAIRequest,
  signal?: AbortSignal
): Promise<GenerateAIResponse> => {
  try {
    const payload = generateAIRequestSchema.parse(params);
    const response = await getAiApi()
      .post('generate', { json: payload, signal })
      .json();
    return generateAIResponseSchema.parse(response);
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorBody = await error.response
        .json<{ error?: string }>()
        .catch(() => null);
      const errorMessage =
        typeof errorBody?.error === 'string'
          ? errorBody.error
          : 'AI 생성 중 오류가 발생했습니다.';
      throw new Error(errorMessage);
    }
    throw error;
  }
};
