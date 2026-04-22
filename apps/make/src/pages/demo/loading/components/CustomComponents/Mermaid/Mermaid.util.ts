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
