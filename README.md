# The Claudefather

> Make Claude an offer it can’t refuse: your codebase.

An internal learning hub for developers using Claude and other AI tools. It holds short, practical lessons with prompts you can copy, learning paths, a What’s new feed, and a place to request the next lesson.

Built with Next.js 16 (App Router, Cache Components), Tailwind CSS v4 and MDX. Lessons are plain `.mdx` files in the repo. There's no CMS and no database.

---

## Run it locally

Requires Node.js 20.9+ (tested on Node 26).

```bash
npm install
cp .env.example .env.local   # optional locally, see below
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server. Draft lessons are visible, with a Draft badge. |
| `npm run build` | Production build. **Fails on invalid lesson frontmatter**, unknown topics, or broken learning-path references. |
| `npm start` | Serve the production build. |
| `npm run lint` | ESLint. |

If `SITE_PASSWORD` is unset, local dev skips the password gate. To test the gate locally, set it in `.env.local` and run `npm run build && npm start`.

## Deploy (Vercel)

The repo is connected to Vercel, so **every push to `main` deploys to production**. No `vercel.json` is needed; Vercel detects Next.js.

One-time setup in **Vercel → Project → Settings → Environment Variables**:

| Variable | Required | Purpose |
| --- | --- | --- |
| `SITE_PASSWORD` | **Yes** | Shared team password. **If missing, the deployed site returns 503 on every page** (fails closed). |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | For comments | Turns on lesson discussions and the request board (see below). |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL. Defaults to Vercel's production URL. |
| `NEXT_PUBLIC_GISCUS_REPO`, `..._REPO_ID`, `..._CATEGORY` | No | Override the defaults in `src/lib/site.ts`. |

Set them for **Production** and **Preview**, then redeploy. `NEXT_PUBLIC_*` values are baked in at build time, so changing them needs a redeploy.

### Turn on comments and lesson requests (giscus)

Comments and the “Request a lesson” board are stored in **GitHub Discussions** on this repo through [giscus](https://giscus.app). Commenters need a GitHub account. The repo is public, which giscus requires; the site itself stays password-protected.

1. GitHub → repo **Settings → General → Features** → tick **Discussions**.
2. Make sure there's a discussion category named **Ideas** (GitHub creates it by default). To use another category, set `NEXT_PUBLIC_GISCUS_CATEGORY`.
3. Install the giscus GitHub App on this repo: <https://github.com/apps/giscus>.
4. Go to <https://giscus.app>, enter `metin-akyol/claudefather`, pick the category, and copy the `data-category-id` value from the generated snippet.
5. Set `NEXT_PUBLIC_GISCUS_CATEGORY_ID` in Vercel and redeploy.

Until step 5, comment areas show a “not switched on yet” notice with a fallback link to open a GitHub issue.

Each lesson gets its own discussion thread (`lesson/<slug>`). Lesson requests share one thread (`lesson-requests`), where people post ideas and react to the ones they want.

---

## Adding content

Full guide: **[CONTRIBUTING.md](CONTRIBUTING.md)**. In short:

1. Copy `templates/lesson.mdx` to `src/content/lessons/<slug>.mdx`. The filename is the URL.
2. Fill in the frontmatter and write the lesson. Use `<Callout>`, `<Prompt>` and `<Exercise>`.
3. `npm run dev` to preview, then `npm run build` to validate.
4. Set `draft: false`, commit, and push to `main`. Vercel deploys, and the lesson appears in **Lessons**, **What’s new**, its **topics**, and the home page.

To **update** a lesson, set `updated:` and `updateNote:` in its frontmatter. The revision then shows up in What’s new.

To add a **topic**, edit `src/content/topics.ts`. For a **learning path**, edit `src/content/paths.ts`.

### Weekly editorial rhythm (manual, by design)

Publishing is deliberately manual. There's no automation in this repo beyond “push to `main` deploys.”

1. **Monday:** read the requests thread on `/suggest` (GitHub Discussions) and pick the most-wanted idea that is still unaddressed.
2. **Mid-week:** write the lesson as a draft and get a teammate to review the PR.
3. **Publish:** set `draft: false`, set `published:` to today, merge to `main`.
4. **Close the loop:** reply in the request thread with the lesson link.
5. **Monthly:** skim lessons older than about three months for advice that has gone stale, then update them with an `updateNote`.

### What it would take to automate later

These are **not implemented**. Each would be a small addition:

- **Scheduled publishing:** a GitHub Actions cron that flips `draft: false` on lessons whose `published` date has arrived and commits to `main` (which triggers the normal deploy). Alternatively, hide future-dated lessons in `src/lib/content.ts` and trigger a weekly Vercel Deploy Hook from a cron. That needs a `VERCEL_DEPLOY_HOOK_URL` secret.
- **Request digest:** a scheduled job that reads the `lesson-requests` discussion through the GitHub GraphQL API and ranks comments by reactions. That needs a GitHub token with Discussions read access.
- **AI-drafted lessons:** the Claude Code GitHub Action could open a **draft PR** for the top request, using `templates/lesson.mdx` and CONTRIBUTING.md as instructions. That needs an `ANTHROPIC_API_KEY` repo secret, and a human must still review and publish.
- **Real “popular” rankings:** “The Don’s picks” is editorial (`featured: true`), not traffic-based. Ranking by views would need an analytics source with a readable API. Vercel Web Analytics shows views in the dashboard, but we haven't wired any data back into the site.

---

## Key files

```
src/
  proxy.ts                     Password gate (Next 16 "proxy", formerly middleware)
  app/
    (site)/                    Pages with header/footer
      page.tsx                 Home: hero, what's new, paths, picks, topics, request CTA
      lessons/[slug]/page.tsx  Lesson page: MDX body, TOC, path nav, discussion, related
      lessons/ paths/ topics/ whats-new/ suggest/ contribute/
    (auth)/login/              Password page (no site chrome)
    api/login, api/logout      Set/clear the auth cookie
    robots.ts, sitemap.ts      SEO (robots disallows all while the site is private)
  content/
    lessons/*.mdx              ← the lessons
    topics.ts, paths.ts        Topic registry and learning paths (validated at build)
  lib/
    content.ts                 Loads, validates and indexes lessons (cached)
    mdx.tsx                    MDX compile + syntax highlighting (Shiki)
    site.ts                    Site config: name, repo, giscus, indexable flag
    auth.ts                    Cookie token + safe redirect helpers
  components/
    mdx/                       Callout, Prompt, Exercise, copyable code blocks
    discussion.tsx             giscus wrapper
templates/lesson.mdx           Starter template for new lessons
```

## Decisions and trade-offs

- **Content as MDX in git.** Lessons get reviewed in PRs like code, there are no extra services, and history is free. Frontmatter is validated at build, so a typo fails the deploy instead of shipping a broken page.
- **Shared password via `proxy.ts`.** It's simple and works on any Vercel plan. The cookie stores an HMAC of the password, so changing `SITE_PASSWORD` logs everyone out. Limitations: there's one password for everyone, no per-user accounts, and no login rate limiting. If you need real identity, use Vercel Deployment Protection (paid plans) or an SSO provider.
- **giscus for comments.** There's no database to run, moderation happens in GitHub, and requests sit next to the code. The trade-offs are that commenters need GitHub accounts, and comments are visible in the public repo's Discussions even though the site itself is private. **Don't post anything confidential in comments.**
- **Private by default for SEO.** Every page has full metadata (titles, descriptions, Open Graph, canonical URLs, sitemap), but `site.indexable = false` sets `noindex` and a disallow-all `robots.txt`. Flip it in `src/lib/site.ts` if the site ever goes public.
- **Dark-only theme.** The design is built around one palette (black, gold, wine). A light theme would need a second token set in `globals.css`.
- **Unknown lesson URLs:** with Cache Components, the not-found page renders with `noindex` but an HTTP 200 status, because the shell has already streamed. This is documented Next.js behaviour.
- **Starter lessons** are dated with the launch date. They describe Claude Code features as of late 2026. Features change, so each lesson tells readers to verify version-specific details in the official docs.
