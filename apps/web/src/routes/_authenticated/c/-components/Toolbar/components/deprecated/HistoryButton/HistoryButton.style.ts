import styled from '@emotion/styled';

export const StyledExportHistoryButtonCount = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  display: flex;
  width: 16px;
  height: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  ${({ theme }) => theme.typo.Md_12};

  @media (max-width: 1199px) {
    top: 2px;
    left: 2px;
  }
`;
