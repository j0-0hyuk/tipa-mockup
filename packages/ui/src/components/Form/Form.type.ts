import type { FieldPath, FieldValues } from 'react-hook-form';
import type { TypographyKey } from '#styles/emotion.d.ts';

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

export type FormItemContextValue = {
  id: string;
  required?: boolean;
  tooltip?: string | string[];
};

export type FormStyleContextValue = {
  $labelTypo?: TypographyKey;
};
