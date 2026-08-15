/**
 * Cookie utilities for managing the auth token cookie.
 * The proxy (proxy.ts) reads this cookie to gate access.
 */

const AUTH_COOKIE_NAME = "auth-token";
const AUTH_COOKIE_MAX_AGE_DAYS = 30;

export function setAuthTokenCookie(token: string): void {
  const maxAge = AUTH_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60; // 30 days in seconds
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function removeAuthTokenCookie(): void {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

export function getAuthTokenFromCookie(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + AUTH_COOKIE_NAME + "=([^;]*)"));
  return match ? match[2] : null;
}
