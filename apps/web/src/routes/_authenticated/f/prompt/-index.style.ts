import styled from '@emotion/styled';

export const StyledPromptLabel = styled.h3`
  margin: 0;
  ${({ theme }) => theme.typo.Md_18}
  color: ${({ theme }) => theme.color.black};
`;

export const StyledFooter = styled.footer`
  position: sticky;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: fit-content;
  bottom: 20px;
  left: 0;
  right: 0;
`;

export const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  align-items: center;
  width: 100%;
  height: fit-content;
`;

export const StyledGradientSpace = styled.div`
  height: 40px;
  width: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 1) 100%
  );
  position: absolute;
  top: 0;
  transform: translateY(-100%);
`;

export const StyledFooterButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 0 20px 0;
  background-color: ${({ theme }) => theme.color.white};
`;
