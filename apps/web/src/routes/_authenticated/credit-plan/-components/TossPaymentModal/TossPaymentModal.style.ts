import styled from '@emotion/styled';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export const StyledTossPaymentModalOverlay = styled(DialogPrimitive.Overlay)`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  z-index: 1000;
`;

export const StyledTossPaymentModalContent = styled(DialogPrimitive.Content)`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 90%;
  max-width: 540px;
  height: fit-content;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  z-index: 1001;

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 24px 16px;
  }
`;

export const StyledTossPaymentModalTitle = styled(DialogPrimitive.Title)`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.black};
  margin-bottom: 8px;
  text-align: center;
`;

export const StyledTossPaymentModalDescription = styled(
  DialogPrimitive.Description
)`
  font-size: 14px;
  color: ${({ theme }) => theme.color.textGray};
  margin-bottom: 24px;
  text-align: center;
`;

export const StyledTossPaymentModalCloseButton = styled(DialogPrimitive.Close)`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.color.bgGray};
  }
`;

export const StyledPaymentMethodsWrapper = styled.div`
  width: 100%;
  min-height: 300px;
  margin-bottom: 16px;
  position: relative;
`;

export const StyledAgreementWrapper = styled.div`
  width: 100%;
  margin-bottom: 24px;
`;

export const StyledOrderSummary = styled.div`
  background-color: ${({ theme }) => theme.color.bgGray};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

export const StyledOrderSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  }
`;

export const StyledOrderLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledOrderValue = styled.span<{ $highlight?: boolean }>`
  font-size: ${({ $highlight }) => ($highlight ? '18px' : '14px')};
  font-weight: ${({ $highlight }) => ($highlight ? '600' : '400')};
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.color.main : theme.color.black};
`;

export const StyledOriginalPrice = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.color.textGray};
  text-decoration: line-through;
  margin-right: 8px;
`;

export const StyledDiscountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background-color: ${({ theme }) => theme.color.bgMain};
  color: ${({ theme }) => theme.color.main};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
`;

export const StyledDiscountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  color: ${({ theme }) => theme.color.main};
`;

export const StyledDiscountLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.color.main};
`;

export const StyledDiscountValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.main};
`;

export const StyledReferralInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.color.bgMain};
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.main};
  font-weight: 500;
`;

export const StyledDiscountResolutionBanner = styled.div`
  background-color: ${({ theme }) => theme.color.bgMain};
  color: ${({ theme }) => theme.color.main};
  font-size: 13px;
  font-weight: 400;
  padding: 10px 12px;
  border-radius: 8px;
  margin-top: 4px;
  line-height: 1.4;
`;

export const StyledPaymentButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background-color: ${({ theme, $disabled }) =>
    $disabled ? theme.color.bgGray : theme.color.main};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.color.textGray : 'white'};
  font-size: 16px;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: opacity 0.2s;

  &:hover {
    opacity: ${({ $disabled }) => ($disabled ? 1 : 0.9)};
  }
`;

export const StyledErrorMessage = styled.p`
  color: ${({ theme }) => theme.color.error};
  font-size: 13px;
  text-align: center;
  margin-top: 12px;
`;
