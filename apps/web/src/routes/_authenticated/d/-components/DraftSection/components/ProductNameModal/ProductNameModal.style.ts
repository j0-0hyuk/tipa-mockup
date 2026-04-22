import styled from '@emotion/styled';

export const StyledProductNameModalInput = styled.input`
  padding: 14px 12px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background-color: ${({ theme }) => theme.color.white};
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.02em;

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }
`;
