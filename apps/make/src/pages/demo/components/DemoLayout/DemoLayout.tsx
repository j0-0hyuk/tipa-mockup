import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { Flex } from '@/packages/ui/src';
import StepStatusbar from '@/apps/make/src/pages/demo/components/Statusbar/Statusbar';
import {
  StyledDemoPageContainer,
  StyledMainTitle,
  StyledStepCardWrapper,
  StyledStepCardDivider
} from '@/apps/make/src/pages/demo/components/DemoLayout/DemoLayout.style';
import { useBreakPoints } from '@/apps/make/src/hooks/useBreakPoints';
import { StyledStatusbarContainer } from '@/apps/make/src/pages/demo/components/DemoLayout/DemoLayout.style';
import StepCard from '@/apps/make/src/pages/demo/components/StepCard/StepCard';

const statusSteps = [
  { step: '1', title: '한글 양식 업로드' },
  { step: '2', title: '프롬프트 입력' },
  { step: '3', title: '다운로드' }
];

export default function DemoLayout() {
  const { sm } = useBreakPoints();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getActiveStep = () => {
    if (location.pathname === '/file' || location.pathname === '/loading') {
      return '3';
    }
    const step = searchParams.get('step');
    return step === '2' ? '2' : '1';
  };

  const activeStep = getActiveStep();

  return (
    <StyledDemoPageContainer>
      <Flex direction="column" gap={16} width="100%" alignItems="center">
        <Flex gap={4} direction="column" alignItems="center">
          <StyledMainTitle $sm={sm}>
            필요한 문서를 빠르게 완성하세요
          </StyledMainTitle>
          <p>한글 양식 업로드 → 프롬프트 입력 → 다운로드</p>
        </Flex>
        <StyledStatusbarContainer>
          {statusSteps.map(({ step, title }) => (
            <StepStatusbar
              key={step}
              step={step}
              title={title}
              isActive={step === activeStep}
            />
          ))}
        </StyledStatusbarContainer>
      </Flex>
      <Outlet />
      <StyledStepCardWrapper>
        <StepCard
          step="1. 한글 양식 업로드"
          title="원하는 양식을 뭐든지 넣으세요"
          description="어떤 문서든 필요한 양식을 업로드하면 됩니다. 한글을 지원합니다."
          warning="*hwpx 지원, hwp 미지원"
          isActive={activeStep === '1'}
          imageSrc="/images/main/step1.png"
        />
        <StyledStepCardDivider />
        <StepCard
          step="2. 프롬프트 입력"
          title="채우고 싶은 내용을 작성하세요"
          description={`만들고 싶은 문서의\n목적, 규칙, 필요 정보 등을 자유롭게 입력해주세요.\n입력이 구체적일수록\n결과가 정확해집니다.`}
          isActive={activeStep === '2'}
          imageSrc="/images/main/step2.png"
        />
        <StyledStepCardDivider />
        <StepCard
          step="3. 다운로드"
          title="이제 3분만 기다리면 문서가 완성됩니다!"
          description="입력한 프롬프트를 바탕으로 자동으로 업로드한 양식에 맞게 채워집니다. 빠르게 문서를 완성하세요."
          isActive={activeStep === '3'}
          imageSrc="/images/main/step3.png"
        />
      </StyledStepCardWrapper>
    </StyledDemoPageContainer>
  );
}
