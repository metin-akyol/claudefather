"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "./nav-links";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <ul className="hidden items-center gap-1 md:flex">
      {navLinks.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm transition ${
                active ? "bg-elevated text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Fallback while the pathname is unknown during prerendering. */
export function StaticDesktopNav() {
  return (
    <ul className="hidden items-center gap-1 md:flex">
      {navLinks.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="rounded-full px-3.5 py-2 text-sm text-muted hover:text-fg">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="flex size-10 items-center justify-center rounded-full border border-line text-fg"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
        </svg>
      </button>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-b border-line bg-bg/95 px-5 pb-6 pt-2 backdrop-blur-xl"
        >
          <ul className="flex flex-col">
            {[...navLinks, { href: "/suggest", label: "Request a lesson" }].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3.5 font-display text-xl text-fg aria-[current=page]:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
