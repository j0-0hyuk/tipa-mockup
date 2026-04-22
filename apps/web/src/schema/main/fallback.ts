import { z } from 'zod';

// 머메이드 내부의
const removeBrTagsInMermaid = (content: string): string => {
  return content.replace(
    /<mermaid>([\s\S]*?)<\/mermaid>/g,
    (_match, mermaidContent) => {
      const cleaned = mermaidContent.replace(/<br\/?>/gi, '');
      return `<mermaid>${cleaned}</mermaid>`;
    }
  );
};

/**
 * 리스트(ol, ul) 항목 바로 뒤에 붙어있는
 * 마크다운 테이블을 찾아 각 줄에 탭을 추가하여
 * 올바르게 렌더링되도록 수정하는 함수
 */
const fixTableInList = (content: string): string => {
  const brokenTableRegex = /(^(?:(?:\*|-|\+)|\d+\.) .*\n)((?:\|.*\|?\n)+)/gm;
  const replacer = (_match: string, listLine: string, tableBlock: string) => {
    const tableLines = tableBlock.trim().split('\n');
    const indentedTable = tableLines.map((line) => `\t${line}`).join('\n');
    return listLine + indentedTable;
  };
  return content.replace(brokenTableRegex, replacer);
};

export const markdownFixerSchema = z
  .string()
  .transform((content) => removeBrTagsInMermaid(content))
  .transform((content) => fixTableInList(content));

export function parseMarkdownFallback(content: string | null): string | null {
  if (content === null) {
    return null;
  }
  return markdownFixerSchema.parse(content);
}
