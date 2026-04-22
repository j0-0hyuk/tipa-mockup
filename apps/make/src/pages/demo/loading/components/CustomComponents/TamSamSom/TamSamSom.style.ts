import styled from '@emotion/styled';

export const StyledTamSamSomContainer = styled.div`
  padding: 20px;
  display: flex;
  gap: 58px;
  box-sizing: border-box;
  max-width: 768px;
`;

export const StyledDiagramContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  flex-shrink: 0;
`;

export const StyledCircleContainer = styled.div<{
  size: number;
  color: string;
  gap: number;
}>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: ${(props) => props.color};
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.gap}px;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
`;

export const StyledCircleLabel = styled.div`
  position: relative;
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 1.19;
  letter-spacing: -0.02em;
  text-align: center;
  color: #1a1a1c;
`;

export const StyledCircleValue = styled.div`
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.19;
  letter-spacing: -0.02em;
  text-align: center;
  color: #000000;
`;

export const StyledDescriptionContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 10px;
  justify-content: center;
`;

export const StyledDescriptionBlock = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

export const StyledTextContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

export const StyledTitle = styled.div`
  font-family: Pretendard, sans-serif;
  font-weight: 700;
  font-size: 15px;
  line-height: 1.19;
  letter-spacing: -0.02em;
  color: #6e7687;
`;

export const StyledDescription = styled.div`
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 1.19;
  letter-spacing: -0.02em;
  color: #6e7687;
`;
