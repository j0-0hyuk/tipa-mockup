import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Flex } from '@docs-front/ui';

export const StyledFileDropzone = styled.div<{ isDragOver: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 16px 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.color.white};
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

export const StyledFileAddLabel = styled.p<{ $sm: boolean }>`
  ${({ theme, $sm }) => ($sm ? 'font-size: 11px;' : theme.typo.Rg_14)}
  color: ${({ theme }) => theme.color.textGray};
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

export const StyledPendingModalTitle = styled.h3`
  ${({ theme }) => theme.typo.Sb_24}
  margin: 0;
`;

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

export const StyledShadowFlex = styled(Flex)`
  box-shadow: 0 4px 12px 0 rgba(0, 27, 55, 0.1);
  border-radius: 12px;
  border: none;
`;
