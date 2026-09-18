export const MARKETPLACE_SPONSORSHIP_PLANS = [
  {
    id: "marketplace-sponsor-7d",
    label: "7 days",
    durationDays: 7,
    amountKobo: 50000,
    currency: "NGN",
    active: true,
  },
  {
    id: "marketplace-sponsor-14d",
    label: "14 days",
    durationDays: 14,
    amountKobo: 100000,
    currency: "NGN",
    active: true,
  },
  {
    id: "marketplace-sponsor-21d",
    label: "21 days",
    durationDays: 21,
    amountKobo: 150000,
    currency: "NGN",
    active: true,
  },
];

export const getMarketplaceSponsorshipPlan = (planId) =>
  MARKETPLACE_SPONSORSHIP_PLANS.find((plan) => plan.id === planId && plan.active) || null;

export const toNaira = (amountKobo) => Number((Number(amountKobo || 0) / 100).toFixed(2));
