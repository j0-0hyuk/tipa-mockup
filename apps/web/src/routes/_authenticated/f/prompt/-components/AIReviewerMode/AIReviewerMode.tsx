import { useEffect, useRef, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import {
  TextField,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  IconButton
} from '@bichon/ds';
import { WandSparkles, Square } from 'lucide-react';
import { colors } from '@bichon/ds';
import { motion } from 'motion/react';

import type { DetailInputPageForm } from '@/schema/main/detailInput';
import { MAX_DETAIL_INPUT_PAGE_LENGTH } from '@/schema/main/detailInput';
import { DETAIL_INPUT_FIELDS } from '@/constants/detailInput.constant';
import { generateAI } from '@/api/ai';
import { MAX_AI_PROMPT_LENGTH } from '@/schema/api/ai';
import { useToast } from '@bichon/ds';

import {
  StyledFieldBlock,
  StyledFieldLabel,
  StyledFieldMetaRow,
  StyledFieldError,
  StyledAIButtonWrapper
} from '@/routes/_authenticated/f/prompt/-components/AIReviewerMode/AIReviewerMode.style';

// --- AI 어시스턴트 관련 상수 / 유틸 ---

const AI_MIN_PROMPT_LENGTH = 7;
const AI_MIN_PROMPT_WARNING_TEXT = `${AI_MIN_PROMPT_LENGTH}글자 이상 입력해주세요.`;
const AI_LOW_INFORMATION_TOOLTIP =
  '의미 있는 문장으로 입력해주세요. 같은 글자 반복 입력은 AI 심사가 어렵습니다.';
const AI_LOW_INFO_MIN_CHECK_LENGTH = 30;
const AI_LOW_INFO_REPEAT_RATIO = 0.85;

const FIELD_TYPE_MAP: Record<keyof DetailInputPageForm, string> = {
  problem: 'problem',
  solution: 'solution',
  target: 'target',
  competitor: 'competitor',
  market: 'market',
  traction: 'traction',
  strategy: 'strategy',
  businessModel: 'businessModel',
  milestone: 'milestone',
  financialPlan: 'financialPlan',
  teamAndVision: 'teamVision'
};

const FIELD_LABEL_MAP = DETAIL_INPUT_FIELDS.reduce<
  Record<keyof DetailInputPageForm, string>
>(
  (acc, field) => {
    acc[field.name] = field.label;
    return acc;
  },
  {} as Record<keyof DetailInputPageForm, string>
);

const isBlankText = (value?: string | null) =>
  value == null || value.trim().length === 0;

const getTextLength = (value: string) => Array.from(value).length;

const isLowInformationInput = (value: string) => {
  const normalized = Array.from(value.replace(/\s+/g, ''));
  if (normalized.length < AI_LOW_INFO_MIN_CHECK_LENGTH) return false;

  const frequencies = new Map<string, number>();
  let maxFrequency = 0;
  normalized.forEach((char) => {
    const next = (frequencies.get(char) ?? 0) + 1;
    frequencies.set(char, next);
    if (next > maxFrequency) maxFrequency = next;
  });
  return maxFrequency / normalized.length >= AI_LOW_INFO_REPEAT_RATIO;
};

type AIBlockedReason = 'NONE' | 'PROMPT_TOO_LONG' | 'LOW_INFORMATION' | 'TOO_SHORT';

const getBlockedReason = ({
  currentValue,
  promptLength
}: {
  currentValue: string;
  promptLength: number;
}): AIBlockedReason => {
  if (promptLength > MAX_AI_PROMPT_LENGTH) return 'PROMPT_TOO_LONG';
  if (promptLength < AI_MIN_PROMPT_LENGTH) return 'TOO_SHORT';
  if (currentValue.trim().length > 0 && isLowInformationInput(currentValue))
    return 'LOW_INFORMATION';
  return 'NONE';
};

const getBlockedTooltip = (reason: AIBlockedReason, promptLength: number) => {
  if (reason === 'PROMPT_TOO_LONG')
    return `AI 프롬프트가 너무 깁니다. ${promptLength}/${MAX_AI_PROMPT_LENGTH}자 (공백 포함)`;
  if (reason === 'LOW_INFORMATION') return AI_LOW_INFORMATION_TOOLTIP;
  if (reason === 'TOO_SHORT') return AI_MIN_PROMPT_WARNING_TEXT;
  return '쉽고 빠르게 프롬프트 작성';
};

const buildAIPrompt = ({
  fieldName,
  currentValue,
  formValues
}: {
  fieldName: keyof DetailInputPageForm;
  currentValue: string;
  formValues: DetailInputPageForm;
}) => {
  const fieldIndex = DETAIL_INPUT_FIELDS.findIndex(({ name }) => name === fieldName);
  const previousContext =
    fieldIndex <= 0
      ? []
      : DETAIL_INPUT_FIELDS.slice(0, fieldIndex)
          .map(({ name }) => {
            const value = formValues[name];
            if (isBlankText(value) || value == null) return null;
            return `${FIELD_LABEL_MAP[name]}\n${value.trim()}`;
          })
          .filter((v): v is string => v !== null);

  const trimmed = currentValue.trim();

  if (previousContext.length === 0) return trimmed;

  if (trimmed.length === 0) {
    return [
      '[작성 대상 문항]',
      FIELD_LABEL_MAP[fieldName],
      '[이전 입력 정보]',
      previousContext.join('\n\n'),
      '[요청]',
      '위 정보를 바탕으로 작성 대상 문항을 구체적으로 작성해주세요.'
    ].join('\n\n');
  }

  return [
    '[현재 입력]',
    `${FIELD_LABEL_MAP[fieldName]}\n${trimmed}`,
    '[이전 입력 정보]',
    previousContext.join('\n\n')
  ].join('\n\n');
};

// --- 컴포넌트 ---

interface AIReviewerModeProps {
  form: UseFormReturn<DetailInputPageForm>;
}

export default function AIReviewerMode({ form }: AIReviewerModeProps) {
  const toast = useToast();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const watchedValues = form.watch();

  useEffect(() => {
    const controllers = abortControllersRef.current;
    return () => {
      controllers.forEach((c) => c.abort());
      controllers.clear();
    };
  }, []);

  const handleAIAssistant = async (
    fieldName: keyof DetailInputPageForm,
    currentValue: string
  ) => {
    const formValues = form.getValues();
    const aiPrompt = buildAIPrompt({ fieldName, currentValue, formValues });
    const aiPromptLength = getTextLength(aiPrompt);
    const reason = getBlockedReason({ currentValue, promptLength: aiPromptLength });

    if (reason !== 'NONE') {
      if (reason === 'TOO_SHORT') {
        form.setError(fieldName, { type: 'manual', message: AI_MIN_PROMPT_WARNING_TEXT });
      } else {
        toast.showToast(getBlockedTooltip(reason, aiPromptLength), { duration: 2000 });
      }
      return;
    }

    if (form.getFieldState(fieldName).error?.message === AI_MIN_PROMPT_WARNING_TEXT) {
      form.clearErrors(fieldName);
    }

    const existing = abortControllersRef.current.get(fieldName);
    if (existing) existing.abort();

    const controller = new AbortController();
    abortControllersRef.current.set(fieldName, controller);
    setLoadingFields((prev) => new Set(prev).add(fieldName));

    try {
      const response = await generateAI(
        { prompt: aiPrompt, type: FIELD_TYPE_MAP[fieldName] },
        controller.signal
      );
      form.setValue(fieldName, response.text, { shouldValidate: true, shouldDirty: true });
      toast.showToast('AI 심사가 완료되었습니다.', { duration: 2000 });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        toast.showToast('요청이 취소되었습니다.', { duration: 2000 });
        return;
      }
      let errorMessage = 'AI 생성 중 오류가 발생했습니다.';
      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          errorMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
        } else if (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError')
        ) {
          errorMessage = '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
        } else {
          errorMessage = error.message;
        }
      }
      toast.showToast(errorMessage, { duration: 3000 });
    } finally {
      abortControllersRef.current.delete(fieldName);
      setLoadingFields((prev) => {
        const next = new Set(prev);
        next.delete(fieldName);
        return next;
      });
    }
  };

  const handleCancel = (fieldName: string) => {
    const controller = abortControllersRef.current.get(fieldName);
    if (controller) controller.abort();
  };

  return (
    <div>
      {DETAIL_INPUT_FIELDS.map(({ name, label, placeholder }) => (
        <Controller
          key={name}
          control={form.control}
          name={name}
          render={({ field, fieldState }) => {
            const isFocused = focusedField === name;
            const isLoading = loadingFields.has(name);
            const shouldShowAI = isFocused || fieldState.isTouched || isLoading;

            const renderedPrompt = buildAIPrompt({
              fieldName: name,
              currentValue: field.value ?? '',
              formValues: watchedValues
            });
            const promptLength = getTextLength(renderedPrompt);
            const reason = getBlockedReason({
              currentValue: field.value ?? '',
              promptLength
            });
            const canRequestAI = reason === 'NONE';

            return (
              <StyledFieldBlock>
                <StyledFieldLabel htmlFor={`ai-reviewer-${name}`}>
                  {label}
                </StyledFieldLabel>
                <TextField
                  id={`ai-reviewer-${name}`}
                  multiline
                  minRows={4}
                  placeholder={placeholder}
                  maxLength={MAX_DETAIL_INPUT_PAGE_LENGTH}
                  width="100%"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(eventOrValue) => {
                    field.onChange(eventOrValue);
                    const value =
                      typeof eventOrValue === 'string'
                        ? eventOrValue
                        : ((
                            eventOrValue?.target as
                              | HTMLTextAreaElement
                              | HTMLInputElement
                              | undefined
                          )?.value ?? '');
                    const nextFormValues = {
                      ...form.getValues(),
                      [name]: value
                    } as DetailInputPageForm;
                    const nextPrompt = buildAIPrompt({
                      fieldName: name,
                      currentValue: value,
                      formValues: nextFormValues
                    });
                    if (
                      getTextLength(nextPrompt) >= AI_MIN_PROMPT_LENGTH &&
                      fieldState.error?.message === AI_MIN_PROMPT_WARNING_TEXT
                    ) {
                      form.clearErrors(name);
                    }
                  }}
                  onFocus={() => setFocusedField(name)}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                />
                {(fieldState.error?.message || shouldShowAI) && (
                  <StyledFieldMetaRow>
                    {fieldState.error?.message && (
                      <StyledFieldError>{fieldState.error.message}</StyledFieldError>
                    )}
                    {shouldShowAI && (
                      <StyledAIButtonWrapper>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {isLoading ? (
                                <span style={{ display: 'inline-flex' }}>
                                  <IconButton
                                    variant="outlined"
                                    size="medium"
                                    onClick={() => handleCancel(name)}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: 20,
                                        height: 20,
                                        position: 'relative',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      <motion.span
                                        style={{
                                          position: 'absolute',
                                          display: 'inline-flex',
                                          opacity: 0.85
                                        }}
                                        animate={{ rotate: [45, 405] }}
                                        transition={{
                                          duration: 1.2,
                                          repeat: Infinity,
                                          ease: 'linear'
                                        }}
                                      >
                                        <Square
                                          size={18}
                                          color={colors.bgAccent}
                                          fill={colors.bgAccent}
                                        />
                                      </motion.span>
                                      <motion.span
                                        style={{
                                          position: 'absolute',
                                          display: 'inline-flex',
                                          opacity: 0.75
                                        }}
                                        animate={{ rotate: [-45, -405] }}
                                        transition={{
                                          duration: 1.6,
                                          repeat: Infinity,
                                          ease: 'linear'
                                        }}
                                      >
                                        <Square
                                          size={18}
                                          color={colors.bgAccentDark}
                                          fill={colors.bgAccentDark}
                                        />
                                      </motion.span>
                                    </span>
                                  </IconButton>
                                </span>
                              ) : (
                                <span style={{ display: 'inline-flex' }}>
                                  <Button
                                    type="button"
                                    variant="outlined"
                                    size="medium"
                                    onClick={() =>
                                      handleAIAssistant(name, field.value ?? '')
                                    }
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    <WandSparkles
                                      size={20}
                                      color={colors.textPrimary}
                                    />
                                    AI 심사역
                                  </Button>
                                </span>
                              )}
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              {isLoading
                                ? '대답 생성 중지'
                                : canRequestAI
                                  ? '쉽고 빠르게 프롬프트 작성'
                                  : getBlockedTooltip(reason, promptLength)}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </StyledAIButtonWrapper>
                    )}
                  </StyledFieldMetaRow>
                )}
              </StyledFieldBlock>
            );
          }}
        />
      ))}
    </div>
  );
}
