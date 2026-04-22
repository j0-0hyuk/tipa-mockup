import styled from '@emotion/styled';

export const StyledStepCardContainer = styled.div<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 16px;
  padding: 24px;
  width: 100%;
  height: fit-content;
`;

export const StyledTitle = styled.h3`
  color: ${({ theme }) => theme.color.black};
  font-weight: 600;
  font-style: normal;
  font-size: 16px;
  line-height: 23px;
  letter-spacing: -0.02em;
  margin: 0;
  @media (max-width: 768px) {
    ${({ theme }) => theme.typo.Rg_14}
    font-weight: 600;
  }
`;

export const StyledDescription = styled.p`
  color: ${({ theme }) => theme.color.textGray};
  font-weight: 400;
  font-style: normal;
  font-size: 15px;
  line-height: 21px;
  letter-spacing: -0.02em;
  white-space: pre-line;
  @media (max-width: 768px) {
    ${({ theme }) => theme.typo.Rg_12}
    font-weight: 400;
  }
`;

export const StyledWarning = styled.span`
  color: ${({ theme }) => theme.color.textGray};
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: -0.02em;
  @media (max-width: 768px) {
    font-size: 10px;
    font-weight: 400;
  }
`;

export const StyledImage = styled.img`
  width: 167px;
  height: 198px;
  object-fit: cover;
  @media (max-width: 768px) {
    width: 100px;
    height: 120px;
  }
`;
