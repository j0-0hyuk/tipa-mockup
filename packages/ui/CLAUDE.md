# @docs-front/ui 패키지 가이드

## 개요

공용 UI 컴포넌트 라이브러리입니다. Radix UI + Emotion 기반으로 구축되어 있습니다.

## 임포트

```typescript
import {
  // Layout
  Flex,
  Divider,
  // Form
  Button,
  Input,
  TextArea,
  Select,
  Checkbox,
  RadioButton,
  Toggle,
  // Feedback
  Modal,
  Toast,
  useToast,
  Tooltip,
  Spinner,
  Skeleton,
  Progress,
  // Display
  Avatar,
  Badge,
  Accordion,
  // Provider
  DocsThemeProvider
} from '@docs-front/ui';
```

## 테마 시스템

`useTheme()` 훅으로 테마에 접근합니다.

### Colors

| 용도   | ColorKey                                                                                        |
| ------ | ----------------------------------------------------------------------------------------------- |
| 브랜드 | `main`, `bgMain`, `brandBlue`, `brightBlue`                                                     |
| 기본   | `black`, `white`                                                                                |
| 배경   | `bgGray`, `bgLightGray`, `bgMediumGray`, `bgDarkGray`, `bgBlueGray`                             |
| 테두리 | `borderGray`, `borderLightGray`                                                                 |
| 텍스트 | `textGray`, `textGray2`, `textPlaceholder`, `textDisabled` (Disabled: grey-300)                 |
| 에러   | `error`, `errorBg`                                                                              |
| 차트   | `chartRed`, `chartOrange`, `chartYellow`, `chartGreen`, `chartBlue`, `chartPurple`, `chartPink` |

### Typography

- **Semi-bold**: `Sb_32`, `Sb_24`, `Sb_20`, `Sb_18`, `Sb_16`, `Sb_14`
- **Medium**: `Md_18`, `Md_16`, `Md_15`, `Md_14`, `Md_13`, `Md_12`
- **Regular**: `Rg_16`, `Rg_15`, `Rg_14`, `Rg_13`, `Rg_12`

### Border Radius

`xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`, `full`

---

## 컴포넌트

각 컴포넌트의 세부 사용법은 해당 폴더의 CLAUDE.md를 참조하세요.

### Layout

- [Flex](src/components/Flex/CLAUDE.md)
- [Divider](src/components/Divider/CLAUDE.md)

### Form

- [Form](src/components/Form/CLAUDE.md) - react-hook-form 통합
- [Button](src/components/Button/CLAUDE.md)
- [Input](src/components/Input/CLAUDE.md)
- [TextArea](src/components/TextArea/CLAUDE.md)
- [Select](src/components/Select/CLAUDE.md)
- [Checkbox](src/components/Checkbox/CLAUDE.md)
- [RadioButton](src/components/RadioButton/CLAUDE.md)
- [Toggle](src/components/Toggle/CLAUDE.md)

### Feedback

- [Modal](src/components/Modal/CLAUDE.md)
- [Toast](src/components/Toast/CLAUDE.md)
- [Tooltip](src/components/Tooltip/CLAUDE.md)
- [Spinner](src/components/Spinner/CLAUDE.md)
- [Skeleton](src/components/Skeleton/CLAUDE.md)
- [Progress](src/components/Progress/CLAUDE.md)

### Display

- [Avatar](src/components/Avatar/CLAUDE.md)
- [Badge](src/components/Badge/CLAUDE.md)
- [Accordion](src/components/Accordion/CLAUDE.md)

---

## UI 패턴

### 로딩 상태

```tsx
{
  isLoading ? (
    <Flex justify="center" alignItems="center" padding="40px">
      <Spinner size={32} />
    </Flex>
  ) : (
    <Content />
  );
}
```

### 스켈레톤 로딩

```tsx
{
  isLoading ? (
    <Flex direction="column" gap={12}>
      <Skeleton width="60%" height={24} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="80%" height={16} />
    </Flex>
  ) : (
    <Content />
  );
}
```

### 폼 레이아웃

```tsx
<Flex direction="column" gap={16}>
  <Flex direction="column" gap={4}>
    <label>이메일</label>
    <Input type="email" placeholder="example@email.com" />
  </Flex>
  <Button $bgColor="main" $color="white" $borderRadius="md" width="100%">
    로그인
  </Button>
</Flex>
```

### 버튼 그룹

```tsx
<Flex gap={8}>
  <Button $bgColor="main" $color="white" $borderRadius="md">
    저장
  </Button>
  <Button $borderColor="borderGray" $color="black" $borderRadius="md">
    취소
  </Button>
</Flex>
```

### 빈 상태

```tsx
<Flex
  direction="column"
  justify="center"
  alignItems="center"
  padding="60px"
  gap={16}
>
  <LuInbox size={48} color={theme.color.textGray} />
  <p style={{ color: theme.color.textGray }}>데이터가 없습니다</p>
</Flex>
```

### 에러 상태

```tsx
<Flex
  padding="16px"
  style={{
    backgroundColor: theme.color.errorBg,
    borderRadius: theme.borderRadius.md
  }}
>
  <Flex gap={8} alignItems="center">
    <LuCircleAlert size={20} color={theme.color.error} />
    <span style={{ color: theme.color.error }}>오류가 발생했습니다.</span>
  </Flex>
</Flex>
```
