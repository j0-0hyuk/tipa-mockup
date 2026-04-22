import styled from '@emotion/styled';

export const CaptureWrapper = styled.div<{ name?: string }>`
  width: ${({ name }) => (name === 'mermaid' ? '100%' : 'fit-content')};
  padding: 10px;
`;
