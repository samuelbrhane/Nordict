"use client";

import AnimatedCard from "./AnimatedCard";

interface KpiTile {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  status?: "healthy" | "warning" | "error";
}

interface KpiTilesProps {
  horizon: "1D" | "7D" | "30D";
}

const ClockIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ChartIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
    />
  </svg>
);

const TargetIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TrendIcon = () => (
  <svg
    className="h-5 w-5"
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

const getKpiData = (horizon: "1D" | "7D" | "30D"): KpiTile[] => {
  const baseData: Record<string, KpiTile[]> = {
    "1D": [
      {
        label: "Forecast Run",
        value: "2 min ago",
        icon: <ClockIcon />,
        status: "healthy",
      },
      {
        label: "Markets",
        value: "24",
        change: "+2",
        changeType: "positive",
        icon: <ChartIcon />,
      },
      {
        label: "Active Alerts",
        value: "8",
        change: "+1",
        changeType: "neutral",
        icon: <BellIcon />,
      },
      {
        label: "Avg Confidence",
        value: "74%",
        change: "+3%",
        changeType: "positive",
        icon: <TargetIcon />,
      },
      {
        label: "1D Performance",
        value: "+2.1%",
        change: "vs baseline",
        changeType: "positive",
        icon: <TrendIcon />,
      },
    ],
    "7D": [
      {
        label: "Forecast Run",
        value: "2 min ago",
        icon: <ClockIcon />,
        status: "healthy",
      },
      {
        label: "Markets",
        value: "24",
        change: "+2",
        changeType: "positive",
        icon: <ChartIcon />,
      },
      {
        label: "Active Alerts",
        value: "12",
        change: "+4",
        changeType: "neutral",
        icon: <BellIcon />,
      },
      {
        label: "Avg Confidence",
        value: "68%",
        change: "-2%",
        changeType: "negative",
        icon: <TargetIcon />,
      },
      {
        label: "7D Performance",
        value: "+5.8%",
        change: "vs baseline",
        changeType: "positive",
        icon: <TrendIcon />,
      },
    ],
    "30D": [
      {
        label: "Forecast Run",
        value: "2 min ago",
        icon: <ClockIcon />,
        status: "healthy",
      },
      {
        label: "Markets",
        value: "24",
        change: "+2",
        changeType: "positive",
        icon: <ChartIcon />,
      },
      {
        label: "Active Alerts",
        value: "18",
        change: "+6",
        changeType: "neutral",
        icon: <BellIcon />,
      },
      {
        label: "Avg Confidence",
        value: "61%",
        change: "-5%",
        changeType: "negative",
        icon: <TargetIcon />,
      },
      {
        label: "30D Performance",
        value: "+12.4%",
        change: "vs baseline",
        changeType: "positive",
        icon: <TrendIcon />,
      },
    ],
  };
  return baseData[horizon];
};

const KpiTiles = ({ horizon }: KpiTilesProps) => {
  const tiles = getKpiData(horizon);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
      {tiles.map((tile, index) => (
        <AnimatedCard key={tile.label} delay={50 + index * 50}>
          <div className="group relative flex h-full min-h-[140px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(135deg, rgba(4,236,58,0.03) 0%, transparent 50%)",
              }}
            />
            <div className="relative flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: "rgba(4,236,58,0.1)" }}
                >
                  <span style={{ color: "var(--brand)" }}>{tile.icon}</span>
                </div>
                {tile.status && (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      tile.status === "healthy"
                        ? "bg-emerald-500"
                        : tile.status === "warning"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                )}
              </div>
              <div className="mt-auto pt-3">
                <p className="text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl">
                  {tile.value}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
                    {tile.label}
                  </p>
                  {tile.change && (
                    <span
                      className={`shrink-0 text-xs font-medium ${
                        tile.changeType === "positive"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : tile.changeType === "negative"
                          ? "text-red-600 dark:text-red-400"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {tile.change}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
};

export default KpiTiles;
