export interface Market {
  symbol: string;
  name: string;
}

export interface ConditionType {
  id: string;
  label: string;
  unit: string | null;
}

export interface Alert {
  id: number;
  market: string;
  horizon: string;
  condition: string;
  conditionType: string;
  value: number | null;
  channel: string;
  status: "active" | "paused";
  lastTriggered: string;
  triggerCount: number;
}

export interface AlertHistoryItem {
  id: number;
  alertId: number;
  market: string;
  condition: string;
  triggeredAt: string;
  value: string;
}

export const MARKETS: Market[] = [
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
  { symbol: "SOL-USD", name: "Solana" },
  { symbol: "AVAX-USD", name: "Avalanche" },
  { symbol: "MATIC-USD", name: "Polygon" },
  { symbol: "LINK-USD", name: "Chainlink" },
];

export const HORIZONS = ["1D", "7D", "30D", "90D"];

export const CONDITION_TYPES: ConditionType[] = [
  { id: "confidence_above", label: "Confidence above", unit: "%" },
  { id: "confidence_below", label: "Confidence below", unit: "%" },
  { id: "predicted_move_above", label: "Predicted move above", unit: "%" },
  { id: "predicted_move_below", label: "Predicted move below", unit: "%" },
  { id: "direction_change", label: "Direction changes", unit: null },
  { id: "price_exits_range", label: "Price exits predicted range", unit: null },
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 1,
    market: "BTC-USD",
    horizon: "7D",
    condition: "Confidence above 75%",
    conditionType: "confidence_above",
    value: 75,
    channel: "email",
    status: "active",
    lastTriggered: "Dec 21, 2024",
    triggerCount: 8,
  },
  {
    id: 2,
    market: "BTC-USD",
    horizon: "1D",
    condition: "Price exits predicted range",
    conditionType: "price_exits_range",
    value: null,
    channel: "email",
    status: "active",
    lastTriggered: "Never",
    triggerCount: 0,
  },
  {
    id: 3,
    market: "ETH-USD",
    horizon: "7D",
    condition: "Predicted move above 5%",
    conditionType: "predicted_move_above",
    value: 5,
    channel: "email",
    status: "active",
    lastTriggered: "Dec 18, 2024",
    triggerCount: 3,
  },
  {
    id: 4,
    market: "SOL-USD",
    horizon: "7D",
    condition: "Direction changes",
    conditionType: "direction_change",
    value: null,
    channel: "email",
    status: "paused",
    lastTriggered: "Dec 15, 2024",
    triggerCount: 5,
  },
];

export const ALERT_HISTORY: AlertHistoryItem[] = [
  {
    id: 1,
    alertId: 1,
    market: "BTC-USD",
    condition: "Confidence above 75%",
    triggeredAt: "Dec 21, 2024 14:32",
    value: "78%",
  },
  {
    id: 2,
    alertId: 3,
    market: "ETH-USD",
    condition: "Predicted move above 5%",
    triggeredAt: "Dec 18, 2024 09:15",
    value: "+6.2%",
  },
  {
    id: 3,
    alertId: 1,
    market: "BTC-USD",
    condition: "Confidence above 75%",
    triggeredAt: "Dec 14, 2024 11:45",
    value: "82%",
  },
  {
    id: 4,
    alertId: 4,
    market: "SOL-USD",
    condition: "Direction changes",
    triggeredAt: "Dec 15, 2024 16:20",
    value: "↑ → ↓",
  },
  {
    id: 5,
    alertId: 1,
    market: "BTC-USD",
    condition: "Confidence above 75%",
    triggeredAt: "Dec 7, 2024 10:30",
    value: "76%",
  },
];
