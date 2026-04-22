---
name: code-review
description: Docs Front 모노레포(apps/web, admin, make, sejong, packages/ui)의 코드를 React/TypeScript/TanStack Router/ky/Zod/Turbo 관점에서 8-pass로 검토하고 severity별로 분류합니다. "코드 리뷰", "review", "리뷰해줘", "코드 검토", "변경사항 확인" 요청 시 호출. submit-pr 스킬 내부에서도 자동 호출됩니다.
---

# Code Review Skill

프론트엔드 모노레포 코드 변경을 체계적으로 리뷰하고 개선안을 제시합니다.

## 리뷰 프로세스

### Pass 1: 변경 범위와 아키텍처

- 변경 파일이 어떤 워크스페이스(`apps/*`, `packages/*`)에 영향을 주는지 먼저 식별
- 앱 경계를 침범하는 직접 참조 여부 확인 (다른 앱 내부 파일 직접 import 금지)
- 상대 경로 대신 절대 경로/워크스페이스 import 사용 여부 확인 (`@/*`, `@docs-front/ui`)
- `routeTree.gen.ts` 같은 생성 파일을 수동 편집했는지 확인 (수동 편집 금지)
- 라우팅 규칙 준수 여부 확인
  - `web`, `admin`: TanStack Router file-based routing (`createFileRoute`, `beforeLoad`)
  - `make`: `react-router-dom` 기반 라우터 규칙
  - `sejong`: 크롬 확장 컨텍스트(Background/Content) 경계 유지

### Pass 2: 보안/개인정보/권한

- 토큰, 비밀번호, API 키, 사용자 데이터 하드코딩/노출 여부 확인
- 민감값을 `console.log`, 에러 메시지, analytics payload에 노출하는지 확인
- 인증/인가 우회 가능성 확인 (`beforeLoad` 가드, admin 권한 체크 누락 여부)
- 사용자 A의 데이터가 사용자 B에게 노출될 수 있는 경로가 생기는지 확인
- `rehype-raw`, HTML 렌더링 구간의 XSS 위험성 확인
- 확장 프로그램(`sejong`)의 도메인/메시지 검증 누락 여부 확인

### Pass 3: API/스키마/상태 동기화

- `ky` 인스턴스(`api`, `authenticatedApi`)를 일관되게 사용하는지 확인
- 요청/응답을 `zod`로 검증(`parse`/`safeParse`)하는지 확인
- 에러 스키마 파싱 실패 시 안전한 fallback이 있는지 확인
- `TanStack Query`의 `queryKey`가 안정적이고 파라미터를 충분히 포함하는지 확인
- mutation 이후 `invalidateQueries`/캐시 갱신 누락 여부 확인
- 폴링/재시도(`refetchInterval`, `retry`) 종료 조건 누락 여부 확인

### Pass 4: 성능/런타임 안정성

- 무한 요청 루프/과도한 폴링/불필요한 재렌더링 여부 확인
- 대용량 렌더링에서 key 누락, 비싼 연산의 반복 실행 여부 확인
- `useEffect` 의존성 누락으로 stale closure/중복 side effect가 발생하는지 확인
- 렌더 단계에서 예외를 유발할 수 있는 null/undefined 접근 확인
- 브라우저 메인 스레드를 장시간 점유하는 처리 여부 확인

### Pass 5: 운영 UX/사용자 체감 품질

- 로딩 상태 누락 여부 확인 (Spinner, Skeleton 없이 빈 화면이 노출되는 구간)
- 에러 발생 시 사용자에게 의미 있는 피드백이 표시되는지 확인 (빈 화면, 깨진 UI 대신 에러 메시지/복구 안내)
- 폼 제출 후 사용자 피드백 존재 여부 확인 (Toast, 버튼 비활성화, 로딩 표시 등)
- 버튼/폼 이중 클릭 방지 처리 여부 확인 (`isLoading` 중 비활성화, mutation pending 상태 활용)
- 비동기 작업 실패 시 사용자가 재시도하거나 복구할 수 있는 경로가 있는지 확인
- 빈 상태(Empty State) 처리 여부 확인 (데이터 없을 때 안내 문구/일러스트 대신 빈 화면 노출)
- 페이지 전환/데이터 로드 시 레이아웃 깜빡임(Layout Shift) 여부 확인
- 사용자 입력 검증 메시지가 명확하고 적시에 표시되는지 확인
- 모달/오버레이 닫기 후 포커스 복원, 키보드 접근성 기본 동작 확인
- 낙관적 업데이트(Optimistic Update) 실패 시 롤백과 사용자 알림이 적절한지 확인
- UI 요소의 시각적 어색함 확인 (정렬 불일치, 간격 불균형, 잘리는 텍스트, 아이콘-텍스트 수직 정렬 어긋남)
- 상태 전환 시 어색한 UI 변화 확인 (크기가 갑자기 바뀌는 컴포넌트, 조건부 렌더링으로 콘텐츠가 점프하는 현상)
- 인터랙션 피드백의 자연스러움 확인 (hover/active/disabled 상태 구분, 클릭 가능 요소의 cursor 스타일)
- 텍스트 오버플로 처리 확인 (긴 사용자 입력이나 동적 데이터에 대한 말줄임/줄바꿈 처리)

### Pass 6: 프로젝트 컨벤션

- 신규 UI 작업에서 `@bichon/ds` 우선 원칙을 지켰는지 확인
- 불가피한 경우가 아니면 `@docs-front/ui` 신규 의존성 추가를 피했는지 확인
- Emotion styled transient props에 `$` prefix를 사용했는지 확인
- 사용자 노출 문자열 변경 시 i18n 반영 누락 여부 확인 (`apps/web`)
- 환경변수 접근은 `import.meta.env.VITE_*`만 사용하는지 확인
- `dist/`, 빌드 산출물, 캐시 파일을 직접 수정하지 않았는지 확인

### Pass 7: 자동화 심층 검토

Pass 1~6 완료 후, 다음 두 스킬을 순서대로 실행합니다.

**Step 1 — Simplify**
`Skill` 툴로 `simplify` 스킬을 호출합니다. 코드 재사용성·품질·효율성 관점에서 추가 이슈를 찾아 직접 수정하고, 수정 요약을 리뷰 결과에 통합합니다.

**Step 2 — Security Review**
`Skill` 툴로 `security-review` 스킬을 호출합니다. 브랜치 변경 diff를 기준으로 보안 취약점을 심층 분석하고, 발견된 취약점을 리뷰 결과의 🔴 Critical / 🟡 Warning 항목에 병합합니다.

### Pass 8: 검증 명령 제안

변경 영역에 따라 최소 검증 명령을 제안합니다.

- `apps/web`: `pnpm --filter @docs-front/web lint`, `pnpm --filter @docs-front/web check-types`, `pnpm --filter @docs-front/web build`

- `apps/admin`: `pnpm --filter admin lint`, `pnpm --filter admin build`
- `apps/make`: `pnpm --filter make lint`, `pnpm --filter make check-types`, `pnpm --filter make build`
- `apps/sejong`: `pnpm --filter sejong lint`, `pnpm --filter sejong build`
- `packages/ui`: `pnpm --filter @docs-front/ui lint`, `pnpm --filter @docs-front/ui check-types`, `pnpm --filter @docs-front/ui build`, 필요 시 `pnpm test:projects`

## Severity 기준

### 🔴 Critical (즉시 수정 필요)

머지 시 **장애/보안사고/결제 오류/데이터 노출** 가능성이 높은 문제:

- 인증/인가 우회, 관리자 권한 검증 누락
- 사용자 데이터 교차 노출 가능성
- 결제/크레딧/요금제 로직 오류
- 런타임 크래시 확정 코드, 무한 요청 루프
- 토큰/시크릿/민감 정보 노출

### 🟡 Warning (수정 권장)

즉시 장애는 아니지만 **품질 저하/기술 부채**를 만드는 문제:

- Zod 검증 누락, Query key/invalidations 부정확
- 성능 저하 가능성 (불필요한 refetch/re-render)
- 라우팅/상태관리 패턴 위반
- 컨벤션 위반 (절대경로, styled props, UI 마이그레이션 원칙)

### 🔵 Info (참고 사항)

PR 머지를 막지 않는 개선 제안:

- 대안 구현 아이디어
- 구조 단순화 제안
- 향후 리팩토링 후보

### ✅ Good (잘한 점)

- 잘 작성된 부분에 대한 긍정적 피드백

## 출력 포맷

리뷰 결과를 다음 형식으로 출력합니다:

```
## 코드 리뷰 결과

### 발견 사항

#### 🔴 Critical (즉시 수정 필요)
- **[카테고리]** `파일명:라인` - 설명
  - 영향: [장애/보안/데이터/비즈니스 영향]
  - 제안: [개선 코드]

#### 🟡 Warning (수정 권장)
- **[카테고리]** `파일명:라인` - 설명
  - 이유: [왜 수정을 권장하는지]
  - 제안: [개선 방법]

#### 🔵 Info (참고 사항)
- **[카테고리]** `파일명:라인` - 설명

#### ✅ Good (잘한 점)
- 잘 작성된 부분에 대한 긍정적 피드백

### 남은 리스크/테스트 갭
- [검증 미수행 항목, 수동 테스트 필요 영역]

### 요약
- 리뷰 대상: [파일/변경사항 설명]
- 전체 평가: [한 줄 요약]
```

## 리뷰 시 주의사항

- 단순 스타일보다 **실질적인 버그/보안/성능/데이터 노출**에 집중
- 비판만 하지 말고, **잘한 부분도 인정**할 것
- 제안은 가능한 한 **구체적인 코드 예시**와 함께 제공
- 프로젝트 컨텍스트를 고려한 **맞춤형 리뷰** 수행
- 변경의 **영향 범위**를 파악하고 관련 파일도 함께 검토
- 사소한 포맷/스타일 지적만으로 리뷰를 채우지 않음

## Gotchas

> Claude가 이 스킬 실행 시 자주 빠지는 함정 목록.
> 실수를 발견할 때마다 여기에 한 줄씩 추가한다.

<!-- 아직 발견된 gotcha가 없습니다. 실수 패턴이 발견되면 여기에 추가하세요. -->
