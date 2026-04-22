import styled from '@emotion/styled';

export const StyledToolbar = styled.div<{ $hideBorder?: boolean }>`
  width: 100%;
  height: fit-content;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.color.white};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${({ $hideBorder, theme }) =>
    $hideBorder ? 'none' : `1px solid ${theme.color.borderGray}`};
`;

export const StyledToolbarTitle = styled.h2<{ $isSm?: boolean }>`
  ${({ theme }) => theme.typo.Sb_18};
  margin: 0;
  max-width: ${({ $isSm }) => ($isSm ? '160px' : '400px')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
