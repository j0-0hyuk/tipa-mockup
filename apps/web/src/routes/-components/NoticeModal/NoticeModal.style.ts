import styled from '@emotion/styled';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export const StyledOverlay = styled(DialogPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(20, 24, 40, 0.38);
  z-index: 50;
`;

export const StyledContent = styled(DialogPrimitive.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  width: min(440px, calc(100vw - 32px));
  max-height: min(600px, calc(100vh - 64px));
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(12, 26, 75, 0.16);
  outline: none;
  overflow: hidden;
  z-index: 51;
`;

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 20px 20px 28px;
  flex-shrink: 0;
`;

export const StyledTitle = styled(DialogPrimitive.Title)`
  margin: 0;
  color: #262933;
  font-size: 20px;
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const StyledCloseButton = styled(DialogPrimitive.Close)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  color: #7d8391;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid #4b8bf5;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0 28px 24px;
`;

export const StyledNoticeItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e8e9ed;
  }
`;

export const StyledNoticeItemHeader = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  cursor: pointer;

  &:hover span {
    text-decoration: underline;
  }
`;

export const StyledNoticeItemTitle = styled.span`
  color: #262933;
  font-size: 17px;
  line-height: 1.4;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const StyledNoticeItemDate = styled.span`
  color: #9da2b0;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: -0.02em;
`;

export const StyledNoticeItemBody = styled.p`
  margin: 0;
  color: #6b7080;
  font-size: 15px;
  line-height: 1.6;
  font-weight: 400;
  letter-spacing: -0.02em;
`;

export const StyledFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 28px 24px;
  flex-shrink: 0;
  border-top: 1px solid #e8e9ed;
`;

export const StyledAllNoticesLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #7d8391;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.02em;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #262933;
  }
`;
