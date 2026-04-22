import styled from '@emotion/styled';

export const StyledDialogOverlay = styled.div`
  background-color: ${({ theme }) => theme.color.basic.black30};
  position: fixed;
  inset: 0;
  z-index: 50;
`;

export const StyledDialogContent = styled.div`
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.lineDefault};
  border-radius: 16px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 720px;
  width: fit-content;
  padding: 20px;
  z-index: 51;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StyledDialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

export const StyledDialogTitle = styled.h2`
  color: ${({ theme }) => theme.color.textPrimary};
  ${({ theme }) => theme.typo.Sb_20}
  margin: 0;
  flex: 1;
`;

export const StyledDialogCloseButton = styled.button`
  padding: 0;
  height: fit-content;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

export const StyledDialogContentText = styled.div`
  color: ${({ theme }) => theme.color.textSecondary};
  ${({ theme }) => theme.typo.Rg_15}
`;

export const StyledDialogFooter = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;
