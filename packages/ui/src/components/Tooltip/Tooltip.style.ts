import styled from '@emotion/styled';
import * as RTooltip from '@radix-ui/react-tooltip';

export const StyledTooltipContent = styled(RTooltip.Content)`
  display: flex;
  align-items: center;
  max-width: 480px;

  padding: 3px 8px;
  border-radius: 5px;
  background: ${({ theme }) => theme.color.bgDarkGrey};

  color: ${({ theme }) => theme.color.bgWhite};
  ${({ theme }) => theme.typo.Rg_12};
`;

export const StyledTooltipArrow = styled(RTooltip.Arrow)`
  fill: ${({ theme }) => theme.color.bgDarkGrey};
`;
