import styled from '@emotion/styled';

export const StyledSvg = styled.svg<{
  width?: number | string;
  height?: number | string;
  color?: string;
  size?: number | string;
}>`
  width: ${({ size, width }) => size ?? width ?? 18}px;
  height: ${({ size, height }) => size ?? height ?? 18}px;
  color: ${({ color }) => color ?? 'currentColor'};
`;

export interface SvgProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  size?: number | string;
}
