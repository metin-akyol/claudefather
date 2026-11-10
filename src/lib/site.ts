/**
 * Site-wide configuration. Anything a maintainer might want to tweak lives here
 * so it isn't scattered across components.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // Provided automatically by Vercel on every deployment.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "The Claudefather",
  shortName: "Claudefather",
  tagline: "Make Claude an offer it can’t refuse: your codebase.",
  description:
    "A living field guide for developers using Claude and other AI tools: practical lessons, reusable prompts, and workflows you can try today.",
  url: resolveSiteUrl(),
  repo: "metin-akyol/claudefather",
  /**
   * The site sits behind a shared password, so we keep it out of search
   * engines. Flip to `true` only if you ever make the site public.
   */
  indexable: false,
  /** Lessons published within this many days get a "New" badge. */
  newWindowDays: 21,
  giscus: {
    repo: (process.env.NEXT_PUBLIC_GISCUS_REPO ??
      "metin-akyol/claudefather") as `${string}/${string}`,
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "R_kgDOVpm74A",
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "Ideas",
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
  },
} as const;

export const githubUrl = `https://github.com/${site.repo}`;
