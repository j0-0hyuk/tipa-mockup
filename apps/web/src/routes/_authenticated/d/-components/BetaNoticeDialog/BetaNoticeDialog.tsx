import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n';
import {
  StyledBody,
  StyledCloseButton,
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledInfoItem,
  StyledOverlay,
  StyledSubtitle,
  StyledTitle
} from '@/routes/_authenticated/d/-components/BetaNoticeDialog/BetaNoticeDialog.style';

interface BetaNoticeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const COPY = {
  ko: {
    title: '⚠️ [필독] 문서 에디터(Beta) 이용 전 확인 사항',
    subtitle: '원활한 서비스 이용을 위해 아래 내용을 확인해 주세요.',
    items: [
      {
        icon: '📄',
        label: '문서 표시 안내',
        desc: '에디터 내에서 일시적으로 문서가 깨져 보일 수 있으나, 기존 원본 문서는 손상되지 않으니 안심하고 이용해 주세요.'
      },
      {
        icon: '📅',
        label: '지원 범위 안내',
        desc: '본 에디터는 2026년 3월 23일 부터 생성된 문서부터 지원합니다. 이전 문서는 번거로우시겠지만 기존 파일을 이용해 새로 생성해 주시기 바랍니다.'
      },
      {
        icon: '💬',
        label: '오류 제보 및 피드백',
        desc: '이용 중 기능 이상을 발견하시면 챗봇의 [에디터 기능 리뷰하기]를 통해 자유로운 피드백 부탁드립니다.'
      },
      {
        icon: '🎁',
        label: '무제한 이용 안내',
        desc: '해당 기능은 베타 기간동안 무제한으로 사용 가능합니다.'
      }
    ],
    confirm: '확인'
  },
  en: {
    title: '⚠️ [Required] Before Using the Document Editor (Beta)',
    subtitle:
      'Please review the following information for a smooth experience.',
    items: [
      {
        icon: '📄',
        label: 'Display Notice',
        desc: 'Documents may temporarily appear broken in the editor, but rest assured that the original document is not affected.'
      },
      {
        icon: '📅',
        label: 'Supported Documents',
        desc: 'This editor supports documents created from March 23, 2026. For older documents, please create a new one using the existing file.'
      },
      {
        icon: '💬',
        label: 'Bug Reports & Feedback',
        desc: 'If you encounter any issues, please share your feedback through the [Review Editor Feature] option in the chatbot.'
      },
      {
        icon: '🎁',
        label: 'Unlimited Usage',
        desc: 'This feature is available for unlimited use during the beta period.'
      }
    ],
    confirm: 'OK'
  }
};

export function BetaNoticeDialog({ isOpen, onClose }: BetaNoticeDialogProps) {
  const { currentLanguage } = useI18n(['common']);
  const copy = currentLanguage === 'en' ? COPY.en : COPY.ko;

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {isOpen && (
        <DialogPrimitive.Portal>
          <StyledOverlay />
          <StyledContent>
            <StyledHeader>
              <StyledTitle>{copy.title}</StyledTitle>
              <StyledCloseButton aria-label={copy.confirm}>
                <X size={24} />
              </StyledCloseButton>
            </StyledHeader>

            <StyledBody>
              <StyledSubtitle>{copy.subtitle}</StyledSubtitle>
              {copy.items.map((item) => (
                <StyledInfoItem key={item.label}>
                  <span className="item-label">
                    {item.icon} {item.label}
                  </span>
                  <span className="item-desc">{item.desc}</span>
                </StyledInfoItem>
              ))}
            </StyledBody>

            <StyledFooter>
              <Button variant="filled" size="medium" onClick={onClose}>
                {copy.confirm}
              </Button>
            </StyledFooter>
          </StyledContent>
        </DialogPrimitive.Portal>
      )}
    </DialogPrimitive.Root>
  );
}
