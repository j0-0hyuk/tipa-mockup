import { SideNavigationContext } from '@/routes/_authenticated/-components/SideNavigation/SideNavigation.context';
import { useContext } from 'react';

export const useSideNavigation = () => {
  const context = useContext(SideNavigationContext);
  if (!context) {
    throw new Error(
      'useSideNavigation must be used within a SideNavigationProvider'
    );
  }
  return context;
};
