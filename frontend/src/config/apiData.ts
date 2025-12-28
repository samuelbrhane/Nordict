export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsed: string | null;
  permissions: string[];
  status: "active" | "revoked";
}

export interface Permission {
  id: string;
  label: string;
  description: string;
}

export const PERMISSIONS: Permission[] = [
  {
    id: "forecasts:read",
    label: "Read Forecasts",
    description: "Access forecast data",
  },
  {
    id: "alerts:read",
    label: "Read Alerts",
    description: "View alert configurations",
  },
  {
    id: "alerts:write",
    label: "Manage Alerts",
    description: "Create, update, delete alerts",
  },
  {
    id: "performance:read",
    label: "Read Performance",
    description: "Access performance metrics",
  },
];

export const INITIAL_KEYS: ApiKey[] = [
  {
    id: "1",
    name: "Production App",
    keyPrefix: "nrd_live_7x8k",
    createdAt: "Dec 1, 2024",
    lastUsed: "2 hours ago",
    permissions: ["forecasts:read", "alerts:read", "alerts:write"],
    status: "active",
  },
  {
    id: "2",
    name: "Development",
    keyPrefix: "nrd_test_3m2n",
    createdAt: "Nov 15, 2024",
    lastUsed: "3 days ago",
    permissions: ["forecasts:read"],
    status: "active",
  },
  {
    id: "3",
    name: "Old Integration",
    keyPrefix: "nrd_live_9p4q",
    createdAt: "Oct 1, 2024",
    lastUsed: "Nov 20, 2024",
    permissions: ["forecasts:read", "alerts:read"],
    status: "revoked",
  },
];
