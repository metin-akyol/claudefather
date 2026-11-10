import type { Metadata } from "next";
import Link from "next/link";
import { paths } from "@/content/paths";
import { getPathLessons } from "@/lib/content";
import { Container, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Learning paths",
  description: "Ordered sequences of lessons, from first prompts to automated pipelines.",
  alternates: { canonical: "/paths" },
};

export default async function PathsPage() {
  const withLessons = await Promise.all(paths.map(async (p) => ({ p, lessons: await getPathLessons(p) })));
  return (
    <>
      <PageHero
        eyebrow="Rise through the ranks"
        title="Learning paths"
        description="New here? Go in order. Already comfortable? Jump to the rank that matches the work in front of you."
      />
      <Container className="space-y-6 py-14">
        {withLessons.map(({ p, lessons }, i) => {
          const minutes = lessons.reduce((n, l) => n + l.readingMinutes, 0);
          return (
            <section key={p.slug} aria-labelledby={`path-${p.slug}`} className="grid gap-8 rounded-3xl border border-line bg-surface p-7 sm:p-10 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                  Path {i + 1} · {p.rank}
                </p>
                <h2 id={`path-${p.slug}`} className="mt-3 font-display text-3xl text-fg">{p.title}</h2>
                <p className="mt-3 text-muted">{p.description}</p>
                <p className="mt-4 text-sm text-subtle">
                  {lessons.length} lessons · about {minutes} min of reading
                </p>
                <Link href={`/paths/${p.slug}`} className="mt-6 inline-block rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-bg hover:bg-gold-bright">
                  Open path
                </Link>
              </div>
              <ol className="space-y-2">
                {lessons.map((l, n) => (
                  <li key={l.slug}>
                    <Link href={`/lessons/${l.slug}`} className="flex items-baseline gap-4 rounded-xl px-4 py-3 transition hover:bg-elevated">
                      <span className="font-display italic text-gold">{n + 1}</span>
                      <span className="text-fg">{l.title}</span>
                      <span className="ml-auto shrink-0 text-xs text-subtle">{l.readingMinutes} min</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </Container>
    </>
  );
}
