interface BillingToggleProps {
  billingCycle: "monthly" | "yearly";
  onChange: (cycle: "monthly" | "yearly") => void;
}

const BillingToggle = ({ billingCycle, onChange }: BillingToggleProps) => {
  return (
    <div className="flex justify-center border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
      <div className="inline-flex items-center rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        <button
          onClick={() => onChange("monthly")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
            billingCycle === "monthly"
              ? "bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-white"
              : "text-neutral-600 dark:text-neutral-400"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => onChange("yearly")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
            billingCycle === "yearly"
              ? "bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-white"
              : "text-neutral-600 dark:text-neutral-400"
          }`}
        >
          Yearly
          <span className="ml-1.5 rounded-full bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Save 20%
          </span>
        </button>
      </div>
    </div>
  );
};

export default BillingToggle;
