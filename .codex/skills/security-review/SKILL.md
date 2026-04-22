---
name: security-review
description: PR/브랜치 변경 diff를 보안 관점으로 집중 리뷰해 confidence >= 0.8인 실제 악용 가능 취약점만 식별합니다(DoS/rate-limit 등 제외). "security review", "보안 리뷰", "취약점 점검", "PR 보안 점검" 요청 시 호출. code-review 스킬 Step 2에서 자동 호출됩니다.
---

# Security Review

## Overview

브랜치 변경분만 대상으로 보안 취약점을 리뷰합니다.
일반 코드 품질이 아니라 실제 악용 가능성이 높은 보안 이슈만 보고합니다.

## Phase 1: Repository Context Research

아래 명령으로 PR/브랜치 컨텍스트를 먼저 수집합니다.

1. `git status`
2. `git diff --name-only origin/HEAD...HEAD`
3. `git log --no-decorate origin/HEAD...HEAD`
4. `git diff --merge-base origin/HEAD HEAD`

리뷰 기준 diff는 `git diff --merge-base origin/HEAD HEAD` 결과를 기본으로 사용합니다.

## Phase 2: Comparative Analysis

수집한 diff 전체를 읽고 "이 PR에서 새로 도입된" 보안 영향만 분석합니다.
기존 코드에 있던 과거 이슈는 보고하지 않습니다.

다음 카테고리만 집중합니다.

1. Input validation: SQL/Command/XXE/Template/NoSQL injection, Path traversal
2. AuthN/AuthZ: 인증 우회, 권한 상승, 세션/JWT 취약점, 인가 우회
3. Crypto/Secrets: 하드코딩된 키/토큰, 약한 암호 알고리즘, 키 관리 오류, 인증서 검증 우회
4. Injection/Code execution: 역직렬화 RCE, Pickle/YAML/Eval injection, XSS
5. Data exposure: 민감정보 로깅, PII 노출, API 응답 누출, 디버그 정보 노출

## Phase 3: Vulnerability Assessment

각 후보 이슈마다 아래를 검증한 뒤 보고 여부를 결정합니다.

1. 공격 입력이 실제로 도달 가능한가
2. 방어 로직(검증/인코딩/권한체크) 우회가 가능한가
3. 악용 시 영향이 보안 사고 수준인가(무단 접근, 데이터 유출, 시스템 손상)

신뢰도 기준:

1. 기본 기준은 `confidence >= 0.8`일 때만 보고
2. `confidence < 0.7`은 절대 보고하지 않음
3. 이론적 가능성만 있는 항목은 스킵

## Hard Exclusions

아래 항목은 자동 제외합니다.

1. DoS/리소스 고갈/메모리·CPU 고갈
2. 디스크에 저장된 시크릿 이슈(별도 관리 영역)
3. Rate limiting 이슈
4. 보안 영향이 없는 입력 검증 누락
5. 실제 취약점으로 이어지지 않는 일반 경고성 이슈

## Reporting Rules

반드시 보안 이슈만 보고하고, 불필요한 설명/잡음을 포함하지 않습니다.
최종 응답은 markdown 보고서만 출력합니다.

출력 템플릿:

```markdown
# Vuln 1: XSS: `foo.py:42`
* Severity: HIGH
* Confidence: 0.91
* Description: ...
* Exploit Scenario: ...
* Recommendation: ...
```

Severity는 `HIGH | MEDIUM | LOW` 중 하나를 사용합니다.

보고할 이슈가 없으면 아래 한 줄만 출력합니다.

```markdown
# Security Review Report
No high-confidence vulnerabilities found in the PR diff.
```

## Gotchas

> Codex가 이 스킬 실행 시 자주 빠지는 함정 목록.
> 실수를 발견할 때마다 여기에 한 줄씩 추가한다.

<!-- 아직 발견된 gotcha가 없습니다. 실수 패턴이 발견되면 여기에 추가하세요. -->
