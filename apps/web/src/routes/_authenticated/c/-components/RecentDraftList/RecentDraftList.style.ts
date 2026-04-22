import { Flex } from '@docs-front/ui';
import styled from '@emotion/styled';

export const StyledDraftListPosition = styled.div`
  top: 115px;
  width: 100%;
  border-top: 0.5px solid ${({ theme }) => theme.color.borderLightGray};
`;

export const StyledDraftListContent = styled.div`
  border-radius: 8px;
  border-top: 1px solid ${({ theme }) => theme.color.borderLightGray};
  border-bottom: 1px solid ${({ theme }) => theme.color.borderLightGray};
  display: flex;
  flex-direction: column;
`;

export const StyledDraftCard = styled(Flex)`
  padding: 8px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderLightGray};
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

export const StyledItemName = styled.span`
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.black};
`;

export const StyledButtonWrapper = styled.div`
  opacity: 0;
  transition: opacity 0.2s ease;

  ${StyledDraftCard}:hover & {
    opacity: 1;
  }
`;
