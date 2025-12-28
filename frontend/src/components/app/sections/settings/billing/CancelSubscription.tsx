"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";

const CancelSubscription = () => {
  return (
    <AnimatedCard delay={250}>
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              Cancel Subscription
            </p>
            <p className="text-xs text-neutral-500">
              Access continues until end of billing period
            </p>
          </div>
          <button className="w-fit text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400">
            Cancel subscription
          </button>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default CancelSubscription;
