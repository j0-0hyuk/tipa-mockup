import { forwardRef, useMemo } from 'react';
import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  CSSProperties
} from 'react';
import { Flex } from '#components/Flex/Flex.tsx';
import {
  StyledTextFieldInput,
  StyledTextFieldTextarea,
  StyledHelperText,
  type StyledTextFieldProps
} from '#components/Textfield/Textfield.style.ts';
import type { TextFieldVariant } from '#components/Textfield/Textfield.style.ts';

/**
 * TextField 컴포넌트
 *
 * 단일 라인 입력(input)과 다중 라인 입력(textarea)을 모두 지원하는 통합 텍스트 입력 컴포넌트입니다.
 * multiline prop을 통해 두 모드를 전환할 수 있으며, variant를 통해 다양한 상태를 표현할 수 있습니다.
 *
 * 주요 기능:
 * - 단일/다중 라인 입력 지원 (multiline prop)
 * - 상태별 스타일링 (default, focus, warning, disabled)
 * - Helper Text 지원 (선택적)
 * - 자동 높이 조절 (multiline 모드에서 minRows/maxRows 지원)
 */
export type { TextFieldVariant };

export interface TextFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement> &
      TextareaHTMLAttributes<HTMLTextAreaElement>,
    'width'
  > {
  multiline?: boolean;
  variant?: TextFieldVariant;
  width?: CSSProperties['width'];
  minRows?: number;
  maxRows?: number;
  helperText?: string;
  showHelperText?: boolean;
}

type TextFieldRef = HTMLInputElement | HTMLTextAreaElement;

export const TextField = forwardRef<TextFieldRef, TextFieldProps>(
  (
    {
      multiline = false,
      variant = 'default',
      width = '375px',
      minRows = 2,
      maxRows,
      helperText,
      showHelperText,
      disabled,
      ...props
    },
    ref
  ) => {
    const effectiveVariant: TextFieldVariant = useMemo(() => {
      if (disabled) return 'disabled';
      return variant;
    }, [disabled, variant]);

    const shouldShowHelperText = useMemo(() => {
      // showHelperText가 명시적으로 false로 설정되지 않았고 helperText가 있으면 표시
      if (showHelperText === false) return false;
      return Boolean(helperText);
    }, [showHelperText, helperText]);

    const inputProps = useMemo(() => {
      const baseProps = {
        ...props,
        $variant: effectiveVariant,
        $width: '100%',
        $multiline: multiline,
        disabled: effectiveVariant === 'disabled' || disabled
      };

      if (multiline) {
        return {
          ...baseProps,
          minRows,
          maxRows
        };
      }

      return baseProps;
    }, [props, effectiveVariant, multiline, minRows, maxRows, disabled]);

    return (
      <Flex direction="column" width={width}>
        {multiline ? (
          <StyledTextFieldTextarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...(inputProps as StyledTextFieldProps & {
              minRows?: number;
              maxRows?: number;
            })}
          />
        ) : (
          <StyledTextFieldInput
            ref={ref as React.Ref<HTMLInputElement>}
            {...(inputProps as StyledTextFieldProps)}
          />
        )}
        {shouldShowHelperText && (
          <StyledHelperText $variant={effectiveVariant}>
            {helperText}
          </StyledHelperText>
        )}
      </Flex>
    );
  }
);

TextField.displayName = 'TextField';
