# Badge

뱃지 컴포넌트입니다.

## 사용법

```typescript
import { Badge } from '@docs-front/ui';
```

## 예시

```tsx
<Badge $bgColor="main" $color="white">NEW</Badge>
<Badge $bgColor="error" $color="white">HOT</Badge>
```

## Props

| Prop | Type | 설명 |
|------|------|------|
| `$bgColor` | `ColorKey` | 배경색 |
| `$color` | `ColorKey` | 텍스트 색상 |
| `children` | `ReactNode` | 뱃지 텍스트 |
