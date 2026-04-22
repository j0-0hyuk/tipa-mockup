import styled from '@emotion/styled';

export const StyledCanvas = styled.div<{ $isSm?: boolean; $hasDiff?: boolean }>`
  min-height: 100%;
  width: ${({ $isSm }) => ($isSm ? '100%' : '768px')};
  position: relative;
  width: fit-content;

  .pagedjs_page {
    border: 1px solid #b5b9c4;
    margin-bottom: ${({ $isSm }) => ($isSm ? '10px' : '20px')};
    box-shadow: 0px 4px 12px 0px #001b371a;
    background-color: ${({ theme }) => theme.color.white};
  }
`;

export const StyledCanvasBlur = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  pointer-events: auto;
  z-index: 0;
  isolation: isolate;
  z-index: 10;
`;

export const StyledDiffCanvasBlur = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  pointer-events: auto;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.75);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  inset: 0;
`;

export const StyledCanvasBlurContent = styled.div<{
  $isSm?: boolean;
}>`
  position: sticky;
  z-index: 1;
  top: 30%;
  transform: ${({ $isSm }) =>
    $isSm ? 'translateY(100%)' : 'translateY(150%)'};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 9px;
  h2 {
    ${({ theme, $isSm }) => ($isSm ? theme.typo.Sb_16 : theme.typo.Sb_24)}
    color: ${({ theme }) => theme.color.black};
  }

  p {
    ${({ theme, $isSm }) => ($isSm ? theme.typo.Rg_12 : theme.typo.Md_15)}
    color: ${({ theme }) => theme.color.black};
  }
`;

export const StyledBlurWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const StyledSkeletonPage = styled.div<{ $isSm?: boolean }>`
  width: ${({ $isSm }) => ($isSm ? '100%' : '768px')};
  height: ${({ $isSm }) => ($isSm ? '480px' : '1150px')};
  padding: ${({ $isSm }) => ($isSm ? '30px' : '75px')};
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid #b5b9c4;
  margin-bottom: ${({ $isSm }) => ($isSm ? '10px' : '20px')};
  box-shadow: 0px 4px 12px 0px #001b371a;
  display: flex;
  flex-direction: column;
  gap: ${({ $isSm }) => ($isSm ? '6px' : '9px')};
`;
