"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AnimatedCard } from "../../dashboard";
import { api } from "@/lib/api";

interface UsageData {
  alerts: number;
  sessions: number;
}

const UsageSection = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData>({ alerts: 0, sessions: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const data = await api.get<UsageData>("/api/v1/auth/me/usage/");
        setUsage(data);
      } catch (error) {
        console.error("Failed to fetch usage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUsage();
    }
  }, [user]);

  if (!user) return null;

  const { plan_limits } = user;

  const items = [
    {
      label: "Active Alerts",
      description: "Price alerts you've set up",
      used: usage.alerts,
      total: plan_limits.max_alerts,
    },
    {
      label: "Active Devices",
      description: "Devices logged into your account",
      used: usage.sessions,
      total: plan_limits.max_sessions,
    },
  ];

  return (
    <AnimatedCard delay={50}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="font-semibold text-neutral-900 dark:text-white">
          Usage
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          Your current resource usage
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const isUnlimited = item.total === null;
            const percent = isUnlimited
              ? 0
              : Math.round((item.used / item.total!) * 100);
            const isNearLimit = !isUnlimited && percent >= 80;
            const isAtLimit = !isUnlimited && percent >= 100;

            return (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {isLoading ? (
                      <span className="text-neutral-400">...</span>
                    ) : (
                      <>
                        {item.used}
                        {isUnlimited ? (
                          <span className="font-normal text-neutral-500">
                            {" "}
                            / ∞
                          </span>
                        ) : (
                          <span className="font-normal text-neutral-500">
                            {" "}
                            / {item.total}
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: isLoading
                        ? "0%"
                        : isUnlimited
                        ? "5%"
                        : `${Math.min(percent, 100)}%`,
                      backgroundColor: isAtLimit
                        ? "#ef4444"
                        : isNearLimit
                        ? "#f59e0b"
                        : "var(--brand)",
                    }}
                  />
                </div>
                <p
                  className={`mt-1 text-xs ${
                    isAtLimit
                      ? "text-red-600 dark:text-red-400"
                      : isNearLimit
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-neutral-500"
                  }`}
                >
                  {isLoading
                    ? "Loading..."
                    : isUnlimited
                    ? "Unlimited"
                    : isAtLimit
                    ? "Limit reached"
                    : `${item.total! - item.used} remaining`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default UsageSection;
