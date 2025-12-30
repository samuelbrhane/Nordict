export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch {
    return true;
  }
}

export function getTokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 - Date.now();
  } catch {
    return 0;
  }
}

export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
