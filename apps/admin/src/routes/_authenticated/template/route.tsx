import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Flex, Button, useToast } from '@bichon/ds';
import {
  PageHeader,
  PageTitle,
  PageDescription,
  FormContainer,
  FormSection,
  Label,
  FileInputWrapper,
  FileInputLabel,
  FileName,
  ErrorMessage,
  HelpText,
  TextInput,
  TextArea,
  WarningMessage
} from '@/routes/_authenticated/template/template.style';
import { uploadTemplateFormat, getProductFiles } from '@/api/authenticated/products';
import {
  uploadTemplateSchema,
  type UploadTemplateFormData
} from '@/schema/api/products/uploadTemplate';
import { useState, useMemo } from 'react';

export const Route = createFileRoute('/_authenticated/template')({
  component: TemplatePage
});

// 파일 경로에서 파일명만 추출
const extractFileName = (filePath: string | null): string => {
  if (!filePath) return '';
  const parts = filePath.split('/');
  return parts[parts.length - 1] || '';
};

function TemplatePage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 기존 템플릿 목록 조회 (중복 체크용)
  const { data: existingTemplates } = useQuery({
    queryKey: ['productFiles', 'all', 1000],
    queryFn: () => getProductFiles({ page: 0, size: 1000, fileType: 'TEMPLATE' })
  });

  // 기존 파일명 목록
  const existingFileNames = useMemo(() => {
    const content = existingTemplates?.data?.templates?.content;
    if (!content) return new Set<string>();
    return new Set(
      content
        .map((template) => extractFileName(template.filePath))
        .filter(Boolean)
        .map((name) => name.toLowerCase().normalize('NFC'))
    );
  }, [existingTemplates]);

  // 중복 파일 체크
  const isDuplicateFile = useMemo(() => {
    if (!selectedFile) return false;
    const selectedFileName = selectedFile.name.toLowerCase().normalize('NFC');
    return existingFileNames.has(selectedFileName);
  }, [selectedFile, existingFileNames]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
    setValue,
    trigger
  } = useForm<UploadTemplateFormData>({
    resolver: zodResolver(uploadTemplateSchema),
    defaultValues: {
      templateViewerUrl: '',
      postingUrl: '',
      templatePrompt: '',
      templateMarkdown: '',
      organizingAgency: '',
      deadline: ''
    }
  });

  const uploadMutation = useMutation({
    mutationFn: uploadTemplateFormat,
    onSuccess: () => {
      toast.showToast('템플릿 파일이 성공적으로 업로드되었습니다.', {
        duration: 3000
      });
      reset();
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['productFiles'] });
    },
    onError: (error: Error) => {
      toast.showToast(`템플릿 업로드에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
    }
  });

  const onSubmit = ({ file, templateViewerUrl, postingUrl, templatePrompt, templateMarkdown, organizingAgency, deadline }: UploadTemplateFormData) => {
    uploadMutation.mutate({
      file,
      contents: {
        templateViewerUrl,
        postingUrl,
        templatePrompt,
        templateMarkdown,
        organizingAgency: organizingAgency || null,
        deadline: deadline || null
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue('file', file);
      await trigger('file');
    } else {
      setSelectedFile(null);
      resetField('file');
    }
  };

  return (
    <Flex direction="column" gap={24}>
      <PageHeader>
        <PageTitle>템플릿 업로드</PageTitle>
        <PageDescription>
          사용자에게 제공할 기본 템플릿 양식을 업로드하세요.
        </PageDescription>
      </PageHeader>

      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap={24}>
            <FormSection>
              <Label htmlFor="file">템플릿 파일 *</Label>
              <FileInputWrapper>
                <FileInputLabel htmlFor="file">
                  <input
                    id="file"
                    type="file"
                    accept=".hwp,.hwpx,.docx"
                    onChange={handleFileChange}
                  />
                  파일 선택
                </FileInputLabel>
              </FileInputWrapper>
              {selectedFile && <FileName>{selectedFile.name}</FileName>}
              {isDuplicateFile && (
                <WarningMessage>
                  ⚠️ 동일한 이름의 템플릿 파일이 이미 존재합니다. 다른 파일을 선택하거나 기존 파일을 삭제 후 업로드하세요.
                </WarningMessage>
              )}
              {errors.file && (
                <ErrorMessage>{errors.file.message as string}</ErrorMessage>
              )}
              <HelpText>
                허용되는 파일 형식: .hwp, .hwpx, .docx (최대 30MB)
              </HelpText>
            </FormSection>

            <FormSection>
              <Label htmlFor="templateViewerUrl">뷰어 URL (선택)</Label>
              <TextInput
                id="templateViewerUrl"
                type="url"
                placeholder="https://..."
                {...register('templateViewerUrl')}
              />
              {errors.templateViewerUrl && (
                <ErrorMessage>{errors.templateViewerUrl.message}</ErrorMessage>
              )}
              <HelpText>템플릿 뷰어 링크</HelpText>
            </FormSection>

            <FormSection>
              <Label htmlFor="postingUrl">공고 URL (선택)</Label>
              <TextInput
                id="postingUrl"
                type="url"
                placeholder="https://example.com/announcement/..."
                {...register('postingUrl')}
              />
              {errors.postingUrl && (
                <ErrorMessage>{errors.postingUrl.message}</ErrorMessage>
              )}
              <HelpText>해당 템플릿과 관련된 공고 페이지 링크</HelpText>
            </FormSection>

            <FormSection>
              <Label htmlFor="templatePrompt">커스텀 프롬프트 (선택)</Label>
              <TextArea
                id="templatePrompt"
                placeholder="이 템플릿에 적용할 맞춤 프롬프트를 입력하세요..."
                rows={4}
                {...register('templatePrompt')}
              />
              {errors.templatePrompt && (
                <ErrorMessage>{errors.templatePrompt.message}</ErrorMessage>
              )}
              <HelpText>최대 10,000자까지 입력 가능</HelpText>
            </FormSection>

            <FormSection>
              <Label htmlFor="templateMarkdown">템플릿 마크다운 (선택)</Label>
              <TextArea
                id="templateMarkdown"
                placeholder="파일에서 추출한 텍스트를 마크다운 형식으로 입력하세요..."
                rows={10}
                {...register('templateMarkdown')}
              />
              {errors.templateMarkdown && (
                <ErrorMessage>{errors.templateMarkdown.message}</ErrorMessage>
              )}
              <HelpText>파일의 텍스트를 마크다운 형식으로 변환한 내용 (최대 100,000자)</HelpText>
            </FormSection>

            <FormSection>
              <Label htmlFor="deadline">마감일시 (선택)</Label>
              <TextInput
                id="deadline"
                type="datetime-local"
                {...register('deadline')}
              />
              <HelpText>공고 마감일시를 설정하면 목록에서 만료 여부를 확인할 수 있습니다</HelpText>
            </FormSection>

            <FormSection>
              <Label htmlFor="organizingAgency">주관 기관 (선택)</Label>
              <TextInput
                id="organizingAgency"
                type="text"
                placeholder="예: 창업진흥원"
                {...register('organizingAgency')}
              />
              {errors.organizingAgency && (
                <ErrorMessage>{errors.organizingAgency.message}</ErrorMessage>
              )}
              <HelpText>공고를 주관하는 기관명을 입력하세요 (최대 200자)</HelpText>
            </FormSection>

            <Button
              type="submit"
              variant="filled"
              size="medium"
              disabled={uploadMutation.isPending || !selectedFile || isDuplicateFile}
            >
              {uploadMutation.isPending ? '업로드 중...' : '템플릿 업로드'}
            </Button>
          </Flex>
        </form>
      </FormContainer>
    </Flex>
  );
}
