# Document Chat: AI Server Action Streaming Protocol

## Overview

문서 채팅에서 AI가 HWPX 문서를 편집할 때, 서버는 개별 편집 액션을 `data-action` 이벤트로 클라이언트에 스트리밍합니다.
클라이언트는 수신된 액션을 ProseMirror 에디터에 인라인 diff 데코레이션으로 실시간 표시하며,
사용자가 변경사항을 리뷰한 후 수락/거절할 수 있습니다.

## SSE 스트리밍 포맷

기존 NDJSON/SSE 스트림(`POST /document-chat/messages:stream`)에 `data-action` 이벤트를 추가합니다.

### 이벤트 구조

SSE 이벤트는 `data:` 라인으로 전송되며, `\n\n`으로 구분됩니다:

```
data: ["data-action", {"phase": "start"}]

data: ["data-action", {"phase": "delta", "action": { ... }}]

data: ["data-action", {"phase": "delta", "action": { ... }}]

data: ["data-action", {"phase": "done"}]

```

## data-action 이벤트 Phase

### `start` - 스트리밍 시작

액션 스트리밍이 시작됨을 알립니다. 클라이언트는 이 이벤트를 받으면 diff 세션을 시작합니다.

```json
["data-action", { "phase": "start" }]
```

### `delta` - 개별 액션 전송

하나의 편집 액션을 전송합니다. 여러 번 반복됩니다.

```json
["data-action", { "phase": "delta", "action": { "type": "update", "refId": "p-1", "actionNode": "<p style=\"s4\" refId=\"p-1\"><run style=\"s5\"><t>수정된 텍스트</t></run></p>" } }]
```

### `done` - 스트리밍 완료

모든 액션 전송이 완료됨을 알립니다. 클라이언트는 이 이벤트를 받으면 사용자 리뷰 모드로 전환합니다.

```json
["data-action", { "phase": "done" }]
```

## Action 스키마

서버 Pydantic 모델과 1:1 대응되는 JSON 스키마입니다. **필드명은 camelCase** (`to_camel` alias 적용).

### 공통 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | `"add" \| "update" \| "delete"` | O | 액션 타입 |
| `refId` | `string` | O | 대상 노드의 고유 식별자 (예: `"p-1"`, `"tbl-3"`) |

### AddAction - 노드 추가

기존 노드의 앞 또는 뒤에 새 노드를 삽입합니다.

```json
{
  "type": "add",
  "refId": "p-5",
  "actionNodes": [
    "<p style=\"s4\" refId=\"__tmp-1\"><run style=\"s5\"><t>새로 추가된 문단입니다.</t></run></p>"
  ],
  "position": "after"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `actionNodes` | `string[]` | O | 추가할 IR XML 노드 배열 |
| `position` | `"before" \| "after"` | X | 삽입 위치 (기본값: `"after"`) |

### UpdateAction - 노드 수정

기존 노드를 새 노드로 교체합니다. **동일한 타입의 노드만 교체 가능합니다.**

```json
{
  "type": "update",
  "refId": "p-3",
  "actionNode": "<p style=\"s4\" refId=\"p-3\"><run style=\"s5\"><t>수정된 내용</t></run></p>"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `actionNode` | `string` | O | 교체할 IR XML 노드 |

### DeleteAction - 노드 삭제

지정된 `refId`의 노드를 삭제합니다.

```json
{
  "type": "delete",
  "refId": "p-7"
}
```

추가 필드 없음.

## Pydantic 모델 (서버 참조)

```python
from enum import Enum
from typing import Literal, List, Annotated

from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel


class ActionTypeEnum(str, Enum):
    ADD = "add"
    UPDATE = "update"
    DELETE = "delete"


class PositionEnum(str, Enum):
    BEFORE = "before"
    AFTER = "after"


class BaseAction(BaseModel):
    type: ActionTypeEnum
    ref_id: str = Field(..., description="Reference ID for the action")

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )


class AddAction(BaseAction):
    type: Literal[ActionTypeEnum.ADD]
    action_nodes: List[str] = Field(..., description="List of nodes to add")
    position: PositionEnum = PositionEnum.AFTER


class UpdateAction(BaseAction):
    """
    Action to replace an existing node with another node.
    The node to replace with must be the same type as the original.
    """
    type: Literal[ActionTypeEnum.UPDATE]
    action_node: str = Field(
        ...,
        description="New node to replace existing node. Must be the same type."
    )


class DeleteAction(BaseAction):
    type: Literal[ActionTypeEnum.DELETE]


class Actions(BaseModel):
    actions: list[
        Annotated[
            AddAction | UpdateAction | DeleteAction,
            Field(discriminator="type")
        ]
    ] = Field(..., description="List of actions to add/update/delete")
```

## IR XML 노드 형식

액션의 `actionNode` / `actionNodes` 필드는 **HWPX IR XML** 형식의 문자열입니다.

### 문단 (Paragraph)

```xml
<p style="s4" refId="p-1">
  <run style="s5"><t>일반 텍스트</t></run>
  <run style="s6"><t>볼드 텍스트</t></run>
</p>
```

- `style`: 문단/런 스타일 ID (문서 Theme에 정의됨)
- `refId`: 노드 고유 식별자
- `<run>`: 동일 서식이 적용된 텍스트 범위
- `<t>`: 실제 텍스트 컨텐츠

### 테이블 (Table)

```xml
<tbl style="s7" refId="tbl-1">
  <tr>
    <tc><p style="s4" refId="p-10"><run style="s5"><t>셀1</t></run></p></tc>
    <tc><p style="s4" refId="p-11"><run style="s5"><t>셀2</t></run></p></tc>
  </tr>
</tbl>
```

### 새 노드의 refId 규칙

- **수정/삭제**: 기존 `refId`를 그대로 사용 (예: `"p-3"`)
- **추가**: `__tmp-N` 형식의 임시 ID 사용 (예: `"__tmp-1"`, `"__tmp-2"`)
- 클라이언트가 임시 ID를 영구 ID로 자동 변환

## refId 체계

`refId`는 문서 내 각 블록 노드(문단, 테이블 등)의 고유 식별자입니다.

- 문서 로드 시 WASM 코어가 각 노드에 `refId`를 할당합니다
- 서버에서 문서의 IR을 조회하면 각 노드의 `refId`를 확인할 수 있습니다
- 액션에서 `refId`를 사용하여 수정/삭제 대상 노드를 지정합니다
- 새 노드 추가 시 기존 노드의 `refId`를 기준점으로 사용하고, 새 노드에는 `__tmp-N` ID를 부여합니다

### IR 조회 예시

```python
# WASM 코어를 통해 현재 문서의 IR을 조회
ir_nodes = processor.to_action_nodes()  # string[] - 각 블록의 IR XML
```

반환 예시:
```
[
  "<p style=\"s4\" refId=\"p-1\"><run style=\"s5\"><t>첫 번째 문단</t></run></p>",
  "<p style=\"s4\" refId=\"p-2\"><run style=\"s5\"><t>두 번째 문단</t></run></p>",
  "<tbl style=\"s7\" refId=\"tbl-1\">...</tbl>"
]
```

## 전체 스트리밍 라이프사이클

```
Server                                          Client
  │                                                │
  │  POST /document-chat/messages:stream           │
  │◄───────────────────────────────────────────────│
  │                                                │
  │  (AI가 문서 분석 및 편집 계획 수립)              │
  │                                                │
  │  data: ["data-action", {"phase":"start"}]      │
  │───────────────────────────────────────────────►│ → session.startStreaming()
  │                                                │
  │  data: ["data-action", {"phase":"delta",       │
  │    "action":{"type":"update","refId":"p-1",    │
  │    "actionNode":"<p>...</p>"}}]                 │
  │───────────────────────────────────────────────►│ → session.pushAction(action)
  │                                                │   (인라인 diff 데코레이션 표시)
  │  data: ["data-action", {"phase":"delta",       │
  │    "action":{"type":"add","refId":"p-1",       │
  │    "actionNodes":["<p>...</p>"],               │
  │    "position":"after"}}]                        │
  │───────────────────────────────────────────────►│ → session.pushAction(action)
  │                                                │
  │  ... (추가 delta 이벤트들) ...                  │
  │                                                │
  │  data: ["data-action", {"phase":"done"}]       │
  │───────────────────────────────────────────────►│ → session.finishStreaming()
  │                                                │   (사용자 리뷰 모드)
  │                                                │
  │  ┌─────────────────────────────────────────┐   │
  │  │ 사용자가 변경사항 리뷰                    │   │
  │  │ - 개별 항목 체크/언체크                   │   │
  │  │ - "반영" 또는 "취소" 버튼 클릭            │   │
  │  └─────────────────────────────────────────┘   │
  │                                                │
  │  [승인 시] resumeAction: "approve"              │
  │◄───────────────────────────────────────────────│
  │                                                │
  │  PATCH /document-chat/apply-actions            │
  │  { fileId, actions: [...수락된 액션들] }        │
  │◄───────────────────────────────────────────────│
  │                                                │
  │  [거절 시] resumeAction: "reject"               │
  │◄───────────────────────────────────────────────│
```

## 적용 API

### `PATCH /document-chat/apply-actions`

사용자가 수락한 액션들을 서버에 반영합니다.

**Request Body:**
```json
{
  "fileId": 123,
  "actions": [
    { "type": "update", "refId": "p-1", "actionNode": "<p>...</p>" },
    { "type": "add", "refId": "p-5", "actionNodes": ["<p>...</p>"], "position": "after" }
  ]
}
```

**Response:** `200 OK` (body 없음)

서버는 수신된 액션을 원본 HWPX 파일에 적용하여 저장합니다.

## 에러 처리

스트리밍 중 에러 발생 시 기존 에러 이벤트 형식을 사용합니다:

```
data: ["error", {"message": "에러 메시지"}]

```

클라이언트는 에러 수신 시 diff 세션을 리셋하고 롤백합니다.

## 기존 프로토콜과의 관계

기존 `data-document` 프로토콜(sessionId 기반 편집된 문서 다운로드)은 `data-action`으로 대체됩니다.

| | data-document (기존) | data-action (신규) |
|---|---|---|
| 편집 주체 | 서버 | 서버 (액션 생성) + 클라이언트 (적용) |
| 데이터 전송 | sessionId → 전체 HWPX 다운로드 | 개별 액션 스트리밍 |
| Diff 표시 | HTML 레벨 diff (iframe) | ProseMirror 인라인 diff 데코레이션 |
| 실시간성 | 완료 후 한 번에 표시 | 액션 도착할 때마다 실시간 표시 |
| 선택적 수락 | 전체 수락/거절만 가능 | 개별 액션 단위 수락/거절 가능 |
