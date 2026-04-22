import styled from '@emotion/styled';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export const StyledPricingPlanModalContent = styled(DialogPrimitive.Content)`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 6px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: safe center;
  align-items: center;
  gap: 24px;
  padding: 24px;
  isolation: isolate;
  overflow: auto;
  z-index: 20;
`;

export const StyledPricingPlanModalCloseButton = styled(DialogPrimitive.Close)`
  position: absolute;
  top: 24px;
  right: 24px;
  padding: 0;
`;

export const StyledPricingPlanModalTitle = styled(DialogPrimitive.Title)`
  height: 42px;
  ${({ theme }) => theme.typo.Sb_32};
  text-align: center;
  color: ${({ theme }) => theme.color.black};
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const StyledPricingPlanModalTabsList = styled(TabsPrimitive.List)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  width: 260px;
  height: 47px;
  background: ${({ theme }) => theme.color.bgBlueGray};
  border-radius: 999px;
  flex: none;
  order: 1;
  flex-grow: 0;
  z-index: 1;
`;

export const StyledPricingPlanModalTabsTrigger = styled(TabsPrimitive.Trigger)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  gap: 10px;
  height: 39px;
  background: transparent;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  flex: none;
  flex-grow: 0;

  ${({ theme }) => theme.typo.Md_16};
  color: ${({ theme }) => theme.color.black};

  &[data-state='active'] {
    background: ${({ theme }) => theme.color.white};
    box-shadow: 0 2px 4px rgba(0, 27, 55, 0.15);
  }

  &:first-of-type {
    width: 98px;
    order: 0;
  }

  &:last-of-type {
    width: 154px;
    order: 1;
  }
`;

export const StyledPricingPlanCard = styled.div<{
  borderColor: string;
  borderWidth: string;
  isRecommended?: boolean;
  $isSm: boolean;
}>`
  width: ${({ $isSm }) => ($isSm ? 'calc(100vw - 16px)' : '400px')};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background: ${({ theme }) => theme.color.white};
  border-radius: ${({ isRecommended }) => (isRecommended ? '20px' : '16px')};
  border: ${({ borderColor, borderWidth }) =>
    `${borderWidth} solid ${borderColor}`};
`;

export const StyledPricingPlanCardBackground = styled.div<{
  background: string;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background: ${({ background }) => background};
  border-radius: 16px;
  flex: none;
  align-self: stretch;
`;

export const StyledPricingPlanCardTitle = styled.h3`
  ${({ theme }) => theme.typo.Md_18};
  color: ${({ theme }) => theme.color.black};
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0;
`;

export const StyledPricingPlanRecommendedBadge = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
  width: fit-content;
  height: 22px;
  background: linear-gradient(89.32deg, #5d98f6 5.18%, #106af9 75.67%);
  border-radius: 999px;
  flex: none;
  order: 1;
  flex-grow: 0;

  ${({ theme }) => theme.typo.Md_12};
  color: #ffffff;
`;

export const StyledPricingPlanCardPriceValueText = styled.span<{
  color: string;
  $isMobile?: boolean;
}>`
  font-weight: 600;
  font-size: ${({ $isMobile }) => ($isMobile ? '32px' : '40px')};
  line-height: 48px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const StyledPricingPlanCardPriceUnitText = styled.span`
  ${({ theme }) => theme.typo.Md_16};
  color: ${({ theme }) => theme.color.black};
  flex: none;
  order: 2;
  flex-grow: 0;
`;

export const StyledPricingPlanCardCheckbox = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  gap: 10px;
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.color.bgBlueGray};
  border-radius: 6px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const StyledCreditPolicySection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0;
  gap: 8px;
  width: 100%;
  height: 16px;
  flex: none;
  order: 4;
  flex-grow: 0;
  z-index: 4;
`;

export const StyledCreditPolicyFooter = styled.div`
  ${({ theme }) => theme.typo.Md_13};
  color: ${({ theme }) => theme.color.textGray};
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const StyledCreditPolicyLink = styled.a`
  ${({ theme }) => theme.typo.Md_13};
  text-decoration-line: underline;
  color: ${({ theme }) => theme.color.black};
  cursor: pointer;
  flex: none;
  order: 1;
  flex-grow: 0;

  &:hover {
    opacity: 0.8;
  }
`;

export const StyledPricingPlanCardGroup = styled.div<{ $isSm: boolean }>`
  display: flex;
  flex-direction: ${({ $isSm }) => ($isSm ? 'column' : 'row')};
  justify-content: center;
  align-items: start;
  gap: ${({ $isSm }) => ($isSm ? '12px' : '20px')};
  flex: none;
  width: 100%;
`;

export const StyledPricingPlanCardFeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const StyledPricingPlanCardOffText = styled.span`
  font-family: Pretendard;
  font-weight: 600;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: -2%;
  text-decoration: line-through;
  color: ${({ theme }) => theme.color.textGray};
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const StyledCouponText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 4px;
  text-align: left;
  ${({ theme }) => theme.typo.Md_14};
  color: ${({ theme }) => theme.color.bgDarkGray};
`;

export const StyledSeasonPassBadge = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 10px;
  gap: 4px;
  width: fit-content;
  height: 24px;
  background: linear-gradient(89.32deg, #5d98f6 5.18%, #106af9 75.67%);
  border-radius: 999px;

  ${({ theme }) => theme.typo.Md_12};
  color: #ffffff;
`;

export const StyledSeasonPassOriginalPrice = styled.span`
  ${({ theme }) => theme.typo.Sb_20};
  text-decoration: line-through;
  color: ${({ theme }) => theme.color.textGray};
  padding-bottom: 8px;
`;

export const StyledSeasonPassPrice = styled.span<{ $isMobile?: boolean }>`
  font-weight: 600;
  font-size: ${({ $isMobile }) => ($isMobile ? '32px' : '40px')};
  color: ${({ theme }) => theme.color.black};
`;

export const StyledSeasonPassPriceUnit = styled.span`
  ${({ theme }) => theme.typo.Md_16};
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledSeasonPassDescription = styled.p`
  ${({ theme }) => theme.typo.Md_16};
  color: ${({ theme }) => theme.color.black};
  margin-top: 8px;
  white-space: pre-line;
`;

export const StyledExistingProUserLink = styled.a`
  ${({ theme }) => theme.typo.Md_14};
  text-decoration: underline;
  color: ${({ theme }) => theme.color.textGray};
  cursor: pointer;
  text-align: center;
  margin-top: 4px;

  &:hover {
    opacity: 0.8;
  }
`;

export const StyledUsagePolicySection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0;
  gap: 8px;
  width: 100%;
  flex: none;
`;

export const StyledExistingProUserSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0;
  gap: 4px;
  width: 100%;
`;

export const StyledExistingProUserText = styled.span`
  ${({ theme }) => theme.typo.Md_14};
  color: ${({ theme }) => theme.color.textGray};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const StyledPricingPlanCardHeaderSection = styled.div<{
  $backgroundColor?: string;
}>`
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: ${({ $backgroundColor, theme }) =>
    $backgroundColor || theme.color.bgLightGray};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;
