import styled from '@emotion/styled';

export const StyledNavItemContainer = styled.div<{
  $isCurrent?: boolean;
  $isSetOpen?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $isSetOpen }) =>
    $isSetOpen ? 'space-between' : 'center'};
  width: 100%;
  padding: ${({ $isSetOpen }) => ($isSetOpen ? '14px 12px' : '14px')};
  background-color: ${({ $isCurrent }) =>
    $isCurrent ? 'rgba(44, 129, 252, 0.15)' : 'transparent'};
  cursor: pointer;
  border-radius: 8px;
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: ${({ $isCurrent }) =>
      $isCurrent ? '#5AA3FF' : 'rgba(255, 255, 255, 0.7)'};
  }
  &:hover {
    background-color: ${({ $isCurrent }) =>
      $isCurrent ? 'rgba(44, 129, 252, 0.15)' : 'rgba(255, 255, 255, 0.08)'};
  }
`;

export const StyledNavItemLabel = styled.h2<{ $isCurrent?: boolean }>`
  width: 154px;
  ${({ theme }) => theme.typo.Md_14};
  color: ${({ $isCurrent }) =>
    $isCurrent ? '#5AA3FF' : 'rgba(255, 255, 255, 0.85)'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;
  margin: 0;
`;

export const StyledMeetballButton = styled.button`
  background: none;
  cursor: pointer;
  position: relative;
  width: fit-content;
  height: 18px;
  padding: 0;
  margin: 0;
`;
