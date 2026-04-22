import { Flex, Form, FormField, TextArea, IconButton, useToast } from '@docs-front/ui';
import { useTheme } from '@emotion/react';
import { useForm } from 'react-hook-form';
import { ArrowUp, Paperclip, Square } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent
} from 'react';
import type { ChatStatus } from 'ai';
import type { ChatFile } from '@/schema/api/document-chat/chat';
import {
  postDocumentChatFiles,
  deleteDocumentChatFile
} from '@/api/files';
import { documentChatInputFormSchema } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatInput/DocumentChatInput.schema';
import { StyledChatInput } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatInput/DocumentChatInput.style';
import { FileInputWithTrigger } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatInput/FileInputWithTrigger';
import { FileCardList } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatInput/FileCard/FileCard';
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILES,
  MAX_FILE_SIZE
} from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatInput/file-type-utils';

export interface DocumentChatInputSubmitData {
  prompt: string;
  uploadedFiles: ChatFile[];
}

interface DocumentChatInputProps {
  productFileIdNumber: number;
  onSubmit: (data: DocumentChatInputSubmitData) => void;
  chatStatus: ChatStatus;
  stop: () => Promise<void>;
  disabled?: boolean;
  pendingReview?: boolean;
}

export const DocumentChatInput = ({
  productFileIdNumber,
  onSubmit,
  chatStatus,
  stop,
  disabled,
  pendingReview
}: DocumentChatInputProps) => {
  const theme = useTheme();
  const toast = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<ChatFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(documentChatInputFormSchema),
    defaultValues: {
      prompt: ''
    }
  });

  const formRef = useRef<HTMLFormElement>(null);

  const isChatLoading = useMemo(() => {
    return chatStatus === 'streaming' || chatStatus === 'submitted';
  }, [chatStatus]);

  const { reset, formState: { isValid } } = form;

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      const newFiles = Array.from(e.target.files).filter(
        (file) => file.size <= MAX_FILE_SIZE
      );

      const existingNames = new Set(uploadedFiles.map((f) => f.filename));
      const deduped = newFiles.filter((f) => !existingNames.has(f.name));
      const remaining = MAX_FILES - uploadedFiles.length;
      const filesToUpload = deduped.slice(0, remaining);

      e.target.value = '';

      if (remaining <= 0) {
        toast.open({ content: `파일은 최대 ${MAX_FILES}개까지 첨부할 수 있습니다.` });
        return;
      }

      if (filesToUpload.length === 0) return;

      setIsUploading(true);
      try {
        const result = await postDocumentChatFiles(
          productFileIdNumber,
          filesToUpload
        );
        setUploadedFiles((prev) => [...prev, ...result]);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : '파일 업로드에 실패했습니다.';
        toast.open({ content: message });
      } finally {
        setIsUploading(false);
      }
    },
    [productFileIdNumber, uploadedFiles, toast]
  );

  const onRemoveFile = useCallback(
    (fileName: string) => {
      const file = uploadedFiles.find((f) => f.filename === fileName);
      if (!file) return;

      setUploadedFiles((prev) =>
        prev.filter((f) => f.fileId !== file.fileId)
      );

      deleteDocumentChatFile(productFileIdNumber, file.fileId).catch(
        () => {}
      );
    },
    [uploadedFiles, productFileIdNumber]
  );

  const handleSubmit = useCallback(
    (data: z.infer<typeof documentChatInputFormSchema>) => {
      if (isChatLoading || isUploading) return;
      onSubmit({ prompt: data.prompt, uploadedFiles });
      setUploadedFiles([]);
      reset();
    },
    [onSubmit, reset, isChatLoading, isUploading, uploadedFiles]
  );

  const submitButtonConfig = useMemo(() => {
    if (isChatLoading) {
      return {
        children: <Square size={16} fill={theme.color.black} />,
        type: 'button' as const,
        variant: 'outlined' as const,
        onClick: stop,
        disabled: false
      };
    }
    return {
      children: <ArrowUp size={20} color={theme.color.white} />,
      type: 'submit' as const,
      variant: 'filled' as const,
      onClick: undefined,
      disabled: !isValid || disabled || isUploading
    };
  }, [
    isChatLoading,
    theme.color.black,
    theme.color.white,
    stop,
    isValid,
    disabled,
    isUploading
  ]);

  const onEnterPress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }, []);

  return (
    <StyledChatInput>
      <Form form={form} onSubmit={handleSubmit} ref={formRef}>
        {(uploadedFiles.length > 0 || isUploading) && (
          <FileCardList
            files={[
              ...uploadedFiles.map((f) => ({ name: f.filename })),
              ...(isUploading ? [{ name: '업로드 중...' }] : [])
            ]}
            onRemove={onRemoveFile}
          />
        )}
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <TextArea
              id="prompt"
              $borderColor="none"
              $padding={0}
              $borderRadius="none"
              $bgColor="none"
              placeholder={
                isUploading
                  ? '파일을 업로드하는 중...'
                  : isChatLoading
                    ? '응답을 기다리는 중...'
                    : pendingReview
                      ? '문서 변경사항을 검토해주세요.'
                      : '원하는 요청을 입력하세요.'
              }
              $placeholderColor="textGray"
              minRows={1}
              maxRows={7}
              onKeyDown={onEnterPress}
              disabled={disabled}
              {...field}
            />
          )}
        />
        <Flex justify="space-between" alignItems="center">
          <FileInputWithTrigger
            onChange={handleFileChange}
            accept={ACCEPTED_FILE_TYPES}
            trigger={
              <IconButton variant="outlined" size="small" type="button">
                <Paperclip size={20} />
              </IconButton>
            }
          />
          <IconButton
            type={submitButtonConfig.type}
            variant={submitButtonConfig.variant}
            size="small"
            disabled={submitButtonConfig.disabled}
            onClick={submitButtonConfig.onClick}
          >
            {submitButtonConfig.children}
          </IconButton>
        </Flex>
      </Form>
    </StyledChatInput>
  );
};
