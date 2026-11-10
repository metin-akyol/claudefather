import type { Metadata } from "next";
import Link from "next/link";
import { getChangeLog, type ChangeEvent } from "@/lib/content";
import { formatDate, formatMonth } from "@/lib/format";
import { Container, PageHero, TopicTag } from "@/components/ui";

export const metadata: Metadata = {
  title: "What’s new",
  description: "Every new and updated lesson, newest first.",
  alternates: { canonical: "/whats-new" },
};

export default async function WhatsNewPage() {
  const events = await getChangeLog();
  const byMonth = new Map<string, ChangeEvent[]>();
  for (const e of events) {
    const key = e.date.slice(0, 7);
    byMonth.set(key, [...(byMonth.get(key) ?? []), e]);
  }

  return (
    <>
      <PageHero
        eyebrow="Word on the street"
        title="What’s new"
        description="New lessons and meaningful revisions, newest first. AI tools move quickly, so we update lessons when the advice changes."
      />
      <Container className="py-14">
        <div className="space-y-16">
          {[...byMonth.entries()].map(([month, items]) => (
            <section key={month} aria-labelledby={`m-${month}`} className="grid gap-6 md:grid-cols-[12rem_1fr]">
              <h2 id={`m-${month}`} className="font-display text-2xl italic text-gold md:sticky md:top-24 md:self-start">
                {formatMonth(`${month}-01`)}
              </h2>
              <ol className="space-y-4">
                {items.map((e) => (
                  <li key={`${e.kind}-${e.lesson.slug}`} className="rounded-2xl border border-line bg-surface p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-mono uppercase tracking-wider ${
                          e.kind === "published" ? "bg-gold/15 text-gold" : "bg-sage/15 text-sage"
                        }`}
                      >
                        {e.kind === "published" ? "New lesson" : "Updated"}
                      </span>
                      <time dateTime={e.date} className="text-subtle">{formatDate(e.date)}</time>
                    </div>
                    <h3 className="mt-3 font-display text-xl text-fg">
                      <Link href={`/lessons/${e.lesson.slug}`} className="hover:text-gold-bright">{e.lesson.title}</Link>
                    </h3>
                    <p className="mt-1.5 text-sm text-muted">{e.note ?? e.lesson.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {e.lesson.topics.map((t) => <TopicTag key={t} slug={t} />)}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
