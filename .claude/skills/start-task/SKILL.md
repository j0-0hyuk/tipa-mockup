---
name: start-task
description: 프론트엔드 모노레포에서 스펙/요구사항/버그리포트/VOC를 받아 git worktree + 브랜치를 생성하고 .task.md에 스펙 저장 후 plan 스킬로 실행 계획까지 수립합니다. "새 작업 시작", "이거 개발해줘", "이거 수정해줘", "start task", "워크트리 만들어줘" 요청 시, 또는 기능 스펙/버그 리포트/VOC 내용을 직접 붙여넣을 때 호출.
---

# Start Task Skill

프론트엔드 모노레포 작업을 시작할 때 스펙을 보존하고, `main` 기반 worktree + 브랜치를 일관되게 생성합니다.

## 실행 흐름

### Phase 1: 스펙 분석

1. 사용자가 제공한 입력을 분석합니다.
   - 입력 형태: 기능 스펙, PRD, 버그 리포트, VOC, Jira 티켓, 슬랙 메시지
2. 작업 유형을 분류합니다.
   - `feat`: 신규 기능
   - `fix`: 버그 수정, VOC 대응
   - `hotfix`: 긴급 운영 이슈
   - `chore`: 설정/의존성/운영 작업
   - `refactor`: 구조 개선
   - `docs`: 문서 작업
3. 이름을 제안합니다.
   - worktree: 짧은 kebab-case (`feat-chat-stream`)
   - branch: conventional 형식 (`feat/chat-stream`)
   - 이슈 번호가 있으면 포함 (`fix/DOCS-108-chat-timeout`)
4. 사용자에게 이름을 확인받습니다.
   - worktree 이름, 브랜치 이름, 작업 제목을 보여주고 승인받습니다.

### Phase 2: 환경 생성

1. 사전 검증을 수행합니다.
   - 동일 worktree 존재 여부 확인: `.worktrees/<name>`
   - 동일 브랜치 존재 여부 확인:
     - 로컬: `refs/heads/<branch>`
     - 원격: `refs/remotes/origin/<branch>` (필요 시 `git fetch origin` 후 확인)
   - 대상 브랜치가 다른 worktree에서 이미 사용 중인지 확인: `git worktree list`
   - `main` 브랜치 존재 여부 확인 (로컬 및 `origin/main`)
2. 충돌을 처리합니다.
   - 동일 worktree가 있으면 중단하고 사용자에게 알립니다.
   - 동일 브랜치가 있을 때:
     - `git worktree list`에서 해당 브랜치가 이미 다른 worktree에 체크아웃되어 있으면 중단하고, 다른 브랜치 사용 또는 기존 worktree 정리를 안내합니다.
     - 다른 worktree에서 사용 중이 아니면 사용자에게 재사용 여부를 확인받습니다.
   - 원격에만 동일 브랜치가 있을 때:
     - 사용자에게 원격 브랜치 추적 사용 여부를 확인받습니다.
     - 필요 시 다른 브랜치명으로 신규 생성하도록 안내합니다.
3. worktree를 생성합니다.
   - 신규 브랜치 생성 (로컬/원격 동명 브랜치가 없을 때):
     ```bash
     git worktree add .worktrees/<name> -b <branch> main
     ```
   - 기존 로컬 브랜치 재사용 (다른 worktree에서 사용 중이 아닐 때):
     ```bash
     git worktree add .worktrees/<name> <branch>
     ```
   - 기존 원격 브랜치 재사용 (로컬 브랜치가 없고 원격 브랜치만 있을 때):
     ```bash
     git worktree add .worktrees/<name> --track -b <branch> origin/<branch>
     ```
4. 스펙 파일을 생성합니다.
   - 경로: `.worktrees/<name>/.task.md`
   - 사용자 원문을 요약 없이 그대로 저장합니다.
   - 형식:

     ```markdown
     # Task: [작업 제목]

     ## 브랜치

     - worktree: <name>
     - branch: <branch>

     ## 스펙

     [사용자가 제공한 원본 스펙 전문]
     ```

5. 로컬 env 파일을 항상 복사합니다.
   - 목적: 로컬 실행에 필요한 환경값 누락으로 인한 실행/빌드 실패 방지
   - 규칙: `.env*` 파일 중 템플릿(`.env.example`, `.env.template`)은 제외하고 worktree에 같은 경로로 복사
   - 예시:
     ```bash
     while IFS= read -r file; do
       target=".worktrees/<name>/$file"
       mkdir -p "$(dirname "$target")"
       cp "$file" "$target"
     done < <(
       find . -type f -name '.env*' \
         ! -name '.env.example' \
         ! -name '.env.template' \
         ! -path './.worktrees/*'
     )
     ```

### Phase 3: 계획 수립

`.worktrees/<name>/.task.md`를 기반으로 `/plan` 스킬을 실행하여 구현 계획을 수립합니다.

### Phase 4: 실행 안내

다음 형식으로 결과를 출력합니다.

```text
worktree 생성 완료!

  worktree: .worktrees/<name>
  branch:   <branch>
  spec:     .worktrees/<name>/.task.md

새 터미널에서 실행하세요:
  cd .worktrees/<name>
  pnpm install

한 줄 실행(복붙):
  cd .worktrees/<name> && pnpm install && <app-run-command>
```

`<app-run-command>`는 대상 앱에 맞게 반드시 채워서 안내합니다.

- web: `pnpm web`
- admin: `pnpm admin`
- make: `pnpm make`
- sejong: `pnpm --filter sejong dev`

## 주의사항

- base 브랜치는 항상 `main`을 사용합니다.
- 사용자가 제공한 스펙 원문을 `.task.md`에 그대로 저장합니다(요약 금지).
- 로컬 env 파일 복사는 선택이 아니라 필수 단계로 수행합니다.
- 기존 브랜치를 재사용할 때는 반드시 `git worktree list`로 다른 worktree 점유 여부를 먼저 확인합니다.
- 브랜치 충돌 검사는 로컬뿐 아니라 `origin`까지 포함해 확인합니다.
- 기존 worktree/브랜치 충돌 시 임의로 덮어쓰지 말고 반드시 사용자 확인을 받습니다.
- Phase 4 출력의 마지막에 한 줄 실행 명령(`cd ... && pnpm install && <app-run-command>`)을 반드시 포함합니다.
- 이 스킬은 프론트엔드 레포 기준입니다(`gradle.properties`, `./tools/wt-launch.sh` 의존성 없음).

## Gotchas

> Claude가 이 스킬 실행 시 자주 빠지는 함정 목록.
> 실수를 발견할 때마다 여기에 한 줄씩 추가한다.

<!-- 아직 발견된 gotcha가 없습니다. 실수 패턴이 발견되면 여기에 추가하세요. -->
