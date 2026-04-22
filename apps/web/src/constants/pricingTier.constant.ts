export type PricingTierId = 'starter' | 'pro' | 'seasonPass';

export type BillingCycle = 'month' | 'year';

export interface PricingTier {
  name: string;
  id: PricingTierId;
  priceId?: Record<BillingCycle, string> | string;
  policyLink?: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free',
    id: 'starter'
  },
  {
    name: 'Pro',
    id: 'pro',
    priceId: {
      month: import.meta.env.VITE_PADDLE_PRO_MONTHLY_PRICE_ID,
      year: import.meta.env.VITE_PADDLE_PRO_YEARLY_PRICE_ID
    }
  },
  {
    name: 'Master 2026',
    id: 'seasonPass',
    priceId: import.meta.env.VITE_PADDLE_SEASON_PASS_PRICE_ID
  }
];

export type OpenCheckoutOptions = {
  discountCode?: string;
  showAddDiscounts?: boolean;
  allowDiscountRemoval?: boolean;
};
