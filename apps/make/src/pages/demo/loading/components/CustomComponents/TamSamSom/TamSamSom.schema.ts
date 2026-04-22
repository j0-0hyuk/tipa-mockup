import { z } from 'zod';

export const tamSamSomPropsSchema = z.object({
  info: z.string().optional(),
  tamValue: z.coerce.string(),
  samValue: z.coerce.string(),
  somValue: z.coerce.string(),
  tamDescription: z.string(),
  samDescription: z.string(),
  somDescription: z.string(),
  tamJustification: z.string(),
  samJustification: z.string(),
  somJustification: z.string()
});

export type TamSamSomProps = z.infer<typeof tamSamSomPropsSchema>;
