import styled from '@emotion/styled';

export const StyledChatInput = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background: ${({ theme }) => theme.color.white};
  z-index: 0;
`;
