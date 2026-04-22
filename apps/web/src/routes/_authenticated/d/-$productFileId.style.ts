import styled from '@emotion/styled';
import { PanelResizeHandle } from 'react-resizable-panels';

export const StyledEditorContainer = styled.main`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.bgGray};
  overflow: hidden;
`;

export const StyledPanelResizeHandle = styled(PanelResizeHandle)`
  width: 2px;
  background-color: ${({ theme }) => theme.color.borderGray};

  &[data-resize-handle-state='hover'] {
    outline: 2px solid ${({ theme }) => theme.color.borderGray};
  }
`;

export const StyledDocumentPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const StyledEditorToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  flex-shrink: 0;
`;

export const StyledEditorTitle = styled.h1`
  ${({ theme }) => theme.typo.Sb_16}
  color: ${({ theme }) => theme.color.black};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 500px;
`;

export const StyledEditorContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  padding: 24px;
`;

export const StyledEditorPaper = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 48px;
  min-height: fit-content;

  & img {
    max-width: 100%;
    height: auto;
  }

  & table {
    border-collapse: collapse;
    width: 100%;
  }

  & td,
  & th {
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    padding: 8px;
  }
`;

export const StyledEditorLoading = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledEditorError = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: ${({ theme }) => theme.color.textGray};
`;

// Chat styles - ChatSection과 동일
export const StyledChatSectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 100%;
  flex: 1;
  height: 100%;
  background-color: ${({ theme }) => theme.color.bgGray};
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

  -ms-overflow-style: none;
  scrollbar-width: none;

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

export const StyledChatInput = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 12px;
  box-shadow: 0 4px 12px 0 rgba(0, 27, 55, 0.1);
  border-radius: 10px;
  border: none;
  background: ${({ theme }) => theme.color.white};
  z-index: 0;
`;

export const StyledUserMessage = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledUserMessageBubble = styled.span`
  white-space: pre-wrap;
  word-break: break-word;
`;

export const StyledAssistantMessage = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const StyledAssistantMessageContent = styled.div`
  ${({ theme }) => theme.typo.Rg_16}
  white-space: pre-wrap;
  word-break: break-word;
`;

export const StyledChatEmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.color.textGray};
  ${({ theme }) => theme.typo.Rg_14}
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

export const StyledMobileSlideContainer = styled.div`
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
