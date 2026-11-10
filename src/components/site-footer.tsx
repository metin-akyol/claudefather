import Link from "next/link";
import { FedoraMark } from "./logo";
import { githubUrl } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <FedoraMark className="size-9 text-gold" />
          <p className="mt-4 max-w-sm font-display text-xl italic text-fg/90">
            “I’m gonna make it an offer it can’t refuse.”
          </p>
          <p className="mt-3 max-w-sm text-sm text-muted">
            A team field guide to building software with Claude and friends. A new lesson most weeks,
            and the next one is often a reader request.
          </p>
        </div>
        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">Learn</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="text-muted hover:text-fg" href="/paths/foundations">Start here</Link></li>
            <li><Link className="text-muted hover:text-fg" href="/lessons">All lessons</Link></li>
            <li><Link className="text-muted hover:text-fg" href="/topics">Topics</Link></li>
            <li><Link className="text-muted hover:text-fg" href="/whats-new">What’s new</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">The family</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="text-muted hover:text-fg" href="/suggest">Request a lesson</Link></li>
            <li><Link className="text-muted hover:text-fg" href="/contribute">Write a lesson</Link></li>
            <li><a className="text-muted hover:text-fg" href={githubUrl}>GitHub repository</a></li>
            <li>
              <form action="/api/logout" method="post">
                <button type="submit" className="text-muted hover:text-fg">Sign out</button>
              </form>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-subtle sm:px-8">
          Internal learning hub. AI tools change fast, so check anything version-specific against the official docs.
        </p>
      </div>
    </footer>
  );
}
