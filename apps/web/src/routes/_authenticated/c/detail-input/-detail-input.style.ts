import styled from '@emotion/styled';

export const StyledDetailInputContainer = styled.div<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '768px')};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '24px' : '40px')};
  align-items: center;
  justify-content: start;
  min-width: ${({ $isMobile }) => ($isMobile ? '100%' : '768px')};
  padding: ${({ $isMobile }) =>
    $isMobile ? '30px 16px 90px 16px' : '60px 0 90px 0'};
`;

export const StyledDetailInputContents = styled.div<{ $isMobile: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  flex: none;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  padding-bottom: 48px;
`;

/** 필드 블록 (라벨 + 입력 + 에러). 필드 간 40px */
export const StyledFieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 40px;
  width: 100%;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const StyledFieldMetaRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 4px;
  width: 100%;
`;

export const StyledAIAssistantButtonWrapper = styled.div`
  margin-left: auto;
  display: inline-flex;
  flex-shrink: 0;
`;

/** 라벨: docs-front Md_16, textPrimary */
export const StyledFieldLabel = styled.label`
  ${({ theme }) => theme.typo.Md_16}
  color: ${({ theme }) => theme.color.textPrimary};
  margin-bottom: 8px;
  display: block;
  width: 100%;
`;

export const StyledFieldError = styled.span`
  ${({ theme }) => theme.typo.Md_12}
  color: ${({ theme }) => theme.color.textWarning};
  display: block;
  flex: 1;
`;

export const StyledFooter = styled.footer`
  position: sticky;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: fit-content;
  bottom: 20px;
  left: 0;
  right: 0;
`;

export const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  align-items: center;
  width: 100%;
  height: fit-content;
`;
