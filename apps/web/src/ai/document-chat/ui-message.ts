import type { UIMessage } from 'ai';
import { z } from 'zod';

const addActionSchema = z.object({
  type: z.literal('add'),
  refId: z.string(),
  actionNodes: z.array(z.string()),
  position: z.enum(['before', 'after']).default('after')
});

const updateActionSchema = z.object({
  type: z.literal('update'),
  refId: z.string(),
  actionNode: z.string()
});

const deleteActionSchema = z.object({
  type: z.literal('delete'),
  refId: z.string()
});

export const hwpxActionSchema = z.discriminatedUnion('type', [
  addActionSchema,
  updateActionSchema,
  deleteActionSchema
]);

const docshuntDocumentChatUIMessageActionDataSchema = z.discriminatedUnion(
  'phase',
  [
    z.object({ phase: z.literal('start'), sessionId: z.string() }),
    z.object({ phase: z.literal('delta'), action: hwpxActionSchema }),
    z.object({ phase: z.literal('done') })
  ]
);

// --- 통합 데이터 타입 스키마 ---
export const docshuntDocumentChatUIMessageDataTypesSchema = z.object({
  action: docshuntDocumentChatUIMessageActionDataSchema
});

export const docshuntDocumentChatUIMessageDataSchemas = {
  action: docshuntDocumentChatUIMessageActionDataSchema
};

// --- 타입 내보내기 ---
type DocshuntDocumentChatUIMessageMetadata = never;

export type HwpxAction = z.infer<typeof hwpxActionSchema>;

export type DocshuntDocumentChatUIMessageActionData = z.infer<
  typeof docshuntDocumentChatUIMessageActionDataSchema
>;

export type DocshuntDocumentChatUIMessageDataTypes = z.infer<
  typeof docshuntDocumentChatUIMessageDataTypesSchema
>;

export type DocshuntDocumentChatUIMessage = UIMessage<
  DocshuntDocumentChatUIMessageMetadata,
  DocshuntDocumentChatUIMessageDataTypes
>;
