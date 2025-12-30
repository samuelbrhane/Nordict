"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";
import Toggle from "./ToggleRow";

interface SystemNotificationsProps {
  maintenance: boolean;
  newFeatures: boolean;
  newsletter: boolean;
  onMaintenanceChange: (v: boolean) => void;
  onNewFeaturesChange: (v: boolean) => void;
  onNewsletterChange: (v: boolean) => void;
}

const SystemNotifications = ({
  maintenance,
  newFeatures,
  newsletter,
  onMaintenanceChange,
  onNewFeaturesChange,
  onNewsletterChange,
}: SystemNotificationsProps) => {
  return (
    <AnimatedCard delay={150}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          System
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          Platform updates
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Maintenance
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Downtime and updates
              </p>
            </div>
            <Toggle enabled={maintenance} onChange={onMaintenanceChange} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                New Features
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Product improvements
              </p>
            </div>
            <Toggle enabled={newFeatures} onChange={onNewFeaturesChange} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Newsletter
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Monthly insights
              </p>
            </div>
            <Toggle enabled={newsletter} onChange={onNewsletterChange} />
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default SystemNotifications;
