import styled from '@emotion/styled';

export const SideNavigationWidth = styled.div<{ $open?: boolean }>`
  min-width: ${({ $open }) => ($open ? '230px' : '56px')};
`;

export const StyledSideNavigation = styled.nav<{ $open?: boolean }>`
  position: fixed;
  display: flex;
  flex-direction: column;
  padding: 12px 4px;
  height: 100vh;
  width: ${({ $open }) => ($open ? '230px' : '56px')};
  background: #3B5998;
  border-right: 1px solid #4A6AAA;
  transition: width 0.2s ease-out, padding 0.2s ease-out;
  overflow: visible;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

export const StyledSideNavigationModal = styled.nav<{ sm?: boolean }>`
  position: fixed;
  left: 0;
  bottom: 0;
  ${({ sm }) => sm && 'top: 0;'}
  z-index: 41;
  display: flex;
  flex-direction: column;
  padding: 12px 4px;
  height: 100vh;
  width: 230px;
  background: #3B5998;
  border-right: 1px solid #4A6AAA;
  overflow: visible;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

export const StyledModalOverlay = styled.div`
  z-index: 40;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const StyledSideNavigationHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const StyledNavLogoBadge = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StyledNavLogoImage = styled.img`
  width: 120%;
  height: 120%;
  object-fit: contain;
  display: block;
  user-select: none;
  pointer-events: none;
`;

export const StyledSideNavigationDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-top: 8px;
`;

export const StyledResizeButton = styled.button`
  cursor: col-resize;
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.6);
`;

export const StyledHeading2 = styled.h2`
  ${({ theme }) => theme.typo.Md_12};
  margin: 0;
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledProfileContainer = styled.div`
  margin-top: auto;
  padding-top: 12px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const StyledScrollableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;
