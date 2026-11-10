import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { topics, type TopicSlug } from "@/content/topics";
import { getLessonsByTopic } from "@/lib/content";
import { Container, LessonCard, PageHero } from "@/components/ui";

const isTopic = (s: string): s is TopicSlug => s in topics;

export function generateStaticParams() {
  return Object.keys(topics).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/topics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isTopic(slug)) return {};
  return { title: topics[slug].title, description: topics[slug].description, alternates: { canonical: `/topics/${slug}` } };
}

export default async function TopicPage({ params }: PageProps<"/topics/[slug]">) {
  const { slug } = await params;
  if (!isTopic(slug)) notFound();
  const lessons = await getLessonsByTopic(slug);

  return (
    <>
      <PageHero eyebrow="Topic" title={topics[slug].title} description={topics[slug].description} />
      <Container className="py-14">
        {lessons.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((l) => (
              <LessonCard key={l.slug} lesson={l} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line-strong p-10 text-center">
            <p className="font-display text-xl text-fg">No lessons here yet.</p>
            <p className="mt-2 text-sm text-muted">
              Want one? <Link href="/suggest" className="text-gold underline underline-offset-4">Request it</Link>.
            </p>
          </div>
        )}
      </Container>
    </>
  );
}
