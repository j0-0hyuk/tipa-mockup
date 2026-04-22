import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { zValidator } from '@hono/zod-validator';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { getPrompt } from './prompt/index.js';
import { generateRequestSchema } from './schema.js';
import {
  getCachedNotionLatestTime,
  startNotionLatestTimePolling
} from './notionLatestTime.js';

const app = new Hono();
const GOOGLE_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1';
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://bizcanvas.net',
  'https://app.docshunt.app'
];

const parsedAllowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0) ?? [];
const allowedOrigins =
  parsedAllowedOrigins.length > 0
    ? parsedAllowedOrigins
    : DEFAULT_ALLOWED_ORIGINS;

const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_MAX_REQUESTS = Number(
  process.env.RATE_LIMIT_MAX_REQUESTS ?? 60
);
const NOTION_RATE_LIMIT_WINDOW_MS = Number(
  process.env.NOTION_RATE_LIMIT_WINDOW_MS ?? 60_000
);
const NOTION_RATE_LIMIT_MAX_REQUESTS = Number(
  process.env.NOTION_RATE_LIMIT_MAX_REQUESTS ?? 120
);
const MAX_RESPONSE_TEXT_LENGTH = 500;
const DEFAULT_GENERATE_TIMEOUT_MS = 45_000;
const GENERATE_TIMEOUT_MS = Number.isFinite(
  Number(process.env.GENERATE_TIMEOUT_MS)
)
  ? Math.max(1, Number(process.env.GENERATE_TIMEOUT_MS))
  : DEFAULT_GENERATE_TIMEOUT_MS;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const notionRateLimitStore = new Map<string, { count: number; resetAt: number }>();

const getApiKey = () => {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error('AI_API_KEY is missing in environment variables');
  }
  return apiKey;
};

const toStatusCode = (status: number): ContentfulStatusCode =>
  (status >= 200 && status <= 599 ? status : 500) as ContentfulStatusCode;

const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  return request.headers.get('x-real-ip') || 'unknown';
};

const extractGoogleErrorMessage = (data: unknown, fallback: string): string => {
  if (!data || typeof data !== 'object') return fallback;
  const maybeError = (data as { error?: unknown }).error;
  if (!maybeError || typeof maybeError !== 'object') return fallback;
  const maybeMessage = (maybeError as { message?: unknown }).message;
  if (typeof maybeMessage !== 'string' || maybeMessage.length === 0) {
    return fallback;
  }
  return maybeMessage;
};

const sanitizeUserPrompt = (value: string): string =>
  value.replace(/\{\{user_input\}\}/g, '{user_input}');

const composePrompt = (prompt: string, type?: string): string => {
  if (!type) return prompt;
  const promptTemplate = getPrompt(type);
  if (!promptTemplate) return prompt;
  const safePrompt = sanitizeUserPrompt(prompt);
  return promptTemplate.replace(
    /\{\{user_input\}\}/g,
    `<user_input>\n${safePrompt}\n</user_input>`
  );
};

app.use('/api/*', async (c, next) => {
  if (c.req.path === '/api/notion/latest-time') {
    await next();
    return;
  }

  const now = Date.now();
  const clientIp = getClientIp(c.req.raw);

  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(ip);
    }
  }

  const current = rateLimitStore.get(clientIp);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    await next();
    return;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return c.json(
      { error: 'Too many requests. Please try again later.' },
      429
    );
  }

  rateLimitStore.set(clientIp, {
    count: current.count + 1,
    resetAt: current.resetAt
  });

  await next();
});

app.use('/api/notion/latest-time', async (c, next) => {
  const now = Date.now();
  const clientIp = getClientIp(c.req.raw);

  for (const [ip, entry] of notionRateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      notionRateLimitStore.delete(ip);
    }
  }

  const current = notionRateLimitStore.get(clientIp);
  if (!current || current.resetAt <= now) {
    notionRateLimitStore.set(clientIp, {
      count: 1,
      resetAt: now + NOTION_RATE_LIMIT_WINDOW_MS
    });
    await next();
    return;
  }

  if (current.count >= NOTION_RATE_LIMIT_MAX_REQUESTS) {
    return c.json(
      { error: 'Too many requests. Please try again later.' },
      429
    );
  }

  notionRateLimitStore.set(clientIp, {
    count: current.count + 1,
    resetAt: current.resetAt
  });

  await next();
});

app.use(
  '*',
  cors({
    origin: allowedOrigins,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization']
  })
);

app.get('/api/notion/latest-time', (c) => {
  return c.json({
    latestTime: getCachedNotionLatestTime()
  });
});

app.get('/api/models', async (c) => {
  try {
    const apiKey = getApiKey();
    const response = await fetch(`${GOOGLE_API_BASE_URL}/models?pageSize=100`, {
      headers: {
        'x-goog-api-key': apiKey
      }
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return c.json(
        {
          error: extractGoogleErrorMessage(data, 'Failed to fetch models')
        },
        toStatusCode(response.status)
      );
    }

    return c.json(data);
  } catch (error) {
    console.error('Error in /api/models:', error);
    return c.json({ error: 'Failed to fetch models' }, 500);
  }
});

app.post(
  '/api/generate',
  zValidator('json', generateRequestSchema),
  async (c) => {
    const { prompt, model, type } = c.req.valid('json');
    const modelName = model.startsWith('models/')
      ? model.replace('models/', '')
      : model;

    const finalPrompt = composePrompt(prompt, type);
    const constrainedPrompt = `${finalPrompt}\n\n[출력 제한]\n최종 답변은 공백 포함 ${MAX_RESPONSE_TEXT_LENGTH}자 이내로 작성하세요.\n\n[출력 형식]\n마크다운 문법(제목, 목록, 코드블록, 강조기호 등)을 사용하지 말고 일반 텍스트로만 작성하세요.`;

    try {
      const apiKey = getApiKey();
      const response = await fetch(
        `${GOOGLE_API_BASE_URL}/models/${modelName}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          signal: AbortSignal.timeout(GENERATE_TIMEOUT_MS),
          body: JSON.stringify({
            contents: [{ parts: [{ text: constrainedPrompt }] }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return c.json(
          {
            error: extractGoogleErrorMessage(errorData, 'AI request failed')
          },
          toStatusCode(response.status)
        );
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const trimmedText = text.trim();

      if (!trimmedText) {
        console.error(
          'Empty response from Gemini:',
          JSON.stringify(data, null, 2)
        );
        return c.json(
          {
            error:
              'AI가 유효한 답변을 생성하지 못했습니다. 입력을 보강해 다시 시도해주세요.'
          },
          422
        );
      }

      return c.json({ text: trimmedText });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === 'TimeoutError' || error.name === 'AbortError')
      ) {
        return c.json(
          {
            error:
              'AI 요청 시간이 초과되었습니다. 입력을 줄이거나 보완하여 다시 시도해주세요.'
          },
          504
        );
      }
      console.error('Error in /api/generate:', error);
      return c.json({ error: 'Internal Server Error' }, 500);
    }
  }
);

app.get('/health', async (c) => {
  const start = Date.now();

  try {
    const apiKey = getApiKey();
    const response = await fetch(`${GOOGLE_API_BASE_URL}/models?pageSize=1`, {
      headers: {
        'x-goog-api-key': apiKey
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      return c.json(
        {
          status: 'degraded',
          aiService: 'unhealthy',
          aiStatusCode: response.status
        },
        503
      );
    }

    return c.json({
      status: 'ok',
      aiService: 'healthy',
      latencyMs: Date.now() - start
    });
  } catch (error) {
    console.error('Error in /health:', error);
    return c.json(
      {
        status: 'degraded',
        aiService: 'unhealthy'
      },
      503
    );
  }
});

const port = Number(process.env.PORT) || 3000;
startNotionLatestTimePolling();
serve({ fetch: app.fetch, port });
console.log(`Proxy server listening on http://localhost:${port}`);
