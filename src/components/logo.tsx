/** Fedora mark. Kept as inline SVG so it inherits colour and stays crisp. */
export function FedoraMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <path
        d="M19.5 37.5 21.6 24.6c.9-5.2 4.9-7.4 8.6-5l1.8 1.3 1.8-1.3c3.7-2.4 7.7-.2 8.6 5l2.1 12.9Z"
        fill="currentColor"
      />
      <path d="M20.6 31.2h22.8l.9 5.6H19.7Z" fill="#0a0908" opacity=".55" />
      <ellipse cx="32" cy="40.2" rx="24" ry="5.6" fill="currentColor" />
      <ellipse cx="32" cy="38.6" rx="13" ry="2" fill="#0a0908" opacity=".35" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <FedoraMark className="size-8 text-gold" />
      <span className="font-display text-[1.15rem] leading-none tracking-tight text-fg">
        <span className="mr-1 align-[2px] text-[0.62rem] font-sans uppercase tracking-[0.28em] text-muted">
          The
        </span>
        Claudefather
      </span>
    </span>
  );
}
