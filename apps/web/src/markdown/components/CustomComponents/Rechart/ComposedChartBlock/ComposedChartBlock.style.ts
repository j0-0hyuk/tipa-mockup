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
  ${({ theme }) => theme.typo.Md_12}
  white-space: nowrap;
  flex-shrink: 0;
`;

export const Styledtspan = styled.tspan`
  ${({ theme }) => theme.typo.Md_16}
`;
