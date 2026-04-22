import styled from '@emotion/styled';

export const StyledChangeScheduledModal = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px;
  gap: 12px;
  position: absolute;
  width: 444px;
  height: 293px;
  left: calc(50% - 444px / 2);
  top: calc(50% - 293px / 2 + 0.5px);
  background: #ffffff;
  border-radius: 20px;
`;

export const StyledChangeScheduledModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px 20px;
  gap: 24px;
  width: 428px;
  height: 277px;
  background: linear-gradient(180deg, #d7e7ff 0%, #ffffff 30%);
  border-radius: 12px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;

export const StyledChangeScheduledModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  gap: 16px;
  width: 297px;
  height: 153px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const StyledChangeScheduledModalIcon = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  gap: 10px;
  width: 64px;
  height: 64px;
  background: #3182f7;
  border-radius: 999px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const StyledChangeScheduledModalTitle = styled.div`
  width: 297px;
  height: 29px;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #1a1a1c;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`;

export const StyledChangeScheduledModalDescription = styled.div`
  width: 297px;
  height: 28px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #1a1a1c;
  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
`;

export const StyledChangeScheduledModalButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 16px 0 14px;
  gap: 8px;
  width: 388px;
  height: 52px;
  background: #3182f7;
  border-radius: 8px;
  border: none;
  color: #ffffff;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  letter-spacing: -0.02em;
  cursor: pointer;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;

  &:hover {
    opacity: 0.9;
  }
`;
