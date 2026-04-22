---
name: simplify
description: 변경된 코드를 재사용성·코드 품질·효율성 관점에서 3개 병렬 에이전트로 재검토하고 발견된 이슈를 즉시 수정합니다. "simplify", "코드 정리", "cleanup", "중복 제거", "리팩토링" 요청 시 호출. code-review 스킬 Step 1에서 자동 호출됩니다.
---

# Simplify: Code Review and Cleanup

## Overview

변경된 파일 전체를 다시 점검해서 중복 구현, 품질 저하 패턴, 비효율 코드를 찾아 바로 수정합니다.
검토만 하지 않고 가능한 범위에서 직접 코드 변경과 검증까지 수행합니다.

## Phase 1: Identify Changes

변경 범위를 먼저 확정하고, 이후 모든 리뷰 단계에서 동일한 diff를 기준으로 판단합니다.

1. Staged 변경이 있으면 `git diff --cached`, 없으면 `git diff`를 사용합니다.
2. 변경이 없으면 사용자가 언급한 파일이나 이 대화에서 최근 수정한 파일을 우선 검토합니다.
3. 대상 파일이 여전히 불분명하면 최근 수정 파일(`git log -1 --name-only`, `find` 기반 mtime 확인)로 범위를 정합니다.

## Phase 2: Run 3 Review Agents in Parallel

가능하면 병렬 실행합니다. Codex에서는 `multi_tool_use.parallel`로 세 트랙을 동시에 진행합니다.

모든 트랙은 동일한 전체 diff를 컨텍스트로 사용합니다.

### Agent 1: Code Reuse Review

각 변경에 대해 다음을 확인합니다.

1. 기존 유틸/헬퍼/공용 모듈로 대체 가능한 신규 코드가 있는지 `rg`로 탐색
2. 기존 기능과 중복되는 신규 함수가 있는지 식별하고 대체 후보 제시
3. 인라인 로직(문자열 처리, 경로 처리, 환경 분기, 타입 가드 등)을 기존 유틸로 치환 가능한지 확인

### Agent 2: Code Quality Review

동일 diff를 대상으로 다음 안티패턴을 점검합니다.

1. Redundant state: 파생 가능한 상태를 별도 상태로 저장
2. Parameter sprawl: 함수 인자만 계속 늘리는 방식
3. Copy-paste variation: 거의 동일한 코드 블록 반복
4. Leaky abstractions: 내부 구현 디테일 노출/경계 침범
5. Stringly-typed code: 상수/유니온 타입 대신 raw string 남발

### Agent 3: Efficiency Review

동일 diff를 대상으로 다음 효율성 이슈를 점검합니다.

1. Unnecessary work: 중복 계산, 중복 I/O/API 호출, N+1 패턴
2. Missed concurrency: 독립 작업의 불필요한 직렬 처리
3. Hot-path bloat: 렌더/요청 hot path에 추가된 무거운 동기 작업
4. Unnecessary existence checks: TOCTOU 가능성이 있는 선행 존재 체크
5. Memory: 정리되지 않는 리스너/타이머, unbounded 구조
6. Overly broad operations: 필요한 범위보다 과도하게 읽고 처리

## Phase 3: Fix Issues

1. 세 트랙 결과를 합쳐 우선순위(버그 위험 > 데이터/보안 > 성능 > 유지보수성)로 정렬
2. 각 이슈를 직접 수정하고, 관련 테스트/타입체크/린트를 가능한 범위에서 실행
3. 오탐 또는 비용 대비 효과가 낮은 항목은 한 줄 근거만 남기고 스킵
4. 변경 후 diff를 다시 훑어 새로운 중복/회귀가 생기지 않았는지 재확인

## Output

완료 시 아래를 짧게 보고합니다.

1. 수정한 항목 요약(파일 경로 + 핵심 변경)
2. 스킵한 항목과 사유(있다면)
3. 검증 수행 결과(실행한 명령과 통과/실패)

수정할 내용이 없으면 코드가 이미 clean한 상태임을 명시합니다.

## Gotchas

> Codex가 이 스킬 실행 시 자주 빠지는 함정 목록.
> 실수를 발견할 때마다 여기에 한 줄씩 추가한다.

<!-- 아직 발견된 gotcha가 없습니다. 실수 패턴이 발견되면 여기에 추가하세요. -->
