---
name: ui-design
description: Implement front-end pages using the @bichon/ds design system with strict DS-only components, layout wrappers (Type A/B), and structured planning process.
---

### Core Rules (DS only)

- UI must be composed only with components from `@bichon/ds`.
- No raw HTML elements (`div`, `span`, `button`, `input`, etc.).
  - If you believe a raw element is unavoidable, **stop** and explain in one sentence what DS gap caused it and propose the smallest DS-side fix.
- No `style` / `className` / custom CSS. Use DS props + design tokens only.
- All layout + typography must be controlled via DS props/tokens only. No custom px values.

### Layout Enforcement

- Every new page must use exactly one wrapper:
  - `DocsHuntContentsPage` (Type A) OR
  - `DocsHuntChatbotPage` (Type B)
- Do not compose AppShell/SideNav/Main layout outside these wrappers.
- Do not change Type A padding (60) or Type B panel padding (20).

### Required Process (before code)

1. Choose Type A or B and give one-sentence rationale.
2. Write a DS Usage Plan: list the exact `@bichon/ds` components you will use.
3. Write a Hierarchy Plan (3 lines max):
   - Primary (top 3 items)
   - Secondary (top 3 items)
   - Tertiary (top 3 items)
4. Write a Structure Plan (max 5 lines):
   - Header: Title + 1-line intent + Primary CTA
   - Main pattern: **Top-line → Meta → Actions** (apply to lists/cards/sections)
   - Section order (top → bottom) in one sentence
5. Implement using only the plans. If you must deviate, update the plan first.

### Required States

- Implement loading / empty / error / success.
- Empty and Error must include at least one actionable CTA (e.g., Reset filters / Clear search / Retry), and the CTA must be wired (no placeholder buttons).
- A dev toggle for switching states is allowed, but it must be placed outside the page title area (not next to the title).
