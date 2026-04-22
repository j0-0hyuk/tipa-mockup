export function normalizeJsonString(raw: string): string {
  let normalized = '';
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];

    if (escapeNext) {
      normalized += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      normalized += char;
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      normalized += char;
      continue;
    }

    if (inString) {
      if (char === '\n') {
        normalized += '\\n';
      } else if (char === '\r') {
        normalized += '\\r';
      } else {
        normalized += char;
      }
    } else {
      normalized += char;
    }
  }

  return normalized;
}

/**
 * 작은따옴표 및 쌍따옴표 문자열 내부의 실제 줄바꿈을 이스케이프 처리하여 JSON5 파싱이 가능하도록 정규화합니다.
 * @param str 원본 문자열
 * @returns 정규화된 문자열
 */
export function normalizeForJSON5(str: string): string {
  let result = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escapeNext = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (escapeNext) {
      result += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      result += char;
      escapeNext = true;
      continue;
    }

    if (char === "'") {
      inSingleQuote = !inSingleQuote;
      result += char;
      continue;
    }

    if (char === '"') {
      inDoubleQuote = !inDoubleQuote;
      result += char;
      continue;
    }

    if (inSingleQuote || inDoubleQuote) {
      // 작은따옴표 또는 쌍따옴표 문자열 내부의 실제 줄바꿈을 이스케이프
      if (char === '\n') {
        result += '\\n';
      } else if (char === '\r') {
        result += '\\r';
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }

  return result;
}
