# Form

react-hook-form과 통합된 폼 컴포넌트입니다.

## 사용법

```typescript
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  TipFormLabel
} from '@docs-front/ui';
```

## 예시

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다')
});

type FormValues = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem required>
            <FormLabel>이메일</FormLabel>
            <FormControl>
              <Input placeholder="example@email.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem required>
            <FormLabel>비밀번호</FormLabel>
            <FormControl>
              <Input type="password" placeholder="비밀번호 입력" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" $bgColor="main" $color="white">
        제출
      </Button>
    </Form>
  );
}
```

## 구성 요소

### Form

폼 컨테이너. react-hook-form의 FormProvider를 래핑합니다.

| Prop | Type | 설명 |
|------|------|------|
| `form` | `UseFormReturn<T>` | useForm 반환값 |
| `onSubmit` | `SubmitHandler<T>` | 제출 핸들러 |
| `$labelTypo` | `TypographyKey` | 라벨 타이포그래피 |

### FormField

react-hook-form의 Controller를 래핑합니다.

| Prop | Type | 설명 |
|------|------|------|
| `control` | `Control<T>` | form.control |
| `name` | `string` | 필드 이름 |
| `render` | `({ field }) => ReactNode` | 렌더 함수 |

### FormItem

폼 필드 컨테이너.

| Prop | Type | 설명 |
|------|------|------|
| `required` | `boolean` | 필수 여부 (라벨에 표시) |
| `tooltip` | `string \| string[]` | 툴팁 내용 |

### FormLabel

폼 필드 라벨. required가 true면 "(필수)" 텍스트 표시.

### TipFormLabel

툴팁이 있는 폼 필드 라벨.

| Prop | Type | 설명 |
|------|------|------|
| `tipLabel` | `string` | 팁 라벨 텍스트 |

### FormControl

폼 컨트롤 래퍼. aria 속성을 자동으로 설정합니다.

### FormMessage

에러 메시지 표시. 애니메이션과 함께 표시/숨김됩니다.

### FormDescription

폼 필드 설명 텍스트.
