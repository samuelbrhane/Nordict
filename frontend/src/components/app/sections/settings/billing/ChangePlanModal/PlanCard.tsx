import { PlanCardProps } from "./types";

const PlanCard = ({
  plan,
  billingCycle,
  isSelected,
  isCurrentPlan,
  hasSubscription,
  isUpgrade,
  onSelect,
}: PlanCardProps) => {
  const isTeams = plan.id === "teams";

  const getPrice = () => {
    if (billingCycle === "yearly") {
      return Math.floor(plan.yearlyPrice / 12);
    }
    return plan.price;
  };

  const getSavings = () => {
    const monthlyTotal = plan.price * 12;
    const yearlyTotal = plan.yearlyPrice;
    return Math.floor(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
  };

  return (
    <div
      onClick={() => !isTeams && onSelect(plan.id)}
      className={`relative rounded-xl border-2 p-4 transition-all ${
        isTeams
          ? "cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-60 dark:border-neutral-700 dark:bg-neutral-800/50"
          : isCurrentPlan
          ? "cursor-default border-neutral-300 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800/50"
          : isSelected
          ? "cursor-pointer border-[var(--brand)] bg-[rgba(4,236,58,0.05)]"
          : "cursor-pointer border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
      }`}
    >
      {/* Badges */}
      {isTeams && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-neutral-400 px-2 py-0.5 text-xs font-medium text-white dark:bg-neutral-600">
          Coming Soon
        </span>
      )}

      {plan.highlighted && !isCurrentPlan && !isTeams && (
        <span
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-xs font-medium text-black"
          style={{ backgroundColor: "var(--brand)" }}
        >
          Popular
        </span>
      )}

      {isCurrentPlan && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
          Current
        </span>
      )}

      <h4 className="font-semibold text-neutral-900 dark:text-white">
        {plan.name}
      </h4>
      <p className="mt-0.5 text-xs text-neutral-500">{plan.description}</p>

      <p className="mt-3">
        {isTeams ? (
          <span className="text-xl font-bold text-neutral-900 dark:text-white">
            Custom
          </span>
        ) : (
          <>
            <span className="text-xl font-bold text-neutral-900 dark:text-white">
              €{getPrice()}
            </span>
            <span className="text-xs text-neutral-500">/month</span>
          </>
        )}
      </p>

      {billingCycle === "yearly" && !isTeams && (
        <p className="mt-0.5 text-xs text-green-600 dark:text-green-400">
          €{plan.yearlyPrice}/year · Save {getSavings()}%
        </p>
      )}

      {/* Upgrade/Downgrade indicator */}
      {isSelected && !isCurrentPlan && !isTeams && hasSubscription && (
        <p
          className={`mt-2 text-xs font-medium ${
            isUpgrade ? "text-green-600" : "text-amber-600"
          }`}
        >
          {isUpgrade ? "↑ Immediate upgrade" : "↓ Changes at period end"}
        </p>
      )}

      {/* Features */}
      <ul className="mt-3 space-y-1.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-1.5 text-xs">
            <svg
              className="mt-0.5 h-3 w-3 shrink-0"
              style={{ color: isTeams ? "#9ca3af" : "var(--brand)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-neutral-600 dark:text-neutral-400">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {isTeams && (
        <p className="mt-3 text-center text-xs text-neutral-500">
          Contact us for pricing
        </p>
      )}
    </div>
  );
};

export default PlanCard;
