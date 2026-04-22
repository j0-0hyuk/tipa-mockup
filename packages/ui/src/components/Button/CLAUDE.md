# Button

사전에 정의된 **variant**와 **size**만 사용합니다. 스타일·크기를 임의로 만들거나 변경하지 않습니다.

## 사용법

```typescript
import { Button } from '@docs-front/ui';
import type { ButtonProps, ButtonVariant, ButtonSize } from '@docs-front/ui';
```

## 예시

```tsx
// Primary (filled)
<Button variant="filled" size="large">저장</Button>

// Secondary (outlined)
<Button variant="outlined" size="medium">취소</Button>

// Text
<Button variant="text" size="small">더보기</Button>

// HTML button props (type, onClick, disabled 등)
<Button variant="filled" size="large" type="submit" onClick={handleSubmit}>
  제출
</Button>

// Full width button
<Button variant="filled" size="medium" width="100%">
  전체 너비 버튼
</Button>
```

## Variant

| Variant      | enabled                                  | pressed/hovered          | disabled    |
| ------------ | ---------------------------------------- | ------------------------ | ----------- |
| **filled**   | bgAccent, text white                     | bgAccentDark, text white | opacity 50% |
| **outlined** | bgWhite, border lineDefault, textPrimary | 동일                     | opacity 50% |
| **text**     | bg transparent, text textPrimary         | 동일                     | opacity 50% |

## Size

**filled / outlined**

| Size   | border-radius | typo  | padding (y, x) |
| ------ | ------------- | ----- | -------------- |
| large  | 10px          | Md_16 | 12px 16px      |
| medium | 8px           | Md_15 | 8.5px 16px     |
| small  | 8px           | Md_14 | 5.5px 12px     |

**text**

| Size   | padding (y, x) |
| ------ | -------------- |
| large  | 12px 8px       |
| medium | 8.5px 8px      |
| small  | 8px 6px        |

## Props

| Prop       | Type                                      | 필수 | 설명                                   |
| ---------- | ----------------------------------------- | ---- | -------------------------------------- |
| `variant`  | `ButtonVariant`                           | ✅   | `'filled'` \| `'outlined'` \| `'text'` |
| `size`     | `ButtonSize`                              | ✅   | `'large'` \| `'medium'` \| `'small'`   |
| `width`    | `string \| number`                        | ❌   | 기본값 `'fit-content'` (예: `'100%'`, `'200px'`, `200`) |
| `type`     | `'button' \| 'submit' \| 'reset'`         | ❌   | 기본값 `'button'`                      |
| `disabled` | `boolean`                                 | ❌   | 비활성화                               |
| `children` | `ReactNode`                               | ❌   | 버튼 내용                              |
| ...        | `ButtonHTMLAttributes<HTMLButtonElement>` | ❌   | onClick, className 등                  |

**참고**: `width`는 기본적으로 `fit-content`이지만, props로 설정할 수 있습니다. `height`는 `fit-content`로 고정되어 있습니다.

## 가이드라인

- 한 화면에는 **Primary(filled) Button을 하나만** 사용
- 삭제·탈퇴 등 **파괴적 행동**에는 Primary 사용 금지
- 주요 행동이 아니면 **Secondary(outlined)** 또는 **Text** 사용
- 강조도가 낮거나 인라인 액션에는 **Text** 사용
- 동일한 맥락에서 Primary Button **위치를 일관되게** 유지
- 한 화면에서 서로 다른 Button **정렬 패턴을 섞지 않음**
