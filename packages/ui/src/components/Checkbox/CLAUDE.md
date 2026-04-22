# Checkbox

Radix UI 기반 체크박스. 뉴 디자인시스템의 size(large/medium/small)와 상태(selected, unselected, pressed, disabled)를 지원합니다.

## 사용법

```typescript
import { Checkbox } from '@docs-front/ui';
import type { CheckboxProps, CheckboxSize } from '@docs-front/ui';
```

## 예시

```tsx
<Checkbox
  size="medium"
  checked={checked}
  onCheckedChange={(value) => setChecked(value === true)}
>
  약관에 동의합니다
</Checkbox>
```

## Props

| Prop              | Type                                            | 필수 | 설명                                                   |
| ----------------- | ----------------------------------------------- | ---- | ------------------------------------------------------ |
| `size`            | `CheckboxSize`                                  | ❌   | `'large'` \| `'medium'` \| `'small'` (기본 `'medium'`) |
| `checked`         | `boolean \| 'indeterminate'`                    | ❌   | 제어 모드 체크 상태                                    |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | ❌   | 체크 변경 콜백                                         |
| `disabled`        | `boolean`                                       | ❌   | 비활성화                                               |
| `id`              | `string`                                        | ❌   | label htmlFor 연결용                                   |
| `children`        | `ReactNode`                                     | ❌   | 라벨(오른쪽에 배치)                                    |

그 외 [Radix Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox) Root와 동일한 props 지원.

## 상태 (신규 디자인시스템)

| 상태           | 스타일                                                                |
| -------------- | --------------------------------------------------------------------- |
| **unselected** | bgWhite, border 1px lineDefault, 아이콘 없음                          |
| **selected**   | bgAccent, Check 아이콘 color white                                    |
| **pressed**    | selected 상태에서 클릭 중 → bgAccentDark, Check 아이콘 white          |
| **disabled**   | unselected와 동일 외관 + opacity 50%. **Label은 반드시 textDisabled** |

## Size (Button과 동일 체계)

| Size   | 박스    | border-radius | padding | 아이콘 영역 |
| ------ | ------- | ------------- | ------- | ----------- |
| large  | 20×20px | 5px           | 2px     | 16×16       |
| medium | 16×16px | 4px           | 2px     | 12×12       |
| small  | 12×12px | 3px           | 2px     | 8×8         |

## Do / Don't

**Do**

- Checkbox가 **disabled일 때는 반드시 Label 텍스트 색상을 textDisabled**로 사용합니다.
- 주요 행동을 유도할 때는 **Filled 버튼을 사용**하며, **항상 오른쪽에 배치**합니다.

**Don't**

- 주요 행동을 유도하는 Filled 버튼은 **왼쪽에 배치하지 않습니다**.
