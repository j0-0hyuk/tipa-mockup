import { Button, Dialog, Flex } from '@docs-front/ui';
import { CircleAlert } from 'lucide-react';
import {
  StyledCreditBadge,
  StyledPolicyLink
} from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/DailyLimitExceededModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const getTimeUntilNextDay = () => {
  const now = new Date();
  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);

  const diffMs = Math.max(0, nextDay.getTime() - now.getTime());
  const totalMinutes = Math.ceil(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
};

export const AllCreditsExhaustedModal = ({ isOpen, onClose }: Props) => {
  const { hours, minutes } = getTimeUntilNextDay();

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Dialog.title>모든 크레딧이 소진되었어요</Dialog.title>
      <Dialog.content>
        <div>보유한 모든 크레딧이 부족하여 진행할 수 없습니다.</div>
        <StyledCreditBadge>
          {hours}시간 {minutes}분 후에 이용할 수 있어요.
        </StyledCreditBadge>
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
            <CircleAlert size={16} />
            <span>{`크레딧 정책 보기`}</span>
          </StyledPolicyLink>
          <Button
            variant="outlined"
            size="medium"
            onClick={() => {
              onClose();
            }}
          >
            닫기
          </Button>
        </Flex>
      </Dialog.footer>
    </Dialog>
  );
};
