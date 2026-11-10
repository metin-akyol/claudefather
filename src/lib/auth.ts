import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE = "cf_auth";
export const AUTH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * The cookie stores an HMAC of the password rather than the password itself.
 * Changing SITE_PASSWORD invalidates every existing session.
 */
export function tokenFor(password: string): string {
  return createHmac("sha256", password).update("claudefather-session-v1").digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Only allow same-site relative redirects after login. */
export function safeNext(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}
