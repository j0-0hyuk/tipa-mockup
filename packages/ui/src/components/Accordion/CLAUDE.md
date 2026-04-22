# Accordion

아코디언 컴포넌트입니다.

## 사용법

```tsx
import { Accordion } from '@docs-front/ui';
```

## 예시

```tsx
<Accordion>
  <Accordion.Item>
    <Accordion.Trigger>섹션 1</Accordion.Trigger>
    <Accordion.Content>내용 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Trigger>섹션 2</Accordion.Trigger>
    <Accordion.Content>내용 2</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## 구성 요소

- `Accordion` - 컨테이너
- `Accordion.Item` - 개별 아이템
- `Accordion.Trigger` - 클릭 트리거 (제목)
- `Accordion.Content` - 펼쳐지는 내용
