import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Flex } from '@docs-front/ui';

/** MainPrompt와 유사한 통합 영역 (프롬프트 + 참고자료) */
export const StyledPromptAndReferencesCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  width: 100%;
  box-shadow: 0 4px 12px 0 rgba(0, 27, 55, 0.1);
`;

export const StyledPromptTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  resize: vertical;
  outline: none;
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.black};
  background-color: ${({ theme }) => theme.color.white};

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.lineAccent};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.color.bgLightGray};
  }
`;

export const StyledReferencesLabelRow = styled(Flex)`
  width: 100%;
`;

export const StyledReferenceHintList = styled.ul`
  margin: 0;
  padding-left: 16px;
  list-style-type: disc;
  ${({ theme }) => theme.typo.Rg_12}
  color: ${({ theme }) => theme.color.textGray};
  line-height: 1;
`;

export const StyledFileDropzone = styled.div<{ $isDragOver: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 16px 16px;
  border-radius: 12px;
  background-color: ${({ theme, $isDragOver }) =>
    $isDragOver ? theme.color.bgBlueGray : theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  width: 100%;
`;

export const StyledFileBadge = styled.div<{ $sm: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: ${({ $sm }) => ($sm ? '4px 8px' : '6.5px 12px')};
  background-color: ${({ theme }) => theme.color.bgBlueGray};
  color: ${({ theme }) => theme.color.textGray};
  border-radius: 999px;
  max-width: ${({ $sm }) => ($sm ? '200px' : '320px')};
  ${({ theme, $sm }) => ($sm ? theme.typo.Md_12 : theme.typo.Md_16)}
`;

export const StyledBadgeText = styled.p<{ $sm: boolean }>`
  max-width: ${({ $sm }) => ($sm ? '200px' : '280px')};
  ${({ theme, $sm }) => ($sm ? theme.typo.Md_12 : theme.typo.Md_16)}
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledMainTextarea = styled.textarea<{ $sm: boolean }>`
  width: 100%;
  height: ${({ $sm }) => ($sm ? '100px' : '120px')};
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
  border-radius: 8px;
  resize: none;
  transition: border-color 0.2s ease;
  overflow: auto;
  border: none;
  outline: none;
  ${({ $sm }) => $sm && 'line-height: 160%;'}
  ${({ theme, $sm }) => ($sm ? theme.typo.Rg_14 : theme.typo.Rg_16)}
  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.color.white};
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const StyledSpinningIcon = styled.span`
  display: inline-flex;
  animation: ${spin} 1s linear infinite;
`;

export const StyledShadowFlex = styled(Flex)`
  box-shadow: 0 4px 12px 0 rgba(0, 27, 55, 0.1);
  border-radius: 12px;
  border: none;
`;
