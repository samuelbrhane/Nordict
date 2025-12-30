interface ModalFooterProps {
  hasSubscription: boolean;
  isOnTrial: boolean;
  selectedPlan: string | null;
  isUpgrade: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  buttonText: string;
  onCancel: () => void;
  onSubmit: () => void;
}

const ModalFooter = ({
  hasSubscription,
  isOnTrial,
  selectedPlan,
  isUpgrade,
  isLoading,
  isDisabled,
  buttonText,
  onCancel,
  onSubmit,
}: ModalFooterProps) => {
  const getHelperText = () => {
    if (!hasSubscription || isOnTrial) {
      return "You won't be charged until checkout";
    }
    if (selectedPlan && isUpgrade) {
      return "Upgrade is immediate with prorated billing";
    }
    return "Downgrade takes effect at end of billing period";
  };

  return (
    <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-700">
      <p className="text-xs text-neutral-500">{getHelperText()}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={isDisabled || isLoading}
          className="rounded-lg px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: "var(--brand)" }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ModalFooter;
