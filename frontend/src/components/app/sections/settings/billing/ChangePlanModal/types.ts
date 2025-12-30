export interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    yearlyPrice: number;
    features: string[];
    highlighted?: boolean;
  };
  billingCycle: "monthly" | "yearly";
  isSelected: boolean;
  isCurrentPlan: boolean;
  hasSubscription: boolean;
  isUpgrade: boolean;
  onSelect: (planId: string) => void;
}
