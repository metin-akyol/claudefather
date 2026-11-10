@AGENTS.md

# The Claudefather

Internal learning hub. Next.js 16 App Router with `cacheComponents`, Tailwind v4, lessons as MDX.

## Commands
- `npm run dev`: local dev (password gate disabled when SITE_PASSWORD is unset)
- `npm run build`: must pass before pushing; validates lesson frontmatter/topics/paths
- `npm run lint`

## Conventions
- Lessons: `src/content/lessons/*.mdx`; follow CONTRIBUTING.md and `templates/lesson.mdx`
- Content loading goes through `src/lib/content.ts` (`"use cache"`); don't read lesson files elsewhere
- Client components must import types from `src/lib/lesson-types.ts`, never `src/lib/content.ts` (it uses `fs`)
- Under Cache Components, `Date.now()`/`new Date()` and similar must be inside a `"use cache"` scope
- `src/proxy.ts` is the auth gate (Next 16 renamed middleware → proxy)
- Design tokens live in `src/app/globals.css` `@theme` (bg, surface, gold, wine, …); use them, not raw hex
- Push to `main` deploys to production on Vercel
