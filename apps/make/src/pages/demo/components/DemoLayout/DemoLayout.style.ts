import styled from '@emotion/styled';

export const StyledStatusbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 1200px;
  margin: 0 auto;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  background-color: ${({ theme }) => theme.color.white};
`;

export const StyledMainTitle = styled.h1<{ $sm: boolean }>`
  color: ${({ theme }) => theme.color.black};
  font-weight: 600;
  font-size: ${({ $sm }) => ($sm ? '28px' : '36px')};
  line-height: ${({ $sm }) => ($sm ? '32px' : '42px')};
  letter-spacing: 0%;
  text-align: center;
  white-space: pre-line;
`;

export const StyledDemoPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 1200px;
  margin: 0 auto;
  gap: 8px;
`;

export const StyledStepCardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  @media (max-width: 1200px) {
    .inactive-step {
      display: none;
    }

    .active-step {
      display: flex;
    }
  }
`;

export const StyledStepCardDivider = styled.div`
  width: 1px;
  height: 200px;
  background: ${({ theme }) => theme.color.borderGray};
  margin: 0px 4px;
  @media (max-width: 1200px) {
    display: none;
  }
`;
