# Toggle

토글 스위치 컴포넌트입니다.

## 사용법

```typescript
import { Toggle } from '@docs-front/ui';
```

## 예시

```tsx
<Toggle checked={enabled} onChange={setEnabled} />
```

## Props

| Prop | Type | 설명 |
|------|------|------|
| `checked` | `boolean` | 활성화 상태 |
| `onChange` | `(checked: boolean) => void` | 변경 콜백 |
| `disabled` | `boolean` | 비활성화 상태 |
