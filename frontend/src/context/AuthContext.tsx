"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  company: string | null;
  timezone: string;
  effective_plan: string;
  is_trial_active: boolean;
  trial_days_remaining: number;
  plan_limits: PlanLimits;
  default_market: string;
  default_horizon: string;
  is_subscription_active: boolean;
}
interface Session {
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

interface Tokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  tokens: Tokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  changePassword: (data: PasswordChangeData) => Promise<void>;
  getSessions: () => Promise<Session[]>;
  revokeSession: (sessionId: number) => Promise<void>;
  revokeAllSessions: () => Promise<void>;
}

interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  company?: string;
  timezone?: string;
}

interface RegisterData {
  email: string;
  full_name: string;
  password: string;
  password_confirm: string;
  timezone?: string;
}

interface PasswordChangeData {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}

interface PlanLimits {
  max_markets: number | null;
  max_alerts: number | null;
  max_sessions: number | null;
  horizons: string[];
  api_access: boolean;
  backtest_days: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to check if token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch {
    return true;
  }
}

// Helper to get time until expiry
function getTokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 - Date.now();
  } catch {
    return 0;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const clearAuth = useCallback(() => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const storedTokens = localStorage.getItem("tokens");
    if (!storedTokens) return false;

    const { refresh } = JSON.parse(storedTokens);
    if (!refresh || isTokenExpired(refresh)) {
      clearAuth();
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) {
        clearAuth();
        return false;
      }

      const data = await response.json();
      const newTokens = {
        access: data.access,
        refresh: data.refresh || refresh,
      };

      setTokens(newTokens);
      localStorage.setItem("tokens", JSON.stringify(newTokens));
      return true;
    } catch {
      clearAuth();
      return false;
    }
  }, [clearAuth]);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedTokens = localStorage.getItem("tokens");
      const storedUser = localStorage.getItem("user");

      if (!storedTokens || !storedUser) {
        setIsLoading(false);
        return;
      }

      const parsedTokens: Tokens = JSON.parse(storedTokens);
      const parsedUser: User = JSON.parse(storedUser);

      // Check if access token is still valid
      if (!isTokenExpired(parsedTokens.access)) {
        setTokens(parsedTokens);
        setUser(parsedUser);
        setIsLoading(false);
        return;
      }

      // Access token expired, try refresh
      if (!isTokenExpired(parsedTokens.refresh)) {
        const refreshed = await refreshToken();
        if (refreshed) {
          setUser(parsedUser);
        }
      } else {
        // Both tokens expired
        clearAuth();
      }

      setIsLoading(false);
    };

    initAuth();
  }, [refreshToken, clearAuth]);

  // Auto-refresh access token before it expires
  useEffect(() => {
    if (!tokens?.access) return;

    const timeUntilExpiry = getTokenExpiry(tokens.access);
    // Refresh 5 minutes before expiry
    const refreshTime = timeUntilExpiry - 5 * 60 * 1000;

    if (refreshTime <= 0) {
      refreshToken();
      return;
    }

    const timeoutId = setTimeout(() => {
      refreshToken();
    }, refreshTime);

    return () => clearTimeout(timeoutId);
  }, [tokens?.access, refreshToken]);

  // Save tokens to localStorage when they change
  useEffect(() => {
    if (tokens) {
      localStorage.setItem("tokens", JSON.stringify(tokens));
    }
  }, [tokens]);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await fetch(`${API_URL}/api/v1/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, timezone: userTimezone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();
    setUser(data.user);
    setTokens(data.tokens);
  };

  const register = async (data: RegisterData) => {
    const response = await fetch(`${API_URL}/api/v1/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const result = await response.json();
    setUser(result.user);
    setTokens(result.tokens);
  };

  const logout = async () => {
    if (tokens?.refresh) {
      try {
        await fetch(`${API_URL}/api/v1/auth/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.access}`,
          },
          body: JSON.stringify({ refresh: tokens.refresh }),
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    clearAuth();
    router.push("/login");
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!tokens?.access) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}/api/v1/auth/me/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.access}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update profile");
    }

    const updatedUser = await response.json();
    setUser(updatedUser);
  };

  const requestPasswordReset = async (email: string) => {
    const response = await fetch(`${API_URL}/api/v1/auth/password-reset/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Request failed");
    }
  };

  const changePassword = async (data: PasswordChangeData) => {
    if (!tokens?.access) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}/api/v1/auth/password-change/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.access}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to change password");
    }
  };

  const getSessions = async (): Promise<Session[]> => {
    if (!tokens?.access) throw new Error("Not authenticated");

    const response = await fetch(`${API_URL}/api/v1/auth/sessions/`, {
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sessions");
    }

    return response.json();
  };

  const revokeSession = async (sessionId: number) => {
    if (!tokens?.access) throw new Error("Not authenticated");

    const response = await fetch(
      `${API_URL}/api/v1/auth/sessions/${sessionId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to revoke session");
    }
  };

  const revokeAllSessions = async () => {
    if (!tokens?.access) throw new Error("Not authenticated");

    const response = await fetch(
      `${API_URL}/api/v1/auth/sessions/revoke-all/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to revoke sessions");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isLoading,
        isAuthenticated: !!tokens?.access && !isTokenExpired(tokens.access),
        login,
        register,
        logout,
        refreshToken,
        requestPasswordReset,
        updateProfile,
        changePassword,
        getSessions,
        revokeSession,
        revokeAllSessions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
