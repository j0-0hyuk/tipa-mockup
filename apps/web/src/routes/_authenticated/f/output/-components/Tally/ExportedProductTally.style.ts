import styled from '@emotion/styled';

export const StyledTallyWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
`;

export const StyledTallyIframe = styled.iframe`
  border: none;
  margin: 0;
  width: 100%;
`;
