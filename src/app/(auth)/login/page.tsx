import type { Metadata } from "next";
import { Suspense } from "react";
import { FedoraMark } from "@/components/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main id="main" className="grain relative flex flex-1 items-center justify-center overflow-hidden px-5 py-20">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="animate-rise w-full max-w-sm">
        <FedoraMark className="mx-auto size-14 text-gold" />
        <h1 className="mt-6 text-center font-display text-4xl tracking-tight text-fg">The Claudefather</h1>
        <p className="mt-3 text-center text-muted">Members of the family only.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
