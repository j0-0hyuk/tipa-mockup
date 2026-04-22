import styled from '@emotion/styled';

export const StyledModalOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  inset: 0;
  z-index: 50;
`;

export const StyledModalContent = styled.div`
  background: ${({ theme }) => theme.color.white};
  border-radius: 16px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  padding: 20px;
  z-index: 51;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledModalHeader = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 4px;
`;

export const StyledModalTitle = styled.h2`
  color: ${({ theme }) => theme.color.black};
  ${({ theme }) => theme.typo.Sb_24}
  margin: 0;
  flex: 1;
`;

export const StyledModalCloseButton = styled.button`
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

export const StyledModalBody = styled.div`
  color: ${({ theme }) => theme.color.black};
  ${({ theme }) => theme.typo.Rg_16}
  padding: 4px 0;
  flex: 1;
`;

export const StyledModalFooter = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
`;
