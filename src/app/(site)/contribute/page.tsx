import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/ui";
import { githubUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Write a lesson",
  description: "How lessons are written, reviewed and published.",
  alternates: { canonical: "/contribute" },
};

const frontmatter = `---
title: "Your lesson title"
summary: "One or two sentences: what the reader will be able to do."
published: 2026-11-17
topics: [debugging, claude-code]   # keys from src/content/topics.ts
level: intermediate                # foundation | intermediate | advanced
tools: [Claude Code]
featured: false                    # true = shows in "The Don's picks"
draft: true                        # hidden in production until false
---`;

const steps = [
  ["Pick a request", <>Start from the top-voted idea on <Link href="/suggest" className="text-gold underline underline-offset-4">Request a lesson</Link>, or something your team has been asking about.</>],
  ["Create the file", <>Add <code>src/content/lessons/your-slug.mdx</code>. The filename becomes the URL. Copy the frontmatter below.</>],
  ["Write it tight", <>Aim for 5–8 minutes of reading. Lead with <em>when</em> the technique is useful, show a real example, include at least one <code>&lt;Prompt&gt;</code>, and end with an <code>&lt;Exercise&gt;</code>.</>],
  ["Preview locally", <>Run <code>npm run dev</code>. Drafts are visible locally with a Draft badge.</>],
  ["Open a PR or push", <>Set <code>draft: false</code> and push to <code>main</code>. Vercel deploys automatically, and the lesson shows up in What’s new.</>],
  ["Close the loop", <>Reply in the request thread with a link to the new lesson.</>],
] as const;

export default function ContributePage() {
  return (
    <>
      <PageHero
        eyebrow="Join the family"
        title="Write a lesson"
        description="Lessons are MDX files in the repo. No CMS, no database. If you can open a pull request, you can publish."
      />
      <Container className="grid gap-14 py-14 lg:grid-cols-2">
        <ol className="space-y-6">
          {steps.map(([title, body], i) => (
            <li key={title} className="flex gap-5">
              <span className="font-display text-2xl italic text-gold">{i + 1}</span>
              <div className="[&_code]:rounded [&_code]:bg-elevated [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-fg">
                <h2 className="font-medium text-fg">{title}</h2>
                <p className="mt-1 text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="space-y-6">
          <div>
            <p className="mb-2 font-mono text-xs text-subtle">src/content/lessons/your-slug.mdx</p>
            <pre className="overflow-x-auto rounded-xl border border-line bg-[#0f0d0c] p-5 font-mono text-[13px] leading-relaxed text-fg/90">
              {frontmatter}
            </pre>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
            <h2 className="font-display text-xl text-fg">Updating an existing lesson</h2>
            <p className="mt-2">
              Set <code className="text-fg">updated:</code> to today and add a one-line{" "}
              <code className="text-fg">updateNote:</code>. The revision then shows in What’s new.
              Typo fixes don’t need either.
            </p>
            <p className="mt-3">
              Full guide, including the style rules and available components:{" "}
              <a className="text-gold underline underline-offset-4" href={`${githubUrl}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING.md</a>.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
