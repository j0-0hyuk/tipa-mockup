import { Button, Dialog, Flex } from '@docs-front/ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type?: 'image' | 'encrypted';
}

export const InvalidPdfFileModal = ({
  isOpen,
  onClose,
  type = 'image'
}: Props) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Dialog.title>PDF 파일을 읽을 수 없어요</Dialog.title>
      <Dialog.content>
        <div>
          {type === 'image' ? (
            <>
              스캔된 이미지로 구성된 PDF 파일이에요.
              <br />
              아래 링크에서 텍스트가 포함된 PDF로 변환 후 다시 시도해주세요.
              <br />
              <br />
              <a
                href="https://www.ilovepdf.com/ocr-pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3182F7', textDecoration: 'underline' }}
              >
                텍스트 인식 가능한 PDF로 변환하기
              </a>
            </>
          ) : (
            <>
              보안이 설정된 PDF 파일이에요.
              <br />
              보안 설정을 해제한 후 다시 시도해주세요.
            </>
          )}
        </div>
      </Dialog.content>
      <Dialog.footer>
        <Flex direction="row" width="100%" justify="flex-end">
          <Button variant="outlined" size="medium" onClick={onClose}>
            확인
          </Button>
        </Flex>
      </Dialog.footer>
    </Dialog>
  );
};
