"use client";

import Giscus from "@giscus/react";
import { githubUrl, site } from "@/lib/site";

/**
 * GitHub Discussions-backed comments via giscus (https://giscus.app).
 * Until NEXT_PUBLIC_GISCUS_CATEGORY_ID is configured we show setup guidance
 * instead of a broken widget.
 */
export function Discussion({ term }: { term: string }) {
  const { repo, repoId, category, categoryId } = site.giscus;

  if (!categoryId) {
    return (
      <div className="rounded-2xl border border-dashed border-line-strong p-6 text-sm text-muted">
        <p className="font-medium text-fg">Comments aren’t switched on yet.</p>
        <p className="mt-2">
          An admin needs to enable GitHub Discussions and set <code className="text-fg">NEXT_PUBLIC_GISCUS_CATEGORY_ID</code>{" "}
          (see the README). Until then, you can{" "}
          <a className="text-gold underline underline-offset-4" href={`${githubUrl}/issues/new?title=${encodeURIComponent(term)}`}>
            open a GitHub issue
          </a>{" "}
          instead.
        </p>
      </div>
    );
  }

  return (
    <Giscus
      repo={repo}
      repoId={repoId}
      category={category}
      categoryId={categoryId}
      mapping="specific"
      term={term}
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="transparent_dark"
      lang="en"
      loading="lazy"
    />
  );
}
