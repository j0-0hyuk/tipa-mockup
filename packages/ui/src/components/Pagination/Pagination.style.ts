import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const PaginationPages = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

export const StyledPaginationButton = styled('button', {
  shouldForwardProp: (prop) => prop !== '$active' && isPropValid(prop)
})<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: 8.5px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme, $active }) =>
    $active ? theme.color.bgMediumGrey : 'transparent'};
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  .pagination-button-inner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 23px;
    height: 23px;
    ${({ theme }) => theme.typo.Md_15};
    color: ${({ theme, $active }) =>
      $active ? theme.color.textPrimary : theme.color.textTertiary};
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme, $active }) =>
      $active ? theme.color.bgMediumGrey : theme.color.bgLightGrey};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;
