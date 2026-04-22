import styled from '@emotion/styled';

export const StyledDropdownTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  height: 32px;
  min-width: 100px;
  padding: 0 8px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.black};
  ${({ theme }) => theme.typo.Rg_14}
  cursor: pointer;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.color.textPlaceholder};
  }

  &:hover {
    border-color: ${({ theme }) => theme.color.textPlaceholder};
  }
`;

export const StyledOptionButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: ${({ $active, theme }) =>
    $active ? theme.color.bgMediumGray : 'transparent'};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.color.bgMediumGray};
  }
`;
