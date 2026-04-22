import styled from '@emotion/styled';

interface LegendColorProps {
  backgroundColor: string;
}

export const LegendColor = styled.span<LegendColorProps>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  width: 22px;
  height: 12px;
  margin-right: 4px;
  border-radius: 2px;
`;

export const LegendText = styled.span`
  font-family: Pretendard;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: -0.24px;
  text-align: start;
`;

export const Styledtspan = styled.tspan`
  ${({ theme }) => theme.typo.Md_16}
`;
