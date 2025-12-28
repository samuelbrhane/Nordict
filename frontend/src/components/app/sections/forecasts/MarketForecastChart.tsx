"use client";

import AnimatedCard from "../dashboard/AnimatedCard";

interface MarketForecastChartProps {
  symbol: string;
  horizon: "1D" | "7D" | "30D";
}

const generateChartData = (horizon: "1D" | "7D" | "30D", basePrice: number) => {
  const points = horizon === "1D" ? 24 : horizon === "7D" ? 7 : 30;
  const data = [];
  let price = basePrice;
  let forecast = basePrice;

  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.48) * (basePrice * 0.02);
    forecast += (Math.random() - 0.45) * (basePrice * 0.015);
    data.push({
      price: Math.round(price * 100) / 100,
      forecast: Math.round(forecast * 100) / 100,
      upper: Math.round((forecast + basePrice * 0.03) * 100) / 100,
      lower: Math.round((forecast - basePrice * 0.03) * 100) / 100,
    });
  }
  return data;
};

const MarketForecastChart = ({ symbol, horizon }: MarketForecastChartProps) => {
  const basePrice =
    symbol === "BTC-USD"
      ? 95000
      : symbol === "ETH-USD"
      ? 3400
      : symbol === "SOL-USD"
      ? 142
      : 100;
  const data = generateChartData(horizon, basePrice);

  const maxValue = Math.max(...data.map((d) => d.upper));
  const minValue = Math.min(...data.map((d) => d.lower));
  const range = maxValue - minValue;

  const getY = (value: number) => 180 - ((value - minValue) / range) * 160;

  const pricePath = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * 100}% ${getY(
          d.price
        )}`
    )
    .join(" ");
  const forecastPath = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * 100}% ${getY(
          d.forecast
        )}`
    )
    .join(" ");
  const bandPath =
    data
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * 100}% ${getY(
            d.upper
          )}`
      )
      .join(" ") +
    " " +
    [...data]
      .reverse()
      .map(
        (d, i) =>
          `L ${((data.length - 1 - i) / (data.length - 1)) * 100}% ${getY(
            d.lower
          )}`
      )
      .join(" ") +
    " Z";

  const formatValue = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toFixed(0)}`;
  };

  return (
    <AnimatedCard delay={200}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Price Forecast
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Historical price with {horizon} forecast band
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded-full bg-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400">
                Price
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-0.5 w-4 rounded-full"
                style={{ backgroundColor: "var(--brand)" }}
              />
              <span className="text-neutral-500 dark:text-neutral-400">
                Forecast
              </span>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <span
                className="h-3 w-4 rounded-sm opacity-30"
                style={{ backgroundColor: "var(--brand)" }}
              />
              <span className="text-neutral-500 dark:text-neutral-400">
                Confidence
              </span>
            </div>
          </div>
        </div>
        <div className="relative h-48 w-full sm:h-64">
          <svg
            viewBox="0 0 100 200"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0%"
                y1={20 + i * 40}
                x2="100%"
                y2={20 + i * 40}
                stroke="currentColor"
                strokeOpacity={0.1}
                className="text-neutral-300 dark:text-neutral-700"
              />
            ))}
            <path d={bandPath} fill="var(--brand)" fillOpacity={0.1} />
            <path
              d={pricePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-400 dark:text-neutral-500"
            />
            <path
              d={forecastPath}
              fill="none"
              stroke="var(--brand)"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-2 text-[10px] text-neutral-400">
            <span>{formatValue(maxValue)}</span>
            <span>{formatValue((maxValue + minValue) / 2)}</span>
            <span>{formatValue(minValue)}</span>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default MarketForecastChart;
