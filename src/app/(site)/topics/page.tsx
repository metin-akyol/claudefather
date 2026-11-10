import type { Metadata } from "next";
import Link from "next/link";
import { topics, type TopicSlug } from "@/content/topics";
import { getAllLessons } from "@/lib/content";
import { Container, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Topics",
  description: "Browse lessons by topic.",
  alternates: { canonical: "/topics" },
};

export default async function TopicsPage() {
  const lessons = await getAllLessons();
  return (
    <>
      <PageHero eyebrow="The territory" title="Topics" description="Every lesson is tagged with one or more topics." />
      <Container className="py-14">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(topics) as TopicSlug[]).map((slug) => {
            const inTopic = lessons.filter((l) => l.topics.includes(slug));
            return (
              <li key={slug}>
                <Link href={`/topics/${slug}`} className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition hover:border-gold/40 hover:bg-elevated">
                  <h2 className="font-display text-2xl text-fg">{topics[slug].title}</h2>
                  <p className="mt-2 text-sm text-muted">{topics[slug].description}</p>
                  <p className="mt-auto pt-6 text-xs text-subtle">
                    {inTopic.length} {inTopic.length === 1 ? "lesson" : "lessons"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </>
  );
}
