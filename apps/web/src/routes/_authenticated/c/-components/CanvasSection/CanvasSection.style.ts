import styled from '@emotion/styled';

export const StyledCanvasSection = styled.section<{ $isMobile?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const StyledCanvasWrapper = styled.div<{
  $isMobile?: boolean;
}>`
  width: 100%;
  display: flex;
  align-items: start;
  min-height: 0;
  background-color: ${({ theme }) => theme.color.bgGray};
  padding: ${({ $isMobile }) => ($isMobile ? '12px' : '30px')};
  padding-bottom: ${({ $isMobile }) => ($isMobile ? '2px' : '10px')};
  overflow: auto;
  justify-content: center;
`;
