import { FormProvider, useForm, Controller } from 'react-hook-form';
import i18n from '@/i18n';
import { getAccountMeQueryOptions } from '@/query/options/account';
import {
  StyledButtonWrapper,
  StyledDetailInputContainer,
  StyledDetailInputContents,
  StyledFieldBlock,
  StyledFieldError,
  StyledFieldMetaRow,
  StyledFieldLabel,
  StyledFooter
} from '@/routes/_authenticated/c/detail-input/-detail-input.style';

import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MAX_DETAIL_INPUT_PAGE_LENGTH,
  detailInputPageFormSchema,
  detailInputPageFormToApiForm,
  type DetailInputPageForm
} from '@/schema/main/detailInput';
import {
  useFormAutoSave,
  getSavedFormValues,
  clearSavedFormValues
} from '@/hooks/useFormAutoSave';

import {
  TextField,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@bichon/ds';
import { IconButton } from '@docs-front/ui';
import { useToast } from '@docs-front/ui';
import { useModal } from '@/hooks/useModal';
import {
  useQueryClient,
  useSuspenseQuery,
  useMutation
} from '@tanstack/react-query';
import { InsufficientCreditProductCreationModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/InsufficientCreditProductCreationModal';
import { DailyLimitExceededModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/DailyLimitExceededModal';
import { AllCreditsExhaustedModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/AllCreditsExhaustedModal';
import { getProductsQueryOptions } from '@/query/options/products';
import { postProductChatMessages, postProducts } from '@/api/products/mutation';
import { onboardingFormToUIMessage } from '@/ai/utils';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useEffect, useRef, useState } from 'react';
import { TitleToggle } from '@/routes/_authenticated/c/-components/TitleToggle/TitleToggle';
import { DETAIL_INPUT_FIELDS } from '@/constants/detailInput.constant';
import { generateAI } from '@/api/ai';
import { MAX_AI_PROMPT_LENGTH } from '@/schema/api/ai';
import { StyledAIAssistantButtonWrapper } from '@/routes/_authenticated/c/detail-input/-detail-input.style';
import { WandSparkles, Square } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { motion } from 'motion/react';

const FORM_STORAGE_KEY = 'detail-input-form';

const DEFAULT_PAGE_FORM_VALUES: DetailInputPageForm = {
  problem: '',
  solution: '',
  target: '',
  competitor: '',
  market: '',
  traction: '',
  strategy: '',
  businessModel: '',
  milestone: '',
  financialPlan: '',
  teamAndVision: ''
};

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
  // NOTE: form field name is `teamAndVision`, prompt type key is `teamVision`.
  teamAndVision: 'teamVision'
};

const AI_MIN_PROMPT_LENGTH = 7;
const AI_MIN_PROMPT_WARNING_TEXT = `${AI_MIN_PROMPT_LENGTH}글자 이상 입력해주세요.`;
const AI_LOW_INFORMATION_TOOLTIP =
  '의미 있는 문장으로 입력해주세요. 같은 글자 반복 입력은 AI 심사가 어렵습니다.';
const AI_LOW_INFO_MIN_CHECK_LENGTH = 30;
const AI_LOW_INFO_REPEAT_RATIO = 0.85;

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
const getTrimmedTextLength = (value: string) => Array.from(value.trim()).length;
const getPromptTooLongTooltip = (promptLength: number) =>
  `AI 프롬프트가 너무 깁니다. ${promptLength}/${MAX_AI_PROMPT_LENGTH}자 (공백 포함)`;
const isLowInformationInput = (value: string) => {
  const normalized = Array.from(value.replace(/\s+/g, ''));
  if (normalized.length < AI_LOW_INFO_MIN_CHECK_LENGTH) {
    return false;
  }

  const frequencies = new Map<string, number>();
  let maxFrequency = 0;

  normalized.forEach((char) => {
    const next = (frequencies.get(char) ?? 0) + 1;
    frequencies.set(char, next);
    if (next > maxFrequency) {
      maxFrequency = next;
    }
  });

  return maxFrequency / normalized.length >= AI_LOW_INFO_REPEAT_RATIO;
};

type AIAssistantBlockedReason =
  | 'NONE'
  | 'PROMPT_TOO_LONG'
  | 'LOW_INFORMATION'
  | 'TOO_SHORT';

const getAIAssistantBlockedReason = ({
  currentValue,
  promptLength
}: {
  currentValue: string;
  promptLength: number;
}) => {
  if (promptLength > MAX_AI_PROMPT_LENGTH) {
    return 'PROMPT_TOO_LONG';
  }

  if (promptLength < AI_MIN_PROMPT_LENGTH) {
    return 'TOO_SHORT';
  }

  const trimmedLength = getTrimmedTextLength(currentValue);

  if (trimmedLength > 0 && isLowInformationInput(currentValue)) {
    return 'LOW_INFORMATION';
  }

  return 'NONE';
};

const getAIAssistantBlockedTooltip = (
  reason: AIAssistantBlockedReason,
  promptLength: number
) => {
  if (reason === 'PROMPT_TOO_LONG') {
    return getPromptTooLongTooltip(promptLength);
  }
  if (reason === 'LOW_INFORMATION') {
    return AI_LOW_INFORMATION_TOOLTIP;
  }
  if (reason === 'TOO_SHORT') {
    return AI_MIN_PROMPT_WARNING_TEXT;
  }
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
  const fieldIndex = DETAIL_INPUT_FIELDS.findIndex(
    ({ name }) => name === fieldName
  );
  const previousInputContext =
    fieldIndex <= 0
      ? []
      : DETAIL_INPUT_FIELDS.slice(0, fieldIndex)
          .map(({ name }) => {
            const value = formValues[name];
            if (isBlankText(value) || value == null) return null;
            return `${FIELD_LABEL_MAP[name]}\n${value.trim()}`;
          })
          .filter((value): value is string => value !== null);
  const trimmedCurrentValue = currentValue.trim();

  if (previousInputContext.length === 0) {
    return trimmedCurrentValue;
  }

  if (trimmedCurrentValue.length === 0) {
    return [
      '[작성 대상 문항]',
      FIELD_LABEL_MAP[fieldName],
      '[이전 입력 정보]',
      previousInputContext.join('\n\n'),
      '[요청]',
      '위 정보를 바탕으로 작성 대상 문항을 구체적으로 작성해주세요.'
    ].join('\n\n');
  }

  return [
    '[현재 입력]',
    `${FIELD_LABEL_MAP[fieldName]}\n${trimmedCurrentValue}`,
    '[이전 입력 정보]',
    previousInputContext.join('\n\n')
  ].join('\n\n');
};

export const Route = createFileRoute('/_authenticated/c/detail-input')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { queryClient, toast } = context;
    const account = await queryClient.ensureQueryData(
      getAccountMeQueryOptions()
    );
    const totalCredit = account.freeCredit + account.paidCredit;
    if (totalCredit < account.productCreationCredit) {
      toast.open({
        content: i18n.t('creditPlan:insufficient.title'),
        duration: 3000
      });
      throw redirect({ to: '/credit-plan', replace: true });
    }
  }
});

function RouteComponent() {
  const [toggleValue, setToggleValue] = useState<'left' | 'right'>('right');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const modal = useModal();
  const toast = useToast();
  const { isMobile } = useBreakPoints();
  const theme = useTheme();

  const form = useForm<DetailInputPageForm>({
    resolver: zodResolver(detailInputPageFormSchema),
    defaultValues: getSavedFormValues(
      FORM_STORAGE_KEY,
      DEFAULT_PAGE_FORM_VALUES
    )
  });

  useFormAutoSave(
    form.control,
    FORM_STORAGE_KEY,
    1000,
    [],
    loadingFields.size === 0
  );
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());

  const postProductsMutation = useMutation<
    number,
    Error,
    { contents: Record<string, string>; files?: File[] }
  >({
    mutationFn: postProducts,
    throwOnError: true
  });
  const watchedValues = form.watch();
  const isSubmitDisabled =
    postProductsMutation.isPending ||
    Object.values(watchedValues).every((value) => isBlankText(value));

  const { mutateAsync: postChatMessagesMutateAsync } = useMutation({
    mutationFn: ({
      chatMessage,
      productId
    }: {
      chatMessage: string[];
      productId: number;
    }) => postProductChatMessages(productId, { chatMessage })
  });

  const proceedWithRequest = async (
    apiForm: ReturnType<typeof detailInputPageFormToApiForm>
  ) => {
    const productId = await postProductsMutation.mutateAsync(apiForm);
    await postChatMessagesMutateAsync({
      chatMessage: onboardingFormToUIMessage(apiForm).map((message) =>
        JSON.stringify(message)
      ),
      productId
    });

    queryClient.invalidateQueries(getProductsQueryOptions());
    clearSavedFormValues(FORM_STORAGE_KEY);

    navigate({
      to: '/c/$productId',
      params: { productId: productId.toString() }
    });
  };

  const checkCreditAndProceed = (
    apiForm: ReturnType<typeof detailInputPageFormToApiForm>
  ) => {
    if (!me.hasProAccess) {
      const totalCredit = me.freeCredit + me.paidCredit;
      if (totalCredit < me.productCreationCredit) {
        modal.openModal(({ isOpen, onClose }) => (
          <InsufficientCreditProductCreationModal
            isOpen={isOpen}
            onClose={onClose}
            totalCredit={totalCredit}
            productCreationCredit={me.productCreationCredit}
          />
        ));
        return;
      }
    }

    if (me.hasProAccess && me.freeCredit < me.productCreationCredit) {
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
          onConfirm={() => {
            void proceedWithRequest(apiForm);
          }}
        />
      ));
      return;
    }

    void proceedWithRequest(apiForm);
  };

  const onSubmit = (data: DetailInputPageForm) => {
    if (Object.values(data).every((value) => isBlankText(value))) {
      toast.open({
        content: '내용을 입력해주세요.',
        duration: 2000
      });
      return;
    }

    const apiForm = detailInputPageFormToApiForm(data);
    checkCreditAndProceed(apiForm);
  };

  useEffect(() => {
    return () => {
      abortControllersRef.current.forEach((controller) => controller.abort());
      abortControllersRef.current.clear();
    };
  }, []);

  return (
    <StyledDetailInputContainer
      $isMobile={isMobile}
      style={{ position: 'relative' }}
    >
      <TitleToggle toggleValue={toggleValue} onToggleChange={setToggleValue} />
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const tag = (e.target as HTMLElement).tagName;
              if (tag !== 'TEXTAREA') {
                e.preventDefault();
                e.stopPropagation();
              }
            }
          }}
        >
          <StyledDetailInputContents $isMobile={isMobile}>
            {DETAIL_INPUT_FIELDS.map(({ name, label, placeholder }) => (
              <Controller
                key={name}
                control={form.control}
                name={name}
                render={({ field, fieldState }) => {
                  const handleAIAssistant = async () => {
                    const currentValue = field.value ?? '';
                    const formValues = form.getValues();
                    const aiPrompt = buildAIPrompt({
                      fieldName: name,
                      currentValue,
                      formValues
                    });
                    const aiPromptLength = getTextLength(aiPrompt);
                    const blockedReason = getAIAssistantBlockedReason({
                      currentValue,
                      promptLength: aiPromptLength
                    });
                    const canRequestAI = blockedReason === 'NONE';

                    if (!canRequestAI) {
                      if (blockedReason === 'TOO_SHORT') {
                        form.setError(name, {
                          type: 'manual',
                          message: AI_MIN_PROMPT_WARNING_TEXT
                        });
                        return;
                      }

                      toast.open({
                        content: getAIAssistantBlockedTooltip(
                          blockedReason,
                          aiPromptLength
                        ),
                        duration: 2000
                      });
                      return;
                    }

                    if (
                      form.getFieldState(name).error?.message ===
                      AI_MIN_PROMPT_WARNING_TEXT
                    ) {
                      form.clearErrors(name);
                    }

                    const existingController =
                      abortControllersRef.current.get(name);
                    if (existingController) {
                      existingController.abort();
                    }

                    const abortController = new AbortController();
                    abortControllersRef.current.set(name, abortController);
                    setLoadingFields((prev) => new Set(prev).add(name));

                    try {
                      const response = await generateAI(
                        {
                          prompt: aiPrompt,
                          type: FIELD_TYPE_MAP[name]
                        },
                        abortController.signal
                      );
                      form.setValue(name, response.text, {
                        shouldValidate: true,
                        shouldDirty: true
                      });
                      toast.open({
                        content: 'AI 심사가 완료되었습니다.',
                        duration: 2000
                      });
                    } catch (error) {
                      if (
                        error instanceof Error &&
                        error.name === 'AbortError'
                      ) {
                        toast.open({
                          content: '요청이 취소되었습니다.',
                          duration: 2000
                        });
                        return;
                      }
                      console.error('AI 생성 실패:', error);
                      let errorMessage = 'AI 생성 중 오류가 발생했습니다.';

                      if (error instanceof Error) {
                        if (error.name === 'TimeoutError') {
                          errorMessage =
                            '요청 시간이 초과되었습니다. 다시 시도해주세요.';
                        } else if (
                          error.message.includes('Failed to fetch') ||
                          error.message.includes('NetworkError')
                        ) {
                          errorMessage =
                            '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
                        } else {
                          errorMessage = error.message;
                        }
                      }

                      toast.open({
                        content: errorMessage,
                        duration: 3000
                      });
                    } finally {
                      abortControllersRef.current.delete(name);
                      setLoadingFields((prev) => {
                        const next = new Set(prev);
                        next.delete(name);
                        return next;
                      });
                    }
                  };

                  const handleCancel = () => {
                    const abortController =
                      abortControllersRef.current.get(name);
                    if (abortController) {
                      abortController.abort();
                    }
                  };

                  const isFocused = focusedField === name;
                  const isLoading = loadingFields.has(name);
                  const shouldShowAIAssistant =
                    isFocused || fieldState.isTouched || isLoading;
                  const renderedAIPrompt = buildAIPrompt({
                    fieldName: name,
                    currentValue: field.value ?? '',
                    formValues: watchedValues
                  });
                  const renderedAIPromptLength =
                    getTextLength(renderedAIPrompt);
                  const blockedReason = getAIAssistantBlockedReason({
                    currentValue: field.value ?? '',
                    promptLength: renderedAIPromptLength
                  });
                  const canRequestAI = blockedReason === 'NONE';

                  return (
                    <StyledFieldBlock>
                      <StyledFieldLabel htmlFor={`detail-input-${name}`}>
                        {label}
                      </StyledFieldLabel>
                      <TextField
                        id={`detail-input-${name}`}
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
                            fieldState.error?.message ===
                              AI_MIN_PROMPT_WARNING_TEXT
                          ) {
                            form.clearErrors(name);
                          }
                        }}
                        onFocus={() => setFocusedField(name)}
                        onBlur={() => setFocusedField(null)}
                        disabled={isLoading}
                      />
                      {(fieldState.error?.message || shouldShowAIAssistant) && (
                        <StyledFieldMetaRow>
                          {fieldState.error?.message && (
                            <StyledFieldError>
                              {fieldState.error.message}
                            </StyledFieldError>
                          )}
                          {shouldShowAIAssistant && (
                            <StyledAIAssistantButtonWrapper>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    {isLoading ? (
                                      <span style={{ display: 'inline-flex' }}>
                                        <IconButton
                                          variant="outlined"
                                          size="medium"
                                          onClick={handleCancel}
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
                                              animate={{
                                                rotate: [45, 405]
                                              }}
                                              transition={{
                                                duration: 1.2,
                                                repeat: Infinity,
                                                ease: 'linear'
                                              }}
                                            >
                                              <Square
                                                size={18}
                                                color={theme.color.bgAccent}
                                                fill={theme.color.bgAccent}
                                              />
                                            </motion.span>
                                            <motion.span
                                              style={{
                                                position: 'absolute',
                                                display: 'inline-flex',
                                                opacity: 0.75
                                              }}
                                              animate={{
                                                rotate: [-45, -405]
                                              }}
                                              transition={{
                                                duration: 1.6,
                                                repeat: Infinity,
                                                ease: 'linear'
                                              }}
                                            >
                                              <Square
                                                size={18}
                                                color={theme.color.bgAccentDark}
                                                fill={theme.color.bgAccentDark}
                                              />
                                            </motion.span>
                                          </span>
                                        </IconButton>
                                      </span>
                                    ) : (
                                      <span style={{ display: 'inline-flex' }}>
                                        <Button
                                          type="button"
                                          variant={'outlined'}
                                          size="medium"
                                          onClick={handleAIAssistant}
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                          }}
                                        >
                                          <WandSparkles
                                            size={20}
                                            color={theme.color.textPrimary}
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
                                        : getAIAssistantBlockedTooltip(
                                            blockedReason,
                                            renderedAIPromptLength
                                          )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </StyledAIAssistantButtonWrapper>
                          )}
                        </StyledFieldMetaRow>
                      )}
                    </StyledFieldBlock>
                  );
                }}
              />
            ))}
          </StyledDetailInputContents>
          <StyledFooter>
            <StyledButtonWrapper>
              <Button
                type="submit"
                variant="filled"
                size="large"
                disabled={isSubmitDisabled}
              >
                초안 생성하기
              </Button>
            </StyledButtonWrapper>
          </StyledFooter>
        </form>
      </FormProvider>
    </StyledDetailInputContainer>
  );
}
