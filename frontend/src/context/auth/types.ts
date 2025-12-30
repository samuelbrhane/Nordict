export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  company: string | null;
  timezone: string;
  // Nested objects
  subscription: UserSubscription;
  preferences: UserPreferences;
  // Shortcuts (same as subscription, for convenience)
  effective_plan: string;
  is_trial_active: boolean;
  is_subscription_active: boolean;
  trial_days_remaining: number;
  plan_limits: PlanLimits;
}

export interface Session {
  id: number;
  device: string;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  created_at: string;
  last_active: string;
  last_active_display: string;
  is_current: boolean;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface PlanLimits {
  max_markets: number | null;
  max_alerts: number | null;
  max_sessions: number | null;
  horizons: string[];
  api_access: boolean;
  backtest_days: number | null;
}

export interface RegisterData {
  email: string;
  full_name: string;
  password: string;
  password_confirm: string;
  timezone?: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  company?: string;
  timezone?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface AuthContextType {
  user: User | null;
  tokens: Tokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  changePassword: (data: PasswordChangeData) => Promise<void>;
  getSessions: () => Promise<Session[]>;
  revokeSession: (sessionId: number) => Promise<void>;
  revokeAllSessions: () => Promise<void>;
  deleteAccount: (data: DeleteAccountData) => Promise<void>;
}

export interface DeleteAccountData {
  password: string;
  confirmation: string;
}

export interface NotificationSettings {
  notify_alerts_email: boolean;
  notify_alerts_push: boolean;
  notify_forecast_daily: boolean;
  notify_forecast_significant: boolean;
}

export interface UserSubscription {
  plan: string;
  billing_cycle: "monthly" | "yearly";
  is_trial_active: boolean;
  trial_days_remaining: number;
  is_subscription_active: boolean;
  effective_plan: string;
  plan_limits: Record<string, number>;
  next_billing_date: string | null;
  cancelled_at: string | null;
  is_cancelled: boolean;
  stripe_customer_id: string | null;
  stripe_card_last4: string | null;
  stripe_card_brand: string | null;
  stripe_card_exp_month: number | null;
  stripe_card_exp_year: number | null;
}

export interface UserPreferences {
  default_market: string;
  default_horizon: string;
  notify_alerts_email: boolean;
  notify_alerts_push: boolean;
  notify_forecast_daily: boolean;
  notify_forecast_significant: boolean;
}
