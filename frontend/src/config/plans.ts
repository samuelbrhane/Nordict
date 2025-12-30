export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  period: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: PlanConfig[] = [
  {
    id: "pro",
    name: "Pro",
    description: "For individual traders",
    price: 19,
    yearlyPrice: 182, // ~20% off
    period: "/month",
    features: [
      "5 markets",
      "5 alerts",
      "2 devices",
      "Daily forecasts",
      "30-day backtest",
      "Email notifications",
    ],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "For power users",
    price: 49,
    yearlyPrice: 470, // ~20% off
    period: "/month",
    features: [
      "Unlimited markets",
      "Unlimited alerts",
      "5 devices",
      "All forecast horizons",
      "Full backtest history",
      "Priority support",
    ],
  },
  {
    id: "teams",
    name: "Teams",
    description: "For organizations",
    price: 99,
    yearlyPrice: 950, // ~20% off
    period: "/month",
    features: [
      "Everything in Premium",
      "Unlimited team members",
      "Unlimited devices",
      "Team collaboration",
      "Admin dashboard",
      "SSO integration",
      "Dedicated support",
    ],
  },
];

export const getPlanById = (id: string): PlanConfig | undefined => {
  return PLANS.find((plan) => plan.id === id);
};
