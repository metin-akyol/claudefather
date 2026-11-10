"use client";

import { useState } from "react";

export function CopyButton({ getText, label = "Copy" }: { getText: () => string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable (e.g. insecure context) — fail quietly */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-line bg-elevated/90 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted backdrop-blur transition hover:border-gold/50 hover:text-gold focus-visible:opacity-100"
      aria-label={copied ? "Copied to clipboard" : `${label} code to clipboard`}
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
