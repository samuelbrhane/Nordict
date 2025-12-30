import {
  User,
  Tokens,
  Session,
  RegisterData,
  ProfileUpdateData,
  PasswordChangeData,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginApi(
  email: string,
  password: string,
  timezone: string
): Promise<{ user: User; tokens: Tokens }> {
  const response = await fetch(`${API_URL}/api/v1/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, timezone }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }

  return response.json();
}

export async function registerApi(
  data: RegisterData
): Promise<{ user: User; tokens: Tokens }> {
  const response = await fetch(`${API_URL}/api/v1/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  return response.json();
}

export async function logoutApi(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  await fetch(`${API_URL}/api/v1/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
}

export async function refreshTokenApi(
  refreshToken: string
): Promise<{ access: string; refresh?: string }> {
  const response = await fetch(`${API_URL}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  return response.json();
}

export async function updateProfileApi(
  accessToken: string,
  data: ProfileUpdateData
): Promise<User> {
  const response = await fetch(`${API_URL}/api/v1/auth/me/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update profile");
  }

  return response.json();
}

export async function changePasswordApi(
  accessToken: string,
  data: PasswordChangeData
): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/auth/password-change/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to change password");
  }
}

export async function requestPasswordResetApi(email: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/auth/password-reset/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }
}

export async function getSessionsApi(accessToken: string): Promise<Session[]> {
  const response = await fetch(`${API_URL}/api/v1/auth/sessions/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }

  return response.json();
}

export async function revokeSessionApi(
  accessToken: string,
  sessionId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/v1/auth/sessions/${sessionId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to revoke session");
  }
}

export async function revokeAllSessionsApi(accessToken: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/auth/sessions/revoke-all/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to revoke sessions");
  }
}
