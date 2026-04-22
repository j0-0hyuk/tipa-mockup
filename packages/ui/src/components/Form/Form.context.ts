import { createContext } from 'react';
import type {
  FormFieldContextValue,
  FormItemContextValue,
  FormStyleContextValue
} from '#components/Form/Form.type.ts';

export const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

export const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

export const FormStyleContext = createContext<FormStyleContextValue>(
  {} as FormStyleContextValue
);
