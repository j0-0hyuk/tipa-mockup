/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_OAUTH_CLIENT_ID: string;
  readonly VITE_PADDLE_CLIENT_TOKEN: string;
  readonly VITE_PADDLE_ENVIRONMENT: 'sandbox' | 'production';
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_GTM_ID: string;
  readonly VITE_FACEBOOK_PIXEL_ID: string;
  readonly VITE_AI_PROXY_URL: string;
  readonly VITE_UPDATE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
