# CLAUDE.md - Admin App

This file provides guidance to Claude Code when working with the **admin** app specifically.

## 앱 개요

독스헌트AI의 관리자 페이지입니다. Google OAuth 인증을 통해 관리자만 접근할 수 있으며, 사용자 관리 및 쿠폰 발급 등의 관리 기능을 제공합니다.

## 기술 스택

- **라우팅**: TanStack Router (file-based routing)
- **상태 관리**: TanStack Query
- **스타일링**: Emotion
- **폼**: React Hook Form + Zod
- **인증**: Google OAuth (@react-oauth/google)
- **HTTP 클라이언트**: ky

## 개발 명령어

```bash
# 개발 서버 실행 (루트에서)
pnpm admin

# 또는 admin 디렉토리에서
pnpm dev

# 빌드
pnpm build

# 린트
pnpm lint
```

## 절대 경로 사용

이 앱에서는 `@/*` 경로를 사용합니다:

```typescript
// ✅ Good
import { useAuth } from '@/hooks/useAuth';
import { createCoupon } from '@/api/authenticated/coupons';
import { Button } from '@bichon/ds';

// ❌ Bad
import { useAuth } from '../../hooks/useAuth';
import { createCoupon } from '../api/authenticated/coupons';
```

## 환경 변수

`.env` 파일에 다음 환경 변수가 필요합니다:

```bash
VITE_API_URL=http://localhost:8080  # API 서버 URL
VITE_GOOGLE_OAUTH_CLIENT_ID=        # Google OAuth Client ID
```

Vite dev server는 `/api` 경로를 `VITE_API_URL`로 프록시합니다 (vite.config.ts:19-27).

## 아키텍처 핵심 개념

### TanStack Router File-Based Routing

라우트 파일은 `src/routes/` 디렉토리에 위치하며, TanStack Router가 자동으로 라우트 트리를 생성합니다.

**라우트 구조:**

```
src/routes/
  ├── __root.tsx              - 루트 레이아웃 (RouterContext 정의)
  ├── index.tsx               - / (랜딩, /main으로 리다이렉트)
  ├── _intro.tsx              - 인트로 레이아웃 (URL에 나타나지 않음)
  ├── _intro/
  │   └── login.tsx           - /login
  ├── _authenticated.tsx      - 인증된 사용자 레이아웃 (Header + Sidebar)
  └── _authenticated/
      ├── main/               - /main (대시보드)
      ├── users/              - /users (사용자 관리)
      └── coupons/            - /coupons (쿠폰 관리)
```

**Router Context 패턴:**

`__root.tsx`에서 RouterContext를 정의하여 모든 라우트에서 접근 가능한 전역 컨텍스트를 제공합니다:

```typescript
// src/routes/__root.tsx
type RouterContext = {
  authentication: AuthContext;    // useAuth 반환값
  queryClient: QueryClient;       // TanStack Query 클라이언트
  toast: ToastContext;           // useToast 반환값
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />
});
```

**라우트 정의 예시:**

```typescript
// src/routes/_authenticated/coupons/route.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/coupons')({
  component: CouponsPage
});

function CouponsPage() {
  // 라우트 컴포넌트 로직
}
```

### 인증 시스템

**라우트 가드** (src/routes/_authenticated.tsx):
```typescript
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    // 로그인 여부만 빠르게 체크 (동기적 리다이렉트)
    if (!context.authentication.isLogined.current) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthenticatedLayout
});

function AuthenticatedLayout() {
  // useEffect에서 Admin 권한 체크 (비동기)
  // Admin이 아니면 토스트 표시 후 로그아웃
}
```

### API 레이어 구조

**API 클라이언트 계층:**
```
api/
  ├── instance.ts              - 기본 ky 인스턴스 (에러 메시지 파싱)
  ├── auth.ts                  - 인증 API (로그인, 로그아웃, 토큰 갱신)
  └── authenticated/
      ├── instance.ts          - 인증이 필요한 API용 확장 인스턴스
      ├── accounts.ts          - 계정 API
      ├── coupons.ts           - 쿠폰 API
      └── payments.ts          - 결제 API
```

**Zod 스키마 기반 타입 안정성:**

모든 API 요청/응답은 Zod 스키마로 정의하고, 런타임 검증과 타입 추론을 동시에 수행합니다:

```typescript
// schema/api/auth/auth.ts
export const authResponseSchema = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  })
}).transform(({ data }) => data);

// api/auth.ts
export const postGoogleSignIn = async (params: GoogleSignInRequestParams) => {
  const response = await authApi.post('signIn/google', { json: params }).json();
  return authResponseSchema.parse(response);  // 런타임 검증 + 타입 추론
};
```

**스키마 구조:**
```
schema/
  ├── api/                     - API 스키마
  │   ├── auth/               - 인증 관련
  │   ├── accounts/           - 계정 관련
  │   ├── coupons/            - 쿠폰 관련
  │   ├── payments/           - 결제 관련
  │   └── error.ts            - 공통 에러 스키마
  └── data.ts                 - 공통 데이터 스키마
```

### 폼 관리

React Hook Form + Zod를 사용한 타입 안전한 폼 관리:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } = useForm<CreateCouponRequest>({
  resolver: zodResolver(createCouponRequestSchema)
});

const onSubmit = (data: CreateCouponRequest) => {
  createCouponMutation.mutate(data);
};
```

TanStack Query의 `useMutation`으로 API 호출, 에러 처리, 토스트 메시지 표시:

```typescript
const createCouponMutation = useMutation({
  mutationFn: createCoupon,
  onSuccess: () => {
    toast.showToast('쿠폰이 성공적으로 생성되었습니다.');
    reset();
    queryClient.invalidateQueries({ queryKey: ['coupons'] });
  },
  onError: (error: Error) => {
    toast.showToast(`쿠폰 생성 실패: ${error.message}`);
  }
});
```

### 스타일링 패턴

Emotion의 `styled` API를 사용하여 컴포넌트별 스타일 파일 분리:

```
routes/_authenticated/coupons/
  ├── route.tsx           - 컴포넌트 로직
  └── coupons.style.ts    - 스타일 정의 (Emotion styled components)
```

공용 UI는 `@bichon/ds` 패키지에서 임포트:

```typescript
import { Button, Flex, useToast, BichonThemeProvider } from '@bichon/ds';
```

**Styled components에서 props 전달:**
```typescript
// Props 이름은 $ 접두사 사용 (transient props)
const StyledButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'blue' : 'gray'};
`;

<StyledButton $active={isActive}>Click</StyledButton>
```

## 주요 디렉토리 구조

```
src/
  ├── routes/              - TanStack Router 라우트 (file-based)
  ├── hooks/               - 커스텀 훅
  │   └── useAuth.ts      - 인증 상태 관리
  ├── components/          - 재사용 가능한 컴포넌트
  │   ├── Header/
  │   ├── Sidebar/
  │   └── GoogleLoginButton/
  ├── api/                 - API 클라이언트
  │   ├── instance.ts     - 기본 ky 인스턴스
  │   ├── auth.ts         - 인증 API
  │   └── authenticated/  - 인증이 필요한 API
  ├── schema/              - Zod 스키마 정의
  │   ├── api/            - API 요청/응답 스키마
  │   └── data.ts         - 공통 데이터 스키마
  ├── App.tsx             - TanStack Router Provider
  └── main.tsx            - 앱 진입점 (BichonThemeProvider, GoogleOAuthProvider)
```

## 주요 페이지

### 로그인 페이지 (`/login`)
- Google OAuth 로그인
- 관리자 권한이 없으면 자동 로그아웃

### 대시보드 (`/main`)
- 사용자 현황, 쿠폰 관리 카드

### 쿠폰 관리 (`/coupons`)
- **일반 쿠폰**: 단일 코드, 무제한 사용 (Paddle)
- **랜덤 쿠폰**: 여러 개 생성, 각각 다른 코드 (Paddle)
- **로컬 쿠폰**: 독스헌트 내부 크레딧 쿠폰 (자체 시스템)
- Paddle 쿠폰은 Paddle 대시보드의 Discounts 페이지에서 확인 가능

### 사용자 관리 (`/users`)
- 사용자 목록 조회 및 관리

## Vite 설정 주요 포인트

`vite.config.ts`에서 중요한 설정들:

- `@vitejs/plugin-react-swc` - SWC를 사용한 빠른 빌드
  - `@swc/plugin-emotion` - Emotion CSS-in-JS 지원
- `vite-tsconfig-paths` - TypeScript 경로 매핑 지원 (`@/*`)
- **Proxy 설정**: `/api` 요청을 `VITE_API_URL`로 프록시

## 주의사항

### Zod 스키마 작성
- 새로운 API 추가 시 반드시 `schema/api/`에 스키마를 먼저 정의
- Request와 Response 스키마를 모두 정의하세요
- `.transform()`을 사용하여 불필요한 래핑을 제거할 수 있습니다

### 인증 토큰 관리
- Access Token과 Refresh Token은 localStorage에 **JSON 문자열**로 저장됨
- `authenticatedApi`를 사용하면 토큰 관리가 자동으로 처리됨
- 직접 localStorage를 조작하지 말고 `useAuth` 훅을 사용하세요

### TanStack Router
- 라우트 파일에서 `export const Route`는 필수입니다
- 라우트 트리 파일(`routeTree.gen.ts`)은 자동 생성되므로 직접 수정하지 마세요
- `beforeLoad`는 동기적 체크에만 사용 (빠른 리다이렉트)
- 비동기 로직은 컴포넌트의 `useEffect`에서 처리

### 환경 변수
- 환경 변수는 반드시 `VITE_` 접두사를 사용하세요
- `import.meta.env.VITE_API_URL` 등으로 접근
