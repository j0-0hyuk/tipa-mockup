import { z } from 'zod';

export const mermaidPropsSchema = z.object({
  info: z.string().optional(),
  chart: z.string()
});

export type MermaidProps = z.infer<typeof mermaidPropsSchema>;
