import styled from '@emotion/styled';

export const StyledAllRequiredText = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: -0.02em;
  color: #1a1a1c;
`;

export const StyledTermsItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 12px;
  width: 100%;
  height: 28px;
`;

export const StyledTermsText = styled.span`
  flex-grow: 1;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: -0.02em;
  color: #1a1a1c;
`;

export const StyledChevronIcon = styled.div`
  width: 14px;
  height: 14px;
  cursor: pointer;
  color: #b5b9c4;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(180deg);

  &:hover {
    color: #1a1a1c;
  }
`;
