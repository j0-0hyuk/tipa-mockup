# Docshunt Front

독스헌트AI 서비스의 프론트엔드 모노레포입니다. **Turbo** + **pnpm**으로 여러 앱과 공용 패키지를 관리합니다.

## 요구 사항

- **Node.js** 18+
- **pnpm** 10+ (`corepack enable` 후 `corepack prepare pnpm@latest --activate`)

## 모노레포 구조

```
apps/
  ├── web           # 메인 서비스 (TanStack Router)
  ├── admin         # 관리자 페이지
  └── make          # make 서비스
packages/
  ├── ui                # 공용 UI 컴포넌트 (Radix UI, Emotion)
  ├── eslint-config     # 공용 ESLint 설정
  ├── typescript-config # 공용 TypeScript 설정
  └── vitest-config     # 공용 Vitest 설정
```

## pnpm Workspace

`pnpm-workspace.yaml`로 워크스페이스와 의존성 버전을 관리합니다.

### 워크스페이스

- **packages**: `apps/*`, `packages/*` — 위 구조의 앱·패키지가 모두 워크스페이스 멤버입니다.
- 워크스페이스 내 패키지 참조: `"@docs-front/ui": "workspace:*"` 처럼 `workspace:*`를 사용합니다.

### Catalog

공통 의존성 버전은 **catalog**에 한 번만 정의하고, 각 앱/패키지에서는 `catalog:`로 참조합니다.

```yaml
# pnpm-workspace.yaml
catalog:
  react: ^18.3.1
  vite: ^7.2.1
  typescript: ~5.8.3
```

```json
// apps/web/package.json 등
{
  "dependencies": {
    "react": "catalog:",
    "vite": "catalog:"
  }
}
```

이렇게 하면 React, Vite, TypeScript 등 버전을 한 곳에서 통일해 관리할 수 있습니다.

## 기술 스택

| 구분        | 스택                                 |
| ----------- | ------------------------------------ |
| 프레임워크  | React 18, TypeScript 5.8             |
| 빌드        | Vite 7, Turbo                        |
| 패키지 관리 | pnpm 10 (workspace + catalog)        |
| UI          | Radix UI, Emotion, lucide-react      |
| 라우팅      | TanStack Router                      |
| 상태/서버   | TanStack Query, React Hook Form, Zod |
| 테스트      | Vitest                               |

## 시작하기

### 1. 저장소 클론 및 의존성 설치

```bash
git clone https://github.com/Docshunt/docs-front
cd docs-front
pnpm install
```

### 2. 개발 서버 실행

**전체 앱 동시 실행** (web, admin, make 등):

```bash
pnpm dev
```

**특정 앱만 실행** (권장):

```bash
pnpm web        # 메인 서비스 (http://localhost:5173)
pnpm admin      # 관리자
pnpm make       # make 서비스
```

> ⚠️ `turbo dev`는 사용하지 않습니다. 루트에서는 `pnpm dev` 또는 위의 앱별 스크립트를 사용하세요.

## 빌드

```bash
# 전체 워크스페이스 빌드
pnpm build

# 특정 앱만 빌드
turbo run build --filter=@docs-front/web
turbo run build --filter=admin
```

## 린트 & 테스트

```bash
pnpm lint              # 전체 린트
pnpm test:projects     # 테스트 실행
pnpm test:projects:watch  # 테스트 watch
```

## 환경 변수

각 앱은 Vite 기준으로 동작하며, 클라이언트에서 쓰는 환경 변수는 **`VITE_`** 접두사가 필요합니다.

## 브랜치

- 기본 브랜치: `main`
- PR은 `main` 대상, 브랜치 네이밍: `feat/`, `fix/`, `chore/` 등

## 참고

- 앱/패키지별 상세 가이드: 해당 디렉터리의 `CLAUDE.md` 참고
- 공용 UI: `import { Button, Modal } from '@docs-front/ui';`
