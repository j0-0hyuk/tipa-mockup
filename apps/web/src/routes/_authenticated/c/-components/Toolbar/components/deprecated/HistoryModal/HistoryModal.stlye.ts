import styled from '@emotion/styled';

export const StyledHistoryModal = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  background: white;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: 12px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  overflow: hidden;
  padding: 12px 8px;
`;

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 158px;
  padding: 6px 8px;
`;

export const StyledTitle = styled.div`
  ${({ theme }) => theme.typo.Md_13};
  white-space: nowrap;
`;
