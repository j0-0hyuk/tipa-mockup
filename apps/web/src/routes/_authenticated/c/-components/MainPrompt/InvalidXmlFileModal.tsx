import { Button, Dialog, Flex } from '@docs-front/ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InvalidXmlFileModal = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Dialog.title>파일을 읽을 수 없어요</Dialog.title>
      <Dialog.content>
        <div>
          문서(hwpx, docx) 파일에 문제가 있습니다.
          <br />
          PDF로 변환 후 시도해주세요.
          <br />
          <br />
          <a
            href="https://www.polarisofficetools.com/hwpx/convert/pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#3182F7', textDecoration: 'underline' }}
          >
            PDF로 변환하기
          </a>
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
