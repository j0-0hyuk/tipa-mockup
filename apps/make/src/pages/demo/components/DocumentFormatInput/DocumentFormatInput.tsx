import { useDropzone } from 'react-dropzone';
import {
  Flex,
  Button,
  Modal,
  ProductCreationLoadingToast
} from '@/packages/ui/src';
import { FilePlus } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { useState, useEffect } from 'react';
import {
  StyledDescription,
  StyledFileDropzone
} from '@/apps/make/src/pages/demo/components/DocumentFormatInput/DocumentFormatInput.style';
import { HwpWarningModal } from '@/apps/make/src/pages/demo/components/HwpWarningModal/HwpWarningModal';
import { useHwpWarningModal } from '@/make/pages/demo/components/HwpWarningModal/useHwpWarningModal';

interface DocumentFormatInputProps {
  onFileSelect?: (file: File) => void;
  onUploadComplete?: () => void;
  isUploading?: boolean;
}

export default function DocumentFormatInput({
  onFileSelect,
  onUploadComplete,
  isUploading = false
}: DocumentFormatInputProps) {
  const theme = useTheme();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFileSizeModalOpen, setIsFileSizeModalOpen] = useState(false);
  const { isOpen, warningType, closeModal, validateFile } =
    useHwpWarningModal();

  useEffect(() => {
    if (!isUploading && uploadProgress === 100) {
      const timer = setTimeout(() => {
        setUploadProgress(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isUploading, uploadProgress]);

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];

    if (!validateFile(file)) {
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setIsFileSizeModalOpen(true);
      return;
    }

    if (onFileSelect) {
      onFileSelect(file);
    }

    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    setTimeout(() => {
      setUploadProgress(100);
      clearInterval(progressInterval);
      if (onUploadComplete) {
        onUploadComplete();
      }
    }, 800);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.hancom.hwp': ['.hwpx'],
      'application/haansofthwp': ['.hwp']
    },
    multiple: false,
    disabled: isUploading || uploadProgress > 0,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0 && !isUploading && uploadProgress === 0) {
        handleFileUpload(acceptedFiles);
      }
    }
  });

  return (
    <>
      <StyledFileDropzone {...getRootProps()}>
        <input {...getInputProps()} />
        {isUploading || uploadProgress > 0 ? (
          <Flex
            direction="column"
            alignItems="center"
            justify="center"
            height={'160px'}
          >
            <ProductCreationLoadingToast
              progress={uploadProgress}
              isVisible={true}
              message="파일 업로드 중..."
              showSpinnerIcon
            />
          </Flex>
        ) : (
          <Flex
            direction="column"
            alignItems="center"
            justify="center"
            gap="8px"
          >
            <FilePlus size={64} color={theme.color.main} strokeWidth={1} />
            <Flex>
              <Button type="button" variant="filled" size="large">
                <p style={{ color: theme.color.white }}>양식 파일 업로드</p>
              </Button>
            </Flex>
            <StyledDescription>최대 20MB / 한글(hwpx) 지원</StyledDescription>
          </Flex>
        )}
      </StyledFileDropzone>

      <HwpWarningModal
        isOpen={isOpen}
        onClose={closeModal}
        type={warningType}
      />

      <Modal
        isOpen={isFileSizeModalOpen}
        onClose={() => setIsFileSizeModalOpen(false)}
      >
        <Modal.Header title="파일 크기 초과" />
        <Modal.Body>
          <div style={{ textAlign: 'center', padding: '15px 0' }}>
            <p
              style={{
                fontSize: '16px',
                marginBottom: '16px',
                color: theme.color.error
              }}
            >
              파일 크기가 10MB를 초과합니다.
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              파일을 압축하거나 다른 파일을 사용해주세요.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.ConfirmButton onClick={() => setIsFileSizeModalOpen(false)}>
            확인
          </Modal.ConfirmButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
