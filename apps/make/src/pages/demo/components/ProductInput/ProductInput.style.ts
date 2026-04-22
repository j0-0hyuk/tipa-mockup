import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const StyledFileDropzone = styled.div<{ isDragOver: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
`;

export const StyledTemplateArea = styled.div`
  display: flex;
  justify-content: start;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-bottom: none;
  width: 100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

export const StyledFileBadge = styled.div<{ $sm: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: ${({ $sm }) => ($sm ? '4px 8px' : '6.5px 12px')};
  background-color: ${({ theme }) => theme.color.bgBlueGray};
  color: ${({ theme }) => theme.color.textGray};
  border-radius: 999px;
  width: fit-content;
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
  height: ${({ $sm }) => ($sm ? '120px' : '150px')};
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
  border-radius: 8px;
  resize: none;
  transition: border-color 0.2s ease;
  overflow: auto;
  border: none;
  outline: none;
  ${({ theme, $sm }) => ($sm ? theme.typo.Rg_13 : theme.typo.Rg_16)}
  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }
`;

export const StyledFileAddLabel = styled.p<{ $sm: boolean }>`
  ${({ theme, $sm }) => ($sm ? theme.typo.Rg_12 : theme.typo.Rg_14)}
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

export const StyledTemplateInput = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.color.bgBlueGray};
  }
`;
