import { Flex } from '@docs-front/ui';
import styled from '@emotion/styled';

export const StyledTimer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #d93025;
  ${({ theme }) => theme.typo.Rg_14}
`;

export const SignUpWrapper = styled(Flex)`
  overflow-y: scroll;
`;
