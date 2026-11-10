import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./code-block";

const calloutStyles = {
  tip: { label: "Tip", cls: "border-gold/40 bg-gold/[0.06]", dot: "bg-gold" },
  warning: { label: "Watch out", cls: "border-wine/60 bg-wine/[0.12]", dot: "bg-wine-bright" },
  when: { label: "When to use this", cls: "border-sage/40 bg-sage/[0.07]", dot: "bg-sage" },
  note: { label: "Note", cls: "border-line bg-surface", dot: "bg-muted" },
} as const;

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof calloutStyles;
  title?: string;
  children: ReactNode;
}) {
  const s = calloutStyles[type];
  return (
    <aside className={`not-prose my-7 rounded-xl border px-5 py-4 ${s.cls}`}>
      <p className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg/80">
        <span className={`size-1.5 rounded-full ${s.dot}`} aria-hidden />
        {title ?? s.label}
      </p>
      <div className="callout-body text-[15px] leading-relaxed text-fg/85">{children}</div>
    </aside>
  );
}

/** A reusable prompt. Wrap a ```text fenced block in it. */
export function Prompt({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="prompt-card not-prose my-8 overflow-hidden rounded-xl border border-gold/30 bg-gradient-to-b from-gold/[0.07] to-transparent">
      <header className="flex items-center justify-between border-b border-gold/20 px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">Reusable prompt</p>
        <p className="text-sm font-medium text-fg">{title}</p>
      </header>
      <div className="px-1 pb-1">{children}</div>
    </section>
  );
}

/** A hands-on exercise readers can do in their own repo. */
export function Exercise({ title = "Try it", children }: { title?: string; children: ReactNode }) {
  return (
    <section className="not-prose my-10 rounded-2xl border border-line bg-surface p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">Exercise</p>
      <h3 className="mt-1 font-display text-2xl text-fg">{title}</h3>
      <div className="exercise-body mt-3 text-[15px] leading-relaxed text-fg/85">{children}</div>
    </section>
  );
}

function A({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noreferrer noopener" {...props} />;
}

function Table(props: ComponentProps<"table">) {
  return (
    <div className="my-6 overflow-x-auto">
      <table {...props} />
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  a: A,
  pre: CodeBlock,
  table: Table,
  Callout,
  Prompt,
  Exercise,
};
