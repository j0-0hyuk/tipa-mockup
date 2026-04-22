# @docs-front/hwpx-editor 패키지 가이드

## 개요

HWPX(한글 2010 XML) 문서 에디터 패키지입니다. Slate 기반 UI와 WASM 백엔드(`@docshunt/docs-editor-wasm`) 사이의 양방향 동기화를 통해 문서 편집, AI 제안 diff, 스타일 관리를 수행합니다.

## 주요 의존성

- `slate` / `slate-react` / `slate-history` - 편집기 코어
- `@docshunt/docs-editor-wasm` - WASM IR/문서 처리 백엔드
- `@bichon/ds` - UI 컴포넌트 (peer)
- `@emotion/react` / `@emotion/styled` - CSS-in-JS (peer)

## 엔트리 포인트

- `src/index.ts` - headless 전체 re-export + UI 전용 컴포넌트
  - UI 전용: `SlateEditor`, `Toolbar`, `DiffPanel`, `bichonDiffTokens`, `downloadBytes`
- `src/headless.ts` - UI 의존성(@bichon/ds, @emotion) 없이 사용 가능한 export
  - Schema: 모든 타입 + `isVoidElement`
  - Store: `DocumentStore`, `irToSlateNodes`, `slateNodeToIrXml`
  - Action: `ActionDispatcher`, 타입들
  - Style: `StyleResolver`, Theme 관련 타입들
  - Diff: `computeDiff`, `useDiffSession`, `DiffStyleTokens`, `defaultDiffTokens`
  - Components (headless-safe): `EditorProvider`, `useEditor`
  - Toolbar hooks: `useToolbarActions`, `useDocumentStyle`, `useParagraphStyle`, `useInlineParagraphStyle`
  - Plugins: `withRefIdNormalizer`, `withTableStructureLock`, `createTableCellSelectionHandler`, `collectCellPathsBetween`
  - Diff decoration: `useDiffTargets`, `getDiffHighlightStyle`, `buildPreviewHtml`, `DiffWidget`, `injectDiffStyles`

## 디렉토리 구조

```
src/
├── schema/          - Slate 요소 타입 정의
│   ├── index.ts             - isVoidElement + re-export
│   └── types.ts             - HwpxElement, HwpxEditor 타입
├── store/           - WASM 문서 래퍼 + IR 변환
│   ├── index.ts             - re-export
│   ├── document-store.ts    - WASM Processor 관리
│   ├── ir-converter.ts      - IR XML → Slate 노드
│   └── ir-serializer.ts     - Slate 노드 → IR XML
├── action/          - Slate ↔ WASM 변경 동기화
│   ├── index.ts             - re-export
│   ├── dispatcher.ts        - 변경 감지 + 액션 생성 + refId 동기화 + rAF 배칭
│   └── types.ts             - Action, ActionsPayload, Position 타입
├── plugins/         - Slate 플러그인 + 이벤트 핸들러
│   ├── index.ts                     - re-export
│   ├── refid-normalizer.ts          - 새 단락 스타일 상속 + split_node refId 제거
│   ├── table-structure-lock.ts      - 테이블 구조 변경 차단
│   ├── with-table-navigation.ts     - 테이블 셀 간 화살표 키 이동
│   └── with-table-cell-selection.ts - 마우스 드래그 셀 선택 + 셀 내용 초기화
├── diff/            - Diff 세션 관리
│   ├── index.ts               - re-export
│   ├── use-diff-session.ts    - diff 상태 + accept/reject 로직
│   ├── compute-diff.ts        - 단어 단위 diff 알고리즘
│   └── diff-style-tokens.ts   - DiffStyleTokens 인터페이스 + defaultDiffTokens
├── style/           - WASM Theme → CSS 변환
│   ├── index.ts             - re-export
│   └── style-resolver.ts   - Theme → CSS 텍스트 변환
├── components/      - React 컴포넌트
│   ├── index.ts                    - re-export
│   ├── EditorProvider.tsx          - 전역 Context 제공
│   ├── SlateEditor.tsx             - 메인 에디터 (셀 선택/테이블 네비게이션 통합)
│   ├── slate-diff-decoration.tsx   - diff 인라인 위젯 + 하이라이트
│   ├── DiffPanel.tsx               - diff 항목 리스트 패널
│   ├── Toolbar.tsx                 - 파일 열기/저장/스타일/undo-redo 툴바
│   └── bichon-diff-tokens.ts       - @bichon/ds 기반 diff 토큰 매핑
├── toolbar/         - 툴바 액션/스타일 훅
│   ├── use-toolbar-actions.ts         - 파일 로드/직렬화/undo-redo
│   ├── use-document-style.ts          - 문서 전체 스타일 조회/수정
│   ├── use-paragraph-style.ts         - 문단 스타일 선택/변경
│   └── use-inline-paragraph-style.ts  - 인라인 문단/글자 속성 수정
└── utils/           - 유틸리티
    └── download.ts  - 파일 다운로드 헬퍼
```

---

## 핵심 파이프라인

### 1. 문서 로드: File → WASM → IR → Slate

```
File (Uint8Array)
  → store.load(bytes, filename)
    → loadFromData() [WASM 파싱]
    → processor.addRefId() [DFS 순서로 refId 부여]
  → store.getIr() → string[] (IR XML 배열)
  → irToSlateNodes(ir, store) [IR XML → Slate 트리]
  → dispatcher.snapshot(nodes) [단락별 XML 캐시]
  → setValue(nodes) + setLoadCount(+1) [에디터 마운트]
```

### 2. 사용자 편집: Slate → Action → WASM → refId 갱신 (rAF 배칭)

```
사용자 입력
  → onChange(newValue)
  → dispatcher.scheduleDirty(editor) [rAF 예약, setValue는 즉시]

[다음 애니메이션 프레임]
  → dispatcher.dispatchDirty(editor, editor.children)
    1. 변경 감지: 캐시된 shallow XML과 현재 노드 비교
       - refId 없음 → ADD 액션 (새 단락)
       - XML 불일치 → UPDATE 액션
       - 캐시에만 존재 → DELETE 액션
    2. store.applyActions(actions) [WASM에 적용]
    3. store.refreshRefIds() [refId 제거 + 재부여]
    4. applyRefIdsFromFlat() [DFS 순서로 Slate 트리에 매핑]
    5. dispatcher.snapshot() [캐시 갱신]
```

**rAF 배칭**: `dispatchDirty`는 `requestAnimationFrame`으로 프레임당 최대 1회 실행됩니다. 여러 키스트로크가 하나의 sync로 병합되어 타이핑 성능이 개선됩니다. WASM 상태를 읽기 전에는 반드시 `dispatcher.flush()`를 호출해야 합니다 (serialize, diff session 시작 등). `reloadEditor`/`doLoad`는 `dispatcher.cancelPending()`으로 stale sync를 폐기합니다.

### 3. 직렬화: Slate → IR → WASM → File

```
store.serialize()
  → removeRefId() → toBytes() → addRefId()
  → Uint8Array (HWPX 바이너리)
```

---

## RefId 동기화 메커니즘

### refId란?

WASM이 각 구조적 요소(paragraph, run, table, row, cell, subList, pic)에 부여하는 고유 식별자입니다. Slate와 WASM 간 동기화의 **핵심 키**입니다.

### DFS 순서 (Critical)

WASM의 `getRefIds()`가 반환하는 flat 배열과 Slate 트리 순회 순서가 **정확히 일치**해야 합니다:

```
paragraph → run → (
  table → row → cell → subList → paragraph (재귀)
  pic
)
```

`applyRefIdsFromFlat()`은 이 순서대로 Slate 트리를 DFS 순회하며 flat 배열에서 refId를 하나씩 소비합니다. 순서 불일치 시 전체 동기화가 깨집니다.

### Shallow vs Full 캐시 (2-tier)

| 캐시 | 내용 | 용도 |
|------|------|------|
| `shallowCache` | 테이블을 `<tbl ... />` 스텁으로 치환 | 단락 수준 변경 감지 |
| `fullCache` | 테이블 내용 포함 전체 XML | diff 표시용 |

테이블 셀 편집이 부모 단락의 UPDATE를 트리거하지 않도록 shallow 캐시를 사용합니다.

---

## Diff Session

### 개요

AI 제안이나 외부 변경사항을 미리보기하고 entry 단위로 수락/거부할 수 있는 세션입니다.

### 상태

```typescript
interface DiffSession {
  entries: DiffEntry[];
  status: "idle" | "streaming" | "ready";
  pushAction: (action: Action) => void;
  startStreaming: () => void;
  finishStreaming: () => void;
  toggleEntry: (index: number) => void;
  toggleAll: (checked: boolean) => void;
  applyChecked: () => void;
  acceptEntry: (index: number) => void;
  rejectEntry: (index: number) => void;
  acceptEntries: (indices: number[]) => void;
  rejectEntries: (indices: number[]) => void;
  reset: () => void;
}

interface DiffEntry {
  action: Action;          // add/update/delete
  oldXml: string | null;   // 변경 전 (캐시)
  newXml: string | null;   // 변경 후
  checked: boolean;        // 사용자 수락 토글
}

interface UseDiffSessionOptions {
  store: DocumentStore;
  dispatcher?: ActionDispatcher;       // getCachedXml로 oldXml 조회
  reloadEditor?: () => void;           // accept/reject 후 에디터 리로드
  getEditorValue?: () => Descendant[]; // 현재 Slate 트리 (그룹핑용)
  onApply?: (actions: Action[]) => void;  // accept 콜백
  onReject?: (action: Action) => void;    // reject 콜백
  onReset?: () => void;                // reset 콜백
  onFinish?: () => void;               // 모든 entry 처리 완료 콜백
}
```

### 스트리밍 패턴 (AI 제안)

```
startStreaming() → [status: "streaming", store.beginTransaction()]
  → pushAction(action) 반복
    (동일 refId + position의 연속 ADD는 자동 병합)
  → finishStreaming() → [status: "ready"]
```

연속 ADD 병합 이유: WASM에 동일 refId 기준 여러 ADD를 개별 적용하면 순서가 뒤집힐 수 있음.

### 트랜잭션 관리

- `startStreaming()`은 `store.beginTransaction()`을 호출하여 onChange 리스너 트리거를 억제
- 모든 entry가 처리 완료되면 `store.refreshRefIds()` → `store.commitTransaction()` → `reloadEditor()` → `onFinish()` 순서로 마무리
- `reset()` 시에도 트랜잭션이 활성 상태면 `commitTransaction()` 호출

### Entry 그룹핑 (Union-Find)

수락/거부 시 관련 entry를 묶어서 처리합니다:

1. **동일 refId 그룹**: 같은 refId에 대한 여러 액션
2. **테이블 자식 그룹**: 같은 테이블 내 row/cell 변경 → 함께 수락/거부

```
acceptEntry(index)
  → computeEntryGroups()로 그룹 탐색
  → 그룹 전체 액션 적용
  → entries에서 제거
  → 모든 entry 처리 완료 시: refreshRefIds() + reloadEditor()
```

### Diff 시각화

`slate-diff-decoration.tsx`에서 diff entry를 Slate 경로에 매핑하여 인라인 위젯으로 렌더링합니다:

- **UPDATE**: 노란 배경 + 이전/이후 비교 위젯
- **DELETE**: 빨간 배경 + 취소선
- **ADD**: 삽입 위치 표시 + 미리보기
- **테이블 변경**: 개별 위젯 대신 테이블 단위 그룹 위젯

주요 export: `useDiffTargets`, `getDiffHighlightStyle`, `buildPreviewHtml`, `DiffWidget`, `injectDiffStyles`

### Diff 스타일 토큰

`DiffStyleTokens` 인터페이스로 diff 위젯/하이라이트의 색상/레이아웃을 커스터마이즈합니다:

- `defaultDiffTokens` - @bichon/ds 의존성 없는 기본 토큰 (fallback)
- `bichonDiffTokens` - @bichon/ds 디자인 시스템 토큰 매핑 (UI 전용)
- `injectDiffStyles(tokens?)` - 토큰 기반 CSS를 DOM에 주입

---

## Action 타입

```typescript
type Action =
  | { type: "add"; refId: string; actionNodes: string[]; position: "before" | "after" }
  | { type: "update"; refId: string; actionNode: string }
  | { type: "delete"; refId: string }
```

- `add`: `refId` 기준 `position` 위치에 `actionNodes` (IR XML 배열) 삽입
- `update`: `refId` 요소를 `actionNode` (IR XML)로 교체
- `delete`: `refId` 요소 삭제

---

## Slate 스키마

```
ParagraphElement (type: "paragraph")
├── style, refId
└── RunElement (type: "run")
    ├── style, refId
    └── TextBlockElement (type: "t") → HwpxText
      | TableElement (type: "table")
      |   └── TableRowElement → TableCellElement → SubListElement → ParagraphElement (재귀)
      | PicElement (type: "pic", void)
```

`pic`은 void 요소로, 이미지 데이터는 로드 시 base64 data URL로 변환됩니다.

---

## Slate 플러그인

| 플러그인/핸들러 | 타입 | 역할 |
|---------|------|------|
| `withRefIdNormalizer` | editor plugin | 새 단락 생성 시 이전 형제의 style 상속. `split_node` 시 refId를 null로 리셋하여 중복 방지. paragraph 자식이 bare text node일 때 run > t 구조로 복원. |
| `withTableStructureLock` | editor plugin | 테이블 행/셀/구조의 insert/remove/split/merge 차단 (셀 내용만 편집 허용). Backspace/Delete가 셀 경계를 넘는 것 차단. 테이블을 포함하는 범위 선택 후 deleteFragment 차단. `__bypassTableLock` 플래그로 우회 가능. |
| `createTableNavigationHandler` | keydown handler | ArrowUp/ArrowDown 키로 같은 visual column의 위/아래 셀로 이동. 첫 행에서 ArrowUp은 표 앞 paragraph로, 마지막 행에서 ArrowDown은 표 뒤 paragraph로 이동. colspan을 고려하여 visual column 기준으로 대상 셀 결정. |
| `createTableCellSelectionHandler` + `collectCellPathsBetween` | keydown handler + utility | 셀 선택 상태에서 Backspace/Delete 시 셀 내용만 비움 (구조 유지). Slate 텍스트 선택이 셀 간에 걸친 경우에도 동일 보호 적용. `collectCellPathsBetween`은 visual grid를 구축하여 rowspan/colspan을 고려한 사각형 영역의 셀 Path 수집. |

**Plugin 적용 순서**: `withTableStructureLock(withRefIdNormalizer(withHistory(withReact(editor))))`

**Event handler 적용** (`SlateEditor` 내부):
```
onKeyDown:  handleTableCellSelection → handleTableNavigation (순서대로, defaultPrevented 체크)
onMouseDown: handleCellMouseDown (마우스 드래그 셀 선택 시작, mousemove/mouseup 리스너 등록)
```

셀 선택 시각화는 DOM data attribute(`data-cell-selected`, `data-cell-selecting`)와 CSS로 처리하며, React state가 아닌 ref로 관리하여 불필요한 리렌더링 방지.

---

## 컴포넌트

### `EditorProvider`

전역 Context를 제공하는 최상위 컴포넌트입니다.

**Props (`EditorProviderProps`):**

| Prop | 타입 | 설명 |
|------|------|------|
| `children` | `ReactNode` | 필수 |
| `store?` | `DocumentStore` | 외부 store 주입 (미제공 시 내부 생성) |
| `initialTheme?` | `Theme` | 문서 로드 직후 적용할 초기 테마 |
| `onLoad?` | `(store: DocumentStore) => void` | 문서 로드 완료 콜백 |
| `onChange?` | `(store: DocumentStore) => void` | 문서 변경 콜백 (`store.onStoreChange`에 등록) |
| `onError?` | `(error: Error) => void` | 에러 콜백 |

**Context (`EditorContextValue`):**

| 필드 | 타입 | 설명 |
|------|------|------|
| `store` | `DocumentStore` | WASM 문서 저장소 |
| `styleResolver` | `StyleResolver \| null` | Theme → CSS 변환기 |
| `pageProperties` | `PageProperties \| null` | 페이지 크기/마진 |
| `value` / `setValue` | `Descendant[]` | Slate 트리 상태 |
| `loadCount` | `number` | 문서 로드 횟수 (SlateEditor key로 사용, 리마운트 트리거) |
| `loadFile` / `loadBytes` | | 문서 로드 |
| `refreshStyles()` | | Theme에서 CSS 재생성 + StyleResolver 갱신 |
| `reloadEditor()` | | WASM IR에서 Slate 트리 재로드 (diff accept/reject 후 사용) |
| `subscribeToEditorState` / `notifyEditorStateChange` | | `useSyncExternalStore` 패턴 |
| `editorRef` | `MutableRefObject<HwpxEditor \| null>` | Slate editor 인스턴스 |
| `dispatcher` | `ActionDispatcher` | 변경 동기화 |

### `SlateEditor`

**Props (`SlateEditorProps`):**

| Prop | 타입 | 설명 |
|------|------|------|
| `width?` | `CSSProperties["width"]` | 기본값: pageProperties.width 또는 "100%" |
| `height?` | `CSSProperties["height"]` | 기본값: pageProperties.height 또는 "auto" |
| `readOnly?` | `boolean` | diff가 활성화되면 자동으로 readOnly |
| `diffSession?` | `DiffSession` | diff 세션 전달 시 인라인 위젯/하이라이트/네비게이션 overlay 표시 |
| `onDismiss?` | `() => void` | diff overlay "전체 무시" 클릭 시 콜백 (미제공 시 `diffSession.reset`) |

**커스텀 동작:**
- `insertBreak`: paragraph를 split하여 새 단락 생성
- `insertData`: 항상 plain text만 삽입 (구조 복사 방지)
- `deleteBackward`: void(pic) 포함 run이 있는 이전 문단과 병합 시, run 단위 moveNodes로 처리하여 Slate cascading merge로 인한 텍스트 소실 방지
- selection-only 변경 시 비싼 XML 직렬화/비교를 스킵하여 성능 유지

### `Toolbar`

**Props (`ToolbarProps`):**

| Prop | 타입 | 설명 |
|------|------|------|
| `onStyleClick?` | `() => void` | 문서 스타일(T) 버튼 클릭 콜백 |

기능: 열기, 저장, 스타일 드롭다운(l1~l4), 문서 스타일(T), 실행 취소, 다시 실행

### `DiffPanel`

**Props (`DiffPanelProps`):**

| Prop | 타입 | 설명 |
|------|------|------|
| `session` | `DiffSession` | diff 세션 |

기능: diff entry 리스트 표시 (각 entry의 체크박스, 타입 배지, 이전/이후 비교), 전체 선택/해제, 일괄 적용, 닫기

---

## 스타일 시스템

`StyleResolver`가 WASM Theme을 CSS로 변환합니다:

```css
[data-style="s0"] { margin-top: 0; text-indent: 10pt; ... }
[data-run-style="s1"] { font-size: 12pt; font-family: '맑은 고딕'; ... }
```

`<style id="hwpx-theme-styles">`로 DOM에 주입되며, Slate 요소의 `data-style` / `data-run-style` 속성으로 적용됩니다.

---

## 툴바 훅

### `useToolbarActions()`

파일 로드/직렬화/undo-redo를 담당합니다.

```typescript
interface ToolbarActions {
  loadFile: (file: File) => Promise<void>;
  loadBytes: (data: Uint8Array, filename: string) => Promise<void>;
  serialize: () => Uint8Array;
  undo: () => boolean;   // 성공 여부 반환
  redo: () => boolean;
  canUndo: boolean;      // useSyncExternalStore로 반응형
  canRedo: boolean;
  editorReady: boolean;
}
```

### `useDocumentStyle()`

문서 전체 테마 스타일을 조회하고 수정합니다.

```typescript
interface UseDocumentStyleReturn {
  styles: DocumentStyleEntry[];  // 테마 전체 스타일 목록
  theme: Theme;                  // 현재 WASM Theme 객체
  updateStyle: (styleKey, character?, paragraph?, border?) => void;  // 수정 후 CSS 갱신 + 에디터 리로드
  setTheme: (theme: Theme) => void;   // 테마 전체 교체
  resetTheme: () => void;             // 테마 초기화
}

interface DocumentStyleEntry {
  styleKey: string;
  character: CharacterStyle | undefined;
  paragraph: ParagraphStyle | undefined;
  border: BorderStyle | undefined;
  composite: Style;  // 원본 composite 스타일
}
```

### `useParagraphStyle()`

문단 스타일 드롭다운에 사용됩니다. `/^l\d+$/` 패턴에 매칭되는 스타일만 표시합니다.

```typescript
interface UseParagraphStyleReturn {
  currentStyleKey: string | null;         // 현재 커서 위치 문단의 스타일 키 (useSyncExternalStore로 반응형)
  options: ParagraphStyleOption[];        // 사용 가능한 스타일 목록
  setStyle: (styleKey: string) => void;   // 선택된 문단 + 하위 run의 style 변경
}

interface ParagraphStyleOption {
  styleKey: string;            // e.g. "l1", "l2"
  displayName: string;        // e.g. "대제목", "소제목", "본문", "캡션"
  mark: Mark | undefined;     // 글머리 기호
  character: CharacterStyle | undefined;
  paragraph: ParagraphStyle | undefined;
  cssStyle: CSSProperties;    // 미리보기용 CSS (fontSize, fontWeight 등)
}
```

### `useInlineParagraphStyle()`

현재 커서 위치 문단의 인라인 스타일 속성을 읽고 수정합니다.

```typescript
interface UseInlineParagraphStyleReturn {
  values: InlineParagraphStyleValues;
  setParagraphProperty: (property: keyof ParagraphStyle, value) => void;
  setCharacterProperty: (property: keyof CharacterStyle, value) => void;
}

interface InlineParagraphStyleValues {
  styleKey: string | null;
  lineSpacing: number | null;     // 줄간격
  align: AlignType | null;        // 정렬
  marginTop: number | null;       // 문단 위 간격
  marginBottom: number | null;    // 문단 아래 간격
  mark: Mark | undefined | null;  // 글머리 기호
  outdent: number | null;         // 들여쓰기
  fontFace: string[] | null;      // 글꼴
  fontSize: number | null;        // 글꼴 크기
  bold: boolean | null;           // 굵게
}
```

**인라인 스타일 메커니즘**: 현재 스타일에서 character/paragraph 속성을 복사한 뒤 요청된 속성만 변경하고, `store.addStyle()`로 새 스타일 키를 생성하여 적용. WASM이 동일 스타일 자동 감지(멱등)하므로 hintKey 불필요. 다중 문단 선택 시 styleKey별로 그룹화하여 각 그룹에 독립적인 인라인 스타일 생성. 직접 자식 run만 변경하여 테이블 내부 paragraph의 외부 run 매칭 방지.

---

## DocumentStore API

| 메서드 | 설명 |
|--------|------|
| `load(data, filename)` | HWPX 바이트 배열 + 파일명으로 문서 로드 |
| `loadFromBytes(data, format?)` | 바이트 배열 + 포맷(`'hwpx'` \| `'docx'`, 기본 `'hwpx'`)으로 로드 |
| `getPageProperties()` | 페이지 크기/마진 반환 (`PageProperties \| null`) |
| `getIr()` | IR XML 문자열 배열 반환 |
| `getRefIds()` | DFS 순서 refId 배열 반환 |
| `applyActions(actions)` | Action 배열을 WASM에 적용 (refId 갱신은 호출자가 `refreshRefIds()`로 수행) |
| `refreshRefIds()` | refId 재할당 (`removeRefId()` + `addRefId()`) |
| `serialize()` | HWPX 바이트 배열로 직렬화 |
| `getHtml()` / `getXml()` | HTML/XML 변환 결과 반환 |
| `extractText()` | 텍스트만 추출 |
| `getTheme()` | 현재 Theme 반환 |
| `setTheme(theme)` | 테마 교체 + onChange 트리거 |
| `setThemeSilent(theme)` | 테마 교체 (onChange 미트리거, 초기 로드용) |
| `resetTheme()` | 테마 기본값 초기화 |
| `addStyle(character?, paragraph?, border?)` | 새 스타일 추가 (멱등: 동일 스타일 존재 시 기존 키 반환) |
| `updateStyle(styleKey, character?, paragraph?, border?)` | 기존 스타일 수정 |
| `getImageData(name)` | 이미지 바이너리 데이터 반환 (`Uint8Array \| null`) |
| `loadImageDoc()` / `freeImageDoc()` | 이미지 조회용 Document 캐시 생성/해제 (다수 이미지 조회 시 한 번만 파싱) |
| `onStoreChange(listener)` | 변경 리스너 등록 (unsubscribe 함수 반환) |
| `beginTransaction()` / `commitTransaction()` | 트랜잭션 관리 (notifyChange 억제, commit 시 한 번 발생) |
| `isTransacting` | 트랜잭션 활성 여부 (getter) |
| `dispose()` | 리소스 해제 (Processor, imageDoc, rawBytes, 리스너) |

---

## WASM 연동 포인트

| WASM 메서드 | 용도 |
|-------------|------|
| `loadFromData(filename, bytes)` | 파일명 + 바이트로 Document 로드 |
| `loadFromBytes(bytes, format)` | 바이트 + 포맷 문자열로 Document 로드 |
| `getProcessor(doc)` | Processor 획득 |
| `processor.toActionNodes()` | IR XML 배열 반환 |
| `processor.getRefIds()` | DFS 순서 refId 배열 |
| `processor.addRefId()` / `removeRefId()` | refId 부여/제거 |
| `processor.apply(actions)` | 액션 적용 |
| `processor.getTheme()` / `setTheme()` / `resetTheme()` | 테마 조회/설정/초기화 |
| `processor.addStyle(char, para, border)` | 새 스타일 추가 (멱등, 실제 키 반환) |
| `processor.updateStyle(key, char, para, border)` | 기존 스타일 수정 |
| `processor.toBytes()` / `toHtml()` / `toXml()` | 직렬화 |
| `processor.extractText()` | 텍스트 추출 |
| `doc.getPageProperties()` | 페이지 속성 조회 |
| `doc.getImageDataByName(name)` | 이미지 바이너리 추출 |

---

## 주의사항

- **DFS 순서 일관성**: `applyRefIdsFromFlat()`의 순회 순서와 WASM의 `getRefIds()` 순서가 반드시 일치해야 합니다. 새 요소 타입 추가 시 양쪽 모두 수정 필요.
- **연속 ADD 병합**: 스트리밍 시 동일 refId/position의 ADD를 개별 적용하면 WASM 내부 순서가 뒤집힙니다. `pushAction()`의 병합 로직 유지 필수.
- **shallow 캐시**: 테이블 내부 변경이 단락 UPDATE를 발생시키지 않도록 `slateNodeToIrXmlShallow()`로 비교합니다.
- **void 요소**: `pic`은 Slate void element이므로 children 조작 불가.
- **셀 선택 상태 관리**: 셀 선택 상태는 React state가 아닌 ref + DOM data attribute(`data-cell-selected`, `data-cell-selecting`)로 관리. 불필요한 리렌더링 방지.
- **`__bypassTableLock`**: 셀 내용 초기화 시 `withTableStructureLock`을 우회하기 위해 `(editor as any).__bypassTableLock = true` 설정 필요.
- **selection-only 변경 최적화**: `onChange`에서 `set_selection` 연산만 있는 경우 비싼 XML 직렬화/비교를 스킵하여 키 입력 시 지연 방지.
- **rAF 배칭과 flush 규칙**: `dispatchDirty`는 rAF로 지연 실행됩니다. WASM 상태를 읽는 모든 곳(`serialize`, `startStreaming` 등)에서 `dispatcher.flush()`를 먼저 호출해야 합니다. `reloadEditor`/`doLoad`처럼 Slate 트리를 WASM에서 새로 구축하는 경우에는 `dispatcher.cancelPending()`으로 stale sync를 폐기합니다.
