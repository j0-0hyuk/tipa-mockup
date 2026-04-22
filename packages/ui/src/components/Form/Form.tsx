import React, { type PropsWithChildren } from 'react';

import { useTheme } from '@emotion/react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { Controller, FormProvider } from 'react-hook-form';
import type {
  FieldValues,
  FieldPath,
  ControllerProps,
  SubmitHandler,
  UseFormReturn
} from 'react-hook-form';

import {
  StyledForm,
  StyledFormItem,
  StyledFormLabel,
  StyledFormMessage
} from '#components/Form/Form.style.ts';
import { Flex } from '#components/Flex/Flex.tsx';
import type { StyledFormProps } from '#components/Form/Form.style.ts';
import { AnimatePresence, motion } from 'motion/react';
import {
  FormStyleContext,
  FormFieldContext,
  FormItemContext
} from '#components/Form/Form.context.ts';
import { useFormField } from '#components/Form/useFormField.ts';
import { Accordion } from '#components/Accordion/Accordion.tsx';

const useFormStyle = () => {
  const formStyleContext = React.useContext(FormStyleContext);
  return formStyleContext;
};

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    required?: boolean;
    tooltip?: string[] | string;
  }
>(({ required, tooltip, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id, required, tooltip }}>
      <StyledFormItem ref={ref} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ children, ...props }, ref) => {
  const { formItemId, required } = useFormField();
  const { $labelTypo } = useFormStyle();
  const theme = useTheme();

  return (
    <Flex alignItems="center" gap={4} margin="0 0 8px 0">
      <StyledFormLabel
        ref={ref}
        htmlFor={formItemId}
        $labelTypo={$labelTypo}
        {...props}
      >
        {children}
        {required && <p style={{ color: theme.color.main }}>(필수)</p>}
      </StyledFormLabel>
    </Flex>
  );
});
FormLabel.displayName = 'FormLabel';

interface TipFormLabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  tipLabel?: string;
}

const TipFormLabel = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  TipFormLabelProps
>(({ children, tipLabel, ...props }, ref) => {
  const { formItemId, required, tooltip } = useFormField();
  const { $labelTypo } = useFormStyle();
  const theme = useTheme();

  return (
    <Accordion tooltip={tooltip ?? ('' as string)} tipLabel={tipLabel}>
      <StyledFormLabel
        ref={ref}
        htmlFor={formItemId}
        $labelTypo={$labelTypo}
        {...props}
      >
        {children}
        {required && <p style={{ color: theme.color.main }}>(필수)</p>}
      </StyledFormLabel>
    </Accordion>
  );
});

TipFormLabel.displayName = 'TipFormLabel';

const FormControl = React.forwardRef<
  React.ComponentRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return <p ref={ref} id={formDescriptionId} {...props} />;
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();

  const getErrorMessage = (error: { message?: unknown }): string => {
    if (!error?.message) return '';

    const message = String(error.message);
    const trimmed = message.trim();

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(message);
        return Array.isArray(parsed) && parsed[0]?.message
          ? parsed[0].message
          : message;
      } catch {
        return message;
      }
    }

    return message;
  };

  const body = error ? getErrorMessage(error) : children;

  return (
    <AnimatePresence mode="wait">
      {body && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
        >
          <StyledFormMessage ref={ref} id={formMessageId} {...props}>
            {body}
          </StyledFormMessage>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
FormMessage.displayName = 'FormMessage';

interface FormProps<T extends FieldValues> extends PropsWithChildren {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

function FormComponent<T extends FieldValues>(
  { form, children, onSubmit, $labelTypo }: FormProps<T> & StyledFormProps,
  ref: React.ForwardedRef<HTMLFormElement>
) {
  return (
    <FormProvider {...form}>
      <FormStyleContext.Provider value={{ $labelTypo }}>
        <StyledForm ref={ref} onSubmit={form.handleSubmit(onSubmit)}>
          {children}
        </StyledForm>
      </FormStyleContext.Provider>
    </FormProvider>
  );
}

FormComponent.displayName = 'FormComponent';

const FormForwardRef = React.forwardRef(FormComponent);

(
  FormForwardRef as typeof FormForwardRef & { displayName: string }
).displayName = 'Form';

const Form = FormForwardRef as <T extends FieldValues>(
  props: FormProps<T> &
    StyledFormProps & { ref?: React.ForwardedRef<HTMLFormElement> }
) => React.ReactElement;

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  TipFormLabel,
  type FormProps
};
