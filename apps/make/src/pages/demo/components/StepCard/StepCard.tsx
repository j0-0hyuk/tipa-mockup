import {
  StyledStepCardContainer,
  StyledTitle,
  StyledDescription,
  StyledWarning,
  StyledImage
} from '@/apps/make/src/pages/demo/components/StepCard/StepCard.style';
import { Flex, Badge } from '@/packages/ui/src';

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  warning?: string;
  isActive?: boolean;
  imageSrc: string;
}

export default function StepCard({
  step,
  title,
  description,
  warning = '',
  isActive = false,
  imageSrc
}: StepCardProps) {
  return (
    <StyledStepCardContainer
      $isActive={isActive}
      data-active={isActive}
      className={isActive ? 'active-step' : 'inactive-step'}
    >
      <Flex
        direction="column"
        justify="start"
        alignItems="flex-start"
        gap="8px"
        width={'160px'}
        height={'100%'}
      >
        <Badge>{step}</Badge>
        <StyledTitle>{title}</StyledTitle>
        <Flex direction="column" gap="15px">
          <StyledDescription>{description}</StyledDescription>
          <StyledWarning>{warning}</StyledWarning>
        </Flex>
      </Flex>
      <StyledImage src={imageSrc} alt={title} />
    </StyledStepCardContainer>
  );
}
