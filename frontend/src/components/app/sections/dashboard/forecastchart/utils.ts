// components/app/sections/dashboard/forecastchart/utils.ts

export type Horizon = "24H" | "30D" | "12W" | "12M";

export interface Market {
  symbol: string;
  name: string;
}

export interface ForecastDataPoint {
  index: number;
  label: string;
  timestamp: Date;
  forecast: number;
  upper: number;
  lower: number;
  confidence: number;
}

export interface PerformanceDataPoint {
  index: number;
  label: string;
  timestamp: Date;
  predicted: number;
  actual: number;
  error: number;
  errorPercent: number;
}

export interface ForecastSummary {
  direction: "Bullish" | "Bearish" | "Neutral";
  range: string;
  confidence: number;
}

export interface HorizonConfig {
  points: number;
  label: string;
  formatLabel: (date: Date) => string;
}

export const markets: Market[] = [
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
  { symbol: "SOL-USD", name: "Solana" },
  { symbol: "AVAX-USD", name: "Avalanche" },
  { symbol: "LINK-USD", name: "Chainlink" },
];

export const getHorizonConfig = (horizon: Horizon): HorizonConfig => {
  const configs: Record<Horizon, HorizonConfig> = {
    "24H": {
      points: 24,
      label: "Hours",
      formatLabel: (date) =>
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
    },
    "30D": {
      points: 30,
      label: "Days",
      formatLabel: (date) =>
        date.toLocaleDateString([], { month: "short", day: "numeric" }),
    },
    "12W": {
      points: 12,
      label: "Weeks",
      formatLabel: (date) =>
        date.toLocaleDateString([], { month: "short", day: "numeric" }),
    },
    "12M": {
      points: 12,
      label: "Months",
      formatLabel: (date) =>
        date.toLocaleDateString([], { month: "short", year: "2-digit" }),
    },
  };
  return configs[horizon];
};

export const getBasePrice = (symbol: string): number => {
  const prices: Record<string, number> = {
    "BTC-USD": 42000,
    "ETH-USD": 2200,
    "SOL-USD": 95,
    "AVAX-USD": 35,
    "LINK-USD": 14,
  };
  return prices[symbol] || 100;
};

export const generateForecastData = (
  horizon: Horizon,
  symbol: string
): ForecastDataPoint[] => {
  const config = getHorizonConfig(horizon);
  const basePrice = getBasePrice(symbol);
  const data: ForecastDataPoint[] = [];

  const getStartDate = (): Date => {
    const now = new Date();

    if (horizon === "24H") {
      now.setMinutes(0, 0, 0);
      now.setHours(now.getHours() + 1);
    } else if (horizon === "30D") {
      now.setHours(0, 0, 0, 0);
      now.setDate(now.getDate() + 1);
    } else if (horizon === "12W") {
      now.setHours(0, 0, 0, 0);
      const dayOfWeek = now.getDay();
      const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
      now.setDate(now.getDate() + daysUntilMonday);
    } else {
      now.setHours(0, 0, 0, 0);
      now.setDate(1);
      now.setMonth(now.getMonth() + 1);
    }

    return now;
  };

  const startDate = getStartDate();

  const getTimestamp = (index: number): Date => {
    const date = new Date(startDate);

    if (horizon === "24H") {
      date.setHours(date.getHours() + index);
    } else if (horizon === "30D") {
      date.setDate(date.getDate() + index);
    } else if (horizon === "12W") {
      date.setDate(date.getDate() + index * 7);
    } else {
      date.setMonth(date.getMonth() + index);
    }

    return date;
  };

  const baseConfidence =
    horizon === "24H"
      ? 0.85
      : horizon === "30D"
      ? 0.7
      : horizon === "12W"
      ? 0.55
      : 0.45;
  const confidenceDecay =
    horizon === "24H"
      ? 0.015
      : horizon === "30D"
      ? 0.012
      : horizon === "12W"
      ? 0.025
      : 0.02;
  const volatilityMultiplier =
    horizon === "24H"
      ? 0.008
      : horizon === "30D"
      ? 0.012
      : horizon === "12W"
      ? 0.025
      : 0.035;

  const seed = symbol
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seededRandom = (i: number) => {
    const x = Math.sin(seed + i * 100) * 10000;
    return x - Math.floor(x);
  };

  let forecast = basePrice;

  for (let i = 0; i < config.points; i++) {
    forecast += (seededRandom(i) - 0.45) * (basePrice * volatilityMultiplier);
    const pointConfidence = Math.max(
      0.25,
      baseConfidence - i * confidenceDecay
    );
    const bandWidth = basePrice * (1 - pointConfidence) * 0.15;
    const timestamp = getTimestamp(i);

    data.push({
      index: i,
      label: config.formatLabel(timestamp),
      timestamp,
      forecast: Math.round(forecast * 100) / 100,
      upper: Math.round((forecast + bandWidth) * 100) / 100,
      lower: Math.round((forecast - bandWidth) * 100) / 100,
      confidence: Math.round(pointConfidence * 100),
    });
  }

  return data;
};

export const generatePerformanceData = (
  horizon: Horizon,
  symbol: string
): PerformanceDataPoint[] => {
  const config = getHorizonConfig(horizon);
  const basePrice = getBasePrice(symbol);
  const data: PerformanceDataPoint[] = [];

  const getEndDate = (): Date => {
    const now = new Date();

    if (horizon === "24H") {
      now.setMinutes(0, 0, 0);
    } else if (horizon === "30D") {
      now.setHours(0, 0, 0, 0);
    } else if (horizon === "12W") {
      now.setHours(0, 0, 0, 0);
      const dayOfWeek = now.getDay();
      const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      now.setDate(now.getDate() - daysSinceMonday);
    } else {
      now.setHours(0, 0, 0, 0);
      now.setDate(1);
    }

    return now;
  };

  const endDate = getEndDate();

  const getTimestamp = (index: number): Date => {
    const date = new Date(endDate);
    const reverseIndex = config.points - 1 - index;

    if (horizon === "24H") {
      date.setHours(date.getHours() - reverseIndex);
    } else if (horizon === "30D") {
      date.setDate(date.getDate() - reverseIndex);
    } else if (horizon === "12W") {
      date.setDate(date.getDate() - reverseIndex * 7);
    } else {
      date.setMonth(date.getMonth() - reverseIndex);
    }

    return date;
  };

  const seed = symbol
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seededRandom = (i: number, offset: number = 0) => {
    const x = Math.sin(seed + i * 100 + offset * 50) * 10000;
    return x - Math.floor(x);
  };

  let predicted = basePrice;
  let actual = basePrice;

  for (let i = 0; i < config.points; i++) {
    const trend = (seededRandom(i) - 0.48) * basePrice * 0.02;
    predicted += trend + (seededRandom(i, 1) - 0.5) * basePrice * 0.01;
    actual += trend + (seededRandom(i, 2) - 0.5) * basePrice * 0.015;

    const error = actual - predicted;
    const errorPercent = (error / predicted) * 100;
    const timestamp = getTimestamp(i);

    data.push({
      index: i,
      label: config.formatLabel(timestamp),
      timestamp,
      predicted: Math.round(predicted * 100) / 100,
      actual: Math.round(actual * 100) / 100,
      error: Math.round(error * 100) / 100,
      errorPercent: Math.round(errorPercent * 100) / 100,
    });
  }

  return data;
};

export const getSummaryData = (
  horizon: Horizon,
  symbol: string
): ForecastSummary => {
  const summaries: Record<string, Record<Horizon, ForecastSummary>> = {
    "BTC-USD": {
      "24H": {
        direction: "Bullish",
        range: "$41,800 - $43,200",
        confidence: 78,
      },
      "30D": {
        direction: "Bullish",
        range: "$40,500 - $48,000",
        confidence: 62,
      },
      "12W": {
        direction: "Neutral",
        range: "$38,000 - $52,000",
        confidence: 48,
      },
      "12M": {
        direction: "Bullish",
        range: "$35,000 - $65,000",
        confidence: 38,
      },
    },
    "ETH-USD": {
      "24H": { direction: "Bullish", range: "$2,150 - $2,280", confidence: 75 },
      "30D": { direction: "Bullish", range: "$2,100 - $2,600", confidence: 58 },
      "12W": { direction: "Bullish", range: "$2,000 - $3,000", confidence: 45 },
      "12M": { direction: "Bullish", range: "$1,800 - $4,000", confidence: 35 },
    },
    "SOL-USD": {
      "24H": { direction: "Bearish", range: "$92 - $98", confidence: 72 },
      "30D": { direction: "Neutral", range: "$85 - $110", confidence: 55 },
      "12W": { direction: "Bullish", range: "$80 - $140", confidence: 42 },
      "12M": { direction: "Bullish", range: "$70 - $200", confidence: 32 },
    },
    "AVAX-USD": {
      "24H": { direction: "Bullish", range: "$34 - $37", confidence: 70 },
      "30D": { direction: "Bullish", range: "$32 - $42", confidence: 54 },
      "12W": { direction: "Neutral", range: "$28 - $50", confidence: 40 },
      "12M": { direction: "Bullish", range: "$25 - $70", confidence: 30 },
    },
    "LINK-USD": {
      "24H": { direction: "Neutral", range: "$13.5 - $14.5", confidence: 65 },
      "30D": { direction: "Bullish", range: "$13 - $18", confidence: 52 },
      "12W": { direction: "Bullish", range: "$12 - $22", confidence: 38 },
      "12M": { direction: "Bullish", range: "$10 - $30", confidence: 28 },
    },
  };
  return summaries[symbol]?.[horizon] || summaries["BTC-USD"][horizon];
};

export const formatPrice = (val: number): string => {
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
  return `$${val.toFixed(0)}`;
};
