import { Flex, Form, FormField, TextArea, IconButton } from '@docs-front/ui';
import { useTheme } from '@emotion/react';
import { useForm } from 'react-hook-form';
import { ArrowUp, Square } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useCallback,
  useMemo,
  useRef,
  // type ChangeEvent,
  type KeyboardEvent
} from 'react';
// import { FileInputWithTrigger } from '@/routes/_authenticated/main/-components/ChatSection/ChatInput/FileInputWithTrigger';
import { UploadedFileBadge } from '@/routes/_authenticated/c/-components/ChatSection/ChatInput/UploadedFileBadges/UploadedFileBadges';
import type { ChatStatus } from 'ai';
import { chatInputFormSchema } from '@/routes/_authenticated/c/-components/ChatSection/ChatInput/ChatInput.schema';
import { StyledChatInput } from '@/routes/_authenticated/c/-components/ChatSection/ChatInput/ChatInput.style';
import { useI18n } from '@/hooks/useI18n';

interface ChatInputProps {
  onSubmit: (data: z.infer<typeof chatInputFormSchema>) => void;
  chatStatus: ChatStatus;
  stop: () => Promise<void>;
}

export const ChatInput = ({ onSubmit, chatStatus, stop }: ChatInputProps) => {
  const theme = useTheme();
  const { t } = useI18n('main');
  const form = useForm({
    resolver: zodResolver(chatInputFormSchema),
    defaultValues: {
      prompt: '',
      files: []
    }
  });

  const formRef = useRef<HTMLFormElement>(null);

  const isLoading = useMemo(() => {
    return chatStatus === 'streaming' || chatStatus === 'submitted';
  }, [chatStatus]);

  const {
    getValues,
    reset,
    setValue,
    formState: { isValid }
  } = form;

  const files = form.watch('files');

  // const handleFileChange = useCallback(
  //   (e: ChangeEvent<HTMLInputElement>) => {
  //     if (!e.target.files) return;

  //     const files = Array.from(e.target.files);

  //     const currentFiles = getValues('files') || [];
  //     const updatedFiles = [...currentFiles, ...files];
  //     setValue('files', updatedFiles);
  //   },
  //   [getValues, setValue]
  // );

  const onRemoveFile = useCallback(
    (fileName: string) => {
      const currentFiles = getValues('files') || [];
      const updatedFiles = currentFiles.filter(
        (file) => file.name !== fileName
      );
      setValue('files', updatedFiles);
    },
    [getValues, setValue]
  );

  const handleSubmit = useCallback(
    (data: z.infer<typeof chatInputFormSchema>) => {
      if (isLoading) {
        return;
      }
      onSubmit(data);
      reset();
    },
    [onSubmit, reset, isLoading]
  );

  const submitButtonProps = useMemo(() => {
    if (isLoading) {
      return {
        children: <Square size={16} fill={theme.color.black} />,
        variant: 'filled' as const,
        type: 'button' as const,
        onClick: stop
      };
    }
    return {
      children: <ArrowUp size={20} color={theme.color.white} />,
      type: 'submit' as const,
      variant: 'filled' as const,
      disabled: !isValid
    };
  }, [isLoading, theme.color.black, theme.color.white, stop, isValid]);

  const onEnterPress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }, []);

  return (
    <StyledChatInput>
      <Form form={form} onSubmit={handleSubmit} ref={formRef}>
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
              placeholder={t('chat.input.placeholder')}
              $placeholderColor="textGray"
              minRows={1}
              maxRows={7}
              onKeyDown={onEnterPress}
              {...field}
            />
          )}
        />
        {files.length > 0 && (
          <Flex wrap="wrap" gap={8}>
            {files.map((file) => (
              <UploadedFileBadge
                key={file.name}
                fileName={file.name}
                onRemove={onRemoveFile}
              />
            ))}
          </Flex>
        )}

        <Flex justify="space-between">
          {/* <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FileInputWithTrigger
                ref={field.ref}
                name={field.name}
                onChange={handleFileChange}
                trigger={
                  <Button
                    type="button"
                    $borderColor="borderGray"
                    $borderRadius="lg"
                    width={32}
                    height={32}
                    padding={0}
                  >
                    <LuPaperclip />
                  </Button>
                }
              />
            )}
          /> */}

          {/* 임시 div */}
          <div></div>
          <IconButton
            type={submitButtonProps.type}
            variant={submitButtonProps.variant}
            size="medium"
            disabled={submitButtonProps.disabled}
            onClick={submitButtonProps.onClick}
          >
            {submitButtonProps.children}
          </IconButton>
        </Flex>
      </Form>
    </StyledChatInput>
  );
};
