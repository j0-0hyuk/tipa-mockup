import { useCallback, useState } from 'react';
import { FONT_FACES } from '@/components/DocsThemeDialog/DocsThemeDialog.constant';

interface FontData {
  family: string;
  fullName: string;
  postscriptName: string;
  style: string;
}

type QueryLocalFonts = () => Promise<FontData[]>;

const isSupported =
  typeof window !== 'undefined' && 'queryLocalFonts' in window;

const fallbackSet = new Set<string>(FONT_FACES);

export const useLocalFonts = () => {
  const [localFonts, setLocalFonts] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  const requestFonts = useCallback(async () => {
    if (loaded || !isSupported) return;

    try {
      const fontList = await (
        window as unknown as { queryLocalFonts: QueryLocalFonts }
      ).queryLocalFonts();
      const families = [...new Set(fontList.map((f) => f.family))]
        .filter((f) => !fallbackSet.has(f))
        .sort((a, b) => a.localeCompare(b, 'ko'));
      setLocalFonts(families);
    } catch {
      // 권한 거부 — fallback 유지
    } finally {
      setLoaded(true);
    }
  }, [loaded]);

  return { fallbackFonts: FONT_FACES, localFonts, requestFonts };
};
