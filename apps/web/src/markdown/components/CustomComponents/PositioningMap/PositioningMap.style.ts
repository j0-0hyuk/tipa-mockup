import styled from '@emotion/styled';

export const StyledLabel = styled.span<{ main?: boolean; color?: string }>`
  color: ${({ theme, main, color }) =>
    main ? (color ? color : theme.color.main) : theme.color.bgDarkGray};
  white-space: nowrap;
  ${({ theme, main }) => (main ? theme.typo.Sb_16 : theme.typo.Md_15)}
`;

export const StyledPos = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StyledDot = styled.div<{ main?: boolean; color?: string }>`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme, main, color }) =>
    main ? (color ? color : theme.color.main) : theme.color.textGray};
`;

export const StyledMap = styled.div<{ marginLeft: number; marginTop: number }>`
  position: relative;
  width: 400px;
  height: 400px;
  margin-left: ${({ marginLeft }) => marginLeft}px;
  margin-top: ${({ marginTop }) => marginTop}px;
`;

export const StyledNegativeXLabel = styled.span`
  position: absolute;
  top: 50%;
  transform: translate(-100%, -50%);
  left: 0;
  color: ${({ theme }) => theme.color.textGray};
  ${({ theme }) => theme.typo.Md_13}
`;

export const StyledPositiveXLabel = styled.span`
  position: absolute;
  top: 50%;
  transform: translate(100%, -50%);
  right: 0;
  color: ${({ theme }) => theme.color.textGray};
  ${({ theme }) => theme.typo.Md_13}
`;

export const StyledNegativeYLabel = styled.span`
  position: absolute;
  bottom: 0;
  transform: translate(-50%, 100%);
  left: 50%;
  color: ${({ theme }) => theme.color.textGray};
  ${({ theme }) => theme.typo.Md_13}
`;

export const StyledPositiveYLabel = styled.span`
  position: absolute;
  top: 0;
  transform: translate(-50%, -100%);
  left: 50%;
  color: ${({ theme }) => theme.color.textGray};
  ${({ theme }) => theme.typo.Md_13}
`;
