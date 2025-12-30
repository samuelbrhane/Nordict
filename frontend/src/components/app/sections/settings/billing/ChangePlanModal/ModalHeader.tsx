interface ModalHeaderProps {
  hasSubscription: boolean;
  isOnTrial: boolean;
  trialDaysRemaining?: number;
  currentPlanId?: string | null;
  currentBillingCycle?: string | null;
  onClose: () => void;
}

const ModalHeader = ({
  hasSubscription,
  isOnTrial,
  trialDaysRemaining,
  currentPlanId,
  currentBillingCycle,
  onClose,
}: ModalHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {hasSubscription ? "Change Plan" : "Choose Your Plan"}
        </h2>
        {isOnTrial && (
          <p className="text-sm text-neutral-500">
            {trialDaysRemaining} days left in your trial
          </p>
        )}
        {hasSubscription && currentPlanId && (
          <p className="text-sm text-neutral-500">
            Current: {currentPlanId.charAt(0).toUpperCase()}
            {currentPlanId.slice(1)} ({currentBillingCycle})
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default ModalHeader;
