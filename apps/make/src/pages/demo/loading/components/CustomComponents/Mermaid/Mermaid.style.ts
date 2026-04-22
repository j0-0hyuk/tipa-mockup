import styled from '@emotion/styled';

export const Container = styled.div<{ $isMobile: boolean }>`
  min-width: ${({ $isMobile }) => ($isMobile ? '300px' : '600px')};
  width: 100%;
  svg {
    max-width: 100%;
    height: auto;
  }

  [data-docx-capture='mermaid'] & {
    padding: 10px;
    border-radius: 4px;

    svg {
      color: white !important;
      display: block;
      margin: 0 auto;
    }
  }
`;
