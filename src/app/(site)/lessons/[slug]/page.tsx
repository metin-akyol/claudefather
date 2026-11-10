import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllLessons, getLesson, getPathContext, getRelatedLessons } from "@/lib/content";
import { MdxContent } from "@/lib/mdx";
import { formatDate } from "@/lib/format";
import { Discussion } from "@/components/discussion";
import { Container, Eyebrow, LessonCard, LevelBadge, NewBadge, TopicTag } from "@/components/ui";
import { githubUrl } from "@/lib/site";

export async function generateStaticParams() {
  return (await getAllLessons()).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  if (!lesson) return {};
  const { meta } = lesson;
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: `/lessons/${slug}` },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.summary,
      publishedTime: meta.published,
      modifiedTime: meta.updated ?? meta.published,
      tags: meta.topics,
    },
  };
}

// Every real lesson is prerendered via generateStaticParams. Unknown slugs
// render the not-found UI; with Cache Components the response status stays
// 200 (the shell has already streamed) and Next.js adds a noindex tag.
export default async function LessonPage({ params }: PageProps<"/lessons/[slug]">) {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  if (!lesson) notFound();

  const { meta } = lesson;
  const [pathCtx, related] = await Promise.all([
    getPathContext(slug),
    getRelatedLessons(meta),
  ]);

  return (
    <article>
      <header className="grain relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute -top-48 left-1/3 h-96 w-[40rem] rounded-full bg-gold/[0.09] blur-3xl" />
        <Container className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-subtle">
            <Link href="/lessons" className="hover:text-fg">Lessons</Link>
            {pathCtx && (
              <>
                <span aria-hidden className="mx-2">/</span>
                <Link href={`/paths/${pathCtx.path.slug}`} className="hover:text-fg">
                  {pathCtx.path.title}
                </Link>
                <span className="ml-2 text-subtle">
                  · {pathCtx.index + 1} of {pathCtx.total}
                </span>
              </>
            )}
          </nav>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {meta.isNew && <NewBadge />}
            {meta.draft && (
              <span className="rounded-full border border-wine-bright/60 px-2 py-0.5 font-mono text-[10px] uppercase text-wine-bright">
                Draft · hidden in production
              </span>
            )}
            {meta.topics.map((t) => (
              <TopicTag key={t} slug={t} />
            ))}
          </div>
          <h1 className="mt-5 max-w-4xl text-balance font-display text-4xl leading-[1.1] tracking-tight text-fg sm:text-5xl lg:text-6xl">
            {meta.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">{meta.summary}</p>
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-subtle">Published</dt>
              <dd className="text-fg"><time dateTime={meta.published}>{formatDate(meta.published)}</time></dd>
            </div>
            {meta.updated && meta.updated !== meta.published && (
              <div>
                <dt className="text-subtle">Updated</dt>
                <dd className="text-fg"><time dateTime={meta.updated}>{formatDate(meta.updated)}</time></dd>
              </div>
            )}
            <div>
              <dt className="text-subtle">Reading time</dt>
              <dd className="text-fg">{meta.readingMinutes} min</dd>
            </div>
            <div>
              <dt className="text-subtle">Level</dt>
              <dd className="pt-0.5"><LevelBadge level={meta.level} /></dd>
            </div>
            {meta.tools.length > 0 && (
              <div>
                <dt className="text-subtle">Tools</dt>
                <dd className="text-fg">{meta.tools.join(", ")}</dd>
              </div>
            )}
          </dl>
        </Container>
      </header>

      <Container className="grid grid-cols-[minmax(0,1fr)] gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="lesson-prose prose prose-lg max-w-none prose-headings:scroll-mt-24 prose-h2:mt-14 prose-h2:text-3xl prose-p:leading-relaxed prose-li:my-1.5 lg:max-w-3xl">
          <MdxContent source={lesson.source} />
        </div>

        {meta.headings.length > 2 && (
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-24">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">On this page</p>
              <ul className="mt-4 space-y-2.5 border-l border-line text-sm">
                {meta.headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted hover:border-gold hover:text-fg">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={`${githubUrl}/edit/main/src/content/lessons/${meta.slug}.mdx`}
                className="mt-8 inline-block text-xs text-subtle hover:text-gold"
              >
                Suggest an edit on GitHub →
              </a>
            </nav>
          </aside>
        )}
      </Container>

      {pathCtx && (pathCtx.prev || pathCtx.next) && (
        <Container>
          <nav aria-label="Path navigation" className="grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
            {pathCtx.prev ? (
              <Link href={`/lessons/${pathCtx.prev.slug}`} className="group rounded-2xl border border-line p-5 transition hover:border-gold/40">
                <span className="text-xs text-subtle">← Previous in {pathCtx.path.title}</span>
                <span className="mt-1 block font-display text-lg text-fg group-hover:text-gold">{pathCtx.prev.title}</span>
              </Link>
            ) : <span />}
            {pathCtx.next && (
              <Link href={`/lessons/${pathCtx.next.slug}`} className="group rounded-2xl border border-line p-5 text-right transition hover:border-gold/40">
                <span className="text-xs text-subtle">Next in {pathCtx.path.title} →</span>
                <span className="mt-1 block font-display text-lg text-fg group-hover:text-gold">{pathCtx.next.title}</span>
              </Link>
            )}
          </nav>
        </Container>
      )}

      <Container className="mt-16 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <section aria-labelledby="discuss-heading" className="lg:max-w-3xl">
          <Eyebrow>Sit down, let’s talk</Eyebrow>
          <h2 id="discuss-heading" className="mt-3 font-display text-3xl text-fg">Discuss this lesson</h2>
          <p className="mt-2 mb-6 text-muted">
            Tried it? Share what worked, what didn’t, or a better prompt. Want something else covered?{" "}
            <Link href="/suggest" className="text-gold underline underline-offset-4">Request a lesson</Link>.
          </p>
          <Discussion term={`lesson/${meta.slug}`} />
        </section>
      </Container>

      {related.length > 0 && (
        <Container className="mt-20">
          <h2 className="font-display text-2xl text-fg">Keep going</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((l) => (
              <LessonCard key={l.slug} lesson={l} />
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
