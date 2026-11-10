import Link from "next/link";
import type { ReactNode } from "react";
import { topics, type TopicSlug } from "@/content/topics";
import { levelLabel, type Level, type LessonMeta } from "@/lib/lesson-types";
import { formatDate } from "@/lib/format";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.22em] text-gold ${className}`}>{children}</p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className="mt-3 font-display text-3xl tracking-tight text-fg sm:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-3 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-bright">
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
    </Link>
  );
}

export function TopicTag({ slug, linked = true }: { slug: TopicSlug; linked?: boolean }) {
  const cls =
    "inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-xs text-muted transition";
  if (!linked) return <span className={cls}>{topics[slug].title}</span>;
  return (
    <Link href={`/topics/${slug}`} className={`${cls} relative z-10 hover:border-gold/50 hover:text-fg`}>
      {topics[slug].title}
    </Link>
  );
}

const levelDots: Record<Level, number> = { foundation: 1, intermediate: 2, advanced: 3 };

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span key={n} className={`size-1.5 rounded-full ${n <= levelDots[level] ? "bg-gold" : "bg-line-strong"}`} />
        ))}
      </span>
      {levelLabel[level]}
    </span>
  );
}

export function NewBadge() {
  return (
    <span className="rounded-full bg-wine px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg">
      New
    </span>
  );
}

export function LessonMetaLine({ lesson }: { lesson: LessonMeta }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle">
      <time dateTime={lesson.published}>{formatDate(lesson.published)}</time>
      <span aria-hidden>·</span>
      <span>{lesson.readingMinutes} min read</span>
      <span aria-hidden>·</span>
      <LevelBadge level={lesson.level} />
    </div>
  );
}

/** Whole card is clickable via a stretched link; topic tags stay independently focusable. */
export function LessonCard({ lesson, index }: { lesson: LessonMeta; index?: number }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-elevated">
      <div className="mb-4 flex items-center justify-between gap-3">
        {index !== undefined ? (
          <span className="font-display text-sm italic text-gold">No. {String(index + 1).padStart(2, "0")}</span>
        ) : (
          <span className="text-xs text-subtle">{lesson.tools.slice(0, 2).join(" · ")}</span>
        )}
        <span className="flex gap-1.5">
          {lesson.draft && (
            <span className="rounded-full border border-wine-bright/60 px-2 py-0.5 font-mono text-[10px] uppercase text-wine-bright">
              Draft
            </span>
          )}
          {lesson.isNew && <NewBadge />}
        </span>
      </div>
      <h3 className="font-display text-xl leading-snug tracking-tight text-fg">
        <Link href={`/lessons/${lesson.slug}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none group-has-[a:focus-visible]:underline">
          {lesson.title}
        </Link>
      </h3>
      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted">{lesson.summary}</p>
      <div className="mt-auto pt-5">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {lesson.topics.map((t) => (
            <TopicTag key={t} slug={t} />
          ))}
        </div>
        <LessonMetaLine lesson={lesson} />
      </div>
    </article>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
      />
      <Container className="py-16 sm:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl tracking-tight text-fg sm:text-5xl">
          {title}
        </h1>
        {description && <div className="mt-4 max-w-2xl text-lg text-muted">{description}</div>}
        {children}
      </Container>
    </section>
  );
}
