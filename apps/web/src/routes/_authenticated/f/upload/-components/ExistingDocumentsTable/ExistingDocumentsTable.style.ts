import styled from '@emotion/styled';
import { IconButton } from '@bichon/ds';
import {
  Table,
  TableBodyCell,
  TableHeaderCell,
  TableRoot,
  colors
} from '@bichon/ds';

const alignPropFilter = (prop: string) => prop !== '$align';
const activePropFilter = (prop: string) => prop !== '$active';
const selectedPropFilter = (prop: string) => prop !== '$selected';

export const TableViewport = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const TableFrame = styled(TableRoot)`
  width: 100%;
  min-width: 700px;
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
  vertical-align: middle;
`;

export const EmptyStateCell = styled.td`
  padding: 42px 16px;
  text-align: center;
`;

export const EmptyStateText = styled.span`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
`;

export const DocumentNameText = styled.span`
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
`;

export const ItemNameText = styled.span`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textPrimary};
`;

export const DateText = styled.span`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textPrimary};
`;

export const TableFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

export const DraftIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: ${colors.bgAccentSubtle};
  flex-shrink: 0;
  color: ${colors.textAccent};
`;

export const SelectedTableBodyRow = styled('tr', {
  shouldForwardProp: selectedPropFilter
})<{ $selected: boolean }>`
  cursor: pointer;

  & > td {
    background-color: ${({ $selected }) =>
      $selected ? colors.bgAccentSubtle : 'transparent'};
    transition: background-color 0.15s ease;
  }

  &:hover > td {
    background-color: ${({ $selected }) =>
      $selected ? colors.bgAccentSubtle : colors.bgLightGrey};
  }
`;

export const FileIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
`;

export const DraftBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 9999px;
  background-color: #e8f5e9;
  color: #2e7d32;
  ${({ theme }) => theme.typo.Md_12}
  white-space: nowrap;
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
