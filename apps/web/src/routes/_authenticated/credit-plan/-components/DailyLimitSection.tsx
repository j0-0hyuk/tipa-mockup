import { useState, useEffect } from 'react';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { getAccountMeQueryOptions } from '@/query/options/account';
import {
  StyledCreditCard,
  StyledCreditDescription,
  StyledCreditDetailLink,
  StyledProgressContainer,
  StyledProgressPercentage,
  StyledProgressWrapper,
  StyledResetTimeContainer,
  StyledResetTimeText,
  StyledSection,
  StyledSectionTitle
} from '@/routes/_authenticated/credit-plan/-components/CreditPlan.style';
import { CREDIT } from '@/constants/credit.constant';
import { Flex, Progress } from '@docs-front/ui';
import { useTheme } from '@emotion/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react';

export default function DailyLimitSection() {
  const { isMobile, sm } = useBreakPoints();
  const theme = useTheme();
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());
  const [resetTime, setResetTime] = useState('');

  const progress = Math.min(
    Math.max(
      0,
      ((CREDIT.DAILY_LIMIT - me.freeCredit) / CREDIT.DAILY_LIMIT) * 100
    ),
    100
  );

  useEffect(() => {
    const updateResetTime = () => {
      const now = new Date();
      const koreaOffset = 9 * 60;
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const koreaTime = new Date(utc + koreaOffset * 60000);

      const nextReset = new Date(koreaTime);
      nextReset.setDate(nextReset.getDate() + 1);
      nextReset.setHours(0, 0, 0, 0);

      const diff = nextReset.getTime() - koreaTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setResetTime(`${hours}시간 ${minutes}분 후 초기화`);
    };

    updateResetTime();
    const interval = setInterval(updateResetTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <StyledSection $isMobile={isMobile}>
      <StyledSectionTitle>내 사용량</StyledSectionTitle>

      <StyledCreditCard $isSm={sm}>
        <Flex direction="column" width="100%" gap="12px">
          <Flex
            direction="row"
            width="100%"
            alignItems="center"
            justify="space-between"
            gap="16px"
          >
            <StyledProgressContainer>
              <StyledProgressWrapper>
                <Progress progress={progress} height="8px" />
              </StyledProgressWrapper>
              <StyledProgressPercentage>
                {Math.round(progress)}% 사용됨
              </StyledProgressPercentage>
            </StyledProgressContainer>
            <StyledResetTimeContainer>
              <StyledResetTimeText>{resetTime}</StyledResetTimeText>
            </StyledResetTimeContainer>
          </Flex>
        </Flex>
      </StyledCreditCard>
      <Flex gap="8px" width="100%" direction="row" alignItems="start">
        <CircleAlert size={16} color={theme.color.textGray} />
        <StyledCreditDescription>
          {`독스헌트의 모든 플랜은 서비스 안정성을 위해 일일 사용량 한도를 적용하며, 이는 24시간마다 자동 초기화됩니다.\n 일반적인 사업계획서 작성과 지원사업 준비에는 충분히 넉넉한 한도를 제공하고 있으니 안심하고 이용해 주세요.`}{' '}
          <StyledCreditDetailLink to="/credit-policy">
            더 자세히 보기
          </StyledCreditDetailLink>
        </StyledCreditDescription>
      </Flex>
    </StyledSection>
  );
}
