# Spinner

로딩 스피너 컴포넌트입니다.

## 사용법

```typescript
import { Spinner } from '@docs-front/ui';
```

## 예시

```tsx
<Spinner size={24} />

// 로딩 상태 패턴
{isLoading ? (
  <Flex justify="center" alignItems="center" padding="40px">
    <Spinner size={32} />
  </Flex>
) : (
  <Content />
)}
```

## Props

| Prop | Type | 설명 |
|------|------|------|
| `size` | `number` | 크기 (px) |
