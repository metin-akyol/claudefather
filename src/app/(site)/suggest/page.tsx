import type { Metadata } from "next";
import { Discussion } from "@/components/discussion";
import { Container, PageHero } from "@/components/ui";
import { githubUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a lesson",
  description: "Tell us what to cover next. Requests shape the weekly lessons.",
  alternates: { canonical: "/suggest" },
};

const tips = [
  ["What you’re trying to do", "“Get Claude to follow our API error conventions,” not just “APIs.”"],
  ["Where it goes wrong", "The output you get, or the step where you give up and do it by hand."],
  ["Your setup", "Language, framework, and which tool: Claude Code, claude.ai, Copilot, etc."],
] as const;

export default function SuggestPage() {
  return (
    <>
      <PageHero
        eyebrow="On the day of my daughter’s wedding…"
        title={<>The family takes requests.</>}
        description="Tell us what you want to learn next. Every week we read the requests, and the ones with the most +1s become lessons."
      />
      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_20rem]">
        <section aria-labelledby="requests-heading" className="min-w-0">
          <h2 id="requests-heading" className="sr-only">Requests</h2>
          <Discussion term="lesson-requests" />
        </section>
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-xl text-fg">A good request includes</h2>
            <ul className="mt-4 space-y-4">
              {tips.map(([t, d]) => (
                <li key={t}>
                  <p className="text-sm font-medium text-fg">{t}</p>
                  <p className="mt-0.5 text-sm text-muted">{d}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line p-6 text-sm text-muted">
            <h2 className="font-display text-xl text-fg">How requests are used</h2>
            <p className="mt-3">
              Comments are stored in{" "}
              <a href={`${githubUrl}/discussions`} className="text-gold underline underline-offset-4">GitHub Discussions</a>.
              You need a GitHub account to post. When a request becomes a lesson, the editor replies in the thread
              with a link.
            </p>
            <p className="mt-3">Add a reaction to ideas you want too. That’s how we rank them.</p>
          </div>
        </aside>
      </Container>
    </>
  );
}
