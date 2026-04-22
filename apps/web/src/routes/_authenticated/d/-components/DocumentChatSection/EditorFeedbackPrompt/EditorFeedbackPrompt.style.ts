import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const StyledFeedbackContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 20px;
  right: 20px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background-color: rgba(245, 245, 245, 0.9);
  backdrop-filter: blur(4px);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  animation: ${slideUp} 0.3s ease-out;
`;

export const StyledFeedbackText = styled.span`
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.textGray2};
`;

export const StyledFeedbackButtonGroup = styled.div`
  display: flex;
  gap: 4px;
`;

export const StyledFeedbackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.15s ease;
  color: ${({ theme }) => theme.color.textGray};

  &:hover {
    background-color: ${({ theme }) => theme.color.bgMediumGray};
  }
`;
