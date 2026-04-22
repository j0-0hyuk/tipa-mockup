import styled from '@emotion/styled';

export const StyledDocumentPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  overflow: hidden;
`;

export const StyledEditorToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 60px;
  padding: 8px 10px;
  background-color: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  flex-shrink: 0;
  min-width: 0;
`;

export const StyledEditorTitle = styled.h1`
  ${({ theme }) => theme.typo.Sb_16}
  color: ${({ theme }) => theme.color.black};
  margin: 0;
  padding-left: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  flex-shrink: 0;
`;

export const StyledEditorNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  flex: 1;
  min-width: 0;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.color.textGray};
  }

  span {
    ${({ theme }) => theme.typo.Rg_13}
    color: ${({ theme }) => theme.color.textGray};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const StyledEditorContent = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  justify-content: center;
  min-width: 0;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  background-color: ${({ theme }) => theme.color.bgGray};
`;

export const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  height: 100%;
  width: 783px;
  max-width: 100%;
  overflow: hidden;
`;

export const StyledEditorOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.bgGray};
  z-index: 1;
`;

export const StyledEditorError = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: ${({ theme }) => theme.color.textGray};
`;
