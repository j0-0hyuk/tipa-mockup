# Skeleton

스켈레톤 로딩 컴포넌트입니다.

## 사용법

```typescript
import { Skeleton } from '@docs-front/ui';
```

## 예시

```tsx
<Skeleton width={200} height={20} />
<Skeleton width="100%" height={40} borderRadius="md" />

// 스켈레톤 로딩 패턴
{isLoading ? (
  <Flex direction="column" gap={12}>
    <Skeleton width="60%" height={24} />
    <Skeleton width="100%" height={16} />
    <Skeleton width="80%" height={16} />
  </Flex>
) : (
  <Content />
)}
```

## Props

| Prop | Type | 설명 |
|------|------|------|
| `width` | `string \| number` | 너비 |
| `height` | `number` | 높이 |
| `borderRadius` | `BorderRadiusKey` | 테두리 둥글기 |
