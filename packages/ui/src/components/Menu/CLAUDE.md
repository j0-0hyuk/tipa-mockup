# Menu

드롭다운 메뉴 컴포넌트입니다.

## 사용법

```typescript
import { Menu, MenuTrigger, MenuContent, MenuItem } from '@docs-front/ui';
```

## 예시

```tsx
<Menu>
  <MenuTrigger>
    <button type="button">Open</button>
  </MenuTrigger>
  <MenuContent>
    <MenuItem>Menu item</MenuItem>
    <MenuItem trailingIcon>More</MenuItem>
  </MenuContent>
</Menu>
```

## Props

### MenuItem

| Prop | Type | 설명 |
|------|------|------|
| `leadingIcon` | `ReactNode` | 왼쪽 아이콘 |
| `trailingIcon` | `boolean` | 오른쪽 Chevron 표시 여부 |
| `width` | `number \| string` | 메뉴 아이템 너비 (기본 120px) |
| `disabled` | `boolean` | 비활성화 상태 |
| `children` | `ReactNode` | 메뉴 텍스트 |
