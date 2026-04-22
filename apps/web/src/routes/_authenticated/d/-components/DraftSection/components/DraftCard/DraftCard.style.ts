import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

export const StyledDraftCard = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0px 12px;
  ${({ theme }) => theme.typo.Rg_15}
  border-bottom: 1px solid ${({ theme }) => theme.color.borderLightGray};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.color.bgGray};
  }
`;
