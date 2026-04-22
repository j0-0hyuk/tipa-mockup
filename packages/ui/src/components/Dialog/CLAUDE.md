# Dialog

**Modal 컴포넌트를 대체하는 새로운 다이얼로그 컴포넌트입니다.** 간단한 확인/경고 다이얼로그에 최적화되어 있으며, Footer는 외부에서 자유롭게 구성할 수 있어 범용성이 높습니다.

## 사용법

```typescript
import { Dialog, Button } from '@docs-front/ui';
```

## 예시

### 기본 사용법

```tsx
<Dialog isOpen={isOpen} onClose={onClose}>
  <Dialog.title>제목</Dialog.title>
  <Dialog.content>내용</Dialog.content>
  <Dialog.footer>
    <Button variant="outlined" onClick={onCancel}>
      취소
    </Button>
    <Button variant="filled" onClick={onConfirm}>
      확인
    </Button>
  </Dialog.footer>
</Dialog>
```

### 삭제 확인 다이얼로그 (useModal 훅과 함께 사용)

```tsx
import { Dialog, Button } from '@docs-front/ui';
import { useModal } from '@/hooks/useModal';

const MyComponent = () => {
  const { openModal, closeModal, isOpen } = useModal();

  const handleOpen = () => {
    openModal(({ isOpen, onClose }) => (
      <Dialog isOpen={isOpen} onClose={onClose}>
        <Dialog.title>삭제 확인</Dialog.title>
        <Dialog.content>
          정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </Dialog.content>
        <Dialog.footer>
          <Button variant="outlined" width="100%" onClick={onClose}>
            취소
          </Button>
          <Button variant="warning" width="100%" onClick={handleDelete}>
            삭제
          </Button>
        </Dialog.footer>
      </Dialog>
    ));
  };

  return <button onClick={handleOpen}>삭제</button>;
};
```

### 경고 다이얼로그

```tsx
<Dialog isOpen={isOpen} onClose={onClose}>
  <Dialog.title>경고</Dialog.title>
  <Dialog.content>
    이 작업을 수행하면 데이터가 손실될 수 있습니다.
  </Dialog.content>
  <Dialog.footer>
    <Button variant="outlined" width="100%" onClick={onClose}>
      취소
    </Button>
    <Button variant="warning" width="100%" onClick={handleConfirm}>
      계속하기
    </Button>
  </Dialog.footer>
</Dialog>
```

## Props

### Dialog

| Prop       | Type         | 필수 | 설명                                              |
| ---------- | ------------ | ---- | ------------------------------------------------- |
| `isOpen`   | `boolean`    | ✅   | 다이얼로그 열림 상태                              |
| `onClose`  | `() => void` | ✅   | 닫기 콜백                                         |
| `children` | `ReactNode`  | ✅   | `Dialog.title`, `Dialog.content`, `Dialog.footer` |

### Dialog.title

| Prop       | Type        | 필수 | 설명        |
| ---------- | ----------- | ---- | ----------- |
| `children` | `ReactNode` | ✅   | 제목 텍스트 |

### Dialog.content

| Prop       | Type        | 필수 | 설명                                      |
| ---------- | ----------- | ---- | ----------------------------------------- |
| `children` | `ReactNode` | ✅   | 내용 (텍스트뿐만 아니라 다른 요소도 가능) |

### Dialog.footer

| Prop       | Type        | 필수 | 설명                            |
| ---------- | ----------- | ---- | ------------------------------- |
| `children` | `ReactNode` | ✅   | Footer 내용 (일반적으로 버튼들) |

## 스타일

- **바깥 컨테이너**: `border: 1px solid lineDefault`, `borderRadius: 16px`, `bg: white`, `padding: 20px`
- **헤더**: 제목과 닫기 버튼이 `space-between`으로 배치
- **콘텐츠**: 자유로운 레이아웃 가능
- **푸터**: 버튼들을 배치하는 영역 (일반적으로 `gap: 8px`, 버튼은 `width: 100%`)

## Modal과의 차이점

- **범용성**: Footer를 외부에서 자유롭게 구성 가능
- **단순성**: 확인/경고 다이얼로그에 최적화
- **유연성**: 버튼 텍스트, 개수, 스타일을 자유롭게 설정 가능

## 가이드라인

- 간단한 확인/경고 다이얼로그에 사용
- Footer의 버튼은 일반적으로 `width: 100%`로 설정하여 균등하게 배치
- 삭제/경고 액션에는 `variant="warning"` 버튼 사용
- `useModal` 훅과 함께 사용하면 상태 관리가 편리함
