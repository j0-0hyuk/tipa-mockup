import styled from '@emotion/styled';

export const StyledColorPick = styled.div<{ $color: string }>`
  display: flex;
  width: 24px;
  height: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ $color }) => $color};
`;

export const StyledColorPickInner = styled.div<{ $color: string }>`
  width: 18px;
  height: 18px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ $color }) => $color};
`;

export const StyledColorPickContent = styled.div`
  display: inline-flex;
  padding: 12px;
  margin-top: 10px;
  align-items: flex-start;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0 4px 12px 0 rgba(0, 27, 55, 0.15);
`;
