# Toast

알림 토스트 컴포넌트입니다.

## 사용법

```typescript
import { useToast } from '@docs-front/ui';

const { open } = useToast();
open({ content: '저장되었습니다.', duration: 3000 });
```

## 예시

```tsx
// 기본 사용
open({ content: '저장되었습니다.', duration: 3000 });

// 커스텀 콘텐츠
open({
  content: (
    <Flex gap={8} alignItems="center">
      <LuCircleCheck color="green" />
      <span>성공적으로 저장되었습니다.</span>
    </Flex>
  ),
  duration: 5000
});
```

## Props

| Prop | Type | 설명 |
|------|------|------|
| `content` | `ReactNode` | 토스트 내용 |
| `duration` | `number` | 표시 시간 (ms) |
