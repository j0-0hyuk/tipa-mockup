import { createFileRoute } from '@tanstack/react-router';

import { Link } from '@tanstack/react-router';
import { Flex } from '@docs-front/ui';
import {
  StyledContentContainer,
  StyledPageContainer,
  StyledTabLink,
  StyledTabContainer,
  StyledTabIndicator
} from '@/routes/_authenticated/credit-plan/-components/CreditPlan.style';
import {
  StyledCreditPolicyContainer,
  StyledPageTitle,
  StyledPlanGuideContainer,
  StyledPolicyCard,
  StyledPolicyQuestion,
  StyledPolicyAnswer
} from '@/routes/_authenticated/credit-policy/-CreditPolicy.style';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useI18n } from '@/hooks/useI18n';

export const Route = createFileRoute('/_authenticated/credit-policy')({
  component: CreditPolicy
});

function Dot() {
  return <span style={{ margin: '0px 4px' }}>•</span>;
}

function CreditPolicy() {
  const { isMobile } = useBreakPoints();
  const { t } = useI18n(['referralEvent']);
  return (
    <Flex
      semantic="main"
      height="100vh"
      width="100%"
      margin="0 auto"
      direction="column"
    >
      <StyledPageContainer $isMobile={isMobile}>
        <StyledTabContainer $isMobile={isMobile}>
          <Link to="/credit-plan">
            <StyledTabLink $isActive={false}>내 플랜 </StyledTabLink>
          </Link>
          <Link to="/credit-policy">
            <StyledTabLink $isActive={true}>
              플랜 이용 안내 <StyledTabIndicator />
            </StyledTabLink>
          </Link>
          <Link to="/referral-event">
            <StyledTabLink $isActive={false}>
              {t('referralEvent:tab')}
            </StyledTabLink>
          </Link>
        </StyledTabContainer>
        <StyledContentContainer $isMobile={isMobile}>
          <StyledCreditPolicyContainer $isMobile={isMobile}>
            <StyledPageTitle $isSm={isMobile}>플랜 이용 안내</StyledPageTitle>
            <StyledPlanGuideContainer>
              <Flex direction="column" gap="40px" width="100%">
                <StyledPolicyCard>
                  <StyledPolicyQuestion>
                    1. 독스헌트는 어떻게 사용하나요?
                  </StyledPolicyQuestion>
                  <StyledPolicyAnswer>
                    독스헌트는 사업계획서 초안 작성, 지원사업 양식 채우기 등 AI
                    기능을 플랜에 따라 자유롭게 사용하는 서비스입니다.
                    <br />
                    모든 플랜은 크레딧 기반이 아닌, 사용량 기준 방식으로
                    운영됩니다.
                  </StyledPolicyAnswer>
                </StyledPolicyCard>

                <StyledPolicyCard>
                  <StyledPolicyQuestion>
                    2. 사용량 기준이란?
                  </StyledPolicyQuestion>
                  <StyledPolicyAnswer>
                    독스헌트의 모든 플랜은 서비스 안정성을 위해 일일 사용량 한도를 적용하며, 이는 24시간마다 자동 초기화됩니다.
                    <br />
                    일반적인 사업계획서 작성과 지원사업 준비에는 충분히 넉넉한 한도를 제공하고 있으니 안심하고 이용해 주세요.
                    <br />
                    <br />
                    사용량은 다음 요소에 따라 달라질 수 있습니다.
                    <br />
                    <Dot /> 문서의 길이와 복잡도
                    <br />
                    <Dot /> 동시에 진행하는 작업의 수
                    <br />
                    <Dot /> 사용 중인 기능 (초안 생성, 수정, 양식 채우기 등)
                    <br />
                    <br />
                    예를 들어, 매우 긴 내용을 한 번에 생성하거나 동일한 작업을
                    반복적으로 요청할 경우 사용 패턴에 따라 사용량 소모 속도가
                    달라질 수 있습니다.
                  </StyledPolicyAnswer>
                </StyledPolicyCard>

                <StyledPolicyCard>
                  <StyledPolicyQuestion>
                    3. 기존 Pro 고객 안내
                  </StyledPolicyQuestion>
                  <StyledPolicyAnswer>
                    기존 Pro 고객은 현재 금액을 그대로 유지합니다.
                    <br />
                    <Dot /> 구독 해지 이전까지 현재 금액으로 계속 구독 가능
                    <br />
                    <Dot /> 크레딧 충전 없이 기능을 자유롭게 사용
                    <br />
                    <Dot /> 일/주/월 사용량 기준 적용
                    <br />
                    <Dot /> 보유한 영구 크레딧은 사용량 기준을 초과한 경우에
                    사용
                  </StyledPolicyAnswer>
                </StyledPolicyCard>

                <StyledPolicyCard>
                  <StyledPolicyQuestion>
                    4. 사용 기준에 도달하면 어떻게 되나요?
                  </StyledPolicyQuestion>
                  <StyledPolicyAnswer>
                    <Dot /> 사용 기준에 근접하면 사전 안내가 제공됩니다.
                    <br />
                    <Dot /> 기준을 초과한 경우:
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Dot /> 다음 기준 시간까지 대기하거나
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Dot /> (기존 Pro 고객의 경우) 보유한 영구 크레딧이 소진될
                    때까지 계속 이용할 수 있습니다.
                  </StyledPolicyAnswer>
                </StyledPolicyCard>

                <StyledPolicyCard>
                  <StyledPolicyQuestion>
                    5. 이런 사용은 제한될 수 있어요
                  </StyledPolicyQuestion>
                  <StyledPolicyAnswer>
                    다음과 같은 경우 사용이 일시적으로 제한될 수 있습니다.
                    <br />
                    <Dot /> 자동화 도구를 이용한 반복 호출
                    <br />
                    <Dot /> 과도한 대량 생성 요청
                    <br />
                    <Dot /> 서비스 안정성을 해치는 사용 패턴
                  </StyledPolicyAnswer>
                </StyledPolicyCard>

                <StyledPolicyCard>
                  <StyledPolicyQuestion>
                    6. 독스헌트를 효율적으로 사용하는 방법
                  </StyledPolicyQuestion>
                  <StyledPolicyAnswer>
                    <Dot /> 챗봇 수정 시, 여러 질문이 있다면 한 번에 묶어
                    요청하세요.
                    <br />
                    <Dot /> 한 사업계획서 초안 안에서 작업을 이어가면 사용
                    효율이 높아집니다.
                  </StyledPolicyAnswer>
                </StyledPolicyCard>
              </Flex>
            </StyledPlanGuideContainer>
          </StyledCreditPolicyContainer>
        </StyledContentContainer>
      </StyledPageContainer>
    </Flex>
  );
}
