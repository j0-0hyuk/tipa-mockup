import styled from '@emotion/styled';

export const StyledIntroHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100vw;
  height: 74px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StyledLine = styled.div`
  width: 1px;
  height: 30px;
  background-color: ${({ theme }) => theme.color.borderGray};
`;
