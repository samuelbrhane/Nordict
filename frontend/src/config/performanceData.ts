export interface Market {
  symbol: string;
  name: string;
}

export interface ModelVersion {
  id: string;
  label: string;
  date: string;
}

export interface Horizon {
  id: string;
  label: string;
}

export interface MetricData {
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface BacktestRun {
  date: string;
  horizon: string;
  version: string;
  mae: string;
  directional: string;
  calibration: string;
}

export interface RegimeData {
  regime: string;
  periods: number;
  mae: string;
  directional: string;
  status: "strong" | "moderate" | "weak";
}

export const MARKETS: Market[] = [
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
  { symbol: "SOL-USD", name: "Solana" },
  { symbol: "AVAX-USD", name: "Avalanche" },
];

export const MODEL_VERSIONS: ModelVersion[] = [
  { id: "v0.3", label: "v0.3 (Current)", date: "Dec 2024" },
  { id: "v0.2", label: "v0.2", date: "Oct 2024" },
  { id: "v0.1", label: "v0.1", date: "Aug 2024" },
];

export const HORIZONS: Horizon[] = [
  { id: "1D", label: "1D" },
  { id: "7D", label: "7D" },
  { id: "30D", label: "30D" },
  { id: "90D", label: "90D" },
];

// Metrics data per horizon
export const METRICS_BY_HORIZON: Record<string, Record<string, MetricData>> = {
  "1D": {
    mae: { value: "1.12%", change: "-0.08%", trend: "down" },
    rmse: { value: "1.58%", change: "-0.05%", trend: "down" },
    mape: { value: "2.34%", change: "-0.12%", trend: "down" },
    directionalAccuracy: { value: "68.2%", change: "+0.8%", trend: "up" },
    calibrationScore: { value: "0.92", change: "+0.01", trend: "up" },
    sharpeRatio: { value: "1.82", change: "+0.05", trend: "up" },
  },
  "7D": {
    mae: { value: "2.34%", change: "-0.12%", trend: "down" },
    rmse: { value: "3.21%", change: "-0.08%", trend: "down" },
    mape: { value: "4.56%", change: "-0.15%", trend: "down" },
    directionalAccuracy: { value: "72.4%", change: "+1.2%", trend: "up" },
    calibrationScore: { value: "0.89", change: "+0.02", trend: "up" },
    sharpeRatio: { value: "1.45", change: "+0.08", trend: "up" },
  },
  "30D": {
    mae: { value: "4.18%", change: "-0.22%", trend: "down" },
    rmse: { value: "5.42%", change: "-0.18%", trend: "down" },
    mape: { value: "7.85%", change: "-0.28%", trend: "down" },
    directionalAccuracy: { value: "65.8%", change: "+0.5%", trend: "up" },
    calibrationScore: { value: "0.84", change: "+0.01", trend: "up" },
    sharpeRatio: { value: "1.12", change: "+0.04", trend: "up" },
  },
  "90D": {
    mae: { value: "6.52%", change: "-0.35%", trend: "down" },
    rmse: { value: "8.21%", change: "-0.42%", trend: "down" },
    mape: { value: "11.24%", change: "-0.48%", trend: "down" },
    directionalAccuracy: { value: "58.4%", change: "+0.3%", trend: "up" },
    calibrationScore: { value: "0.78", change: "+0.01", trend: "up" },
    sharpeRatio: { value: "0.85", change: "+0.02", trend: "up" },
  },
};

export const BACKTEST_RUNS: BacktestRun[] = [
  {
    date: "Dec 20, 2024",
    horizon: "7D",
    version: "v0.3",
    mae: "2.12%",
    directional: "74.2%",
    calibration: "0.91",
  },
  {
    date: "Dec 13, 2024",
    horizon: "7D",
    version: "v0.3",
    mae: "2.45%",
    directional: "71.8%",
    calibration: "0.88",
  },
  {
    date: "Dec 6, 2024",
    horizon: "7D",
    version: "v0.3",
    mae: "2.38%",
    directional: "72.1%",
    calibration: "0.89",
  },
  {
    date: "Nov 29, 2024",
    horizon: "7D",
    version: "v0.3",
    mae: "2.51%",
    directional: "70.5%",
    calibration: "0.87",
  },
];

export const REGIME_BREAKDOWN: RegimeData[] = [
  {
    regime: "Bull Market",
    periods: 45,
    mae: "1.98%",
    directional: "78.2%",
    status: "strong",
  },
  {
    regime: "Bear Market",
    periods: 28,
    mae: "2.89%",
    directional: "68.4%",
    status: "moderate",
  },
  {
    regime: "High Volatility",
    periods: 32,
    mae: "3.45%",
    directional: "65.1%",
    status: "weak",
  },
  {
    regime: "Low Volatility",
    periods: 51,
    mae: "1.76%",
    directional: "76.8%",
    status: "strong",
  },
];
