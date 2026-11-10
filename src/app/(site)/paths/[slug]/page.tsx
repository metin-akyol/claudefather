import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { paths } from "@/content/paths";
import { getPath, getPathLessons } from "@/lib/content";
import { Container, LevelBadge, PageHero } from "@/components/ui";

export function generateStaticParams() {
  return paths.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/paths/[slug]">): Promise<Metadata> {
  const p = getPath((await params).slug);
  return p
    ? { title: `${p.title} path`, description: p.description, alternates: { canonical: `/paths/${p.slug}` } }
    : {};
}

export default async function PathPage({ params }: PageProps<"/paths/[slug]">) {
  const p = getPath((await params).slug);
  if (!p) notFound();
  const lessons = await getPathLessons(p);

  return (
    <>
      <PageHero eyebrow={`Learning path · ${p.rank}`} title={p.title} description={p.description} />
      <Container className="py-14">
        <ol className="relative space-y-4 border-l border-line pl-8 sm:pl-12">
          {lessons.map((l, i) => (
            <li key={l.slug} className="relative">
              <span className="absolute -left-[2.6rem] top-6 flex size-8 items-center justify-center rounded-full border border-gold/50 bg-bg font-display text-sm italic text-gold sm:-left-[3.6rem]">
                {i + 1}
              </span>
              <Link href={`/lessons/${l.slug}`} className="group block rounded-2xl border border-line bg-surface p-6 transition hover:border-gold/40 hover:bg-elevated">
                <h2 className="font-display text-2xl text-fg group-hover:text-gold-bright">{l.title}</h2>
                <p className="mt-2 text-muted">{l.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-subtle">
                  <span>{l.readingMinutes} min read</span>
                  <LevelBadge level={l.level} />
                  {l.promptCount > 0 && <span>{l.promptCount} reusable {l.promptCount === 1 ? "prompt" : "prompts"}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </>
  );
}
