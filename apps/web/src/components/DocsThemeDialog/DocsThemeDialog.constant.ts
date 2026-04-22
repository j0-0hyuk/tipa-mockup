import type { Theme } from '@docshunt/docs-editor-wasm';

export const STYLE_DISPLAY_NAMES: Record<string, string> = {
  l1: '대제목',
  l2: '소제목',
  l3: '본문',
  l4: '캡션'
};

export const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72
];

export const LINE_SPACINGS = [100, 120, 130, 140, 150, 160, 180, 200, 250, 300];

export const PARAGRAPH_SPACINGS = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32];

export const MARK_OPTIONS = ['□', '◦', '○', '●', '⦁', '-', '※', null] as const;

export const FONT_FACES = [
  '맑은 고딕',
  '함초롬돋움',
  '함초롬바탕',
  'HY견고딕',
  'HYwulM',
  '휴먼명조'
] as const;

export const DEFAULT_THEME: Theme = {
  character: {
    heading1: {
      face: ['HY견고딕'],
      size: 16,
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      color: '#000000'
    },
    heading2: {
      face: ['맑은 고딕', '함초롬돋움'],
      size: 14,
      bold: true,
      italic: false,
      underline: false,
      strike: false,
      color: '#000000'
    },
    body: {
      face: ['맑은 고딕', '함초롬돋움'],
      size: 12,
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      color: '#000000'
    },
    'body-serif': {
      face: ['휴먼명조'],
      size: 12,
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      color: '#000000'
    },
    caption: {
      face: ['맑은 고딕', '함초롬돋움'],
      size: 10,
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      color: '#000000'
    }
  },
  paragraph: {
    title: {
      mark: '□',
      margin_top: 10,
      margin_bottom: 6,
      word_spacing_count: 0,
      outdent: 0,
      line_spacing: 160,
      align: 'left'
    },
    subtitle: {
      mark: '◦',
      margin_top: 0,
      margin_bottom: 2,
      word_spacing_count: 1,
      outdent: 0,
      line_spacing: 160,
      align: 'left'
    },
    normal: {
      mark: '-',
      margin_top: 0,
      margin_bottom: 6,
      word_spacing_count: 3,
      outdent: 10,
      line_spacing: 160,
      align: 'left'
    },
    description: {
      mark: '⦁',
      margin_top: 0,
      margin_bottom: 10,
      word_spacing_count: 5,
      outdent: 14,
      line_spacing: 130,
      align: 'left'
    }
  },
  border: {
    none: {
      left: { type: 'NONE', width: 0.1 },
      right: { type: 'NONE', width: 0.1 },
      top: { type: 'NONE', width: 0.1 },
      bottom: { type: 'NONE', width: 0.1 }
    }
  },
  style: {
    l1: {
      character_style: 'heading1',
      paragraph_style: 'title',
      border_style: 'none'
    },
    l2: {
      character_style: 'heading2',
      paragraph_style: 'subtitle',
      border_style: 'none'
    },
    l3: {
      character_style: 'body',
      paragraph_style: 'normal',
      border_style: 'none'
    },
    l4: {
      character_style: 'caption',
      paragraph_style: 'description',
      border_style: 'none'
    }
  }
};

export const PREVIEW_TEXTS: Record<string, string> = {
  l1: '대제목을 입력하세요',
  l2: '부제목을 입력하세요',
  l3: '본문 텍스트를 입력하세요',
  l4: '캡션을 입력하세요'
};
