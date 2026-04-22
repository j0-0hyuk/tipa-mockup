# TextArea

> **⚠️ Deprecated 예정**  
> 이 컴포넌트는 향후 제거될 예정입니다. 대신 `TextField` 컴포넌트를 사용해주세요.  
> `TextField`는 단일 라인과 다중 라인 입력을 모두 지원하며, 더 풍부한 기능과 일관된 API를 제공합니다.
>
> **마이그레이션 예시:**
>
> ```tsx
> // 기존
> <TextArea placeholder="내용을 입력해주세요" />
>
> // 새로운 방식
> <TextField multiline placeholder="내용을 입력해주세요" />
> ```

여러 줄 텍스트 입력 컴포넌트입니다.

## 사용법

```typescript
import { TextArea } from '@docs-front/ui';
```

## 예시

```tsx
<TextArea
  placeholder="내용을 입력해주세요"
  width="100%"
  height={120}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

## Props

| Prop          | Type                 | 설명          |
| ------------- | -------------------- | ------------- |
| `placeholder` | `string`             | 플레이스홀더  |
| `width`       | `string \| number`   | 너비          |
| `height`      | `number`             | 높이          |
| `value`       | `string`             | 값            |
| `onChange`    | `ChangeEventHandler` | 변경 콜백     |
| `disabled`    | `boolean`            | 비활성화 상태 |
