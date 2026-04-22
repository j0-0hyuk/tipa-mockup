import { z } from 'zod';
import { CHART_COLOR_KEYS } from '@/constants/chartColors.constant';

export const emailSchemaProducer = (message?: string) => {
  return z.email({ message });
};

export const authCodeSchemaProducer = (message: string) => {
  return z.string().length(6, { message });
};

export const passwordSchemaProducer = (message: string) => {
  return z.string().regex(/(?=.*\d)(?=.*[a-z]).{8,}/, { message });
};

export const colorKeySchemaProducer = (message: string) => {
  return z.enum(CHART_COLOR_KEYS, { message });
};
