import styled from '@emotion/styled';
import * as PopoverPrimitive from '@radix-ui/react-popover';

export const StyledProfileDialogContent = styled.div`
  display: flex;
  width: 222px;
  padding: 8px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 0px 10px 0px rgba(110, 118, 135, 0.25);
`;

export const StyledProfileDialogTrigger = styled(PopoverPrimitive.Trigger)<{
  $open?: boolean;
}>`
  cursor: pointer;
  background: none;
  border: none;
  padding: ${({ $open }) => ($open ? '10px 12px' : '9px 6px')};
  margin: 0;
  border-radius: 8px;

  &[data-state='open'] {
    background-color: ${({ theme }) => theme.color.bgBlueGray};
  }
`;

export const StyledProfileDialogTriggerEmail = styled.div<{
  $isFreePlan: boolean;
}>`
  font-weight: 500;
  font-style: normal;
  font-size: 14px;
  line-height: 110%;
  letter-spacing: -0.02em;
  width: ${({ $isFreePlan }) => ($isFreePlan ? '80px' : '130px')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(255, 255, 255, 0.85);
`;

export const StyledProfileDialogTriggerPlan = styled.div`
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(255, 255, 255, 0.5);
`;

export const StyledProfileAvatarWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

export const StyledProfileUpdateBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.textWarning};
`;

export const StyledUpdateNewsDot = styled.span`
  display: inline-flex;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.color.textWarning};
`;

export const StyledUserEmail = styled.div`
  display: flex;
  height: 36px;
  padding: 0 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: ${({ theme }) => theme.color.textGray};
  ${({ theme }) => theme.typo.Md_14}
`;

export const StyledCreditInfo = styled.div`
  display: flex;
  height: 36px;
  padding: 8px;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.color.bgMain};
`;

export const StyledMenuButton = styled.button`
  display: flex;
  height: 36px;
  padding: 0 8px;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  align-self: stretch;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.color.white};
  border: none;
  cursor: pointer;
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.black};
  text-align: start;

  &:hover {
    background: ${({ theme }) => theme.color.bgGray};
  }
`;

export const StyledLanguageSelect = styled.div`
  display: flex;
  height: 36px;
  padding: 0 8px 0 8px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  align-self: stretch;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
`;

export const StyledBadge = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: ${({ theme }) => theme.color.main};
  width: 16px;
  height: 16px;
  ${({ theme }) => theme.typo.Md_12}
  color: ${({ theme }) => theme.color.white};
`;

export const StyledNewFeatureContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  min-width: 0;
`;

export const StyledCreditText = styled.div`
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.main};
  width: 100%;
  text-align: center;
`;
