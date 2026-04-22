import styled from '@emotion/styled';
import { Button } from '@docs-front/ui';

export const TableWrap = styled.div`
  width: 100%;
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 5fr 2fr 2fr;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderLightGray};
`;

export const BodyRow = styled.div`
  display: grid;
  grid-template-columns: 5fr 2fr 2fr;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderLightGray};

  &:hover {
    background-color: #f8f9fa;
  }
`;

export const HeadCell = styled.div`
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.textGray};
  padding: 7.5px 12px;
  text-align: start;
`;

export const BodyCell = styled.div`
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.black};
  padding: 0px 12px;
  height: 56px;
  text-align: start;
  align-items: center;
  justify-content: flex-start;
  display: flex;

  &:last-child {
    border-right: none;
  }
`;

export const EmptyStateRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  border-left: 1px solid ${({ theme }) => theme.color.borderLightGray};
  border-right: 1px solid ${({ theme }) => theme.color.borderLightGray};
  border-bottom: 1px solid ${({ theme }) => theme.color.borderLightGray};
  border-radius: 0 0 12px 12px;
`;

export const EmptyStateCell = styled.div`
  padding: 42px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmptyStateText = styled.div`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
`;

export const EmptyStateButton = styled(Button)`
  padding: 11.5px 14px;
  width: fit-content;
  height: fit-content;
  ${({ theme }) => theme.typo.Md_14}
  ${({ theme }) => `border-radius: ${theme.borderRadius.lg};`}
`;

export const FileIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;
