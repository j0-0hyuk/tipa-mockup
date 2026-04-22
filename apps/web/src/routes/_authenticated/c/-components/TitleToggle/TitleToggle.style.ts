import styled from '@emotion/styled';

export const StyledCreateTitle = styled.h1<{ $sm: boolean }>`
  color: ${({ theme }) => theme.color.black};
  font-weight: 600;
  font-size: ${({ $sm }) => ($sm ? '24px' : '32px')};
  line-height: ${({ $sm }) => ($sm ? '32px' : '42px')};
  letter-spacing: 0%;
  text-align: center;
  white-space: pre-line;
`;
