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

export interface DeleteAccountData {
  password: string;
  confirmation: string;
}

export async function deleteAccountApi(
  accessToken: string,
  data: DeleteAccountData
): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/auth/me/delete/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete account");
  }
}

export interface NotificationSettings {
  notify_alerts_email: boolean;
  notify_alerts_push: boolean;
  notify_forecast_daily: boolean;
  notify_forecast_significant: boolean;
}

export async function getNotificationSettingsApi(
  accessToken: string
): Promise<NotificationSettings> {
  const response = await fetch(`${API_URL}/api/v1/auth/me/notifications/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notification settings");
  }

  return response.json();
}

export async function updateNotificationSettingsApi(
  accessToken: string,
  data: Partial<NotificationSettings>
): Promise<NotificationSettings> {
  const response = await fetch(`${API_URL}/api/v1/auth/me/notifications/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update notification settings");
  }

  return response.json();
}

export async function createCheckoutSessionApi(
  accessToken: string,
  plan: string,
  billingCycle: string
): Promise<{ checkout_url: string }> {
  const response = await fetch(
    `${API_URL}/api/v1/auth/billing/create-checkout/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ plan, billing_cycle: billingCycle }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create checkout session");
  }

  return response.json();
}

export async function createPortalSessionApi(
  accessToken: string
): Promise<{ portal_url: string }> {
  const response = await fetch(
    `${API_URL}/api/v1/auth/billing/create-portal/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create portal session");
  }

  return response.json();
}

export async function getUserApi(accessToken: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/v1/auth/me/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export interface ChangePlanResponse {
  message: string;
  change_type: "upgrade" | "downgrade";
  effective: "immediate" | "end_of_period";
  checkout_url?: string;
  next_billing_date?: string;
  effective_date?: string;
}

export async function changePlanApi(
  accessToken: string,
  plan: string,
  billingCycle: string
): Promise<ChangePlanResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/billing/change-plan/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ plan, billing_cycle: billingCycle }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to change plan");
  }

  return response.json();
}

export async function cancelSubscriptionApi(
  accessToken: string
): Promise<{ message: string; access_until: string }> {
  const response = await fetch(`${API_URL}/api/v1/auth/billing/cancel/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to cancel subscription");
  }

  return response.json();
}

export async function reactivateSubscriptionApi(
  accessToken: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/v1/auth/billing/reactivate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to reactivate subscription");
  }

  return response.json();
}
