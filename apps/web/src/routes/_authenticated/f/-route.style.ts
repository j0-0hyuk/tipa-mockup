import styled from '@emotion/styled';

export const StyledFillFormTitle = styled.h1`
  width: 100%;
  color: ${({ theme }) => theme.color.black};
  ${({ theme }) => theme.typo.Sb_24}
`;

export const StyledFillFormFileName = styled.p`
  width: 100%;
  color: ${({ theme }) => theme.color.main};
  ${({ theme }) => theme.typo.Md_14}
`;

export const StyledHeaderRow = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledBackButton = styled.button`
  position: absolute;
  left: -32px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: fit-content;
  height: fit-content;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.color.textGray};

  &:hover {
    opacity: 0.8;
  }
`;

export const StyledMainContainer = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0;
  align-items: flex-start;
`;

export const StyledMainContent = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 1080px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const StyledStickyStepperWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.color.white};
  padding: 24px 0 8px 0;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderLightGray};
`;

export const StyledFunnelContentWrapper = styled.div`
  overflow-y: auto;
  width: 100%;
  gap: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  padding: 0 0 40px 0;
`;
