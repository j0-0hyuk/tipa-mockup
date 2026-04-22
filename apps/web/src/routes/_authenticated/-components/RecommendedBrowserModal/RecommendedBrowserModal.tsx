import { Dialog } from '@docs-front/ui';
import { Button } from '@bichon/ds';
import {
  StyledChromeLink,
  StyledContentText,
  StyledEmphasize
} from '@/routes/_authenticated/-components/RecommendedBrowserModal/RecommendedBrowserModal.style';

const CHROME_DOWNLOAD_URL = 'https://www.google.com/intl/ko_kr/chrome/';

interface RecommendedBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDismissForToday: () => void;
}

export function RecommendedBrowserModal({
  isOpen,
  onClose,
  onDismissForToday
}: RecommendedBrowserModalProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Dialog.title>최적의 환경에서 서비스를 즐겨보세요</Dialog.title>
      <Dialog.content>
        <StyledContentText>
          현재 브라우저는 지원되지 않습니다.
          <br />
          <StyledEmphasize>크롬(Chrome)</StyledEmphasize> 브라우저를
          사용해주세요.
        </StyledContentText>
        <StyledChromeLink
          href={CHROME_DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          크롬(Chrome) 브라우저 다운로드
        </StyledChromeLink>
      </Dialog.content>
      <Dialog.footer>
        <Button variant="outlined" width="100%" onClick={onDismissForToday}>
          오늘 하루 보지 않기
        </Button>
        <Button variant="filled" width="100%" onClick={onClose}>
          닫기
        </Button>
      </Dialog.footer>
    </Dialog>
  );
}
