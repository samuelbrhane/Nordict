"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

const DangerZone = () => {
  return (
    <AnimatedCard delay={200}>
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
        <h3 className="font-semibold text-red-900 dark:text-red-200">
          Danger Zone
        </h3>
        <p className="mt-0.5 text-sm text-red-700 dark:text-red-300">
          Irreversible actions
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-red-900 dark:text-red-200">
              Delete Account
            </p>
            <p className="text-xs text-red-700 dark:text-red-300">
              Permanently delete your account and all data
            </p>
          </div>
          <button className="w-fit rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-all hover:bg-red-50 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
            Delete Account
          </button>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default DangerZone;
