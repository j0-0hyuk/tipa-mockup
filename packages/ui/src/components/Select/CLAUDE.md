# Select

드롭다운 선택 컴포넌트입니다.

## 사용법

```typescript
import { Select } from '@docs-front/ui';
```

## 예시

```tsx
<Select
  options={[
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' }
  ]}
  value={selected}
  onChange={setSelected}
/>
```

## Props

| Prop | Type | 설명 |
|------|------|------|
| `options` | `{ value: string; label: string }[]` | 옵션 목록 |
| `value` | `string` | 선택된 값 |
| `onChange` | `(value: string) => void` | 변경 콜백 |
| `placeholder` | `string` | 플레이스홀더 |
| `disabled` | `boolean` | 비활성화 상태 |
