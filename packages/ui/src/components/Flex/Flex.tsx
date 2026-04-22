import {
  StyledFlex,
  type StyledFlexProps
} from '#components/Flex/Flex.style.ts';
import { forwardRef, type DetailedHTMLProps, type HTMLAttributes } from 'react';

export type FlexProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  StyledFlexProps;

const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ children, semantic, ...props }, ref) => {
    return (
      <StyledFlex ref={ref} as={semantic} {...props}>
        {children}
      </StyledFlex>
    );
  }
);

Flex.displayName = 'Flex';

export { Flex };
