import { Modal } from '@/packages/ui/src';
import { Button } from '@/packages/ui/src';
import {
  StyledSupportingText,
  StyledEmphasize,
  StyledError
} from '@/apps/web/src/routes/_authenticated/c/-components/HwpWarningModal/HwpWarningModal.style';

interface HwpWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'hwp' | 'unsupported' | 'filesize';
}

export function HwpWarningModal({
  isOpen,
  onClose,
  type
}: HwpWarningModalProps) {
  const isHwpType = type === 'hwp';
  const isFileSizeType = type === 'filesize';

  const getTitle = () => {
    if (isHwpType) return 'hwp 파일은 변환이 필요합니다';
    if (isFileSizeType) return '파일 크기 초과';
    return '지원하지 않는 파일 형식입니다.';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={getTitle()} />
      <Modal.Body>
        <StyledSupportingText>
          {isHwpType ? (
            <>
              <StyledEmphasize>.hwpx</StyledEmphasize> 형식으로 변환 후 다시
              시도해주세요. <br />
              <br />
              <StyledError>
                반드시 다음의 과정을 거쳐서 변환해야 합니다.
              </StyledError>
              <br />
              1. 한컴오피스에서 .hwp 파일 열기.
              <br />
              2. 상단 메뉴에서 [파일] &gt; [다른 이름으로 저장하기]를 클릭.
              <br />
              3. &apos;파일 형식&apos;을 `한글 표준 문서(.hwpx)`로 선택하고
              저장.
              <br />
              4. 새롭게 저장된 파일을 업로드.
              <br />
              <br />
              <StyledError>
                한컴오피스가 없다면 아래 링크를 통해 변환해주세요.
              </StyledError>
              <br />
              <a
                href="https://www.polarisofficetools.com/hwp/convert/hwpx"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3182F7', textDecoration: 'underline' }}
              >
                hwp를 hwpx로 변환 바로가기 &gt;
              </a>
            </>
          ) : isFileSizeType ? (
            <>
              <StyledError>파일 크기는 30MB 이하여야 합니다.</StyledError>
              <br />
              <br />
              업로드 가능한 파일 크기를 초과했습니다.
              <br />더 작은 크기의 파일을 선택해 주세요.
            </>
          ) : (
            <>
              선택하신 파일은 업로드할 수 없습니다. <br />
              <br /> 한글 표준 문서(.hwpx) 형식만 지원합니다. 올바른 형식의
              파일을 선택하여 다시 업로드해주세요.
            </>
          )}
        </StyledSupportingText>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="filled" size="large" onClick={onClose}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
