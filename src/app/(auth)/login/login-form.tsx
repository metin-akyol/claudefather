"use client";

import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const params = useSearchParams();
  const error = params.get("error") === "1";
  const next = params.get("next") ?? "/";

  return (
    <form action="/api/login" method="post" className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="block text-sm text-muted">
          Team password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          aria-invalid={error || undefined}
          aria-describedby={error ? "password-error" : undefined}
          className="mt-2 w-full rounded-xl border border-line-strong bg-bg px-4 py-3 text-fg focus:border-gold focus:outline-none"
        />
        {error && (
          <p id="password-error" role="alert" className="mt-2 text-sm text-wine-bright">
            That’s not the password. Ask someone in the family.
          </p>
        )}
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-gold px-4 py-3 font-medium text-bg transition hover:bg-gold-bright"
      >
        Come in
      </button>
    </form>
  );
}
