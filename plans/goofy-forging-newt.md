# StyledStepContent shadow 추가

## Context
StyledStepContent에 챗봇 플로우의 외부 카드(StyledWidget)와 동일한 수준의 box-shadow를 적용하여 카드가 배경 위에 떠 보이는 느낌을 강화한다.

## 변경 사항

**파일**: `apps/web/src/routes/_authenticated/start2/-route.style.ts` (L21~28)

`StyledStepContent`에 `box-shadow` 추가:
```
box-shadow: 0 32px 80px -24px rgba(15, 23, 42, 0.25), 0 12px 32px -8px rgba(15, 23, 42, 0.1);
```
(챗봇 플로우 `StyledWidget`과 동일한 값)

## 검증
- `pnpm web` → TIPA 예시 2 탭 → Step 1 페이지에서 StyledStepContent 카드에 깊은 shadow 확인
