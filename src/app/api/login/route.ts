import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_MAX_AGE, safeEqual, safeNext, tokenFor } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const next = safeNext(form.get("next"));
  const attempt = String(form.get("password") ?? "");
  const password = process.env.SITE_PASSWORD;

  if (!password || !safeEqual(tokenFor(attempt), tokenFor(password))) {
    const back = new URL("/login", request.url);
    back.searchParams.set("error", "1");
    if (next !== "/") back.searchParams.set("next", next);
    return NextResponse.redirect(back, 303);
  }

  const res = NextResponse.redirect(new URL(next, request.url), 303);
  res.cookies.set(AUTH_COOKIE, tokenFor(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_MAX_AGE,
  });
  return res;
}
