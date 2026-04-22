import {
  type Control,
  type FieldPath,
  type FieldValues
} from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  TextArea
} from '@docs-front/ui';
import { type DetailInputForm } from '@/schema/main/detailInput';
import { type DetailInputFieldConfig } from '@/constants/detailInput.constant';
import { TipFormLabel } from '@/routes/_authenticated/c/detail-input/-components/TipFormLabel/TipFormLabel';

interface OptionalInputProps<T extends FieldValues = DetailInputForm> {
  control: Control<T>;
  config: DetailInputFieldConfig;
}

export function OptionalInput<T extends FieldValues = DetailInputForm>({
  control,
  config
}: OptionalInputProps<T>) {
  return (
    <FormField
      control={control}
      name={config.name as FieldPath<T>}
      render={({ field }) => (
        <FormItem tooltip={config.tooltip}>
          <TipFormLabel>{config.label}</TipFormLabel>
          <FormControl>
            <TextArea
              placeholder={config.placeholder}
              maxLength={10000}
              value={(field.value as string) || ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
