import styled from '@emotion/styled';
import { Flex } from '@/packages/ui/src';

export const StyledFileDownloadZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  margin-top: 12px;
  background: ${({ theme }) => theme.color.bgGray};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: 16px;
  width: 100%;
`;

export const StyledFileName = styled.a`
  ${({ theme }) => theme.typo.Rg_16};
  color: ${({ theme }) => theme.color.black};
  text-decoration: underline;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  @media (max-width: 768px) {
    ${({ theme }) => theme.typo.Rg_14};
  }
`;

export const StyledButtonRow = styled(Flex)`
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const StyledToStepLabel = styled.p`
  ${({ theme }) => theme.typo.Rg_16};
  color: ${({ theme }) => theme.color.black};
  font-weight: 600;
`;
