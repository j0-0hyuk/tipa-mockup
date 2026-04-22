const escapedStrongPattern = /\\\*\\\*([^*]+?)\\\*\\\*/g;
const escapedEmphasisPattern = /\\\*([^*\n]+?)\\\*/g;

const normalizeEscapedEmphasisInPlainText = (text: string): string =>
  text
    .replace(escapedStrongPattern, '**$1**')
    .replace(escapedEmphasisPattern, '*$1*');

const normalizeEscapedEmphasisOutsideInlineCode = (line: string): string => {
  if (!line.includes('\\*')) {
    return line;
  }

  let result = '';
  let index = 0;

  while (index < line.length) {
    if (line[index] !== '`') {
      const nextBacktickIndex = line.indexOf('`', index);
      const plainChunk =
        nextBacktickIndex === -1
          ? line.slice(index)
          : line.slice(index, nextBacktickIndex);
      result += normalizeEscapedEmphasisInPlainText(plainChunk);
      if (nextBacktickIndex === -1) {
        break;
      }
      index = nextBacktickIndex;
      continue;
    }

    let tickLength = 1;
    while (line[index + tickLength] === '`') {
      tickLength += 1;
    }

    const fence = '`'.repeat(tickLength);
    const closeIndex = line.indexOf(fence, index + tickLength);
    if (closeIndex === -1) {
      result += line.slice(index);
      break;
    }

    result += line.slice(index, closeIndex + tickLength);
    index = closeIndex + tickLength;
  }

  return result;
};

export const normalizeEscapedEmphasis = (markdown: string): string => {
  if (!markdown.includes('\\*')) {
    return markdown;
  }

  const lines = markdown.split('\n');
  const normalizedLines: string[] = [];
  let openFence: '`' | '~' | null = null;
  let openFenceLength = 0;

  for (const line of lines) {
    const openingMatch = /^ {0,3}(`{3,}|~{3,})/.exec(line);

    if (openingMatch) {
      const marker = openingMatch[1];
      const markerChar = marker[0] as '`' | '~';
      const markerLength = marker.length;

      if (!openFence) {
        openFence = markerChar;
        openFenceLength = markerLength;
      } else if (
        openFence === markerChar &&
        markerLength >= openFenceLength
      ) {
        openFence = null;
        openFenceLength = 0;
      }

      normalizedLines.push(line);
      continue;
    }

    if (openFence) {
      normalizedLines.push(line);
      continue;
    }

    normalizedLines.push(normalizeEscapedEmphasisOutsideInlineCode(line));
  }

  return normalizedLines.join('\n');
};
