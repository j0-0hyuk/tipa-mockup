import { Dialog, Flex, Button } from '@docs-front/ui';
import { CircleAlert } from 'lucide-react';
import {
  StyledCreditBadge,
  StyledPolicyLink
} from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/DailyLimitExceededModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  paidCredit?: number;
  onConfirm?: () => void;
}

export const DailyLimitExceededModal = ({
  isOpen,
  onClose,
  paidCredit = 0,
  onConfirm
}: Props) => {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Dialog.title>영구 크레딧이 차감될 예정이에요</Dialog.title>
      <Dialog.content>
        <Flex direction="column" gap={8}>
          <div>
            지금부터는 보유하신 <strong>영구 크레딧</strong>이 사용됩니다.
          </div>
          <StyledCreditBadge>
            보유 영구 크레딧 : {paidCredit.toLocaleString()}
          </StyledCreditBadge>
        </Flex>
      </Dialog.content>

      <Dialog.footer>
        <Flex
          direction="row"
          width="100%"
          justify="space-between"
          alignItems="center"
          gap={16}
        >
          <StyledPolicyLink to="/credit-policy">
            <CircleAlert size={14} />
            <span>크레딧 정책 보기</span>
          </StyledPolicyLink>
          <Button variant="filled" size="large" onClick={handleConfirm}>
            계속 진행하기
          </Button>
        </Flex>
      </Dialog.footer>
    </Dialog>
  );
};
