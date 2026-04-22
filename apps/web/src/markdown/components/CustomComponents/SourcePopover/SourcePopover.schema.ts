import { z } from 'zod';

export const sourcePopoverPropsSchema = z.object({
  sourceUrls: z.array(z.string())
});

export type SourcePopoverProps = z.infer<typeof sourcePopoverPropsSchema>;
