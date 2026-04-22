import * as DialogPrimitive from '@radix-ui/react-dialog';
import { type PropsWithChildren, useState, useEffect } from 'react';
import {
  StyledCreditPolicyFooter,
  StyledCreditPolicyLink,
  StyledCreditPolicySection,
  StyledPricingPlanCardGroup,
  StyledPricingPlanModalCloseButton,
  StyledPricingPlanModalContent,
  StyledPricingPlanModalTitle,
  StyledUsagePolicySection,
  StyledExistingProUserSection,
  StyledExistingProUserText
} from '@/routes/_authenticated/credit-plan/-components/PricingPlanModal/PricingPlanModal.style';
import { X } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { Flex, IconButton } from '@docs-front/ui';
import { AnimatePresence, motion } from 'motion/react';
import { usePaddle } from '@/hooks/usePaddle.ts';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { getPaymentHistoryQueryOptions } from '@/query/options/payments';
import { getSubscriptionQueryOptions } from '@/query/options/subscription';
import { patchChangeSubscription } from '@/api/subscription';
import { useI18n } from '@/hooks/useI18n.ts';
import type { PricingTier } from '@/constants/pricingTier.constant.ts';
import {
  ChangeScheduledModal,
  ChangeScheduledConfirmModal,
  ChangeScheduledErrorModal,
  ExistingProUserModal
} from '@/routes/_authenticated/credit-plan/-components/ChangeScheduledModal';
import { useModal } from '@/hooks/useModal.ts';
import { PricingPlanCard } from '@/routes/_authenticated/credit-plan/-components/PricingPlanModal/PricingPlanCard';
import { trackPurchase } from '@/utils/purchaseTrack';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useAuth } from '@/service/auth/hook';
import { useAtomos } from '@/service/atomos/hook';

interface PricingPlanModalProps extends PropsWithChildren {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const PricingPlanModal = ({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: PricingPlanModalProps) => {
  const atomos = useAtomos();
  const [internalOpen, setInternalOpen] = useState(false);

  // Controlled vs Uncontrolled mode
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled
    ? (open: boolean) => controlledOnOpenChange?.(open)
    : setInternalOpen;
  const queryClient = useQueryClient();
  const { pricingTiers, getItem } = usePaddle('subscription');
  const { t, locale } = useI18n(['pricing', 'creditPlan']);
  const { openModal } = useModal();
  const { refresh } = useAuth();

  const changeSubscriptionMutation = useMutation({
    mutationFn: patchChangeSubscription,
    onSuccess: async () => {
      await refresh();
      await queryClient.invalidateQueries(getSubscriptionQueryOptions());
      await queryClient.invalidateQueries(getAccountMeQueryOptions());

      openModal(({ onClose: closeSuccessModal }) => (
        <ChangeScheduledModal
          isOpen={true}
          onClose={closeSuccessModal}
          effectiveDate={
            subscription?.data?.firstBilledAt
              ? new Date(subscription.data.firstBilledAt!).toLocaleDateString(
                  locale
                )
              : undefined
          }
          plan={
            subscription?.data?.item === 'SUBSCRIPTION_M'
              ? t('creditPlan:shortPlanNames.proMonthly')
              : subscription?.data?.item === 'SUBSCRIPTION_Y'
                ? t('creditPlan:shortPlanNames.proYearly')
                : t('creditPlan:shortPlanNames.starter')
          }
        />
      ));
    },
    onError: async () => {
      openModal(({ onClose: closeErrorModal }) => (
        <ChangeScheduledErrorModal isOpen={true} onClose={closeErrorModal} />
      ));
    }
  });

  const { data: subscription } = useQuery(getSubscriptionQueryOptions());
  const { sm } = useBreakPoints();
  const handleChangeSubscription = async ({
    tier,
    billingCycle
  }: {
    tier: PricingTier;
    billingCycle: 'month' | 'year';
  }) => {
    const nextBillingItem = await getItem(tier.id, billingCycle);
    const nextBillingAmount =
      nextBillingItem?.perMonthAmount ??
      nextBillingItem?.fallback.perMonthAmount;

    setIsOpen(false);
    openModal(({ onClose: closeConfirmModal }) => (
      <ChangeScheduledConfirmModal
        isOpen={true}
        onClose={closeConfirmModal}
        onConfirm={() => {
          changeSubscriptionMutation.mutate({
            type:
              billingCycle === 'month' ? 'SUBSCRIPTION_M' : 'SUBSCRIPTION_Y',
            immediately: false
          });
          closeConfirmModal();
        }}
        nextBillingDate={
          subscription?.data?.firstBilledAt
            ? new Date(subscription.data.firstBilledAt!).toLocaleDateString(
                locale
              )
            : undefined
        }
        nextBillingAmount={nextBillingAmount}
        countryCode={
          nextBillingItem?.currencyCode ??
          nextBillingItem?.fallback.currencyCode
        }
      />
    ));
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleContactSales = () => {
    setIsOpen(false);
    window.ChannelIO?.('showMessenger');
  };

  const theme = useTheme();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (
        event.data &&
        event.data.event_name === 'checkout.completed' &&
        event.data.callback_data
      ) {
        try {
          const callbackData = event.data.callback_data;
          const data = callbackData.data;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isSubscriptionPurchase = data.items.some((item: any) => {
            const priceId = item.price_id;
            return priceId !== import.meta.env.VITE_PADDLE_SEASON_PASS_PRICE_ID;
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isSeasonPassPurchase = data.items.some((item: any) => {
            const priceId = item.price_id;
            return priceId === import.meta.env.VITE_PADDLE_SEASON_PASS_PRICE_ID;
          });

          if (isSubscriptionPurchase || isSeasonPassPurchase) {
            // 3초 대기 (백엔드가 Paddle 웹훅 처리 및 role 업데이트할 시간 확보)
            await new Promise((resolve) => setTimeout(resolve, 3000));
            // 새 토큰 발급 (업데이트된 role 포함)
            await refresh();
            await queryClient.refetchQueries(getPaymentHistoryQueryOptions());
            await queryClient.refetchQueries(getSubscriptionQueryOptions());
            await queryClient.refetchQueries(getAccountMeQueryOptions());

            trackPurchase({
              data,
              content_type: isSeasonPassPurchase ? 'seasonpass' : 'subscription',
              transaction_id: data.transaction_id
            });

            const currencyCode = data.currency_code || 'USD';
            const salesAmount =
              currencyCode === 'KRW'
                ? Number(data.totals.total)
                : Number(data.totals.total) / 100;

            atomos.track({ type: 'UTMSALE', data: { sales: salesAmount } });

            setIsOpen(false);
          }
        } catch (error) {
          console.error(
            '❌ Failed to process subscription checkout completion:',
            error
          );
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [queryClient]);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      {children && (
        <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>
      )}
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <StyledPricingPlanModalContent asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.1, ease: 'easeInOut' }}
              >
                <Flex
                  direction="column"
                  gap={sm ? 16 : 24}
                  justify="center"
                  alignItems="center"
                  width="100%"
                >
                  <StyledPricingPlanModalTitle>
                    {t('pricing:ui.modal.title')}
                  </StyledPricingPlanModalTitle>

                  <StyledExistingProUserSection
                    onClick={() => {
                      openModal(({ onClose: closeExistingProModal }) => (
                        <ExistingProUserModal
                          isOpen={true}
                          onClose={closeExistingProModal}
                        />
                      ));
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5Z"
                          stroke="#6B7280"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 10.5V8"
                          stroke="#6B7280"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 5.5H8.005"
                          stroke="#6B7280"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <StyledExistingProUserText>
                        {t('pricing:pro.existingProUser')}
                      </StyledExistingProUserText>
                    </span>
                  </StyledExistingProUserSection>

                  <StyledPricingPlanCardGroup $isSm={sm}>
                    {pricingTiers
                      .filter((x) => x.id !== 'starter')
                      .sort((a, b) => {
                        if (!sm) return 0;
                        return a.id === 'seasonPass'
                          ? -1
                          : b.id === 'seasonPass'
                            ? 1
                            : 0;
                      })
                      .map((tier) => (
                        <PricingPlanCard
                          key={tier.id}
                          tier={tier}
                          billingCycle="month"
                          onClose={handleCloseModal}
                          onChangeSubscription={handleChangeSubscription}
                        />
                      ))}
                  </StyledPricingPlanCardGroup>

                  <Flex direction="column" gap={12} alignSelf="stretch">
                    <StyledUsagePolicySection>
                      <StyledCreditPolicyFooter>
                        {t('pricing:ui.modal.usagePolicy')}
                      </StyledCreditPolicyFooter>
                      <StyledCreditPolicyLink
                        onClick={() => window.open('/credit-policy', '_blank')}
                      >
                        {t('pricing:ui.modal.usagePolicyLink')}
                      </StyledCreditPolicyLink>
                    </StyledUsagePolicySection>

                    <StyledCreditPolicySection>
                      <StyledCreditPolicyFooter>
                        {t('pricing:ui.modal.enterprise')}
                      </StyledCreditPolicyFooter>
                      <StyledCreditPolicyLink onClick={handleContactSales}>
                        {t('pricing:ui.modal.contactSales')}
                      </StyledCreditPolicyLink>
                    </StyledCreditPolicySection>
                  </Flex>
                </Flex>
                <DialogPrimitive.Description></DialogPrimitive.Description>
                <StyledPricingPlanModalCloseButton asChild>
                  <IconButton variant="text" size="medium">
                    <X size={24} color={theme.color.textGray} />
                  </IconButton>
                </StyledPricingPlanModalCloseButton>
              </motion.div>
            </StyledPricingPlanModalContent>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};
