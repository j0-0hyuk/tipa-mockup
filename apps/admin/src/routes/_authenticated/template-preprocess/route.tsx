import { createFileRoute } from '@tanstack/react-router';
import { Flex } from '@bichon/ds';
import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authenticatedApi } from '@/api/authenticated/instance';
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
  TextArea,
  SubmitButton,
  ResultContainer,
  ResultHeader,
  ResultTitle,
  DownloadButton,
  ResultContent,
  ErrorMessage,
  LoadingSpinner,
  HelpText
} from '@/routes/_authenticated/template-preprocess/template-preprocess.style';

type Language = 'ko' | 'en';

export const Route = createFileRoute('/_authenticated/template-preprocess')({
  component: TemplatePreprocessPage
});

interface PreprocessResult {
  blob: Blob;
  filename: string;
}

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return ext;
}

function TemplatePreprocessPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [productContents, setProductContents] = useState('');
  const [result, setResult] = useState<PreprocessResult | null>(null);

  const preprocessMutation = useMutation({
    mutationFn: async ({
      file,
      productContents,
      language
    }: {
      file: File;
      productContents: string;
      language: Language;
    }): Promise<PreprocessResult> => {
      const formData = new FormData();
      const extension = getFileExtension(file.name);

      formData.append('documentFormat', file);
      formData.append('productContents', productContents);
      formData.append('extension', extension);
      formData.append('language', language);

      const blob = await authenticatedApi
        .post('products/preprocess', { body: formData, timeout: false })
        .blob();
      const filename = `preprocessed_${file.name}`;

      return { blob, filename };
    },
    onSuccess: (data) => {
      setResult(data);
    }
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setResult(null);
      }
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (!selectedFile || !productContents.trim()) return;
    preprocessMutation.mutate({
      file: selectedFile,
      productContents,
      language: 'ko'
    });
  }, [selectedFile, productContents, preprocessMutation]);

  const handleDownload = useCallback(() => {
    if (!result?.blob) return;

    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result]);

  const isSubmitDisabled =
    !selectedFile || !productContents.trim() || preprocessMutation.isPending;

  return (
    <Flex direction="column" gap={24}>
      <PageHeader>
        <PageTitle>템플릿 전처리</PageTitle>
        <PageDescription>
          템플릿 파일을 업로드하고 프롬프트를 입력하여 전처리된 결과를
          받아보세요.
        </PageDescription>
      </PageHeader>

      <FormContainer>
        <FormSection>
          <Label>템플릿 파일</Label>
          <FileInputWrapper>
            <FileInputLabel>
              파일 선택
              <input
                type="file"
                accept=".hwp,.hwpx,.docx,.pdf,.txt"
                onChange={handleFileChange}
              />
            </FileInputLabel>
          </FileInputWrapper>
          {selectedFile && <FileName>{selectedFile.name}</FileName>}
          <HelpText>지원 형식: .hwp, .hwpx, .docx, .pdf, .txt</HelpText>
        </FormSection>

        <FormSection>
          <Label>콘텐츠 내용 (productContents)</Label>
          <TextArea
            placeholder="전처리할 콘텐츠 내용을 입력하세요..."
            value={productContents}
            onChange={(e) => setProductContents(e.target.value)}
          />
          <HelpText>템플릿에 채워넣을 콘텐츠 내용을 입력하세요.</HelpText>
        </FormSection>

        <SubmitButton onClick={handleSubmit} disabled={isSubmitDisabled}>
          {preprocessMutation.isPending && <LoadingSpinner />}
          {preprocessMutation.isPending ? '처리 중...' : '전처리 실행'}
        </SubmitButton>
      </FormContainer>

      {preprocessMutation.isError && (
        <ErrorMessage>
          {preprocessMutation.error?.message || '오류가 발생했습니다.'}
        </ErrorMessage>
      )}

      {result && (
        <ResultContainer>
          <ResultHeader>
            <ResultTitle>전처리 결과</ResultTitle>
            <DownloadButton onClick={handleDownload}>다운로드</DownloadButton>
          </ResultHeader>
          <ResultContent>
            파일명: {result.filename}
            {'\n'}파일 크기: {(result.blob.size / 1024).toFixed(2)} KB
          </ResultContent>
        </ResultContainer>
      )}
    </Flex>
  );
}
