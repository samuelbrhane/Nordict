"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  User,
  Tokens,
  Session,
  RegisterData,
  ProfileUpdateData,
  PasswordChangeData,
  AuthContextType,
  DeleteAccountData,
} from "./types";

import { isTokenExpired, getTokenExpiry, getUserTimezone } from "./utils";

import {
  loginApi,
  registerApi,
  logoutApi,
  refreshTokenApi,
  updateProfileApi,
  changePasswordApi,
  requestPasswordResetApi,
  getSessionsApi,
  revokeSessionApi,
  revokeAllSessionsApi,
  deleteAccountApi,
  getUserApi,
} from "./api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Clear auth state
  const clearAuth = useCallback(() => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
  }, []);

  // Refresh token
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const storedTokens = localStorage.getItem("tokens");
    if (!storedTokens) return false;

    const { refresh } = JSON.parse(storedTokens);
    if (!refresh || isTokenExpired(refresh)) {
      clearAuth();
      return false;
    }

    try {
      const data = await refreshTokenApi(refresh);
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

      if (!isTokenExpired(parsedTokens.access)) {
        setTokens(parsedTokens);
        setUser(parsedUser);
        setIsLoading(false);
        return;
      }

      if (!isTokenExpired(parsedTokens.refresh)) {
        const refreshed = await refreshToken();
        if (refreshed) {
          setUser(parsedUser);
        }
      } else {
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

  // Persist tokens
  useEffect(() => {
    if (tokens) {
      localStorage.setItem("tokens", JSON.stringify(tokens));
    }
  }, [tokens]);

  // Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // Auth actions
  const login = async (email: string, password: string) => {
    const timezone = getUserTimezone();
    const data = await loginApi(email, password, timezone);
    setUser(data.user);
    setTokens(data.tokens);
  };

  const register = async (data: RegisterData) => {
    const result = await registerApi(data);
    setUser(result.user);
    setTokens(result.tokens);
  };

  const logout = async () => {
    if (tokens?.refresh) {
      try {
        await logoutApi(tokens.access, tokens.refresh);
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    clearAuth();
    router.push("/login");
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!tokens?.access) throw new Error("Not authenticated");
    const updatedUser = await updateProfileApi(tokens.access, data);
    setUser(updatedUser);
  };

  const changePassword = async (data: PasswordChangeData) => {
    if (!tokens?.access) throw new Error("Not authenticated");
    await changePasswordApi(tokens.access, data);
  };

  const requestPasswordReset = async (email: string) => {
    await requestPasswordResetApi(email);
  };

  const getSessions = async (): Promise<Session[]> => {
    if (!tokens?.access) throw new Error("Not authenticated");
    return getSessionsApi(tokens.access);
  };

  const revokeSession = async (sessionId: number) => {
    if (!tokens?.access) throw new Error("Not authenticated");
    await revokeSessionApi(tokens.access, sessionId);
  };

  const revokeAllSessions = async () => {
    if (!tokens?.access) throw new Error("Not authenticated");
    await revokeAllSessionsApi(tokens.access);
  };

  const deleteAccount = async (data: DeleteAccountData) => {
    if (!tokens?.access) throw new Error("Not authenticated");
    await deleteAccountApi(tokens.access, data);
    clearAuth();
    router.push("/login");
  };

  const refreshUser = async () => {
    if (!tokens?.access) return;

    try {
      const updatedUser = await getUserApi(tokens.access);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to refresh user:", err);
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
        deleteAccount,
        refreshUser,
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
