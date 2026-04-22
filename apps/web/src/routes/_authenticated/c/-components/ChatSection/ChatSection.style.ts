import styled from '@emotion/styled';

export const StyledChatSectionContainer = styled.section<{
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: column;
  min-width: 100%;
  flex: 1;
  height: 100%;
`;

export const StyledChatSectionContent = styled.div`
  display: flex;
  flex: 1;
  overflow-y: hidden;
`;

export const StyledChatSectionContentScroll = styled.div`
  flex-direction: column;
  display: flex;
  overflow-y: auto;
  gap: 8px;
  padding: 20px;
  width: 100%;

  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledChatInputContainer = styled.div`
  position: relative;
  padding: 0 20px 20px 20px;
  background: transparent;
  z-index: 0;

  ::before {
    content: '';
    position: absolute;
    top: -30px;
    bottom: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100px;
    pointer-events: none;
    z-index: 0;

    background: linear-gradient(
      180deg,
      color(from ${({ theme }) => theme.color.bgGray} srgb r g b / 0),
      color(from ${({ theme }) => theme.color.bgGray} srgb r g b / 1) 40%
    );
  }
`;
