import {
  StyledTextArea,
  type StyledTextAreaProps
} from '#components/TextArea/TextArea.style.ts';
import { forwardRef } from 'react';
import type { TextareaAutosizeProps } from 'react-textarea-autosize';

export type TextAreaProps = TextareaAutosizeProps & StyledTextAreaProps;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    return <StyledTextArea ref={ref} {...props} />;
  }
);

TextArea.displayName = 'TextArea';
