/**
 * itemName의 이중 JSON 인코딩을 방지하고 안전하게 파싱하는 함수
 * @param value 파싱할 문자열
 * @returns 파싱된 문자열 또는 빈 문자열
 */
export function safeParseItemName(value?: string | null): string {
  if (!value) return '';

  try {
    let parsed = JSON.parse(value);
    while (typeof parsed === 'string') {
      try {
        const temp = JSON.parse(parsed);
        parsed = temp;
      } catch {
        break;
      }
    }
    return typeof parsed === 'string' ? parsed : '';
  } catch {
    return value.replace(/^"(.*)"$/, '$1');
  }
}
