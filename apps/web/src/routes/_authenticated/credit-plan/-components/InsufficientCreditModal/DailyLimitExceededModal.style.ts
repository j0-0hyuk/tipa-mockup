import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

export const StyledCreditBadge = styled.div`
  margin-top: 4px;
  padding: 12px;
  background-color: ${({ theme }) => theme.color.bgLightGrey};
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.color.textAccent};
`;

export const StyledPolicyLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.color.textSecondary};
  text-decoration: none;
  font-size: 13px;
`;
