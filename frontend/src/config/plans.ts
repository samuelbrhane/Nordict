export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  period: string;
  features: string[];
  limits: {
    max_markets: number | null;
    max_alerts: number | null;
    max_sessions: number | null;
    horizons: string[];
    backtest_days: number | null;
    api_access: boolean;
  };
  highlighted?: boolean;
}

export const PLANS: PlanConfig[] = [
  {
    id: "pro",
    name: "Pro",
    description: "For individual traders",
    price: 9,
    yearlyPrice: 86, // $7.20/month
    period: "/month",
    features: [
      "10 markets",
      "5 alerts",
      "3 devices",
      "24H & 30D forecasts",
      "30-day backtest history",
      "Email notifications",
    ],
    limits: {
      max_markets: 10,
      max_alerts: 5,
      max_sessions: 3,
      horizons: ["24H", "30D"],
      backtest_days: 30,
      api_access: false,
    },
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "For power users",
    price: 19,
    yearlyPrice: 182, // $15.20/month
    period: "/month",
    features: [
      "Unlimited markets",
      "Unlimited alerts",
      "5 devices",
      "All forecast horizons",
      "Full backtest history",
      "Priority support",
    ],
    limits: {
      max_markets: null,
      max_alerts: null,
      max_sessions: 5,
      horizons: ["24H", "30D", "12W", "12M"],
      backtest_days: null,
      api_access: false,
    },
  },
  {
    id: "teams",
    name: "Teams",
    description: "For organizations",
    price: 49,
    yearlyPrice: 470, // $39.20/month
    period: "/month",
    features: [
      "Everything in Premium",
      "10 team members",
      "Unlimited devices",
      "Team collaboration",
      "API access",
      "Dedicated support",
    ],
    limits: {
      max_markets: null,
      max_alerts: null,
      max_sessions: null,
      horizons: ["24H", "30D", "12W", "12M"],
      backtest_days: null,
      api_access: true,
    },
  },
];

export const getPlanById = (id: string): PlanConfig | undefined => {
  return PLANS.find((plan) => plan.id === id);
};

export const FREE_PLAN: PlanConfig = {
  id: "free",
  name: "Free",
  description: "Trial expired",
  price: 0,
  yearlyPrice: 0,
  period: "",
  features: [],
  limits: {
    max_markets: 0,
    max_alerts: 0,
    max_sessions: 1,
    horizons: [],
    backtest_days: 0,
    api_access: false,
  },
};
