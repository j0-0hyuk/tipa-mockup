import {
  Button,
  Dialog,
  Flex,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  useToast
} from '@bichon/ds';
import type {
  CharacterStyle,
  ParagraphStyle,
  Theme
} from '@docshunt/docs-editor-wasm';
import {
  createFileRoute,
  Navigate,
  useNavigate
} from '@tanstack/react-router';
import { z } from 'zod';
import { ChevronDown, Info, TriangleAlert } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

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
import { StyledFunnelContentWrapper } from '@/routes/_authenticated/f/-route.style';
import { useModal } from '@/hooks/useModal';
import { useI18n } from '@/hooks/useI18n';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { postProductsExport } from '@/api/products/mutation';
import {
  getFileFromIndexedDB,
  deleteFileFromIndexedDB
} from '@/utils/file/fileStorage';
import { DailyLimitExceededModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/DailyLimitExceededModal';
import { FreeTrialExhaustedModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/FreeTrialExhaustedModal';
import { AllCreditsExhaustedModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/AllCreditsExhaustedModal';
import { InvalidXmlFileModal } from '@/routes/_authenticated/c/-components/MainPrompt/InvalidXmlFileModal';
import { XmlCharacterLimitModal } from '@/routes/_authenticated/c/-components/MainPrompt/XmlCharacterLimitModal';
import type { VisualSuggestion } from '@/routes/_authenticated/f/visual-suggestions/-components/SuggestionsTable';
import Capture from '@/routes/_authenticated/f/prompt/-capture';
import {
  StyledStepHeader,
  StyledTemplateName,
  StyledStepSubtitle,
  StyledInfoBanner,
  StyledSettingsFooter,
  StyledStyleCard,
  StyledCardTitle,
  StyledCardDescription,
  StyledFieldsWrapper,
  StyledFieldGroup,
  StyledFieldLabel,
  StyledMenuTriggerBox,
  StyledAttrGroup,
  StyledAttrButton,
  StyledPreviewBox,
  StyledPreviewLine,
  StyledPreviewNotice,
  StyledContentRow,
  StyledStyleList,
  StyledStylePill,
  StyledPropertiesPanel,
  StyledFieldRow,
  StyledHorizontalDivider
} from '@/routes/_authenticated/f/settings/-settings.style';

const FUNNEL_STORAGE_KEY = 'f-funnel-data';
const SUGGESTIONS_STORAGE_KEY = 'f-visual-suggestions';
const REMOVE_FIELD = Symbol('REMOVE_FIELD');

function getSavedFormData(productFileId: string) {
  try {
    const saved = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed.context?.productFileId !== productFileId) return null;
    return parsed.context?.formData ?? null;
  } catch {
    return null;
  }
}

function getSavedSuggestions(productFileId: string): VisualSuggestion[] {
  try {
    const saved = sessionStorage.getItem(SUGGESTIONS_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (parsed.productFileId !== productFileId) return [];
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

/** sessionStorage에서 저장된 theme 복원 */
function getSavedTheme(): Theme | null {
  try {
    const saved = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return parsed.context?.theme ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute(
  '/_authenticated/f/settings/$productFileId'
)({
  component: RouteComponent,
  validateSearch: z.object({
    fileName: z.string().optional()
  })
});

function RouteComponent() {
  const { productFileId } = Route.useParams();
  const { fileName } = Route.useSearch();
  const navigate = useNavigate();
  const templateFileId = Number(productFileId);
  const modal = useModal();
  const { t } = useI18n(['main', 'export']);
  const toast = useToast();
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());

  const savedTheme = getSavedTheme();
  const [theme, setTheme] = useState<Theme>(savedTheme ?? DEFAULT_THEME);
  const { fallbackFonts, localFonts, requestFonts } = useLocalFonts();

  const { style, character, paragraph } = theme;

  const [selectedKey, setSelectedKey] = useState(
    Object.keys(style)[0] ?? 'l1'
  );
  const [edits, setEdits] = useState<LocalEdits>({});

  useEffect(() => {
    requestFonts();
  }, [requestFonts]);

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
    modal.openModal(({ isOpen, onClose }) => (
      <Dialog isOpen={isOpen} onClose={onClose}>
        <Dialog.Content>
          <Flex direction="column" alignItems="center" gap={16} style={{ padding: '8px 0' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#FFECEE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TriangleAlert size={28} color="#F04452" />
            </div>
            <Flex direction="column" alignItems="center" gap={8}>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#25262C' }}>
                스타일을 초기화하시겠습니까?
              </span>
              <span style={{ fontSize: 14, color: '#8E919B', textAlign: 'center', lineHeight: '22px' }}>
                문서 스타일 설정이 기본값으로 되돌아갑니다.
                <br />
                이 작업은 되돌릴 수 없습니다.
              </span>
            </Flex>
          </Flex>
        </Dialog.Content>
        <Dialog.Footer>
          <Button variant="outlined" width="100%" size="large" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="warning"
            width="100%"
            size="large"
            onClick={() => {
              setTheme(DEFAULT_THEME);
              setEdits({});
              onClose();
            }}
          >
            초기화
          </Button>
        </Dialog.Footer>
      </Dialog>
    ));
  }, [modal]);

  /** 로컬 edits를 theme에 merge하여 최종 테마 반환 */
  const buildMergedTheme = useCallback(() => {
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

    return mergedTheme;
  }, [edits, style, theme]);

  const exportMutation = useMutation({
    mutationFn: postProductsExport,
    onSuccess: async (response) => {
      const exportedProductId = response.data.exportedProductId;

      const formData = getSavedFormData(productFileId);
      const referenceFileIds: string[] = formData?.referenceFileIds ?? [];
      for (const fileId of referenceFileIds) {
        await deleteFileFromIndexedDB(fileId);
      }

      if (exportedProductId) {
        navigate({
          to: '/f/output/$productFileId',
          params: {
            productFileId: String(exportedProductId)
          },
          search: {
            fileName: fileName ?? undefined,
            templateFileId: productFileId
          }
        });
        window.scrollTo(0, 0);
      }
    },
    onError: async (error) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isXmlCharacterLimitExceeded =
        error instanceof HTTPError &&
        error.response?.status === 413 &&
        errorMessage.includes('XML character limit exceeded');

      if (isXmlCharacterLimitExceeded) {
        modal.openModal(({ isOpen, onClose }) => (
          <XmlCharacterLimitModal
            isOpen={isOpen}
            onClose={onClose}
            showPdfConversion
          />
        ));
        return;
      }

      if (error instanceof HTTPError) {
        const httpStatus = error.response?.status;
        if (httpStatus === 400) {
          if (
            error.message ===
            '무료 이용 한도를 초과했습니다. 구독 후 무제한으로 이용하세요.'
          ) {
            modal.openModal(({ isOpen, onClose }) => (
              <FreeTrialExhaustedModal isOpen={isOpen} onClose={onClose} />
            ));
            return;
          }

          if (error.message === '유효한 XML 형식이 아닙니다.') {
            modal.openModal(({ isOpen, onClose }) => (
              <InvalidXmlFileModal isOpen={isOpen} onClose={onClose} />
            ));
            return;
          }

          toast.showToast(error.message, { duration: 4000 });
          return;
        }
      }

      toast.showToast(t('main:fillForm.output.error.title'), {
        duration: 4000
      });
    }
  });

  // 초안 이미지 캡처 관련 상태
  const [shouldCapture, setShouldCapture] = useState(false);
  const pendingThemeRef = useRef<Theme | null>(null);
  const draftMarkdown = getSavedFormData(productFileId)?.productContents ?? '';

  const executeExport = useCallback(
    async (
      mergedTheme: Theme,
      capturedImages?: { productImages: File[]; productImagesMetaData: Array<{ name: string; info: string }> }
    ) => {
      const formData = getSavedFormData(productFileId);
      if (!formData) {
        toast.showToast('세션 데이터가 만료되었습니다. 처음부터 다시 시작해주세요.', { duration: 4000 });
        navigate({ to: '/f/template' });
        return;
      }

      const referenceFileIds: string[] = formData.referenceFileIds ?? [];
      const referenceFiles: File[] = [];
      for (const fileId of referenceFileIds) {
        const result = await getFileFromIndexedDB(fileId);
        if (result) {
          referenceFiles.push(result.file);
        }
      }

      const savedSuggestions = getSavedSuggestions(productFileId);
      const selectedSuggestions = savedSuggestions.filter((s) => s.selected);
      const visualSuggestionsMetaData = selectedSuggestions.map((s) => ({
        name: s.title,
        info: s.prompt,
        position: s.position,
        gen_by: s.genBy
      }));

      const language: 'en' | 'ko' = 'ko';

      exportMutation.mutate({
        contents: {
          userPrompt: formData.resolvedPrompt ?? formData.prompt ?? '',
          productContents: formData.productContents ?? '',
          productImagesMetaData: capturedImages?.productImagesMetaData ?? [],
          svgSuggestions: visualSuggestionsMetaData,
          exportProductFileId: formData.exportProductFileId ?? undefined,
          templateFileId,
          language,
          theme: mergedTheme
        },
        referenceFiles: referenceFiles.length > 0 ? referenceFiles : undefined,
        productImages: capturedImages?.productImages
      });
    },
    [productFileId, templateFileId, exportMutation, toast, navigate]
  );

  const handleCaptureComplete = useCallback(
    (result: { productImages: File[]; productImagesMetaData: Array<{ name: string; info: string }> }) => {
      setShouldCapture(false);
      const theme = pendingThemeRef.current;
      pendingThemeRef.current = null;
      if (theme) {
        executeExport(theme, result);
      }
    },
    [executeExport]
  );

  /** 캡처가 필요하면 캡처 후 export, 아니면 바로 export */
  const startExport = useCallback(
    (mergedTheme: Theme) => {
      if (draftMarkdown) {
        pendingThemeRef.current = mergedTheme;
        setShouldCapture(true);
      } else {
        executeExport(mergedTheme);
      }
    },
    [draftMarkdown, executeExport]
  );

  const handleNext = useCallback(() => {
    if (exportMutation.isPending || shouldCapture) return;

    const mergedTheme = buildMergedTheme();

    try {
      const saved = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};

      sessionStorage.setItem(
        FUNNEL_STORAGE_KEY,
        JSON.stringify({
          ...parsed,
          step: 'settings',
          context: {
            ...parsed.context,
            theme: mergedTheme
          }
        })
      );
    } catch {
      // ignore
    }

    if (me.hasProAccess && me.freeCredit < me.productExportCredit) {
      if (me.paidCredit <= 0) {
        modal.openModal(({ isOpen, onClose }) => (
          <AllCreditsExhaustedModal isOpen={isOpen} onClose={onClose} />
        ));
        return;
      }

      modal.openModal(({ isOpen, onClose }) => (
        <DailyLimitExceededModal
          isOpen={isOpen}
          onClose={onClose}
          paidCredit={me.paidCredit}
          onConfirm={
            me.paidCredit > 0 ? () => startExport(mergedTheme) : undefined
          }
        />
      ));
      return;
    }

    startExport(mergedTheme);
  }, [buildMergedTheme, exportMutation.isPending, shouldCapture, me, modal, startExport]);

  const handleBack = useCallback(() => {
    navigate({
      to: '/f/visual-suggestions/$productFileId',
      params: { productFileId },
      search: fileName ? { fileName } : undefined
    });
  }, [navigate, productFileId, fileName]);

  if (!templateFileId) {
    return <Navigate to="/f/template" />;
  }

  const styleKeys = Object.keys(style);
  const safeSelectedKey = style[selectedKey]
    ? selectedKey
    : (styleKeys[0] ?? 'l1');

  if (styleKeys.length === 0) {
    return null;
  }

  const selectedCharStyle =
    character[style[safeSelectedKey].character_style ?? ''];
  const selectedParaStyle =
    paragraph[style[safeSelectedKey].paragraph_style ?? ''];

  const getChar = (field: keyof CharacterStyle) =>
    getCharacterValue(edits, safeSelectedKey, selectedCharStyle, field);
  const getPara = (field: keyof ParagraphStyle) => {
    const val: unknown = getParagraphValue(
      edits,
      safeSelectedKey,
      selectedParaStyle,
      field
    );
    return val === REMOVE_FIELD ? undefined : val;
  };

  const currentSize = (getChar('size') as number) ?? 12;
  const currentBold = (getChar('bold') as boolean) ?? false;
  const currentLineSpacing = (getPara('line_spacing') as number) ?? 160;
  const currentMark = getPara('mark') as string | undefined;
  const currentMarginTop = (getPara('margin_top') as number) ?? 0;
  const currentMarginBottom = (getPara('margin_bottom') as number) ?? 0;
  const currentFace = (getChar('face') as string[]) ?? [];

  return (
    <Flex
      direction="column"
      width="100%"
      style={{ minHeight: '0px', flex: 1 }}
    >
      <StyledFunnelContentWrapper>
        {/* 헤더 */}
        <StyledStepHeader>
          {fileName && (
            <StyledTemplateName>&apos;{fileName}&apos;</StyledTemplateName>
          )}
          <StyledStepSubtitle>문서 생성 세부 설정</StyledStepSubtitle>
        </StyledStepHeader>

        {/* 안내 배너 */}
        <StyledInfoBanner>
          <Info size={16} />
          <span>
            완벽한 사업계획서를 위해 문서의 스타일 옵션을 확인해주세요.
          </span>
        </StyledInfoBanner>

        {/* 문서 스타일 카드 */}
        <StyledStyleCard>
          <Flex direction="column" gap={4}>
            <StyledCardTitle>문서 스타일</StyledCardTitle>
            <StyledCardDescription>
              문서 전체에 적용되는 스타일을 설정합니다
            </StyledCardDescription>
          </Flex>

          <StyledContentRow>
            {/* Left: style list */}
            <StyledStyleList>
              {styleKeys.map((key) => (
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
                      <MenuContent style={{ minWidth: 'var(--radix-dropdown-menu-trigger-width)' }}>
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
                      <MenuContent style={{ minWidth: 'var(--radix-dropdown-menu-trigger-width)', maxHeight: 300, overflowY: 'auto' }}>
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
                      <MenuContent style={{ minWidth: 'var(--radix-dropdown-menu-trigger-width)' }}>
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
                      <MenuContent style={{ minWidth: 'var(--radix-dropdown-menu-trigger-width)' }}>
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
                      <MenuContent style={{ minWidth: 'var(--radix-dropdown-menu-trigger-width)' }}>
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
                      <MenuContent style={{ minWidth: 'var(--radix-dropdown-menu-trigger-width)' }}>
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

              {/* 서식 */}
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

              {/* 미리보기 */}
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
                    const mark =
                      rawMark === REMOVE_FIELD
                        ? undefined
                        : (rawMark as string | undefined);
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
                  미리보기는 실제와 다를 수 있으며, 내려받은 파일에는 정상
                  적용됩니다.
                </StyledPreviewNotice>
              </div>
            </StyledPropertiesPanel>
          </StyledContentRow>

          {/* 기본값 초기화 */}
          <Flex justify="flex-end">
            <Button
              type="button"
              variant="outlined"
              size="medium"
              onClick={handleReset}
            >
              기본값 초기화
            </Button>
          </Flex>
        </StyledStyleCard>
      </StyledFunnelContentWrapper>

      {/* 푸터 */}
      <StyledSettingsFooter>
        <Button
          type="button"
          variant="outlined"
          size="large"
          onClick={handleBack}
        >
          이전
        </Button>
        <Button
          type="button"
          variant="filled"
          size="large"
          onClick={handleNext}
          disabled={exportMutation.isPending || shouldCapture}
          style={{ marginLeft: 'auto' }}
        >
          {exportMutation.isPending || shouldCapture ? '생성 중...' : '사업계획서 생성'}
        </Button>
      </StyledSettingsFooter>

      {/* 초안 이미지 캡처 (off-screen) */}
      {draftMarkdown && (
        <Capture
          markdown={draftMarkdown}
          shouldCapture={shouldCapture}
          onCaptureComplete={handleCaptureComplete}
        />
      )}
    </Flex>
  );
}
