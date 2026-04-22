import styled from '@emotion/styled';
import { Flex } from '@docs-front/ui';

export const StyledDocsTitle = styled.h1`
  width: 100%;
  color: ${({ theme }) => theme.color.black};
  ${({ theme }) => theme.typo.Sb_32}
`;

export const StyledNavButton = styled.button<{ $isActive: boolean }>`
  cursor: pointer;
  width: fit-content;
  height: fit-content;
  padding: 14.5px 16px;
  border-bottom: 1px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.color.bgDarkGray : theme.color.borderGray};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.color.bgDarkGray : theme.color.textPlaceholder};
  ${({ theme }) => theme.typo.Sb_16}
  background-color: transparent;
`;

export const StyledMainContainer = styled(Flex)`
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const StyledNavContainer = styled(Flex)`
  width: 100%;
  box-shadow: inset 0 -1px 0 0 ${({ theme }) => theme.color.borderGray};
`;
