"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

interface Session {
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

const SESSIONS: Session[] = [
  {
    device: "Chrome on MacOS",
    location: "New York, US",
    lastActive: "Now",
    current: true,
  },
  {
    device: "Safari on iPhone",
    location: "New York, US",
    lastActive: "2 hours ago",
    current: false,
  },
];

const SessionsSection = () => {
  return (
    <AnimatedCard delay={150}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Active Sessions
        </h3>
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
          Devices where you're logged in
        </p>

        <div className="mt-4 space-y-2">
          {SESSIONS.map((session, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-700">
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
                      d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {session.device}
                    </p>
                    {session.current && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-xs font-medium text-black"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {session.location} · {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <button className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default SessionsSection;
