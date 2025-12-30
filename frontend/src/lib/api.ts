const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private getTokens() {
    if (typeof window === "undefined") return null;
    const tokens = localStorage.getItem("tokens");
    return tokens ? JSON.parse(tokens) : null;
  }

  private setTokens(tokens: { access: string; refresh: string }) {
    localStorage.setItem("tokens", JSON.stringify(tokens));
  }

  private clearTokens() {
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
  }

  private async refreshToken(): Promise<boolean> {
    const tokens = this.getTokens();
    if (!tokens?.refresh) return false;

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: tokens.refresh }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      this.setTokens({
        access: data.access,
        refresh: data.refresh || tokens.refresh,
      });
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const tokens = this.getTokens();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (tokens?.access) {
      (headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${tokens.access}`;
    }

    let response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // If 401, try to refresh token and retry
    if (response.status === 401 && tokens?.refresh) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        const newTokens = this.getTokens();
        (headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${newTokens.access}`;
        response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
        });
      } else {
        window.location.href = "/login";
        throw new Error("Session expired");
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || error.error || "Request failed");
    }

    return response.json();
  }

  // Convenience methods
  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient();
