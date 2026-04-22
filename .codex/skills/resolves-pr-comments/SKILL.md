---
name: resolves-pr-comments
description: Docs Front PR의 미해결 리뷰 코멘트(봇/사람)를 GraphQL로 조회하고, 봇 Critical은 자동수정, 사람 코멘트는 사용자확인 후 수정·resolve 처리합니다. "코멘트 해결", "리뷰 코멘트 처리", "resolve comments", "PR 코멘트", "리뷰 반영" 요청 시 호출.
---

# Resolve PR Comments Skill

PR 리뷰 코멘트(봇/사람)를 조회하고, 프론트엔드 리스크 기준으로 분류하여 필요한 항목만 수정/resolve 합니다.

## 실행 흐름

### Phase 1: PR 및 코멘트 조회

1. **PR 탐지**
   - 인자로 PR 번호가 주어지면 해당 PR 사용
   - 인자가 없으면 현재 브랜치의 PR을 자동 탐지:
     ```bash
     gh pr view --json number,url
     ```

2. **리포지토리 정보 확인**

   ```bash
   gh repo view --json owner,name --jq '{owner: .owner.login, name: .name}'
   ```

3. **리뷰 스레드 조회** (GraphQL)

   ```bash
   gh api graphql -f query='
   query($owner: String!, $repo: String!, $pr: Int!) {
     repository(owner: $owner, name: $repo) {
       pullRequest(number: $pr) {
         reviewThreads(first: 100) {
           nodes {
             id
             isResolved
             comments(first: 10) {
               nodes {
                 id
                 databaseId
                 author { login }
                 body
                 path
                 line
                 startLine
               }
             }
           }
         }
       }
     }
   }' -f owner="$OWNER" -f repo="$REPO" -F pr="$PR_NUMBER"
   ```

4. **필터링**
   - 미해결(unresolved) 스레드만 추출 (`isResolved == false`)
   - 자기 자신(Claude)이 작성한 코멘트는 제외
   - 해당하는 코멘트가 없으면 "미해결 리뷰 코멘트가 없습니다." 출력 후 즉시 종료

5. **작성자 구분**
   - **봇**: `author.login`에 `[bot]`, `copilot`, `coderabbit` 등 봇 패턴 포함
   - **사람**: 그 외 모든 작성자

### Phase 2: 코멘트 분류 및 판단

각 코멘트의 내용/대상 파일을 읽고 `code-review` 스킬의 Severity 기준으로 분류합니다.

#### 봇 코멘트 분류 기준

##### 자동 수정 (Critical)

머지 시 장애/보안사고 가능성이 높고, 기계적으로 안전하게 고칠 수 있는 항목만 자동 수정:

- 빌드/타입/린트 실패가 확실한 코드
- 인증 우회, 권한 체크 누락 같은 명확한 보안 결함
- 토큰/시크릿/개인정보 노출
- 명확한 런타임 크래시 (null 접근, 잘못된 분기 등)
- 잘못된 import/path로 인한 실행 실패

##### 사용자 확인 필요 (Warning)

즉시 장애는 아니지만 수정 시 의사결정이 필요한 항목:

- Query key 구조/invalidations 개선
- 폴링 주기/성능 튜닝
- UI/UX 변경 제안
- `@bichon/ds` 마이그레이션 제안
- 결제/크레딧/요금제 로직 수정 제안

##### 무시 (Info)

수정하지 않음. 스레드에는 무시 사유를 남김:

- 스타일 지적 (네이밍, 포맷팅)
- 대규모 리팩토링 제안
- PR 범위 밖 제안
- 지금 PR에서 검증 불가능한 광범위 제안

#### 사람 코멘트 분류 기준

사람이 작성한 코멘트는 의도적 피드백이므로 봇보다 보수적으로 분류합니다:

- **자동 수정하지 않음** - 사람 코멘트는 Critical이라도 "사용자 확인 필요"로 분류
- **무시하지 않음** - 사람 코멘트는 Info 수준이라도 "사용자 확인 필요"로 분류
- 사용자가 모든 항목을 직접 판단하도록 함

**분류 결과를 사용자에게 요약 보고**:

```
## 리뷰 코멘트 분류 결과

### 자동 수정 (N건) - 봇 코멘트만 해당
- `파일:라인` - 설명 (@작성자)

### 사용자 확인 필요 (N건)
- `파일:라인` - 설명 (@작성자)

### 무시 (N건) - 봇 코멘트만 해당
- `파일:라인` - 설명 (@작성자, 무시 사유: ...)
```

### Phase 3: 수정 실행

1. **자동 수정 대상**: 즉시 수정
2. **사용자 확인 대상**: 목록을 보여주고 사용자가 선택한 항목만 수정
3. **프론트엔드 검증 실행**: 변경 워크스페이스 기준으로 필요한 명령만 실행
   - `apps/web`:
     - `pnpm --filter @docs-front/web lint`
     - `pnpm --filter @docs-front/web check-types`
     - `pnpm --filter @docs-front/web build`
   - `apps/admin`:
     - `pnpm --filter admin lint`
     - `pnpm --filter admin build`
   - `apps/make`:
     - `pnpm --filter make lint`
     - `pnpm --filter make check-types`
     - `pnpm --filter make build`
   - `apps/sejong`:
     - `pnpm --filter sejong lint`
     - `pnpm --filter sejong build`
   - `packages/ui`:
     - `pnpm --filter @docs-front/ui lint`
     - `pnpm --filter @docs-front/ui check-types`
     - `pnpm --filter @docs-front/ui build`
     - 필요 시 `pnpm test:projects`
4. 루트 설정 파일(`package.json`, `turbo.json`, `pnpm-workspace.yaml`, 공용 config)까지 수정됐다면 최소 `pnpm lint` + `pnpm build` 추가 실행
5. 검증 실패 시 수정 내용 조정 후 재검증

### Phase 4: 커밋 & Resolve

1. **커밋 & 푸시**

   ```bash
   # 수정된 파일만 명시적으로 staging (git add -A 사용 금지)
   git add <file1> <file2> ...
   git commit -m "fix: resolve PR review comments"
   git push
   ```

2. **수정 완료된 스레드 처리**
   - 답글 달기:
     ```bash
     gh api repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}/replies \
       -f body="반영 완료"
     ```
   - 스레드 resolve:
     ```bash
     gh api graphql -f query='
     mutation($threadId: ID!) {
       resolveReviewThread(input: {threadId: $threadId}) {
         thread { isResolved }
       }
     }' -f threadId="$THREAD_ID"
     ```

3. **무시한 스레드 처리** (봇 코멘트만 해당)
   - 답글 달기:
     ```bash
     gh api repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}/replies \
       -f body="수정 불필요 - [무시 사유]"
     ```
   - 스레드 resolve:
     ```bash
     gh api graphql -f query='
     mutation($threadId: ID!) {
       resolveReviewThread(input: {threadId: $threadId}) {
         thread { isResolved }
       }
     }' -f threadId="$THREAD_ID"
     ```

## 주의사항

- **git add -A 금지**: 수정된 파일만 명시적으로 staging
- **과도한 수정 금지**: 리뷰 코멘트 중 실질적 가치가 있는 것만 수정
- **검증 필수**: 수정 후 변경 워크스페이스 기준 `pnpm` 검증 통과 확인
- **답글 언어**: 한국어로 작성
- **사람 코멘트 존중**: 사람이 작성한 코멘트는 자동 수정/무시하지 않고 반드시 사용자 확인을 거침
- **사람 코멘트 resolve 주의**: 수정하지 않기로 한 사람 코멘트는 resolve하지 않고 남겨둠
- **리스크 우선순위**: 스타일보다 보안/권한/결제/데이터 노출/런타임 안정성 이슈를 우선 처리

## Gotchas

> Codex가 이 스킬 실행 시 자주 빠지는 함정 목록.
> 실수를 발견할 때마다 여기에 한 줄씩 추가한다.

<!-- 아직 발견된 gotcha가 없습니다. 실수 패턴이 발견되면 여기에 추가하세요. -->
