import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

export const StyledMainTitle = styled.h1<{ $sm: boolean }>`
  color: ${({ theme }) => theme.color.black};
  font-weight: 600;
  font-size: ${({ $sm }) => ($sm ? '24px' : '32px')};
  line-height: ${({ $sm }) => ($sm ? '32px' : '42px')};
  letter-spacing: 0%;
  text-align: center;
  white-space: pre-line;
`;

export const StyledMainCallout = styled.div<{ $sm: boolean }>`
  padding: 12px 14px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bgGray};
  color: ${({ theme }) => theme.color.textGray};
  text-align: start;
  width: 100%;
  height: fit-content;
  white-space: pre-line;
  ${({ theme, $sm }) => ($sm ? theme.typo.Rg_12 : theme.typo.Md_15)};
`;

export const StyledForgetPassword = styled(Link)`
  color: ${({ theme }) => theme.color.textGray};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.28px;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: none;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
`;

export const StyledSignupPromptText = styled.span`
  color: ${({ theme }) => theme.color.textGray};
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 125% */
  letter-spacing: -0.32px;
`;

export const StyledSignupLink = styled(Link)`
  color: ${({ theme }) => theme.color.main};
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 125% */
  letter-spacing: -0.32px;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
`;
