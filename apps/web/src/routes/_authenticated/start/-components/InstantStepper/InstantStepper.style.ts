import styled from '@emotion/styled';

export const StyledStepperBar = styled.div`
  padding: 20px 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderLightGray};
  flex-shrink: 0;
  background: ${({ theme }) => theme.color.white};
`;

export const StyledStepperLabel = styled.p`
  ${({ theme }) => theme.typo.Md_12}
  color: ${({ theme }) => theme.color.textPlaceholder};
  margin-bottom: 14px;
`;

export const StyledStepperRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export const StyledStep = styled.div<{ $clickable: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90px;
  gap: 6px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

export const StyledStepCircle = styled.div<{ $state: 'done' | 'active' | 'pending' }>`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s;

  ${({ $state, theme }) => {
    switch ($state) {
      case 'done':
        return `background: ${theme.color.main}; color: ${theme.color.white};`;
      case 'active':
        return `background: ${theme.color.white}; border: 2.5px solid ${theme.color.main}; color: ${theme.color.main};`;
      case 'pending':
        return `background: ${theme.color.bgGray}; color: ${theme.color.textPlaceholder};`;
    }
  }}
`;

export const StyledStepName = styled.span<{ $state: 'done' | 'active' | 'pending' }>`
  ${({ theme }) => theme.typo.Md_12}
  white-space: nowrap;
  transition: all 0.2s;

  ${({ $state, theme }) => {
    switch ($state) {
      case 'done':
        return `font-weight: 500; color: ${theme.color.textGray};`;
      case 'active':
        return `font-weight: 600; color: ${theme.color.black};`;
      case 'pending':
        return `font-weight: 500; color: ${theme.color.textPlaceholder};`;
    }
  }}
`;

export const StyledStepLine = styled.div<{ $done: boolean }>`
  width: 36px;
  height: 2px;
  margin-top: 13px;
  flex-shrink: 0;
  transition: background 0.2s;
  background: ${({ $done, theme }) => ($done ? theme.color.main : theme.color.borderGray)};
`;
