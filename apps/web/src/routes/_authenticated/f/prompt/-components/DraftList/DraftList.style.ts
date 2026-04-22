import styled from '@emotion/styled';
import { Flex } from '@docs-front/ui';

const DRAFT_ITEM_APPROX_HEIGHT = 48;
const VISIBLE_ITEMS_BEFORE_SCROLL = 8;

export const StyledDraftList = styled.div<{ $scrollable?: boolean }>`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.borderLightGray};
  display: flex;
  flex-direction: column;

  ${({ $scrollable }) =>
    $scrollable &&
    `
    max-height: ${VISIBLE_ITEMS_BEFORE_SCROLL * DRAFT_ITEM_APPROX_HEIGHT}px;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  `}
`;

export const StyledDraftCard = styled(Flex)<{
  $isSelected: boolean;
  disabled?: boolean;
}>`
  padding: 8px 8px 8px 16px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderLightGray};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.color.bgBlueGray : 'transparent'};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? 'transparent' : '#f8f9fa'};
  }
`;

export const StyledItemName = styled.span`
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.black};
`;

export const StyledSelectButton = styled.button<{
  $isSelected: boolean;
  disabled?: boolean;
}>`
  width: fit-content;
  height: fit-content;
  padding: 7.5px ${({ $isSelected }) => ($isSelected ? '18px' : '14px')};
  border-radius: 6px;
  border: 1px solid
    ${({ theme, $isSelected }) =>
      $isSelected ? theme.color.borderGray : theme.color.borderGray};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.color.borderGray : theme.color.white};
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: opacity 0.2s ease;

  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.color.textGray2 : theme.color.black};

  ${({ theme }) => theme.typo.Md_14}

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 1 : 0.8)};
  }

  svg {
    color: ${({ theme, $isSelected }) =>
      $isSelected ? theme.color.textGray2 : theme.color.black};
  }
`;
