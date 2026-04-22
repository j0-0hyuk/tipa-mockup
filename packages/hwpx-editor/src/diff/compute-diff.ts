/**
 * 외부 의존성 없는 word-level diff 알고리즘.
 * 텍스트를 단어 단위로 분할 후 LCS 기반 diff를 계산한다.
 */

export interface DiffSegment {
  type: "equal" | "add" | "remove";
  text: string;
}

/**
 * IR XML 문자열에서 사람이 읽을 수 있는 텍스트만 추출한다.
 * <t>...</t> 태그 내의 텍스트를 연결하고, XML 엔티티를 디코딩한다.
 */
export function extractTextFromIrXml(xml: string): string {
  const parts: string[] = [];
  const re = /<t>([\s\S]*?)<\/t>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    if (m[1] != null) parts.push(m[1]);
  }
  return decodeXmlEntities(parts.join(""));
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"');
}

/**
 * 두 문자열의 word-level diff를 계산한다.
 */
export function computeDiff(oldText: string, newText: string): DiffSegment[] {
  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);

  const lcs = buildLcs(oldTokens, newTokens);
  return buildSegments(oldTokens, newTokens, lcs);
}

/** 공백 구분 단어 단위로 토큰 분할 */
function tokenize(text: string): string[] {
  const re = /[ \t\n\r]+|[^ \t\n\r]+/g;
  return text.match(re) ?? [];
}

/** LCS 테이블 구축 (행: old, 열: new) */
function buildLcs(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );

  for (let i = 1; i <= m; i++) {
    const dpRow = dp[i];
    const dpPrevRow = dp[i - 1];
    if (!dpRow || !dpPrevRow) continue;
    for (let j = 1; j <= n; j++) {
      dpRow[j] =
        a[i - 1] === b[j - 1]
          ? (dpPrevRow[j - 1] ?? 0) + 1
          : Math.max(dpPrevRow[j] ?? 0, dpRow[j - 1] ?? 0);
    }
  }

  return dp;
}

/** LCS 테이블을 역추적하여 DiffSegment 배열 생성 */
function buildSegments(
  a: string[],
  b: string[],
  dp: number[][],
): DiffSegment[] {
  const segments: DiffSegment[] = [];
  let i = a.length;
  let j = b.length;

  // 역순으로 수집 후 뒤집기
  const raw: DiffSegment[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      raw.push({ type: "equal", text: a[i - 1] ?? "" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || (dp[i]?.[j - 1] ?? 0) >= (dp[i - 1]?.[j] ?? 0))) {
      raw.push({ type: "add", text: b[j - 1] ?? "" });
      j--;
    } else {
      raw.push({ type: "remove", text: a[i - 1] ?? "" });
      i--;
    }
  }

  raw.reverse();

  // 인접한 같은 type을 병합
  for (const seg of raw) {
    const last = segments[segments.length - 1];
    if (last && last.type === seg.type) {
      last.text += seg.text;
    } else {
      segments.push({ ...seg });
    }
  }

  return segments;
}
