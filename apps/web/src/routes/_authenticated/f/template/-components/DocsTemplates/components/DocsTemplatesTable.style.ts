import styled from '@emotion/styled';
import { IconButton } from '@docs-front/ui';
import {
  Button,
  Table,
  TableBodyCell,
  TableHeaderCell,
  TableRoot
} from '@bichon/ds';

const alignPropFilter = (prop: string) => prop !== '$align';
const activePropFilter = (prop: string) => prop !== '$active';
const deadlineCellPropFilter = (prop: string) => prop !== '$hasDeadline';

export const TableViewport = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const TableFrame = styled(TableRoot)`
  width: 100%;
  min-width: 820px;
`;

export const StyledTable = styled(Table)`
  width: 100%;
  table-layout: fixed;
`;

export const StyledHeaderCell = styled(TableHeaderCell, {
  shouldForwardProp: alignPropFilter
})<{ $align?: 'left' | 'center' | 'right' }>`
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.textSecondary};
  text-align: ${({ $align = 'center' }) => $align};
  white-space: nowrap;
`;

export const StyledBodyCell = styled(TableBodyCell, {
  shouldForwardProp: alignPropFilter
})<{ $align?: 'left' | 'center' | 'right' }>`
  text-align: ${({ $align = 'left' }) => $align};
`;

export const SelectableTableBodyRow = styled.tr`
  & > td {
    cursor: pointer;
  }

  &:focus-visible > td {
    outline: 2px solid ${({ theme }) => theme.color.main};
    outline-offset: -2px;
  }

  &:hover > td {
    background-color: ${({ theme }) => theme.color.bgLightGray};
  }
`;

export const EmptyStateCell = styled.td`
  padding: 42px 16px;
  text-align: center;
`;

export const EmptyStateText = styled.span`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
`;

export const BusinessCellContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
`;

export const BusinessNameText = styled.span`
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DeadlineCellContent = styled('div', {
  shouldForwardProp: deadlineCellPropFilter
})<{ $hasDeadline: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: ${({ $hasDeadline }) =>
    $hasDeadline ? 'max-content 64px' : 'max-content'};
  justify-content: center;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
`;

export const DeadlineDateContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const DeadlineBadgeContainer = styled.div`
  width: 64px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const DeadlineText = styled.span`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textPrimary};
`;

export const DeadlineMissingLink = styled(Button)`
  ${({ theme }) => theme.typo.Rg_14}
  && {
    color: ${({ theme }) => theme.color.black};
    text-decoration: none;
    cursor: pointer;
    transition: color 120ms ease;
  }

  &&:hover:not([aria-disabled='true']),
  &&:focus-visible:not([aria-disabled='true']) {
    color: ${({ theme }) => theme.color.textAccent};
    text-decoration: none;
  }

  &&[aria-disabled='true'] {
    color: ${({ theme }) => theme.color.textSecondary};
    cursor: default;
  }
`;

export const OrganizingAgencyText = styled.span`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textPrimary};
`;

export const TableFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 64px;
`;

export const InterestIconButton = styled(IconButton, {
  shouldForwardProp: activePropFilter
})<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $active }) =>
    $active ? theme.color.textAccent : theme.color.textPlaceholder};
  cursor: pointer;

  &:hover:not(:disabled),
  &:active:not(:disabled) {
    color: ${({ theme, $active }) =>
      $active ? theme.color.textAccent : theme.color.textPlaceholder};
    opacity: 0.8;
  }
`;

export const PostingIconButton = styled(IconButton)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.textPlaceholder};
  cursor: pointer;
  flex-shrink: 0;

  &:hover:not(:disabled),
  &:active:not(:disabled) {
    color: ${({ theme }) => theme.color.textPlaceholder};
    opacity: 0.8;
  }
`;

export const SelectIconButton = styled(IconButton)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.textSecondary};
  cursor: pointer;
`;
