# CLAUDE.md - Web App

This file provides guidance to Claude Code when working with the **web** app specifically.

## 앱 개요

독스헌트AI의 메인 서비스입니다. TanStack Router를 사용한 file-based routing과 i18n을 지원합니다.

## 기술 스택

- **라우팅**: TanStack Router (file-based routing)
- **상태 관리**: TanStack Query + Zustand
- **스타일링**: Emotion
- **폼**: React Hook Form + Zod
- **i18n**: i18next + react-i18next
- **모니터링**: Sentry
- **결제**: Paddle
- **인증**: Google OAuth (@react-oauth/google)

## 개발 명령어

```bash
# 개발 서버 실행
pnpm dev
# 또는
turbo run dev --filter=@docs-front/web

# 빌드
pnpm build

# 타입 체크
pnpm check-types

# 린트
pnpm lint

# i18n 타입 생성
pnpm toc          # Table of Contents 생성
pnpm interface    # TypeScript 인터페이스 생성
```

## 절대 경로 사용

이 앱에서는 `@/web/*` 경로를 사용합니다:

```typescript
// ✅ Good
import { useAuth } from '@/web/hooks/useAuth';
import { ChatSection } from '@/web/routes/_authenticated/main/-components/ChatSection';
import { Button } from '@docs-front/ui';

// ❌ Bad
import { useAuth } from '../../hooks/useAuth';
import { ChatSection } from './-components/ChatSection';
```

## 아키텍처 핵심 개념

### TanStack Router File-Based Routing

라우트 파일은 `src/routes/` 디렉토리에 위치하며, `@tanstack/router-plugin`이 자동으로 라우트 트리를 생성합니다.

**라우트 구조:**

```
src/routes/
  ├── __root.tsx                    - 루트 레이아웃 (RouterContext 정의)
  ├── index.tsx                     - / (홈)
  ├── _intro.tsx                    - 인트로 레이아웃 (URL에 나타나지 않음)
  ├── _intro/
  │   ├── sign-up.tsx               - /sign-up
  │   ├── password-reset.tsx        - /password-reset
  │   └── _authenticated/
  │       └── select-onboarding/    - 온보딩 선택 (인증 필요)
  ├── _authenticated.tsx            - 인증된 사용자 레이아웃
  └── _authenticated/
      └── main/
          ├── route.tsx             - /main
          ├── index.tsx             - /main (인덱스)
          ├── $productId.tsx        - /main/:productId (동적 라우트)
          ├── credit-plan/          - /main/credit-plan
          ├── detail-input/         - /main/detail-input
          └── -components/          - 라우트 전용 컴포넌트 (라우트 아님)
```

**라우트 파일 네이밍 규칙:**

- `__root.tsx` - 루트 라우트 (언더스코어 2개)
- `_layout.tsx` - Pathless 레이아웃 라우트 (URL에 나타나지 않음)
- `$param.tsx` - 동적 파라미터 (예: `$productId.tsx` → `:productId`)
- `index.tsx` - 인덱스 라우트 (부모 경로와 동일한 경로)
- `route.tsx` - 경로에 해당하는 라우트 (디렉토리 이름이 경로)
- `-components/` - 라우트 전용 컴포넌트 디렉토리 (하이픈으로 시작, 라우트 트리에 포함 안 됨)

**Router Context 패턴:**

`__root.tsx`에서 RouterContext를 정의하여 모든 라우트에서 접근 가능한 전역 컨텍스트를 제공합니다:

```typescript
// src/routes/__root.tsx
type RouterContext = {
  authentication: AuthContext;
  queryClient: QueryClient;
  toast: ToastContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <AnalyticsProvider>
      <OverlayProvider>
        <Outlet />
      </OverlayProvider>
    </AnalyticsProvider>
  ),
  // ...
});
```

**라우트 정의 예시:**

```typescript
// src/routes/_authenticated/main/$productId.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/main/$productId')({
  component: ProductPage,
  // beforeLoad, loader 등 라이프사이클 훅 사용 가능
});

function ProductPage() {
  const { productId } = Route.useParams(); // 타입 안전한 파라미터
  // ...
}
```

**타입 안전한 네비게이션:**

```typescript
import { Link, useNavigate } from '@tanstack/react-router';

// Link 컴포넌트 - 타입 추론으로 안전한 네비게이션
<Link to="/main/$productId" params={{ productId: '123' }}>
  Go to Product
</Link>

// useNavigate 훅
const navigate = useNavigate();
navigate({
  to: '/main/$productId',
  params: { productId: id },
  search: { tab: 'details' } // Search params도 타입 안전
});
```

### 인증 패턴

`_authenticated.tsx`와 `_intro/_authenticated.tsx`는 Pathless 레이아웃 라우트로, `beforeLoad`에서 인증을 확인합니다:

```typescript
// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const { authentication } = context;
    if (!authentication.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Outlet />,
});
```

### State Management

**1. TanStack Query (서버 상태)**

API 호출, 캐싱, 동기화를 담당합니다:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['product', productId],
  queryFn: () => fetchProduct(productId),
});
```

**2. Zustand (클라이언트 상태)**

전역 UI 상태를 관리합니다:

```typescript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

**3. TanStack Router Search Params (URL 상태)**

URL 기반 상태 관리로 북마크 가능한 상태를 만듭니다:

```typescript
// 라우트 정의에서 search params 검증
export const Route = createFileRoute('/main')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page) || 1,
      filter: search.filter as string,
    };
  },
});

// 컴포넌트에서 사용
const { page, filter } = Route.useSearch();
```

### i18n (다국어)

`i18next`를 사용하여 다국어를 지원합니다:

**번역 파일 위치:** `src/locales/ko/*.json`

**타입 생성:**

```bash
pnpm toc        # src/@types/resources.ts 생성
pnpm interface  # src/@types/resources.d.ts 생성
```

**사용 예:**

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t('common.welcome')}</h1>;
}
```

### 환경 변수

Vite의 `import.meta.env`를 사용하며, 모든 환경 변수는 `VITE_` 접두사가 필요합니다:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const googleClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
const paddleEnv = import.meta.env.VITE_PADDLE_ENVIRONMENT;
```

### Sentry 통합

에러 모니터링을 위해 Sentry가 통합되어 있습니다:

- `vite.config.ts`에서 `@sentry/vite-plugin` 설정
- `@sentry/react`로 에러 추적

### 공용 컴포넌트 사용

`@docs-front/ui` 패키지에서 공용 컴포넌트를 임포트:

```typescript
import {
  Button,
  Modal,
  Input,
  DocsThemeProvider,
  Toast,
  Spinner,
} from '@docs-front/ui';
```

## 주요 디렉토리 구조

```
src/
  ├── routes/           - TanStack Router 라우트 (file-based)
  ├── hooks/            - 커스텀 훅
  ├── components/       - 재사용 가능한 컴포넌트
  ├── locales/          - i18n 번역 파일
  ├── @types/           - 타입 정의
  ├── i18n.ts           - i18next 설정
  ├── App.tsx           - 앱 진입점 (Router 설정)
  └── main.tsx          - React DOM 렌더링
```

## 라우트 전용 컴포넌트 규칙

라우트와 밀접하게 관련된 컴포넌트는 `-components/` 디렉토리에 위치시킵니다:

```
routes/_authenticated/main/
  ├── route.tsx
  ├── $productId.tsx
  └── -components/
      ├── ChatSection/
      ├── CanvasSection/
      └── Toolbar/
```

이렇게 하면 라우트 트리에 포함되지 않으면서도 관련 컴포넌트를 가까이 배치할 수 있습니다.

## Vite 설정 주요 포인트

`vite.config.ts`에서 중요한 설정들:

- `@tanstack/router-plugin` - 라우트 트리 자동 생성 (`autoCodeSplitting: true`)
- `vite-tsconfig-paths` - TypeScript 경로 매핑 지원
- `@vitejs/plugin-react-swc` - SWC를 사용한 빠른 빌드
- `@sentry/vite-plugin` - 소스맵 업로드

## 주의사항

- 라우트 파일에서 `export const Route`는 필수입니다
- 라우트 트리 파일(`routeTree.gen.ts`)은 자동 생성되므로 직접 수정하지 마세요
- Search params는 항상 `validateSearch`로 검증하세요
- 환경 변수는 반드시 `VITE_` 접두사를 사용하세요
