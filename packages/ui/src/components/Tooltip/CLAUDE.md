# Tooltip

툴팁 컴포넌트입니다.

## 사용법

```typescript
import { Tooltip } from '@docs-front/ui';
```

## 예시

```tsx
<Tooltip content="도움말 텍스트" side="top" placement={6}>
  <Button>Hover me</Button>
</Tooltip>
```

## Props

| Prop        | Type                                     | 설명                                    |
| ----------- | ---------------------------------------- | --------------------------------------- |
| `content`   | `string \| null`                         | 툴팁 내용 (`''` 또는 `null`이면 미표시) |
| `side`      | `'top' \| 'right' \| 'bottom' \| 'left'` | 툴팁 방향                               |
| `placement` | `number`                                 | 트리거와의 간격 (기본 5)                |
| `children`  | `ReactNode`                              | 트리거 요소                             |
