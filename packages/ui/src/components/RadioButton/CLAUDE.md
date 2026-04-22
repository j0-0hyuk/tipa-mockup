# RadioButton

라디오 버튼 컴포넌트입니다.

## 사용법

```typescript
import { RadioButton } from '@docs-front/ui';
```

## 예시

```tsx
<RadioButton
  name="option"
  value="a"
  checked={selected === 'a'}
  onChange={() => setSelected('a')}
>
  옵션 A
</RadioButton>
<RadioButton
  name="option"
  value="b"
  checked={selected === 'b'}
  onChange={() => setSelected('b')}
>
  옵션 B
</RadioButton>
```

## Props

| Prop | Type | 설명 |
|------|------|------|
| `name` | `string` | 라디오 그룹 이름 |
| `value` | `string` | 값 |
| `checked` | `boolean` | 선택 상태 |
| `onChange` | `() => void` | 변경 콜백 |
| `disabled` | `boolean` | 비활성화 상태 |
| `children` | `ReactNode` | 라벨 텍스트 |
