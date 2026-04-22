# Flex

Flexbox 레이아웃 컴포넌트입니다.

## 사용법

```typescript
import { Flex } from '@docs-front/ui';
```

## 예시

```tsx
<Flex direction="column" gap={16} justify="center" alignItems="center">
  {children}
</Flex>
```

## Props

| Prop | Type | 설명 |
|------|------|------|
| `direction` | `'row' \| 'column'` | flex-direction |
| `gap` | `number` | 간격 (px) |
| `justify` | `'flex-start' \| 'center' \| 'flex-end' \| 'space-between'` | justify-content |
| `alignItems` | `'flex-start' \| 'center' \| 'flex-end' \| 'stretch'` | align-items |
| `width` | `string \| number` | 너비 |
| `height` | `string \| number` | 높이 |
| `padding` | `string` | 패딩 |
