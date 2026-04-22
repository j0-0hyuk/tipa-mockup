import { useI18n } from '@/hooks/useI18n';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import type { GetReferralMeResponse } from '@/schema/api/referral/referral';
import { Badge } from '@bichon/ds';
import {
  StyledSection,
  StyledSectionTitle,
  StyledCard,
  StyledProgressBarContainer,
  StyledProgressBar,
  StyledProgressFill,
  StyledProgressText,
  StyledRewardItem,
  StyledRewardIcon,
  StyledRewardText
} from '@/routes/_authenticated/referral-event/-components/ReferralEvent.style';
import { Flex } from '@docs-front/ui';

interface ProgressSectionProps {
  effectiveCount: number;
  rewards: GetReferralMeResponse['rewards'];
}

export const ProgressSection = ({
  effectiveCount,
  rewards
}: ProgressSectionProps) => {
  const { t, locale } = useI18n(['referralEvent']);
  const { isMobile } = useBreakPoints();

  const maxTarget =
    rewards.length > 0 ? Math.max(...rewards.map((r) => r.threshold)) : 10;
  const percent = (effectiveCount / maxTarget) * 100;

  const formatGrantedDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <StyledSection $isMobile={isMobile}>
      <StyledSectionTitle>
        {t('referralEvent:progressSection.title')}
      </StyledSectionTitle>
      <StyledCard>
        <Flex direction="column" gap={16}>
          <span>
            {t('referralEvent:progressSection.count', {
              count: effectiveCount
            })}
          </span>

          <StyledProgressBarContainer>
            <StyledProgressBar>
              <StyledProgressFill $percent={percent} />
            </StyledProgressBar>
            <StyledProgressText>
              {t('referralEvent:progressSection.progress', {
                current: effectiveCount,
                target: maxTarget
              })}
            </StyledProgressText>
          </StyledProgressBarContainer>

          <Flex direction="column" gap={8}>
            {rewards.map((reward) => (
              <StyledRewardItem key={reward.tier} $achieved={reward.achieved}>
                <StyledRewardIcon $achieved={reward.achieved}>
                  {reward.achieved ? '✓' : reward.tier}
                </StyledRewardIcon>
                <StyledRewardText $achieved={reward.achieved}>
                  {t(
                    reward.tier === 1
                      ? 'referralEvent:progressSection.tier1'
                      : 'referralEvent:progressSection.tier2',
                    {
                      threshold: reward.threshold,
                      months: reward.rewardMonths
                    }
                  )}
                </StyledRewardText>
                {reward.achieved && (
                  <Badge variant="active" size="small">
                    {reward.grantedAt
                      ? t('referralEvent:progressSection.grantedAt', {
                          date: formatGrantedDate(reward.grantedAt)
                        })
                      : t('referralEvent:progressSection.achieved')}
                  </Badge>
                )}
              </StyledRewardItem>
            ))}
          </Flex>
        </Flex>
      </StyledCard>
    </StyledSection>
  );
};
