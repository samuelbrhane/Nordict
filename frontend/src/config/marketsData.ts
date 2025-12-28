export type Horizon = "1D" | "7D" | "30D";

export interface HorizonData {
  signal: "up" | "down" | "neutral";
  confidence: number;
}

export interface Market {
  symbol: string;
  name: string;
  category: "crypto" | "forex" | "commodities";
  price: string;
  change24h: string;
  changeDirection: "up" | "down";
  horizons: Record<Horizon, HorizonData>;
  isFavorite: boolean;
}

export const HORIZONS: Horizon[] = ["1D", "7D", "30D"];

export const INITIAL_MARKETS: Market[] = [
  {
    symbol: "BTC-USD",
    name: "Bitcoin",
    category: "crypto",
    price: "$95,420",
    change24h: "+2.4%",
    changeDirection: "up",
    horizons: {
      "1D": { signal: "up", confidence: 68 },
      "7D": { signal: "up", confidence: 78 },
      "30D": { signal: "up", confidence: 65 },
    },
    isFavorite: true,
  },
  {
    symbol: "ETH-USD",
    name: "Ethereum",
    category: "crypto",
    price: "$3,450",
    change24h: "+1.8%",
    changeDirection: "up",
    horizons: {
      "1D": { signal: "up", confidence: 62 },
      "7D": { signal: "up", confidence: 72 },
      "30D": { signal: "up", confidence: 58 },
    },
    isFavorite: true,
  },
  {
    symbol: "SOL-USD",
    name: "Solana",
    category: "crypto",
    price: "$142.30",
    change24h: "-0.6%",
    changeDirection: "down",
    horizons: {
      "1D": { signal: "down", confidence: 55 },
      "7D": { signal: "down", confidence: 68 },
      "30D": { signal: "up", confidence: 52 },
    },
    isFavorite: false,
  },
  {
    symbol: "AVAX-USD",
    name: "Avalanche",
    category: "crypto",
    price: "$38.50",
    change24h: "+3.1%",
    changeDirection: "up",
    horizons: {
      "1D": { signal: "up", confidence: 61 },
      "7D": { signal: "up", confidence: 65 },
      "30D": { signal: "up", confidence: 55 },
    },
    isFavorite: false,
  },
  {
    symbol: "LINK-USD",
    name: "Chainlink",
    category: "crypto",
    price: "$14.20",
    change24h: "-1.2%",
    changeDirection: "down",
    horizons: {
      "1D": { signal: "down", confidence: 58 },
      "7D": { signal: "neutral", confidence: 52 },
      "30D": { signal: "up", confidence: 54 },
    },
    isFavorite: true,
  },
  {
    symbol: "DOT-USD",
    name: "Polkadot",
    category: "crypto",
    price: "$7.85",
    change24h: "+0.9%",
    changeDirection: "up",
    horizons: {
      "1D": { signal: "up", confidence: 54 },
      "7D": { signal: "up", confidence: 61 },
      "30D": { signal: "up", confidence: 48 },
    },
    isFavorite: false,
  },
  {
    symbol: "MATIC-USD",
    name: "Polygon",
    category: "crypto",
    price: "$0.89",
    change24h: "+0.4%",
    changeDirection: "up",
    horizons: {
      "1D": { signal: "up", confidence: 52 },
      "7D": { signal: "down", confidence: 58 },
      "30D": { signal: "up", confidence: 48 },
    },
    isFavorite: false,
  },
  {
    symbol: "UNI-USD",
    name: "Uniswap",
    category: "crypto",
    price: "$12.40",
    change24h: "+2.1%",
    changeDirection: "up",
    horizons: {
      "1D": { signal: "up", confidence: 56 },
      "7D": { signal: "up", confidence: 55 },
      "30D": { signal: "up", confidence: 51 },
    },
    isFavorite: false,
  },
  {
    symbol: "ATOM-USD",
    name: "Cosmos",
    category: "crypto",
    price: "$9.20",
    change24h: "-0.3%",
    changeDirection: "down",
    horizons: {
      "1D": { signal: "neutral", confidence: 50 },
      "7D": { signal: "neutral", confidence: 50 },
      "30D": { signal: "up", confidence: 45 },
    },
    isFavorite: false,
  },
  {
    symbol: "EUR-USD",
    name: "Euro / US Dollar",
    category: "forex",
    price: "$1.0892",
    change24h: "+0.12%",
    changeDirection: "up",
    horizons: {
      "1D": { signal: "up", confidence: 62 },
      "7D": { signal: "up", confidence: 58 },
      "30D": { signal: "neutral", confidence: 50 },
    },
    isFavorite: false,
  },
  {
    symbol: "GBP-USD",
    name: "British Pound",
    category: "forex",
    price: "$1.2534",
    change24h: "-0.08%",
    changeDirection: "down",
    horizons: {
      "1D": { signal: "down", confidence: 55 },
      "7D": { signal: "neutral", confidence: 52 },
      "30D": { signal: "up", confidence: 48 },
    },
    isFavorite: false,
  },
  {
    symbol: "GOLD-USD",
    name: "Gold",
    category: "commodities",
    price: "$2,065.40",
    change24h: "+0.35%",
    changeDirection: "up",
    horizons: {
      "1D": { signal: "up", confidence: 60 },
      "7D": { signal: "up", confidence: 65 },
      "30D": { signal: "up", confidence: 58 },
    },
    isFavorite: true,
  },
  {
    symbol: "OIL-USD",
    name: "Crude Oil",
    category: "commodities",
    price: "$71.82",
    change24h: "-1.45%",
    changeDirection: "down",
    horizons: {
      "1D": { signal: "down", confidence: 58 },
      "7D": { signal: "down", confidence: 55 },
      "30D": { signal: "neutral", confidence: 45 },
    },
    isFavorite: false,
  },
];

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Favorites" },
  { id: "crypto", label: "Crypto" },
  { id: "forex", label: "Forex" },
  { id: "commodities", label: "Commodities" },
];
