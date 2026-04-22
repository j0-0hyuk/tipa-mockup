import { z } from 'zod';

export type HastTextNode = {
  type: 'text';
  value: string;
};

export type HastElementNode = {
  type: 'element';
  tagName: string;
  children?: HastNode[];
};

export type HastNode = HastTextNode | HastElementNode | HastNode[];

export const hastTextNodeSchema = z.object({
  type: z.literal('text'),
  value: z.string()
});

export const hastElementNodeSchema: z.ZodType<HastElementNode> = z.lazy(() =>
  z.object({
    type: z.literal('element'),
    tagName: z.string(),
    children: z.array(hastNodeSchema).optional()
  })
);

export const hastNodeSchema: z.ZodType<HastNode> = z.lazy(() =>
  z.union([hastTextNodeSchema, hastElementNodeSchema, z.array(hastNodeSchema)])
);

export const hastNodeToMarkdown = (node: HastNode): string => {
  if (!node) return '';

  if (Array.isArray(node)) {
    return node.map(hastNodeToMarkdown).join('');
  }

  if (node.type === 'text') {
    const text = node.value || '';
    if (text.includes('|') && /\|\s*---\s*\|/.test(text)) {
      const lines = text.split('\n');
      const result: string[] = [];
      let inTable = false;
      let tableLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isTableLine =
          line.trim().startsWith('|') && line.trim().endsWith('|');

        if (isTableLine) {
          if (!inTable) {
            if (result.length > 0 && result[result.length - 1] !== '') {
              result.push('');
            }
            inTable = true;
          }
          tableLines.push(line);
        } else {
          if (inTable) {
            result.push(...tableLines);
            if (line.trim() !== '') {
              result.push('');
            }
            tableLines = [];
            inTable = false;
          }
          result.push(line);
        }
      }
      if (inTable && tableLines.length > 0) {
        result.push(...tableLines);
        result.push('');
      }

      return result.join('\n');
    }

    return text;
  }

  if (node.type === 'element') {
    const tagName = node.tagName;
    const children = node.children || [];
    const childrenText = children.map(hastNodeToMarkdown).join('');

    const customComponentTags = [
      'composedchartcomponent',
      'donutchartcomponent',
      'tamsamsom',
      'mermaid',
      'positioningmap'
    ];

    if (customComponentTags.includes(tagName.toLowerCase())) {
      return `\n\n<${tagName}>${childrenText}</${tagName}>\n\n`;
    }

    return `<${tagName}>${childrenText}</${tagName}>`;
  }

  return '';
};
