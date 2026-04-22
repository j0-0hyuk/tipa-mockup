import { useEffect } from 'react';
import {
  File,
  LoaderCircle,
  LockKeyhole,
  Paperclip,
  X
} from 'lucide-react';
import {
  Flex,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  IconButton,
  Tooltip
} from '@docs-front/ui';
import type { Control } from 'react-hook-form';
import { useI18n } from '@/hooks/useI18n';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import type { ExportPromptForm } from '@/schema/main/export';
import type { GetMyAccountResponse } from '@/schema/api/accounts/accounts';
import { useReferenceFiles } from '@/routes/_authenticated/-components/ReferenceDropzone/useReferenceFiles.tsx';
import {
  StyledBadgeText,
  StyledFileBadge,
  StyledFileDropzone,
  StyledMainTextarea,
  StyledShadowFlex,
  StyledReferenceHintList,
  StyledSpinningIcon
} from '@/routes/_authenticated/f/prompt/-components/FillFormPromptSection/FillFormPromptSection.style';

interface FillFormPromptSectionProps {
  control: Control<ExportPromptForm>;
  disabled?: boolean;
  me: GetMyAccountResponse;
  onValidationStateChange?: (isValidating: boolean) => void;
}

export default function FillFormPromptSection({
  control,
  disabled = false,
  me,
  onValidationStateChange
}: FillFormPromptSectionProps) {
  const { t } = useI18n(['main']);
  const { sm } = useBreakPoints();

  const {
    files,
    isDragOver,
    isValidatingFiles,
    validatingFiles,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    openFileInput,
    fileInputRef,
    handleFileInputChange,
    removeFile
  } = useReferenceFiles({
    fieldName: 'references',
    disabled: disabled || !me.hasProAccess,
    excludeImageExtensions: true,
    shouldDirty: true
  });

  useEffect(() => {
    onValidationStateChange?.(isValidatingFiles);
  }, [isValidatingFiles, onValidationStateChange]);

  useEffect(() => {
    return () => {
      onValidationStateChange?.(false);
    };
  }, [onValidationStateChange]);

  return (
    <StyledShadowFlex width="100%" direction="column">
      <StyledFileDropzone
        $isDragOver={isDragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <FormField
          control={control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StyledMainTextarea
                  $sm={sm}
                  placeholder={t('main:fillForm.prompt.placeholder')}
                  maxLength={10000}
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(files.length > 0 || files.length >= 3) && (
          <Flex gap={8} wrap="wrap">
            {files.map((file, index) => {
              const isValidating = validatingFiles.has(
                `${file.name}-${file.size}`
              );
              return (
                <StyledFileBadge $sm={sm} key={index}>
                  {isValidating ? (
                    <StyledSpinningIcon>
                      <LoaderCircle size={sm ? 16 : 20} />
                    </StyledSpinningIcon>
                  ) : (
                    <File size={sm ? 16 : 20} />
                  )}
                  <StyledBadgeText $sm={sm}>{file.name}</StyledBadgeText>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    style={{ cursor: 'pointer' }}
                    disabled={!me.hasProAccess}
                  >
                    <X size={sm ? 16 : 20} strokeWidth={1.4} />
                  </button>
                </StyledFileBadge>
              );
            })}
            {files.length >= 3 && (
              <StyledFileBadge
                $sm={sm}
                style={{
                  backgroundColor: '#fee2e2',
                  borderColor: '#fca5a5',
                  color: '#dc2626'
                }}
              >
                {t('main:mainPrompt.maxFilesLimit')}
              </StyledFileBadge>
            )}
          </Flex>
        )}

        <Flex direction="row" gap={2} alignItems="center">
          <Tooltip
            content={
              me.hasProAccess
                ? t('main:fillForm.prompt.references.dropzone.mainText')
                : '해당 기능은 유료 플랜에서 이용 가능합니다.'
            }
            side="bottom"
          >
            <IconButton
              type="button"
              variant="outlined"
              size="large"
              onClick={openFileInput}
              disabled={files.length >= 3 || disabled || !me.hasProAccess}
            >
              {me.hasProAccess ? (
                <Paperclip size={sm ? 14 : 16} />
              ) : (
                <LockKeyhole size={sm ? 14 : 16} />
              )}
            </IconButton>
          </Tooltip>
          <StyledReferenceHintList>
            <li>30MB 이내 3개까지 첨부 가능</li>
            <li>pdf, docx, hwp, hwpx: 텍스트만 읽어 반영</li>
          </StyledReferenceHintList>
        </Flex>
      </StyledFileDropzone>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.hwp,.hwpx"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
    </StyledShadowFlex>
  );
}
