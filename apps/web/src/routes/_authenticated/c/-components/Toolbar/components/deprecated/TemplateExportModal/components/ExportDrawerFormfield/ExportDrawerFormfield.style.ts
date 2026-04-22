import { StyledRadioButton } from '@docs-front/ui';
import styled from '@emotion/styled';

export const StyledUploadedFile = styled.div<{ checked?: boolean }>`
  display: flex;
  width: 100%;
  padding: 12px;
  height: 48px;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.borderLightGray};
  background: ${({ theme }) => theme.color.white};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    border-color: ${({ theme }) => theme.color.borderGray};
    background: ${({ theme }) => theme.color.bgGray};
  }
  &[data-state='checked'] {
    border: 1px solid ${({ theme }) => theme.color.main};
    background: ${({ theme }) => theme.color.bgMain};
    ${StyledRadioButton} {
      border: 1px solid ${({ theme }) => theme.color.main};
    }
    &:hover {
      border-color: ${({ theme }) => theme.color.main};
      background: ${({ theme }) => theme.color.bgMain};
    }
  }
`;

export const StyledFileIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

export const StyledFileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const StyledFileNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const StyledFileName = styled.div`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 14px;
  line-height: 1.19;
  letter-spacing: -0.02em;
  color: #000000;
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
