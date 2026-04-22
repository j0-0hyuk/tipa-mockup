import type { UIMessage, UIMessageChunk } from 'ai';
import { z } from 'zod';

const docshuntUIMessageMarkdownStatusSchema = z.enum([
  'thinking',
  'streaming',
  'abort',
  'review',
  'done'
]);

const docshuntUIMessageDocumentStatusSchema = z.enum([
  'generating',
  'thinking',
  'review',
  'done'
]);

const docshuntUIMessageMarkdownDataSchema = z.object({
  value: z.string(),
  status: docshuntUIMessageMarkdownStatusSchema
});

const docshuntUIMessageDocumentDataSchema = z.object({
  value: z.string(),
  status: docshuntUIMessageDocumentStatusSchema
});

export const docshuntUIMessageDataTypesSchema = z.object({
  markdown: docshuntUIMessageMarkdownDataSchema,
  document: docshuntUIMessageDocumentDataSchema
});

export const docshuntUIMessageDataSchemas = {
  markdown: docshuntUIMessageMarkdownDataSchema,
  document: docshuntUIMessageDocumentDataSchema
};

type DocshuntUIMessageMetadata = never;

export type DocshuntMarkdownStatus = z.infer<
  typeof docshuntUIMessageMarkdownStatusSchema
>;

export type DocshuntMarkdownData = z.infer<
  typeof docshuntUIMessageMarkdownDataSchema
>;
export type DocshuntDocumentStatus = z.infer<
  typeof docshuntUIMessageDocumentStatusSchema
>;

export type DocshuntDocumentData = z.infer<
  typeof docshuntUIMessageDocumentDataSchema
>;

export type DocshuntDateTypes = z.infer<
  typeof docshuntUIMessageDataTypesSchema
>;

export type DocshuntUIMessage = UIMessage<
  DocshuntUIMessageMetadata,
  DocshuntDateTypes
>;

export type DocshuntUIMessageChunk = UIMessageChunk<
  DocshuntUIMessageMetadata,
  DocshuntDateTypes
>;
