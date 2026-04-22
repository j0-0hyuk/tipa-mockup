import styled from '@emotion/styled';

export const StyledLoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: all;
`;

export const StyledHiddenContainer = styled.div<{ $isHidden: boolean }>`
  position: ${({ $isHidden }) => ($isHidden ? 'fixed' : 'static')};
  ${({ $isHidden }) =>
    $isHidden
      ? `
    left: 0;
    top: 100vh;
    width: 1200px;
    max-height: 100vh;
    overflow: hidden;
    pointer-events: none;
    z-index: -1;
  `
      : `
    position: static;
  `}
`;

export const StyledLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  margin-top: 12px;
  background: ${({ theme }) => theme.color.bgGray};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: 16px;
  width: 100%;
`;
