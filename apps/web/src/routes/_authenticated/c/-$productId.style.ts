import styled from '@emotion/styled';
import { PanelResizeHandle } from 'react-resizable-panels';

export const StyledProductIdContainer = styled.main`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.bgGray};

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  scrollbar-height: none;

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  @media (max-width: 1199px) {
    flex-direction: column;
  }
`;

export const StyledCanvasContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${({ $isMobile }) => ($isMobile ? 'center' : 'start')};
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export const StyledToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: fit-content;
  padding: 8px 0px;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  background-color: ${({ theme }) => theme.color.white};
`;

export const StyledPanelResizeHandle = styled(PanelResizeHandle)`
  width: 2px;
  background-color: ${({ theme }) => theme.color.borderGray};

  &[data-resize-handle-state='hover'] {
    outline: 2px solid ${({ theme }) => theme.color.borderGray};
  }
`;

export const StyledMobileSlideContainer = styled.div<{
  $toggleValue: 'left' | 'right';
}>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

export const StyledMobileSlideWrapper = styled.div<{
  $toggleValue: 'left' | 'right';
}>`
  display: flex;
  width: 200%;
  height: 100%;
  transform: translateX(
    ${({ $toggleValue }) => ($toggleValue === 'left' ? '0%' : '-50%')}
  );
  transition: transform 0.3s ease-in-out;
`;

export const StyledMobileSlideItem = styled.div`
  width: 50%;
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
`;
