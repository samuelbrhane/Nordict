"use client";

import AnimatedCard from "../../dashboard/AnimatedCard";
import Toggle from "./Toggle";

interface AlertChannelsProps {
  email: boolean;
  push: boolean;
  onEmailChange: (v: boolean) => void;
  onPushChange: (v: boolean) => void;
}

const AlertChannels = ({
  email,
  push,
  onEmailChange,
  onPushChange,
}: AlertChannelsProps) => {
  return (
    <AnimatedCard delay={50}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Alert Channels
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          How you receive forecast alerts
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <svg
                  className="h-4 w-4 text-neutral-600 dark:text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Email
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Receive alerts via email
                </p>
              </div>
            </div>
            <Toggle enabled={email} onChange={onEmailChange} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <svg
                  className="h-4 w-4 text-neutral-600 dark:text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Push
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Browser and mobile
                </p>
              </div>
            </div>
            <Toggle enabled={push} onChange={onPushChange} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <svg
                  className="h-4 w-4 text-neutral-600 dark:text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Webhook
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Custom endpoint
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Soon</span>
              <Toggle enabled={false} onChange={() => {}} disabled />
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default AlertChannels;
