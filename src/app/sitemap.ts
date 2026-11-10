import type { MetadataRoute } from "next";
import { paths } from "@/content/paths";
import { topics } from "@/content/topics";
import { getAllLessons } from "@/lib/content";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lessons = await getAllLessons();
  const url = (p: string) => `${site.url}${p}`;
  return [
    ...["/", "/lessons", "/paths", "/topics", "/whats-new", "/suggest", "/contribute"].map((p) => ({ url: url(p) })),
    ...lessons.map((l) => ({ url: url(`/lessons/${l.slug}`), lastModified: l.updated ?? l.published })),
    ...paths.map((p) => ({ url: url(`/paths/${p.slug}`) })),
    ...Object.keys(topics).map((t) => ({ url: url(`/topics/${t}`) })),
  ];
}
