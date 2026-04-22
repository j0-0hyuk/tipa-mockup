import styled from '@emotion/styled';

export const StyledFileCard = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background: ${({ theme }) => theme.color.white};
  max-width: 200px;
  min-width: 120px;
  flex-shrink: 0;
`;

export const StyledFileIconWrapper = styled.div<{
  $bgColor: string;
}>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${({ $bgColor }) => $bgColor};
`;

export const StyledFileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

export const StyledFileName = styled.span`
  ${({ theme }) => theme.typo.Md_13}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.color.black};
`;

export const StyledExtensionBadge = styled.span`
  ${({ theme }) => theme.typo.Rg_12}
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledExpiredBadge = styled.span`
  ${({ theme }) => theme.typo.Rg_12}
  color: ${({ theme }) => theme.color.error};
`;
