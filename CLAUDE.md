# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

독스헌트AI 서비스의 프론트엔드 모노레포입니다. Turbo + pnpm을 사용하여 여러 앱과 공통 패키지를 관리합니다.

## 모노레포 구조

```
apps/
  ├── web    - 메인 서비스 (TanStack Router 사용)
  ├── admin  - 관리자 페이지
  └── make   - make 서비스

packages/
  ├── ui                - 공용 UI 컴포넌트 라이브러리
  ├── eslint-config     - 공용 ESLint 설정
  ├── typescript-config - 공용 TypeScript 설정
  └── vitest-config     - 공용 Vitest 설정
```

각 앱의 상세한 가이드는 해당 앱의 `CLAUDE.md` 파일을 참고하세요.

## 기술 스택

- **프레임워크**: React 18 + TypeScript 5.8
- **빌드 도구**: Vite 7 + Turbo 2.6 (모노레포 관리)
- **패키지 관리자**: pnpm 10 (workspace + catalog 사용)
- **공용 UI**: Radix UI + Emotion
- **테스트**: Vitest
- **배포**: Docker + Nginx

## 주요 개발 명령어

### 전체 프로젝트

```bash
# 모든 앱 동시 실행
pnpm dev

# 빌드
pnpm build

# 린트
pnpm lint

# 테스트 실행
pnpm test:projects

# 테스트 watch 모드
pnpm test:projects:watch
```

### 개별 앱 실행

```bash
pnpm admin  # admin 앱만 실행
pnpm web    # web 앱만 실행
pnpm make   # make 앱만 실행
```

### Turbo를 통한 개별 실행

```bash
# 특정 앱만 개발 모드로 실행
turbo run dev --filter=admin
turbo run dev --filter=make
turbo run dev --filter=@docs-front/web

# 특정 앱만 빌드
turbo run build --filter=admin

# 특정 앱만 타입 체크
turbo run check-types --filter=@docs-front/web
```

## 코드 컨벤션

### 절대 경로 사용

루트 `tsconfig.json`에 정의된 절대 경로를 사용합니다:

```typescript
// ✅ Good
import { Button } from '@docs-front/ui';
import { useAuth } from '@/web/hooks/useAuth';
import { SomeComponent } from '@/admin/components/SomeComponent';

// ❌ Bad
import { Button } from '../../../packages/ui';
import { useAuth } from '../../hooks/useAuth';
```

**경로 매핑:**

- `@/*` → 루트 기준 경로
- `@/web/*` → `apps/web/src/*`
- `@/make/*` → `apps/make/src/*`
- `@/admin/*` → `apps/admin/src/*`
- `@docs-front/ui` → `packages/ui`

### 공용 패키지 사용

`packages/ui`에서 공유 컴포넌트를 임포트:

```typescript
import { Button, Modal, Input, DocsThemeProvider } from '@docs-front/ui';
```

## 모노레포 관리

### pnpm Workspace

`pnpm-workspace.yaml`에서 워크스페이스를 정의하고, **catalog** 기능으로 의존성 버전을 통일 관리합니다.

공통 의존성은 catalog에 정의되어 있으며, 각 앱에서 `catalog:` 키워드로 참조합니다:

```json
{
  "dependencies": {
    "react": "catalog:",
    "vite": "catalog:"
  }
}
```

### Turbo 캐싱

`turbo.json`에 정의된 태스크 파이프라인에 따라 빌드 결과를 캐싱합니다. 의존성이 변경되지 않으면 캐시를 재사용하여 빌드 속도를 향상시킵니다.

## 환경 변수

각 앱에서 Vite의 `import.meta.env`를 사용하며, 모든 환경 변수는 `VITE_` 접두사가 필요합니다.

## 브랜치 전략

- **메인 브랜치**: `main`
- **PR 타겟**: `main`
- **브랜치 네이밍**: `feat/`, `fix/`, `chore/` 등 Conventional Commits 스타일

## GitHub 작업

GitHub 관련 작업(이슈, PR 등)은 항상 GitHub MCP를 사용합니다.

## 앱별 가이드

각 앱의 상세한 아키텍처와 패턴은 해당 디렉토리의 `CLAUDE.md`를 참고하세요:

- @apps/web/CLAUDE.md - 메인 서비스 (TanStack Router, i18n 등)
- @apps/admin/CLAUDE.md - 관리자 페이지 (작성 필요)
- 크롬 익스텐션 (작성 필요)

## 패키지별 가이드

각 패키지의 상세한 아키텍처와 패턴은 해당 디렉토리의 `CLAUDE.md`를 참고하세요:

- @packages/ui/CLAUDE.md - ui 패키지
- @packages/hwpx-editor/CLAUDE.md - HWPX 문서 에디터 (Slate + WASM IR 파이프라인)
