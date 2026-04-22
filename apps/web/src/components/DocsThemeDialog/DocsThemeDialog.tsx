import {
  Button,
  Dialog,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger
} from '@bichon/ds';
import type {
  CharacterStyle,
  ParagraphStyle,
  Theme
} from '@docshunt/docs-editor-wasm';
import { Global } from '@emotion/react';
import { ChevronDown, Info } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_THEME,
  FONT_SIZES,
  LINE_SPACINGS,
  MARK_OPTIONS,
  PARAGRAPH_SPACINGS,
  PREVIEW_TEXTS,
  STYLE_DISPLAY_NAMES
} from '@/components/DocsThemeDialog/DocsThemeDialog.constant';
import { useLocalFonts } from '@/hooks/useLocalFonts';
import {
  buildPreviewStyle,
  getCharacterValue,
  getParagraphValue
} from '@/components/DocsThemeDialog/DocsThemeDialog.helpers';
import type { LocalEdits } from '@/components/DocsThemeDialog/DocsThemeDialog.type';
import {
  StyledDialogBody,
  StyledDescription,
  StyledContentRow,
  StyledStyleList,
  StyledStylePill,
  StyledPropertiesPanel,
  StyledFieldsWrapper,
  StyledFieldRow,
  StyledFieldGroup,
  StyledFieldLabel,
  StyledMenuTriggerBox,
  StyledAttrGroup,
  StyledAttrButton,
  StyledHorizontalDivider,
  StyledPreviewBox,
  StyledPreviewLine,
  StyledPreviewNotice
} from '@/components/DocsThemeDialog/DocsThemeDialog.style';

const REMOVE_FIELD = Symbol('REMOVE_FIELD');

interface DocsThemeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (theme: Theme) => void;
  defaultTheme?: Theme;
}

export const DocsThemeDialog = ({
  isOpen,
  onClose,
  onApply,
  defaultTheme = DEFAULT_THEME
}: DocsThemeDialogProps) => {
  const [theme, setTheme] = useState(defaultTheme);
  const { fallbackFonts, localFonts, requestFonts } = useLocalFonts();

  const { style, character, paragraph } = theme;

  const [selectedKey, setSelectedKey] = useState('l1');
  const [edits, setEdits] = useState<LocalEdits>({});
  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTheme(defaultTheme);
      setEdits({});
      setSelectedKey(Object.keys(defaultTheme.style)[0] ?? 'l1');
      requestFonts();
    }
  }, [isOpen, defaultTheme, requestFonts]);

  const updateCharacter = useCallback(
    (field: keyof CharacterStyle, value: unknown) => {
      setEdits((prev) => ({
        ...prev,
        [selectedKey]: {
          character: { ...prev[selectedKey]?.character, [field]: value },
          paragraph: prev[selectedKey]?.paragraph ?? {}
        }
      }));
    },
    [selectedKey]
  );

  const updateParagraph = useCallback(
    (field: keyof ParagraphStyle, value: unknown) => {
      setEdits((prev) => ({
        ...prev,
        [selectedKey]: {
          character: prev[selectedKey]?.character ?? {},
          paragraph: {
            ...prev[selectedKey]?.paragraph,
            [field]: value === null ? REMOVE_FIELD : value
          }
        }
      }));
    },
    [selectedKey]
  );

  const toggleCharBool = useCallback(
    (field: 'bold' | 'italic' | 'underline' | 'strike') => {
      const entry = style[selectedKey];
      if (!entry) return;
      const current = getCharacterValue(
        edits,
        selectedKey,
        character[entry.character_style ?? ''],
        field
      ) as boolean | undefined;
      updateCharacter(field, !current);
    },
    [edits, selectedKey, character, style, updateCharacter]
  );

  const handleReset = useCallback(() => {
    setTheme(DEFAULT_THEME);
    setEdits({});
  }, []);

  const handleApply = useCallback(() => {
    const mergedTheme = structuredClone(theme);

    for (const [styleKey, edit] of Object.entries(edits)) {
      const hasChar = Object.keys(edit.character).length > 0;
      const hasPara = Object.keys(edit.paragraph).length > 0;
      if (!hasChar && !hasPara) continue;

      const entry = style[styleKey];
      const charKey = entry.character_style ?? '';
      const paraKey = entry.paragraph_style ?? '';

      if (charKey && hasChar) {
        mergedTheme.character[charKey] = {
          ...mergedTheme.character[charKey],
          ...edit.character
        };
      }
      if (paraKey && hasPara) {
        const merged = {
          ...mergedTheme.paragraph[paraKey],
          ...edit.paragraph
        };
        for (const [k, v] of Object.entries(
          merged as Record<string, unknown>
        )) {
          if (v === REMOVE_FIELD) {
            delete (merged as Record<string, unknown>)[k];
          }
        }
        mergedTheme.paragraph[paraKey] = merged;
      }
    }

    onApply(mergedTheme);
    onClose();
  }, [edits, style, theme, onClose, onApply]);

  const styleKeys = Object.keys(style);
  const safeSelectedKey = style[selectedKey] ? selectedKey : (styleKeys[0] ?? 'l1');

  if (styleKeys.length === 0) {
    return (
      <Dialog isOpen={isOpen} onClose={onClose}>
        <Dialog.Title>문서 스타일</Dialog.Title>
        <Dialog.Content>
          <p>스타일 데이터가 없습니다.</p>
        </Dialog.Content>
        <Dialog.Footer>
          <Button onClick={onClose} size="large" variant="filled">
            닫기
          </Button>
        </Dialog.Footer>
      </Dialog>
    );
  }

  const selectedCharStyle = character[style[safeSelectedKey].character_style ?? ''];
  const selectedParaStyle = paragraph[style[safeSelectedKey].paragraph_style ?? ''];

  const getChar = (field: keyof CharacterStyle) =>
    getCharacterValue(edits, safeSelectedKey, selectedCharStyle, field);
  const getPara = (field: keyof ParagraphStyle) => {
    const val: unknown = getParagraphValue(edits, safeSelectedKey, selectedParaStyle, field);
    return val === REMOVE_FIELD ? undefined : val;
  };

  const currentSize = (getChar('size') as number) ?? 12;
  const currentFace = (getChar('face') as string[]) ?? [];
  const currentBold = (getChar('bold') as boolean) ?? false;
  const currentLineSpacing = (getPara('line_spacing') as number) ?? 160;
  const currentMark = getPara('mark') as string | undefined;
  const currentMarginTop = (getPara('margin_top') as number) ?? 0;
  const currentMarginBottom = (getPara('margin_bottom') as number) ?? 0;

  return (
    <>
    <Global styles={{ '[role="dialog"]:has(.docs-theme-dialog)': { maxWidth: 640 } }} />
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Dialog.Title>
        문서 스타일
        <StyledDescription>
          문서 전체에 적용되는 스타일을 설정합니다
        </StyledDescription>
      </Dialog.Title>
      <Dialog.Content>
        <StyledDialogBody className="docs-theme-dialog">
          <StyledContentRow>
            {/* Left: style list */}
            <StyledStyleList>
              {Object.keys(style).map((key) => (
                <StyledStylePill
                  key={key}
                  type="button"
                  $active={key === safeSelectedKey}
                  onClick={() => setSelectedKey(key)}
                >
                  {STYLE_DISPLAY_NAMES[key]}
                </StyledStylePill>
              ))}
            </StyledStyleList>

            {/* Right: properties */}
            <StyledPropertiesPanel>
              <StyledFieldsWrapper>
                <StyledFieldRow>
                  <StyledFieldGroup>
                    <StyledFieldLabel>크기</StyledFieldLabel>
                    <Menu>
                      <MenuTrigger asChild>
                        <StyledMenuTriggerBox type="button">
                          <span>{currentSize}pt</span>
                          <ChevronDown size={16} />
                        </StyledMenuTriggerBox>
                      </MenuTrigger>
                      <MenuContent>
                        {FONT_SIZES.map((s) => (
                          <MenuItem
                            key={s}
                            onSelect={() => updateCharacter('size', s)}
                          >
                            {s}pt
                          </MenuItem>
                        ))}
                      </MenuContent>
                    </Menu>
                  </StyledFieldGroup>
                  <StyledFieldGroup>
                    <StyledFieldLabel>글꼴</StyledFieldLabel>
                    <Menu>
                      <MenuTrigger asChild>
                        <StyledMenuTriggerBox type="button">
                          <span>{currentFace[0] ?? '맑은 고딕'}</span>
                          <ChevronDown size={16} />
                        </StyledMenuTriggerBox>
                      </MenuTrigger>
                      <MenuContent style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {currentFace[0] &&
                          ![...fallbackFonts, ...localFonts].includes(currentFace[0]) && (
                            <MenuItem
                              key={currentFace[0]}
                              onSelect={() =>
                                updateCharacter('face', [currentFace[0]])
                              }
                            >
                              {currentFace[0]}
                            </MenuItem>
                          )}
                        {fallbackFonts.map((f) => (
                          <MenuItem
                            key={f}
                            onSelect={() => updateCharacter('face', [f])}
                          >
                            {f}
                          </MenuItem>
                        ))}
                        {localFonts.length > 0 && (
                          <>
                            <StyledHorizontalDivider />
                            {localFonts.map((f) => (
                              <MenuItem
                                key={f}
                                onSelect={() => updateCharacter('face', [f])}
                              >
                                {f}
                              </MenuItem>
                            ))}
                          </>
                        )}
                      </MenuContent>
                    </Menu>
                  </StyledFieldGroup>
                </StyledFieldRow>

                <StyledFieldRow>
                  <StyledFieldGroup>
                    <StyledFieldLabel>줄간격</StyledFieldLabel>
                    <Menu>
                      <MenuTrigger asChild>
                        <StyledMenuTriggerBox type="button">
                          <span>{currentLineSpacing}%</span>
                          <ChevronDown size={16} />
                        </StyledMenuTriggerBox>
                      </MenuTrigger>
                      <MenuContent>
                        {LINE_SPACINGS.map((s) => (
                          <MenuItem
                            key={s}
                            onSelect={() => updateParagraph('line_spacing', s)}
                          >
                            {s}%
                          </MenuItem>
                        ))}
                      </MenuContent>
                    </Menu>
                  </StyledFieldGroup>
                  <StyledFieldGroup>
                    <StyledFieldLabel>글머리 기호</StyledFieldLabel>
                    <Menu>
                      <MenuTrigger asChild>
                        <StyledMenuTriggerBox type="button">
                          <span>{currentMark ?? '없음'}</span>
                          <ChevronDown size={16} />
                        </StyledMenuTriggerBox>
                      </MenuTrigger>
                      <MenuContent>
                        {MARK_OPTIONS.map((m) => (
                          <MenuItem
                            key={m ?? '__none'}
                            onSelect={() => updateParagraph('mark', m)}
                          >
                            {m ?? '없음'}
                          </MenuItem>
                        ))}
                      </MenuContent>
                    </Menu>
                  </StyledFieldGroup>
                </StyledFieldRow>

                <StyledFieldRow>
                  <StyledFieldGroup>
                    <StyledFieldLabel>문단 위 간격</StyledFieldLabel>
                    <Menu>
                      <MenuTrigger asChild>
                        <StyledMenuTriggerBox type="button">
                          <span>{currentMarginTop}pt</span>
                          <ChevronDown size={16} />
                        </StyledMenuTriggerBox>
                      </MenuTrigger>
                      <MenuContent>
                        {PARAGRAPH_SPACINGS.map((s) => (
                          <MenuItem
                            key={s}
                            onSelect={() => updateParagraph('margin_top', s)}
                          >
                            {s}pt
                          </MenuItem>
                        ))}
                      </MenuContent>
                    </Menu>
                  </StyledFieldGroup>
                  <StyledFieldGroup>
                    <StyledFieldLabel>문단 아래 간격</StyledFieldLabel>
                    <Menu>
                      <MenuTrigger asChild>
                        <StyledMenuTriggerBox type="button">
                          <span>{currentMarginBottom}pt</span>
                          <ChevronDown size={16} />
                        </StyledMenuTriggerBox>
                      </MenuTrigger>
                      <MenuContent>
                        {PARAGRAPH_SPACINGS.map((s) => (
                          <MenuItem
                            key={s}
                            onSelect={() => updateParagraph('margin_bottom', s)}
                          >
                            {s}pt
                          </MenuItem>
                        ))}
                      </MenuContent>
                    </Menu>
                  </StyledFieldGroup>
                </StyledFieldRow>
              </StyledFieldsWrapper>

              {/* Attributes */}
              <div>
                <StyledFieldLabel>서식</StyledFieldLabel>
                <StyledAttrGroup style={{ marginTop: 4, width: 'fit-content' }}>
                  <StyledAttrButton
                    type="button"
                    $active={currentBold}
                    onClick={() => toggleCharBool('bold')}
                    title="굵게"
                  >
                    <strong>B</strong>
                  </StyledAttrButton>
                </StyledAttrGroup>
              </div>

              <StyledHorizontalDivider />

              {/* Preview */}
              <div>
                <StyledFieldLabel>미리보기</StyledFieldLabel>
                <StyledPreviewBox style={{ marginTop: 4 }}>
                  {Object.entries(style).map(([key, value]) => {
                    const previewStyle = buildPreviewStyle(
                      edits,
                      key,
                      character[value.character_style ?? ''],
                      paragraph[value.paragraph_style ?? '']
                    );
                    const rawMark: unknown = getParagraphValue(
                      edits,
                      key,
                      paragraph[value.paragraph_style ?? ''],
                      'mark'
                    );
                    const mark = rawMark === REMOVE_FIELD ? undefined : rawMark as string | undefined;
                    return (
                      <StyledPreviewLine key={key} $style={previewStyle}>
                        {mark ? `${mark} ` : ''}
                        {PREVIEW_TEXTS[key] ?? `${key} 텍스트`}
                      </StyledPreviewLine>
                    );
                  })}
                </StyledPreviewBox>
                <StyledPreviewNotice>
                  <Info size={12} />
                  미리보기는 실제와 다를 수 있으며, 내려받은 파일에는 정상 적용됩니다.
                </StyledPreviewNotice>
              </div>
            </StyledPropertiesPanel>
          </StyledContentRow>
        </StyledDialogBody>
      </Dialog.Content>
      <Dialog.Footer>
        <Button onClick={handleReset} size="large" variant="outlined">
          초기화
        </Button>
        <Button onClick={handleApply} size="large" variant="filled">
          적용
        </Button>
      </Dialog.Footer>
    </Dialog>
    </>
  );
};
