import Link from "next/link";
import { Suspense } from "react";
import { Wordmark } from "./logo";
import { DesktopNav, MobileNav, StaticDesktopNav } from "./site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" aria-label="The Claudefather, home" className="shrink-0">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-3">
          <Suspense fallback={<StaticDesktopNav />}>
            <DesktopNav />
          </Suspense>
          <Link
            href="/suggest"
            className="hidden rounded-full border border-gold/40 px-4 py-2 text-sm text-gold transition hover:border-gold hover:bg-gold hover:text-bg md:inline-block"
          >
            Request a lesson
          </Link>
          <Suspense>
            <MobileNav />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
