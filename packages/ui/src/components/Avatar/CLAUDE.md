# Avatar

아바타 컴포넌트입니다.

## 사용법

```typescript
import { Avatar } from '@docs-front/ui';
```

## 예시

```tsx
// 이미지 아바타
<Avatar src={imageUrl} size={40} />

// 이니셜 아바타
<Avatar name="홍길동" size={40} />
```

## Props

| Prop | Type | 설명 |
|------|------|------|
| `src` | `string` | 이미지 URL |
| `name` | `string` | 이름 (이니셜 표시용) |
| `size` | `number` | 크기 (px) |
