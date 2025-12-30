"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";

const NotificationsHeader = () => {
  return (
    <AnimatedCard delay={0}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Notifications
        </h1>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          Manage how you receive updates and alerts
        </p>
      </div>
    </AnimatedCard>
  );
};

export default NotificationsHeader;
