import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUp, File, Paperclip, X } from 'lucide-react';
import { Flex, Button, Form, IconButton } from '@/packages/ui/src';
import {
  StyledFileDropzone,
  StyledFileBadge,
  StyledMainTextarea,
  StyledFileAddLabel,
  StyledBadgeText
} from '@/apps/make/src/pages/demo/components/ProductInput/ProductInput.style';
import { useBreakPoints } from '@/apps/make/src/hooks/useBreakPoints';
import { useHwpWarningModal } from '@/make/pages/demo/components/HwpWarningModal/useHwpWarningModal';
import { HwpWarningModal } from '@/apps/make/src/pages/demo/components/HwpWarningModal/HwpWarningModal';
import type { PostMakeProductsRequest } from '@/apps/make/src/schema/api/products';
import {
  productInputFormSchema,
  type ProductInputForm
} from '@/apps/make/src/schema/form/productInput';
import { useNavigate } from 'react-router-dom';

interface ProductInputProps {
  templateFile: File | null;
}

export default function ProductInput({ templateFile }: ProductInputProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { isOpen, warningType, closeModal, validateFile } =
    useHwpWarningModal();
  const { sm } = useBreakPoints();
  const navigate = useNavigate();

  const form = useForm<ProductInputForm>({
    resolver: zodResolver(productInputFormSchema),
    defaultValues: {
      userPrompt: '',
      referenceFiles: []
    },
    mode: 'onChange'
  });

  const files = form.watch('referenceFiles') || [];

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const currentFiles = form.getValues('referenceFiles') || [];
      const remainingSlots = 3 - currentFiles.length;

      const validFiles = newFiles.filter(validateFile).slice(0, remainingSlots);
      if (validFiles.length > 0) {
        form.setValue('referenceFiles', [...currentFiles, ...validFiles], {
          shouldValidate: true
        });
      }
    },
    [form, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(Array.from(e.dataTransfer.files));
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (index: number) => {
    const current = form.getValues('referenceFiles') || [];
    form.setValue(
      'referenceFiles',
      current.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const addFile = () => {
    if (files.length >= 3) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.hwpx,.hwp,.docx,.pdf';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        handleFiles(Array.from(target.files));
      }
    };
    input.click();
  };

  const onSubmit = async (arg: ProductInputForm) => {
    if (!templateFile) {
      return;
    }

    const productRequest: PostMakeProductsRequest = {
      ...arg,
      documentFormat: templateFile
    };

    navigate('/loading', {
      state: {
        productRequest,
        templateFile,
        isLoading: true
      }
    });
  };

  return (
    <>
      <Form form={form} onSubmit={onSubmit}>
        <Flex width={sm ? '768px' : '100%'} direction="column">
          <StyledFileDropzone
            isDragOver={isDragOver}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <StyledMainTextarea
              $sm={sm}
              placeholder={'프롬프트를 입력해주세요.'}
              {...form.register('userPrompt')}
            />
            {(files.length > 0 || files.length >= 3) && (
              <Flex gap={8} wrap="wrap">
                {files.map((file, index) => (
                  <StyledFileBadge $sm={sm} key={index}>
                    <File size={sm ? 16 : 20} />
                    <StyledBadgeText $sm={sm}>{file.name}</StyledBadgeText>
                    <IconButton
                      variant="text"
                      size="small"
                      onClick={() => removeFile(index)}
                    >
                      <X size={sm ? 16 : 20} strokeWidth={1.4} />
                    </IconButton>
                  </StyledFileBadge>
                ))}
                {files.length >= 3 && (
                  <StyledFileBadge
                    $sm={sm}
                    style={{
                      backgroundColor: '#fee2e2',
                      borderColor: '#fca5a5',
                      color: '#dc2626'
                    }}
                  >
                    최대 3개까지만 업로드 가능합니다
                  </StyledFileBadge>
                )}
              </Flex>
            )}

            <Flex justify="space-between" alignItems="center">
              <Flex gap={8} alignItems="center">
                <Button
                  type="button"
                  variant="outlined"
                  size={sm ? 'small' : 'medium'}
                  onClick={addFile}
                  disabled={files.length >= 3}
                >
                  <Paperclip size={sm ? 14 : 16} />
                  파일 추가
                </Button>
                <StyledFileAddLabel $sm={sm}>
                  추가한 파일의 내용이 문서에 반영됩니다.
                </StyledFileAddLabel>
              </Flex>
              <IconButton
                type="submit"
                variant="filled"
                size="medium"
                disabled={!form.formState.isValid}
              >
                <ArrowUp size={sm ? 20 : 24} />
              </IconButton>
            </Flex>
          </StyledFileDropzone>
        </Flex>
      </Form>
      <HwpWarningModal
        isOpen={isOpen}
        onClose={closeModal}
        type={warningType}
      />
    </>
  );
}
