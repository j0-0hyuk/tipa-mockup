import styled from '@emotion/styled';

export const StyledChatSectionContainer = styled.section`
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

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledChatInputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 20px 20px 20px;
  background: transparent;
  z-index: 0;
`;

export const StyledChatInput = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 4px 12px 0px rgba(0, 27, 55, 0.1);
  z-index: 0;
`;

export const StyledUserMessageBubble = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledUserMessageContent = styled.div`
  ${({ theme }) => theme.typo.Rg_16}
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 1.6;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: 8px;
  padding: 12px;
  max-width: 80%;
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
  max-width: 100%;
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
