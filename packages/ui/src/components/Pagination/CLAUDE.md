# Pagination

페이지네이션 디자인 시스템 컴포넌트입니다. 양옆 Chevron(IconButton small, 24px 아이콘), 페이지 번호 버튼(StyledPaginationButton), 생략 표시(IconButton + Ellipsis 24px, 항상 disabled)로 구성됩니다.

## 사용법

```typescript
import { Pagination } from '@docs-front/ui';
import type { PaginationProps } from '@docs-front/ui';
```

## 예시

```tsx
<Pagination
  currentPage={page}
  totalPage={totalPages}
  onPageChange={(newPage) => setPage(newPage)}
/>

// siblingCount로 좌우에 보일 페이지 개수 조절 (기본 1)
<Pagination
  currentPage={page}
  totalPage={totalPages}
  onPageChange={setPage}
  siblingCount={2}
/>
```

## Props

| Prop           | Type                     | 필수 | 설명                               |
| -------------- | ------------------------ | ---- | ---------------------------------- |
| `currentPage`  | `number`                 | ✅   | 현재 페이지 (1-based)              |
| `totalPage`    | `number`                 | ✅   | 전체 페이지 수                     |
| `onPageChange` | `(page: number) => void` | ✅   | 페이지 변경 콜백                   |
| `siblingCount` | `number`                 | ❌   | 현재 페이지 좌우 노출 개수(기본 1) |

## 스타일 (신규 디자인 시스템)

- **컨테이너**: `gap: 8px` (theme.spacing.sm)
- **Chevron**: IconButton variant="text", size="small", 아이콘 24px
- **페이지 버튼**: border 없음, border-radius 8px, padding 8.5px, Md_15, 텍스트 23×23 박스. active 시 bgMediumGrey + textPrimary, 비활성 시 textTertiary
- **Dots(...)**: IconButton variant="text", size="small", Ellipsis 아이콘 24px, 항상 disabled
