import styled from '@emotion/styled';
import { Flex } from '@docs-front/ui';

export const StyledTemplatePreview = styled.div`
  padding: 4px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.color.bgBlueGray};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledFileInfo = styled(Flex)`
  gap: 6px;
  padding-left: 12px;
  align-items: center;
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledFileName = styled.span`
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.textGray};
`;
