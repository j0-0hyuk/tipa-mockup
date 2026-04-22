import { Flex, Toggle, Tooltip } from '@docs-front/ui';
import { useNavigate } from '@tanstack/react-router';
import { useI18n } from '@/hooks/useI18n';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { StyledCreateTitle } from '@/routes/_authenticated/c/-components/TitleToggle/TitleToggle.style';
import { motion } from 'motion/react';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useSuspenseQuery } from '@tanstack/react-query';
import { LockKeyhole } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { useModal } from '@/hooks/useModal';
import { AllCreditsExhaustedModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/AllCreditsExhaustedModal';

interface TitleToggleProps {
  toggleValue: 'left' | 'right';
  onToggleChange: (value: 'left' | 'right') => void;
}

export function TitleToggle({ toggleValue, onToggleChange }: TitleToggleProps) {
  const { t } = useI18n(['main']);
  const { sm } = useBreakPoints();
  const navigate = useNavigate();
  const theme = useTheme();
  const modal = useModal();
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());
  const isAccess = me.hasProAccess;

  return (
    <motion.div layoutId="toggle-hero">
      <Flex direction="column" gap={24} alignItems="center" semantic="nav">
        <StyledCreateTitle $sm={sm}>
          {sm ? t('mainPage.titleMobile') : t('mainPage.title')}
        </StyledCreateTitle>
        <Toggle
          value={toggleValue}
          onValueChange={(val) => {
            if (val) {
              const newValue = val as 'left' | 'right';
              if (newValue === 'left') {
                onToggleChange(newValue);
                navigate({ to: '/c' });
              } else {
                if (!isAccess) {
                  return;
                }

                const isProCreditsExhausted =
                  me.freeCredit < me.productCreationCredit && me.paidCredit <= 0;

                if (isProCreditsExhausted) {
                  modal.openModal(({ isOpen, onClose }) => (
                    <AllCreditsExhaustedModal isOpen={isOpen} onClose={onClose} />
                  ));
                  return;
                }

                onToggleChange(newValue);
                navigate({ to: '/c/detail-input' });
              }
            }
          }}
          leftContent={<p>아이디어 모드</p>}
          rightContent={
            isAccess ? (
              <p>AI 심사역과 함께</p>
            ) : (
              <Tooltip
                side="bottom"
                content="해당 기능은 유료 플랜에서 이용 가능합니다."
              >
                <Flex
                  direction="row"
                  gap={4}
                  alignItems="center"
                  justify="center"
                >
                  <LockKeyhole size={16} color={theme.color.textPlaceholder} />
                  <p style={{ color: theme.color.textPlaceholder }}>
                    AI 심사역과 함께
                  </p>
                </Flex>
              </Tooltip>
            )
          }
          border="4px solid #f1f1f4"
          borderRadius="12px"
        />
      </Flex>
    </motion.div>
  );
}
