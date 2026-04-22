/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_OAUTH_CLIENT_ID: string;
  readonly VITE_PADDLE_CLIENT_TOKEN: string;
  readonly VITE_PADDLE_ENVIRONMENT: 'sandbox' | 'production';
  readonly VITE_PADDLE_PRO_MONTHLY_PRICE_ID: string;
  readonly VITE_PADDLE_PRO_YEARLY_PRICE_ID: string;
  readonly VITE_PADDLE_SEASON_PASS_PRICE_ID: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_AI_PROXY_URL: string;
  readonly VITE_AI_REQUEST_TIMEOUT_MS?: string;
  readonly VITE_UPDATE_URL: string;
  readonly SECURE_LOCAL_STORAGE_DISABLED_KEYS: string;
  readonly REACT_APP_SECURE_LOCAL_STORAGE_DISABLED_KEYS: string;
  readonly VITE_META_API_URL: string;
  // TossPayments
  readonly VITE_TOSSPAYMENTS_CLIENT_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
