import { useState, useEffect } from 'react';
import { useBreakPoints } from '@/apps/make/src/hooks/useBreakPoints';
import ProductInput from '@/apps/make/src/pages/demo/components/ProductInput/ProductInput';
import DocumentFormatInput from '@/apps/make/src/pages/demo/components/DocumentFormatInput/DocumentFormatInput';
import { Flex } from '@/packages/ui/src';
import { useSearchParams } from 'react-router-dom';

export default function DemoPage() {
  const { sm } = useBreakPoints();
  const [, setSearchParams] = useSearchParams();
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [isDocumentFormatUploaded, setIsDocumentFormatUploaded] =
    useState(false);

  useEffect(() => {
    if (isDocumentFormatUploaded) {
      setSearchParams({ step: '2' });
    } else {
      setSearchParams({ step: '1' });
    }
  }, [isDocumentFormatUploaded, setSearchParams]);

  const handleDocumentFormatSelect = (file: File) => {
    setTemplateFile(file);
  };

  const handleDocumentFormatUploadComplete = () => {
    setIsDocumentFormatUploaded(true);
  };

  return (
    <Flex width={sm ? '768px' : '100%'} direction="column" gap={16}>
      {!isDocumentFormatUploaded ? (
        <DocumentFormatInput
          onFileSelect={handleDocumentFormatSelect}
          onUploadComplete={handleDocumentFormatUploadComplete}
        />
      ) : (
        <ProductInput templateFile={templateFile} />
      )}
    </Flex>
  );
}
