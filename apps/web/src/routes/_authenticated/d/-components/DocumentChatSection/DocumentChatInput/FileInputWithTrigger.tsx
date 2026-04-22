import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  cloneElement,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type ReactElement
} from 'react';

export const FileInputWithTrigger = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & {
    trigger: ReactElement;
  }
>(({ trigger, ...props }, ref) => {
  const internalRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => internalRef.current!);

  const handleClick = useCallback(() => {
    internalRef.current?.click();
  }, []);

  const clone = cloneElement(trigger, {
    onClick: handleClick
  });

  const { multiple = true, ...inputProps } = props;

  return (
    <>
      {clone}
      <VisuallyHidden>
        <input
          type="file"
          multiple={multiple}
          {...inputProps}
          ref={internalRef}
        />
      </VisuallyHidden>
    </>
  );
});

FileInputWithTrigger.displayName = 'FileInputWithTrigger';
