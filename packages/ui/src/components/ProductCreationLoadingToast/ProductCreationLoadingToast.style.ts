import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const StyledProductCreationLoadingToast = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 20px;
  gap: 12px;
  width: 380px;
  height: 77px;
  background: #ffffff;
  border: 1px solid #e3e4e8;
  box-shadow: 0 4px 12px rgba(0, 27, 55, 0.15);
  border-radius: 12px;

  @media (max-width: 768px) {
    width: 250px;
  }
`;

export const StyledContentRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: 19px;
  width: 100%;
`;

export const StyledTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 4px;
  height: 19px;
`;

export const StyledIconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1c;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const StyledSpinnerIcon = styled.span`
  display: inline-flex;
  animation: ${spin} 1s linear infinite;
`;

export const StyledLoadingText = styled.div`
  height: 19px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.02em;
  color: #1a1a1c;
`;

export const StyledPercentageText = styled.div`
  height: 19px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  letter-spacing: -0.02em;
  color: #1a1a1c;
`;

export const StyledProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 10px;
  width: 340px;
  height: 6px;
  background: #e3e4e8;
  border-radius: 999px;

  @media (max-width: 768px) {
    width: 220px;
  }
`;
