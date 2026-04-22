import { Flex } from '@/packages/ui/src';
import { chartTheme } from '@/make/pages/demo/loading/chartTheme';
import type { TamSamSomProps } from '@/make/pages/demo/loading/components/CustomComponents/TamSamSom/TamSamSom.schema';
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
} from '@/make/pages/demo/loading/components/CustomComponents/TamSamSom/TamSamSom.style';

export const TamSamSom = ({
  tamsamsomProps
}: {
  tamsamsomProps: TamSamSomProps;
}) => {
  const colorKey = 'GRAY';
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
          gap={10}
          size={300}
          color={chartTheme[colorKey].tertiary}
        >
          <StyledCircleLabel>TAM</StyledCircleLabel>
          <StyledCircleValue>{tamValue}</StyledCircleValue>
          <StyledCircleContainer
            gap={10}
            size={230}
            color={chartTheme[colorKey].secondary}
          >
            <StyledCircleLabel>SAM</StyledCircleLabel>
            <StyledCircleValue>{samValue}</StyledCircleValue>
            <StyledCircleContainer
              gap={44}
              size={160}
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
