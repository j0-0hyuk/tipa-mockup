import { z } from 'zod';

export const postVisualSuggestionsContentsSchema = z.object({
  templateFileId: z.number(),
  userPrompt: z.string(),
  productContents: z.string().optional(),
  exportProductFileId: z.number().optional()
});

export interface PostVisualSuggestionsRequestParams {
  contents: z.input<typeof postVisualSuggestionsContentsSchema>;
  referenceFiles?: File[];
}

export const svgSuggestionItemSchema = z.object({
  name: z.string(),
  info: z.string(),
  position: z.string()
});

export const postVisualSuggestionsResponseSchema = z
  .object({
    data: z.object({
      svgSuggestions: z.array(svgSuggestionItemSchema)
    })
  })
  .transform(({ data }) => data.svgSuggestions);

export type PostVisualSuggestionsResponse = z.output<
  typeof postVisualSuggestionsResponseSchema
>;

export type SvgSuggestionItem = z.infer<typeof svgSuggestionItemSchema>;
