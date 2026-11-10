import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { cacheLife } from "next/cache";
import { topics, type TopicSlug } from "@/content/topics";
import { paths, type LearningPath } from "@/content/paths";
import { site } from "@/lib/site";
import { LEVELS, type Heading, type Level, type LessonMeta } from "@/lib/lesson-types";

export { levelLabel } from "@/lib/lesson-types";
export type { Heading, Level, LessonMeta } from "@/lib/lesson-types";

const LESSONS_DIR = path.join(process.cwd(), "src/content/lessons");

export interface Lesson {
  meta: LessonMeta;
  source: string;
}

const includeDrafts = process.env.NODE_ENV !== "production";

function toIsoDate(value: unknown, field: string, file: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  throw new Error(`${file}: "${field}" must be a date like 2026-11-10`);
}

function requireString(data: Record<string, unknown>, field: string, file: string): string {
  const value = data[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${file}: missing required frontmatter field "${field}"`);
  }
  return value.trim();
}

/** Strip code fences so `## ` inside code samples isn't mistaken for a heading. */
function extractHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const withoutCode = source.replace(/```[\s\S]*?```/g, "");
  return [...withoutCode.matchAll(/^##\s+(.+)$/gm)].map(([, raw]) => {
    const text = raw
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[`*_]/g, "")
      .trim();
    return { id: slugger.slug(text), text };
  });
}

function parseLesson(file: string, raw: string, now: number): Lesson {
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx$/, "");

  const lessonTopics = data.topics;
  if (!Array.isArray(lessonTopics) || lessonTopics.length === 0) {
    throw new Error(`${file}: "topics" must be a non-empty list`);
  }
  for (const t of lessonTopics) {
    if (!(t in topics)) {
      throw new Error(
        `${file}: unknown topic "${t}". Add it to src/content/topics.ts or fix the typo.`,
      );
    }
  }

  const level = data.level as Level;
  if (!LEVELS.includes(level)) {
    throw new Error(`${file}: "level" must be one of ${LEVELS.join(", ")}`);
  }

  const published = toIsoDate(data.published, "published", file);
  const updated = data.updated ? toIsoDate(data.updated, "updated", file) : undefined;
  const words = content.split(/\s+/).filter(Boolean).length;
  const ageDays = (now - Date.parse(published)) / 86_400_000;

  return {
    source: content,
    meta: {
      slug,
      title: requireString(data, "title", file),
      summary: requireString(data, "summary", file),
      published,
      updated,
      updateNote: typeof data.updateNote === "string" ? data.updateNote : undefined,
      topics: lessonTopics as TopicSlug[],
      level,
      tools: Array.isArray(data.tools) ? data.tools.map(String) : [],
      featured: data.featured === true,
      draft: data.draft === true,
      author: typeof data.author === "string" ? data.author : "The Family",
      readingMinutes: Math.max(1, Math.round(words / 220)),
      promptCount: (content.match(/<Prompt\b/g) ?? []).length,
      headings: extractHeadings(content),
      isNew: ageDays >= 0 && ageDays <= site.newWindowDays,
    },
  };
}

async function loadAll(): Promise<Lesson[]> {
  "use cache";
  cacheLife("max");

  const files = (await readdir(LESSONS_DIR)).filter((f) => f.endsWith(".mdx"));
  const now = Date.now();
  const lessons = await Promise.all(
    files.map(async (f) => parseLesson(f, await readFile(path.join(LESSONS_DIR, f), "utf8"), now)),
  );

  const slugs = new Set(lessons.map((l) => l.meta.slug));
  for (const p of paths) {
    for (const s of p.lessons) {
      if (!slugs.has(s)) {
        throw new Error(`Learning path "${p.slug}" references missing lesson "${s}"`);
      }
    }
  }

  return lessons
    .filter((l) => includeDrafts || !l.meta.draft)
    .sort((a, b) => b.meta.published.localeCompare(a.meta.published) || a.meta.title.localeCompare(b.meta.title));
}

/** All visible lessons, newest first. */
export async function getAllLessons(): Promise<LessonMeta[]> {
  return (await loadAll()).map((l) => l.meta);
}

export async function getLesson(slug: string): Promise<Lesson | undefined> {
  return (await loadAll()).find((l) => l.meta.slug === slug);
}

export async function getLessonsByTopic(topic: TopicSlug): Promise<LessonMeta[]> {
  return (await getAllLessons()).filter((l) => l.topics.includes(topic));
}

export async function getPathLessons(p: LearningPath): Promise<LessonMeta[]> {
  const all = await getAllLessons();
  return p.lessons
    .map((s) => all.find((l) => l.slug === s))
    .filter((l): l is LessonMeta => Boolean(l));
}

export function getPath(slug: string): LearningPath | undefined {
  return paths.find((p) => p.slug === slug);
}

/** The path (if any) a lesson belongs to, plus its neighbours in that path. */
export async function getPathContext(slug: string) {
  const p = paths.find((x) => x.lessons.includes(slug));
  if (!p) return undefined;
  const lessons = await getPathLessons(p);
  const i = lessons.findIndex((l) => l.slug === slug);
  return { path: p, index: i, total: lessons.length, prev: lessons[i - 1], next: lessons[i + 1] };
}

export async function getRelatedLessons(meta: LessonMeta, limit = 3): Promise<LessonMeta[]> {
  const all = await getAllLessons();
  return all
    .filter((l) => l.slug !== meta.slug)
    .map((l) => ({ l, score: l.topics.filter((t) => meta.topics.includes(t)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.l);
}

export interface ChangeEvent {
  date: string;
  kind: "published" | "updated";
  lesson: LessonMeta;
  note?: string;
}

/** Feed for "What's new": every publish and update, newest first. */
export async function getChangeLog(): Promise<ChangeEvent[]> {
  const all = await getAllLessons();
  const events: ChangeEvent[] = [];
  for (const lesson of all) {
    events.push({ date: lesson.published, kind: "published", lesson });
    if (lesson.updated && lesson.updated !== lesson.published) {
      events.push({ date: lesson.updated, kind: "updated", lesson, note: lesson.updateNote });
    }
  }
  return events.sort((a, b) => b.date.localeCompare(a.date));
}
