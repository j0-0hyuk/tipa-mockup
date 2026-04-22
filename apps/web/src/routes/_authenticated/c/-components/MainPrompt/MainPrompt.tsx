import {
  ArrowUp,
  File,
  LoaderCircle,
  LockKeyhole,
  Paperclip,
  X
} from 'lucide-react';
import {
  Button,
  Flex,
  Form,
  IconButton,
  ProductCreationLoadingToast,
  Tooltip
} from '@docs-front/ui';
import { HwpWarningModal } from '@/routes/_authenticated/c/-components/HwpWarningModal/HwpWarningModal';
import { useI18n } from '@/hooks/useI18n';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import {
  StyledBadgeText,
  StyledFileBadge,
  StyledFileDropzone,
  StyledLoadingOverlay,
  StyledMainTextarea,
  StyledShadowFlex,
  StyledSpinningIcon
} from '@/routes/_authenticated/c/-components/MainPrompt/MainPrompt.style';
import { useMainPrompt } from '@/routes/_authenticated/c/-components/MainPrompt/MainPrompt.hook';

export default function MainPrompt() {
  const { t } = useI18n(['main']);
  const { sm } = useBreakPoints();
  const {
    me,
    form,
    files,
    isDragOver,
    isPending,
    isProcessing,
    loadingProgress,
    isValidatingFiles,
    validatingFiles,
    isHwpWarningOpen,
    hwpWarningType,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleRemoveFile,
    handleAddFile,
    handleSubmit,
    closeHwpWarning
  } = useMainPrompt();

  return (
    <>
      <Form form={form} onSubmit={handleSubmit}>
        <StyledShadowFlex width="100%" direction="column">
          <StyledFileDropzone
            isDragOver={isDragOver}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <StyledMainTextarea
              $sm={sm}
              placeholder={t('mainPrompt.placeholder')}
              {...form.register('itemDescription')}
            />

            {files.length > 0 && (
              <Flex gap={8} wrap="wrap">
                {files.map((file, index) => {
                  const isValidating = validatingFiles.has(file);
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
                        onClick={() => handleRemoveFile(index)}
                        style={{
                          cursor: 'pointer'
                        }}
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
                    {t('mainPrompt.maxFilesLimit')}
                  </StyledFileBadge>
                )}
              </Flex>
            )}

            <Flex justify="space-between" alignItems="center">
              <Tooltip
                content={
                  me.hasProAccess
                    ? t('mainPrompt.fileDescription')
                    : '해당 기능은 유료 플랜에서 이용 가능합니다.'
                }
                side="bottom"
              >
                <Button
                  type="button"
                  variant="outlined"
                  size="medium"
                  onClick={handleAddFile}
                  disabled={files.length >= 3 || !me.hasProAccess}
                >
                  {me.hasProAccess ? (
                    <Paperclip size={sm ? 14 : 16} />
                  ) : (
                    <LockKeyhole size={sm ? 14 : 16} />
                  )}
                  {t('mainPrompt.addFile')}
                </Button>
              </Tooltip>
              <IconButton
                type="submit"
                variant="filled"
                size="medium"
                disabled={!form.formState.isValid || isValidatingFiles}
              >
                {isPending || isValidatingFiles ? (
                  <StyledSpinningIcon>
                    <LoaderCircle size={sm ? 20 : 24} />
                  </StyledSpinningIcon>
                ) : (
                  <ArrowUp size={sm ? 20 : 24} />
                )}
              </IconButton>
            </Flex>
          </StyledFileDropzone>
        </StyledShadowFlex>
      </Form>

      {hwpWarningType && (
        <HwpWarningModal
          isOpen={isHwpWarningOpen}
          onClose={closeHwpWarning}
          type={hwpWarningType}
        />
      )}

      {isProcessing && (
        <StyledLoadingOverlay>
          <ProductCreationLoadingToast
            progress={loadingProgress}
            isVisible={true}
          />
        </StyledLoadingOverlay>
      )}
    </>
  );
}
