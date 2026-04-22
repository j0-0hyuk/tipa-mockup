import styled from '@emotion/styled';

export const StyledPageSubtitle = styled.h2`
  margin: 0;
  ${({ theme }) => theme.typo.Sb_18}
  color: ${({ theme }) => theme.color.black};
`;

export const StyledTemplateName = styled.p`
  margin: 0;
  ${({ theme }) => theme.typo.Md_18}
  color: ${({ theme }) => theme.color.main};
`;

export const StyledCounter = styled.span`
  ${({ theme }) => theme.typo.Sb_14}
  color: ${({ theme }) => theme.color.main};
`;

export const StyledDescription = styled.p`
  margin: 0;
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledFooter = styled.footer`
  position: sticky;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: fit-content;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 0;
  background-color: ${({ theme }) => theme.color.white};
  border-top: 1px solid ${({ theme }) => theme.color.borderLightGray};
  z-index: 10;
`;

export const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 20px;
  align-items: center;
  width: 100%;
  height: fit-content;
`;

export const StyledTitleCell = styled.span<{ $selected?: boolean }>`
  ${({ theme }) => theme.typo.Sb_14}
  color: ${({ theme, $selected }) =>
    $selected ? theme.color.main : theme.color.black};
  cursor: default;
  word-break: break-word;
`;

export const StyledPromptCellWrapper = styled.div<{ $selected?: boolean }>`
  width: 100%;
  padding: 16px 0;

  & input {
    border-color: ${({ theme, $selected }) =>
      $selected ? theme.color.main : undefined};
  }
`;

export const StyledHeaderText = styled.span`
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledAddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 0;
  ${({ theme }) => theme.typo.Sb_14}
  color: ${({ theme }) => theme.color.main};

  &:hover {
    opacity: 0.8;
  }
`;

export const StyledDeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${({ theme }) => theme.color.textGray};
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.color.error};
  }
`;

export const StyledTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;

  & table {
    width: 100%;
    table-layout: fixed;
  }
`;

export const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 16px;
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 16px;
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.error};
`;

export const StyledSkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderLightGray};
`;
