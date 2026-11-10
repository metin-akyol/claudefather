import Link from "next/link";
import { paths } from "@/content/paths";
import { topics, type TopicSlug } from "@/content/topics";
import { getAllLessons } from "@/lib/content";
import { ArrowLink, Container, Eyebrow, LessonCard, SectionHeader } from "@/components/ui";
import { FedoraMark } from "@/components/logo";

const rules = [
  ["Context before code", "Show it the files, the constraints, and what done looks like."],
  ["Plan before you edit", "Agree on the approach before a single line changes."],
  ["Verify, don’t trust", "Tests, types, and a real run. Not “looks right to me.”"],
  ["Small jobs, clean exits", "One task per session. Commit, clear, move on."],
  ["Nobody grades their own homework", "Fresh eyes review the diff, whether human or a new session."],
] as const;

export default async function HomePage() {
  const lessons = await getAllLessons();
  const latest = lessons.slice(0, 3);
  const featured = lessons.filter((l) => l.featured).slice(0, 3);
  const promptCount = lessons.reduce((n, l) => n + l.promptCount, 0);
  const topicCounts = Object.keys(topics).map((slug) => ({
    slug: slug as TopicSlug,
    count: lessons.filter((l) => l.topics.includes(slug as TopicSlug)).length,
  }));

  const stats = [
    [lessons.length, "lessons"],
    [promptCount, "reusable prompts"],
    [paths.length, "learning paths"],
    [Object.keys(topics).length, "topics"],
  ] as const;

  return (
    <>
      {/* Hero */}
      <section className="grain relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-56 left-[8%] h-[34rem] w-[34rem] rounded-full bg-gold/[0.12] blur-[120px]" />
          <div className="absolute -bottom-40 right-[2%] h-[26rem] w-[26rem] rounded-full bg-wine/30 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(237_225_205/0.035)_1px,transparent_1px)] bg-[size:88px_100%] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        </div>

        <Container className="grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-[1.25fr_1fr]">
          <div className="animate-rise">
            <Eyebrow>The family business · AI-assisted engineering</Eyebrow>
            <h1 className="mt-6 text-balance font-display text-5xl leading-[1.04] tracking-tight text-fg sm:text-6xl lg:text-7xl">
              Make Claude an offer it{" "}
              <em className="bg-gradient-to-r from-gold-bright to-gold bg-clip-text pr-1 text-transparent">
                can’t refuse.
              </em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Short, practical lessons on building software with Claude and the wider AI toolbox:
              prompts you can copy, workflows you can try this afternoon, and notes on when each
              one is worth it.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/paths/foundations"
                className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-bg shadow-[0_0_40px_-8px] shadow-gold/60 transition hover:bg-gold-bright"
              >
                Start with Foundations
              </Link>
              <Link
                href="/lessons"
                className="rounded-full border border-line-strong px-6 py-3 text-sm text-fg transition hover:border-gold/60 hover:text-gold"
              >
                Browse all lessons
              </Link>
            </div>
            <dl className="mt-14 grid max-w-xl grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
              {stats.map(([n, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <span className="block font-display text-3xl text-fg">{n}</span>
                    <span className="text-xs text-subtle">{label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The rules card */}
          <div className="animate-rise relative [animation-delay:150ms]">
            <div aria-hidden className="absolute -inset-px rounded-[1.4rem] bg-gradient-to-b from-gold/40 via-line to-transparent" />
            <div className="relative rounded-[1.35rem] bg-surface/95 p-7 backdrop-blur sm:p-8">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  The rules of the family
                </p>
                <FedoraMark className="size-7 text-gold/80" />
              </div>
              <ol className="mt-6 space-y-5">
                {rules.map(([title, body], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="font-display text-lg italic text-gold">{["I", "II", "III", "IV", "V"][i]}</span>
                    <div>
                      <p className="font-medium text-fg">{title}</p>
                      <p className="mt-0.5 text-sm text-muted">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* What's new */}
      <section aria-labelledby="new-heading" className="py-20">
        <Container>
          <SectionHeader
            id="new-heading"
            eyebrow="Word on the street"
            title="What’s new"
            description="The latest lessons and updates. A new one lands most weeks."
            action={<ArrowLink href="/whats-new">Full changelog</ArrowLink>}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {latest.map((l) => (
              <LessonCard key={l.slug} lesson={l} />
            ))}
          </div>
        </Container>
      </section>

      {/* Paths */}
      <section aria-labelledby="paths-heading" className="border-y border-line bg-surface/40 py-20">
        <Container>
          <SectionHeader
            id="paths-heading"
            eyebrow="Rise through the ranks"
            title="Learning paths"
            description="Ordered sequences for when you want a curriculum, not a pile of links."
            action={<ArrowLink href="/paths">All paths</ArrowLink>}
          />
          <ol className="grid gap-5 lg:grid-cols-3">
            {paths.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/paths/${p.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-bg p-7 transition hover:border-gold/40"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{p.rank}</span>
                    <span className="font-display text-4xl italic text-line-strong transition group-hover:text-gold/40">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-fg">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
                  <p className="mt-auto pt-6 text-sm text-fg/70">
                    {p.lessons.length} lessons{" "}
                    <span aria-hidden className="text-gold transition group-hover:translate-x-1">→</span>
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section aria-labelledby="picks-heading" className="py-20">
          <Container>
            <SectionHeader
              id="picks-heading"
              eyebrow="The Don’s picks"
              title="Foundational reading"
              description="Hand-picked by the editors: the lessons that pay off fastest if you read nothing else."
            />
            <div className="grid gap-5 md:grid-cols-3">
              {featured.map((l, i) => (
                <LessonCard key={l.slug} lesson={l} index={i} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Topics */}
      <section aria-labelledby="topics-heading" className="pb-20">
        <Container>
          <SectionHeader
            id="topics-heading"
            eyebrow="The territory"
            title="Browse by topic"
            action={<ArrowLink href="/topics">All topics</ArrowLink>}
          />
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {topicCounts.map(({ slug, count }) => (
              <li key={slug} className="bg-bg">
                <Link
                  href={`/topics/${slug}`}
                  className="flex h-full flex-col justify-between gap-6 p-5 transition hover:bg-surface"
                >
                  <span className="font-medium text-fg">{topics[slug].title}</span>
                  <span className="text-xs text-subtle">
                    {count} {count === 1 ? "lesson" : "lessons"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Request CTA */}
      <section aria-labelledby="request-heading">
        <Container>
          <div className="grain relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-wine/40 via-surface to-bg px-8 py-14 sm:px-14">
            <div aria-hidden className="absolute -right-10 -top-10 opacity-[0.07]">
              <FedoraMark className="size-72 text-gold" />
            </div>
            <Eyebrow>On the day of my daughter’s wedding…</Eyebrow>
            <h2 id="request-heading" className="mt-4 max-w-2xl font-display text-3xl tracking-tight text-fg sm:text-4xl">
              The family takes requests. What should we cover next?
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              Tell us where you’re stuck or what you want to get better at. The most-wanted requests
              shape the next round of lessons.
            </p>
            <Link
              href="/suggest"
              className="mt-8 inline-block rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition hover:bg-gold"
            >
              Make a request
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
