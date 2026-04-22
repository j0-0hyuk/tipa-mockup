import styled from '@emotion/styled';

export const StyledStepperContainer = styled.nav`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
`;

export const StyledStepWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const StyledStepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const StyledStepCircle = styled.div<{
  $status: 'completed' | 'current' | 'upcoming';
}>`
  width: 33px;
  height: 33px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $status, theme }) => {
    if ($status === 'completed') {
      return `
        background-color: ${theme.color.main};
        color: ${theme.color.white};
      `;
    }
    if ($status === 'current') {
      return `
        background-color: ${theme.color.white};
        border: 2px solid ${theme.color.main};
        color: ${theme.color.main};
      `;
    }
    return `
      background-color: ${theme.color.white};
      border: 2px solid ${theme.color.borderGray};
      color: ${theme.color.textGray};
    `;
  }}
`;

export const StyledStepNumber = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
`;

export const StyledStepLabel = styled.span<{
  $status: 'completed' | 'current' | 'upcoming';
}>`
  ${({ theme }) => theme.typo.Md_12}
  white-space: nowrap;
  color: ${({ $status, theme }) => {
    if ($status === 'upcoming') {
      return theme.color.textGray;
    }
    return theme.color.black;
  }};
  font-weight: ${({ $status }) => ($status === 'current' ? 700 : 500)};
`;

export const StyledStepConnector = styled.div<{
  $completed: boolean;
}>`
  width: 40px;
  height: 2px;
  margin: 0 12px;
  margin-top: 15px;
  background-color: ${({ $completed, theme }) =>
    $completed ? theme.color.main : theme.color.borderGray};
  flex-shrink: 0;
`;
