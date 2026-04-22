import { Flex } from '@docs-front/ui';
import { chartTheme } from '@/markdown/chartTheme';
import { useChartColorKey } from '@/hooks/useChartColorKey';
import type { TamSamSomProps } from '@/markdown/components/CustomComponents/TamSamSom/TamSamSom.schema';
import {
  StyledTamSamSomContainer,
  StyledDiagramContainer,
  StyledCircleValue,
  StyledCircleLabel,
  StyledCircleContainer,
  StyledDescriptionContainer,
  StyledDescriptionBlock,
  StyledTextContainer,
  StyledTitle,
  StyledDescription
} from '@/markdown/components/CustomComponents/TamSamSom/TamSamSom.style';

export const TamSamSom = ({
  tamsamsomProps
}: {
  tamsamsomProps: TamSamSomProps;
}) => {
  const { colorKey } = useChartColorKey();
  const {
    tamValue,
    samValue,
    somValue,
    tamDescription,
    samDescription,
    somDescription,
    tamJustification,
    samJustification,
    somJustification
  } = tamsamsomProps;
  return (
    <StyledTamSamSomContainer>
      <StyledDiagramContainer>
        <StyledCircleContainer
          gap={8}
          size={240}
          color={chartTheme[colorKey].tertiary}
        >
          <StyledCircleLabel>TAM</StyledCircleLabel>
          <StyledCircleValue>{tamValue}</StyledCircleValue>
          <StyledCircleContainer
            gap={8}
            size={190}
            color={chartTheme[colorKey].secondary}
          >
            <StyledCircleLabel>SAM</StyledCircleLabel>
            <StyledCircleValue>{samValue}</StyledCircleValue>
            <StyledCircleContainer
              gap={36}
              size={140}
              color={chartTheme[colorKey].primary1}
            >
              <StyledCircleLabel style={{ color: '#ffffff' }}>
                SOM
              </StyledCircleLabel>
              <StyledCircleValue style={{ color: '#ffffff' }}>
                {somValue}
              </StyledCircleValue>
              <Flex height={5}></Flex>
            </StyledCircleContainer>
          </StyledCircleContainer>
        </StyledCircleContainer>
      </StyledDiagramContainer>
      <StyledDescriptionContainer>
        <StyledDescriptionBlock>
          <StyledTextContainer>
            <StyledTitle>{tamDescription}</StyledTitle>
            <StyledDescription>{tamJustification}</StyledDescription>
          </StyledTextContainer>
        </StyledDescriptionBlock>

        <StyledDescriptionBlock>
          <StyledTextContainer>
            <StyledTitle>{samDescription}</StyledTitle>
            <StyledDescription>{samJustification}</StyledDescription>
          </StyledTextContainer>
        </StyledDescriptionBlock>

        <StyledDescriptionBlock>
          <StyledTextContainer>
            <StyledTitle style={{ color: '#000000' }}>
              {somDescription}
            </StyledTitle>
            <StyledDescription style={{ color: '#1a1a1c' }}>
              {somJustification}
            </StyledDescription>
          </StyledTextContainer>
        </StyledDescriptionBlock>
      </StyledDescriptionContainer>
    </StyledTamSamSomContainer>
  );
};
