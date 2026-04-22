import styled from '@emotion/styled';

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
