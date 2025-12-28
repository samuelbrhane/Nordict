export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  current: boolean;
  popular?: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For individual exploration",
    features: [
      "2 markets",
      "7D horizon max",
      "1,000 API calls/month",
      "Email alerts only",
    ],
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For active traders",
    features: [
      "10 markets",
      "All horizons (1D–90D)",
      "50,000 API calls/month",
      "All alert channels",
      "Performance analytics",
      "Priority support",
    ],
    current: true,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and institutions",
    features: [
      "Unlimited markets",
      "Custom horizons",
      "Unlimited API calls",
      "Webhook integrations",
      "Dedicated support",
      "Custom model training",
      "SLA guarantee",
    ],
    current: false,
  },
];

export const INVOICES: Invoice[] = [
  { id: "INV-2024-012", date: "Dec 1, 2024", amount: "$49.00", status: "paid" },
  { id: "INV-2024-011", date: "Nov 1, 2024", amount: "$49.00", status: "paid" },
  { id: "INV-2024-010", date: "Oct 1, 2024", amount: "$49.00", status: "paid" },
  { id: "INV-2024-009", date: "Sep 1, 2024", amount: "$49.00", status: "paid" },
];
