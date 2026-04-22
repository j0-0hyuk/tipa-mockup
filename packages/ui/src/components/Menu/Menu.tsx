import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import React from 'react';

import {
  StyledMenuContent,
  StyledMenuItem,
  StyledMenuItemLeft,
  StyledMenuItemText,
  StyledMenuLeadingIcon,
  StyledMenuTrailingIcon,
  type StyledMenuItemProps
} from '#components/Menu/Menu.style.ts';

export const Menu = DropdownMenu.Root;

export type MenuTriggerProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenu.Trigger
>;

export const MenuTrigger = React.forwardRef<
  HTMLButtonElement,
  MenuTriggerProps
>(({ children, ...props }, ref) => (
  <DropdownMenu.Trigger ref={ref} {...props} asChild>
    {children}
  </DropdownMenu.Trigger>
));
MenuTrigger.displayName = 'MenuTrigger';

export type MenuContentProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenu.Content
>;

export const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  ({ children, sideOffset = 5, ...props }, ref) => (
    <DropdownMenu.Portal>
      <StyledMenuContent ref={ref} sideOffset={sideOffset} {...props}>
        {children}
      </StyledMenuContent>
    </DropdownMenu.Portal>
  )
);
MenuContent.displayName = 'MenuContent';

export interface MenuItemProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof DropdownMenu.Item>,
      'children'
    >,
    StyledMenuItemProps {
  leadingIcon?: ReactNode;
  trailingIcon?: boolean;
  children: ReactNode;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ leadingIcon, trailingIcon, width, children, ...props }, ref) => (
    <StyledMenuItem ref={ref} width={width} {...props}>
      <StyledMenuItemLeft>
        {leadingIcon ? (
          <StyledMenuLeadingIcon aria-hidden="true">
            {leadingIcon}
          </StyledMenuLeadingIcon>
        ) : null}
        <StyledMenuItemText>{children}</StyledMenuItemText>
      </StyledMenuItemLeft>
      {trailingIcon ? (
        <StyledMenuTrailingIcon aria-hidden="true">
          <ChevronRight />
        </StyledMenuTrailingIcon>
      ) : null}
    </StyledMenuItem>
  )
);
MenuItem.displayName = 'MenuItem';
