# IconButton

Button을 상속받은 디자인 시스템 컴포넌트입니다. **padding이 y 기준으로 x가 동일**하게 설정됩니다.

## 사용법

```typescript
import { IconButton } from '@docs-front/ui';
import type {
  IconButtonProps,
  ButtonVariant,
  ButtonSize
} from '@docs-front/ui';
```

## 예시

```tsx
// Icon만 사용
<IconButton variant="filled" size="large">
  <LuX size={24} />
</IconButton>

// Icon + Text (gap: 0)
<IconButton variant="outlined" size="medium">
  <LuPlus size={20} />
  <span>추가</span>
</IconButton>
```

## Button과의 차이점

| 항목        | Button             | IconButton                    |
| ----------- | ------------------ | ----------------------------- |
| **padding** | size별 (y, x)      | large 12px / medium 10px / small 8px (정사각형) |
| **gap**     | `8px`              | `0`                           |

**나머지는 Button과 동일**합니다:

- Variant: `filled`, `outlined`, `text`
- Size: `large`, `medium`, `small`
- 색상, hover/active, disabled 상태 모두 동일

## Padding (디자인 시스템)

| Size   | IconButton padding |
| ------ | ------------------ |
| large  | `12px`             |
| medium | `10px`             |
| small  | `8px`              |

## Props

Button과 동일합니다. `ButtonProps`를 참고하세요.

| Prop       | Type                                      | 필수 | 설명                                   |
| ---------- | ----------------------------------------- | ---- | -------------------------------------- |
| `variant`  | `ButtonVariant`                           | ✅   | `'filled'` \| `'outlined'` \| `'text'` |
| `size`     | `ButtonSize`                              | ✅   | `'large'` \| `'medium'` \| `'small'`   |
| `type`     | `'button' \| 'submit' \| 'reset'`         | ❌   | 기본값 `'button'`                      |
| `disabled` | `boolean`                                 | ❌   | 비활성화                               |
| `children` | `ReactNode`                               | ❌   | 아이콘 또는 아이콘+텍스트              |
| ...        | `ButtonHTMLAttributes<HTMLButtonElement>` | ❌   | onClick, className 등                  |
