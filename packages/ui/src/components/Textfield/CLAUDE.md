# TextField

**단일 라인 입력(input)과 다중 라인 입력(textarea)을 모두 지원하는 통합 텍스트 입력 컴포넌트입니다.** multiline prop을 통해 두 모드를 전환할 수 있으며, variant를 통해 다양한 상태를 표현할 수 있습니다.

## 사용법

```typescript
import { TextField } from '@docs-front/ui';
```

## 예시

### 기본 사용법

```tsx
// 단일 라인 입력
<TextField placeholder="이름을 입력하세요" />

// 다중 라인 입력
<TextField multiline minRows={2} placeholder="메시지를 입력하세요" />
```

### Variant 상태

```tsx
// 기본 상태
<TextField placeholder="기본 입력" variant="default" />

// 포커스 상태 (border가 lineAccent로 변경)
<TextField placeholder="포커스 상태" variant="focus" />

// 경고 상태 (border가 lineWarning으로 변경)
<TextField
  placeholder="이메일을 입력하세요"
  variant="warning"
  helperText="올바른 형식이 아닙니다"
/>

// 비활성화 상태 (전체 opacity 50%)
<TextField
  placeholder="비활성화된 입력"
  variant="disabled"
  disabled
/>
```

### Helper Text

```tsx
// 기본 Helper Text
<TextField
  placeholder="이름을 입력하세요"
  helperText="이름은 2자 이상 입력해주세요"
/>

// Warning 상태의 Helper Text (textWarning 색상)
<TextField
  placeholder="비밀번호를 입력하세요"
  variant="warning"
  helperText="비밀번호는 8자 이상이어야 합니다"
/>

// Helper Text 숨기기
<TextField
  placeholder="입력"
  helperText="이 텍스트는 표시되지 않습니다"
  showHelperText={false}
/>
```

### 다중 라인 모드

```tsx
// 기본 다중 라인 (minRows: 2)
<TextField multiline placeholder="메시지를 입력하세요" />

// 최소/최대 행 수 지정
<TextField
  multiline
  minRows={3}
  maxRows={8}
  placeholder="최대 8줄까지 자동 확장"
/>

// 고정 높이 (minRows === maxRows)
<TextField
  multiline
  minRows={5}
  maxRows={5}
  placeholder="고정 높이 텍스트 영역"
/>
```

### 너비 조정

```tsx
// 기본 너비 (375px)
<TextField placeholder="기본 너비" />

// 커스텀 너비 (문자열)
<TextField width="500px" placeholder="500px 너비" />

// 커스텀 너비 (숫자)
<TextField width={600} placeholder="600px 너비" />

// 전체 너비
<TextField width="100%" placeholder="전체 너비" />
```

### 실제 사용 예시 (폼)

```tsx
import { TextField } from '@docs-front/ui';
import { useState } from 'react';

const MyForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const validateName = (value: string) => {
    setNameError(value.length < 2);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <TextField
        placeholder="이름"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          validateName(e.target.value);
        }}
        variant={nameError && name.length > 0 ? 'warning' : 'default'}
        helperText={
          nameError && name.length > 0
            ? '이름은 2자 이상이어야 합니다'
            : '이름을 입력해주세요'
        }
      />
      <TextField
        placeholder="이메일"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        variant={emailError && email.length > 0 ? 'warning' : 'default'}
        helperText={
          emailError && email.length > 0
            ? '올바른 이메일 형식이 아닙니다'
            : '이메일을 입력해주세요'
        }
      />
      <TextField
        placeholder="메시지"
        multiline
        minRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        helperText={`${message.length}/500자`}
      />
    </div>
  );
};
```

## Props

### TextField

| Prop             | Type                                              | 필수 | 기본값      | 설명                                      |
| ---------------- | ------------------------------------------------- | ---- | ----------- | ----------------------------------------- |
| `multiline`      | `boolean`                                         | ❌   | `false`     | 다중 라인 입력 모드 활성화                |
| `variant`        | `'default' \| 'focus' \| 'warning' \| 'disabled'` | ❌   | `'default'` | 시각적 상태                               |
| `width`          | `string \| number`                                | ❌   | `'375px'`   | TextField의 너비                          |
| `minRows`        | `number`                                          | ❌   | `2`         | 다중 라인 모드일 때 최소 행 수            |
| `maxRows`        | `number`                                          | ❌   | -           | 다중 라인 모드일 때 최대 행 수            |
| `helperText`     | `string`                                          | ❌   | -           | Helper Text 내용                          |
| `showHelperText` | `boolean`                                         | ❌   | `true`      | Helper Text 표시 여부                     |
| `disabled`       | `boolean`                                         | ❌   | `false`     | 비활성화 상태 (variant를 disabled로 강제) |
| `placeholder`    | `string`                                          | ❌   | -           | placeholder 텍스트                        |
| 기타             | `InputHTMLAttributes` / `TextareaHTMLAttributes`  | ❌   | -           | 표준 input/textarea 속성들                |

### Variant 설명

- **default**: 기본 상태, border는 `lineDefault`
- **focus**: 포커스 상태, border는 `lineAccent`
- **warning**: 경고 상태, border는 `lineWarning`, Helper Text는 `textWarning` 색상
- **disabled**: 비활성화 상태, 전체 opacity 50%, Helper Text도 opacity 50%

## 스타일

### 기본 스타일

- **Border**: `1px solid lineDefault`, `borderRadius: 10px (xl)`
- **Padding**: `12.5px 16px` (padding-y: 12.5px, padding-x: 16px)
- **Typography**: `Rg_16` (font-size: 16px, line-height: 24px)
- **Text Color**: `textPrimary`
- **Placeholder Color**: `textPlaceholder`

### Variant별 Border 색상

- **default**: `lineDefault`
- **focus**: `lineAccent`
- **warning**: `lineWarning`
- **disabled**: `lineDefault` (opacity 50%)

### Helper Text 스타일

- **위치**: TextField 하단 6px 아래
- **Typography**: `Rg_16`
- **색상**:
  - default/focus: `textTertiary`
  - warning: `textWarning`
  - disabled: `textTertiary` (opacity 50%)

### 다중 라인 모드

- `react-textarea-autosize`를 사용하여 자동 높이 조절
- `minRows` 기본값: `2`
- `maxRows`가 지정되면 해당 행 수까지만 확장

## 가이드라인

- 단일 라인 입력에는 `multiline={false}` (기본값) 사용
- 긴 텍스트 입력에는 `multiline={true}` 사용
- 유효성 검사 실패 시 `variant="warning"`과 함께 `helperText` 제공
- `disabled` prop이 제공되면 자동으로 `variant`가 `disabled`로 설정됨
- Helper Text는 사용자에게 명확한 피드백을 제공할 때 사용
- 너비는 외부에서 주입 가능하지만 기본값(375px)이 적절한 경우가 많음
