import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, safeEqual, tokenFor } from "@/lib/auth";

/**
 * Team-only gate. Every page requires the shared password (SITE_PASSWORD).
 * - In production, a missing SITE_PASSWORD fails closed (the site stays locked).
 * - In local development, a missing SITE_PASSWORD lets you straight in.
 */
export function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;

  if (!password) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    return new NextResponse(
      "The Claudefather is locked: SITE_PASSWORD is not configured for this deployment.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (cookie && safeEqual(cookie, tokenFor(password))) return NextResponse.next();

  const login = new URL("/login", request.url);
  const next = request.nextUrl.pathname + request.nextUrl.search;
  if (next !== "/") login.searchParams.set("next", next);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    // Everything except the login flow, Next internals, and public static files.
    "/((?!login|api/login|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|.*\\.(?:svg|png|jpg|jpeg|webp|ico|woff2?)$).*)",
  ],
};
