import { Dialog } from '@docs-front/ui';
import { Link, useNavigate } from '@tanstack/react-router';
import { Flex } from '@docs-front/ui';
import { CircleAlert } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { Button } from '@docs-front/ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeTrialExhaustedModal = ({ isOpen, onClose }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Dialog.title>무료이용권이 소진되었어요</Dialog.title>
      <Dialog.content>
        <div>
          계정당 초안 생성과 양식 채우기가 각각 1회씩 무료로 제공됩니다.
        </div>
      </Dialog.content>
      <Dialog.footer>
        <Flex
          direction="row"
          width="100%"
          justify="space-between"
          alignItems="center"
          gap="16px"
        >
          <Link
            to="/credit-policy"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: theme.color.textGray,
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            <CircleAlert size={16} />
            <span>{`왜 이런 제한이 있나요? >`}</span>
          </Link>
          <Button
            variant="filled"
            size="large"
            onClick={() => {
              navigate({ to: '/credit-plan' });
            }}
          >
            확인
          </Button>
        </Flex>
      </Dialog.footer>
    </Dialog>
  );
};
