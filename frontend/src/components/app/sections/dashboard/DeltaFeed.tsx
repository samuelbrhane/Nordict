"use client";

import AnimatedCard from "./AnimatedCard";

interface DeltaItem {
  id: string;
  type: "confidence" | "signal" | "band" | "price";
  market: string;
  description: string;
  detail: string;
  timestamp: string;
}

const deltaItems: DeltaItem[] = [
  {
    id: "1",
    type: "confidence",
    market: "BTC-USD",
    description: "Confidence increased",
    detail: "0.62 → 0.74",
    timestamp: "2m ago",
  },
  {
    id: "2",
    type: "signal",
    market: "ETH-USD",
    description: "Signal flipped",
    detail: "Neutral → Up",
    timestamp: "2m ago",
  },
  {
    id: "3",
    type: "band",
    market: "SPY-USD",
    description: "Band widened",
    detail: "Higher uncertainty",
    timestamp: "2m ago",
  },
  {
    id: "4",
    type: "confidence",
    market: "SOL-USD",
    description: "Confidence decreased",
    detail: "0.71 → 0.68",
    timestamp: "2m ago",
  },
  {
    id: "5",
    type: "signal",
    market: "AVAX-USD",
    description: "Signal strengthened",
    detail: "Up (weak) → Up (strong)",
    timestamp: "2m ago",
  },
];

const getTypeIcon = (type: DeltaItem["type"]) => {
  switch (type) {
    case "confidence":
      return (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
          />
        </svg>
      );
    case "signal":
      return (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>
      );
    case "band":
      return (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
};

const DeltaFeed = () => {
  return (
    <AnimatedCard delay={500}>
      <div className="h-full rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              What Changed
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Since last forecast run
            </p>
          </div>
          <span
            className="flex h-6 items-center rounded-full px-2 text-xs font-medium"
            style={{
              backgroundColor: "rgba(4,236,58,0.1)",
              color: "var(--brand)",
            }}
          >
            {deltaItems.length} changes
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {deltaItems.map((item, index) => (
            <div
              key={item.id}
              className="group flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3 transition-all duration-200 hover:border-neutral-200 hover:bg-white dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
            >
              {/* Icon */}
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                style={{
                  backgroundColor: "rgba(4,236,58,0.1)",
                  color: "var(--brand)",
                }}
              >
                {getTypeIcon(item.type)}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {item.market}
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {item.description}
                  </span>
                </div>
                <p
                  className="mt-0.5 text-sm font-medium"
                  style={{ color: "var(--brand)" }}
                >
                  {item.detail}
                </p>
              </div>

              {/* Timestamp */}
              <span className="shrink-0 text-xs text-neutral-400 dark:text-neutral-500">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default DeltaFeed;
