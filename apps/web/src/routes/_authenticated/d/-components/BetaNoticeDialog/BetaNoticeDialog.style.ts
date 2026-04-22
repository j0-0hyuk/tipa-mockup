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
  width: min(520px, calc(100vw - 32px));
  max-height: calc(100vh - 64px);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(12, 26, 75, 0.16);
  outline: none;
  overflow: hidden;
  z-index: 51;
`;

export const StyledHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 20px 0 28px;
  flex-shrink: 0;
`;

export const StyledTitle = styled(DialogPrimitive.Title)`
  margin: 0;
  color: #262933;
  font-size: 17px;
  line-height: 1.4;
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
  padding: 16px 28px 24px;
  overflow-y: auto;
`;

export const StyledSubtitle = styled.p`
  margin: 0 0 16px;
  color: #6b7080;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: -0.02em;
`;

export const StyledInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  background: #f7f8fa;
  border-radius: 10px;

  & + & {
    margin-top: 10px;
  }

  .item-label {
    font-size: 14px;
    font-weight: 600;
    color: #262933;
    letter-spacing: -0.02em;
  }

  .item-desc {
    font-size: 13px;
    color: #6b7080;
    line-height: 1.6;
    letter-spacing: -0.02em;
  }
`;

export const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 28px 24px;
  flex-shrink: 0;
  border-top: 1px solid #e8e9ed;
`;
