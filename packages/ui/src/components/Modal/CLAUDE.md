# Modal

> **⚠️ Deprecated**: 이 컴포넌트는 deprecated 예정입니다. 새로운 프로젝트나 기능에는 **Dialog 컴포넌트**를 사용해주세요.
> Dialog 컴포넌트는 더 범용적이고 유연한 구조를 제공합니다.

## 사용법

```typescript
import { Modal } from '@docs-front/ui';
```

## 예시

```typescript
<Modal isOpen={isOpen} onClose={onClose}>
  <Modal.Header title="Title" icon={<LuInfo />} />
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>
    <Flex gap={8} justify="flex-end">
      <Modal.CancelButton>Cancel</Modal.CancelButton>
      <Modal.ConfirmButton>Confirm</Modal.ConfirmButton>
    </Flex>
  </Modal.Footer>
</Modal>
```

## 확인 모달 패턴

```typescript
<Modal isOpen={isOpen} onClose={onClose}>
  <Modal.Header icon={<LuTrash2 size={20} />} title="삭제 확인" />
  <Modal.Body>
    <p>정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
  </Modal.Body>
  <Modal.Footer>
    <Flex gap={8} justify="flex-end">
      <Modal.CancelButton>취소</Modal.CancelButton>
      <Modal.ConfirmButton onClick={handleDelete}>삭제</Modal.ConfirmButton>
    </Flex>
  </Modal.Footer>
</Modal>
```

## Props

### Modal

| Prop      | Type         | 설명           |
| --------- | ------------ | -------------- |
| `isOpen`  | `boolean`    | 모달 열림 상태 |
| `onClose` | `() => void` | 닫기 콜백      |

### Modal.Header

| Prop              | Type        | 설명                             |
| ----------------- | ----------- | -------------------------------- |
| `title`           | `string`    | 제목                             |
| `icon`            | `ReactNode` | 아이콘                           |
| `showCloseButton` | `boolean`   | 닫기 버튼 표시 여부 (기본: true) |

### Modal.CancelButton / Modal.ConfirmButton

| Prop      | Type         | 설명                            |
| --------- | ------------ | ------------------------------- |
| `onClick` | `() => void` | 클릭 콜백 (없으면 onClose 호출) |
