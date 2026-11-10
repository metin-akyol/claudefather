"use client";

import { useMemo, useState } from "react";
import { topics, type TopicSlug } from "@/content/topics";
import { LEVELS, levelLabel, type Level, type LessonMeta } from "@/lib/lesson-types";
import { LessonCard } from "./ui";

export function LessonBrowser({ lessons }: { lessons: LessonMeta[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicSlug | "all">("all");
  const [level, setLevel] = useState<Level | "all">("all");

  const usedTopics = useMemo(
    () => (Object.keys(topics) as TopicSlug[]).filter((t) => lessons.some((l) => l.topics.includes(t))),
    [lessons],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lessons.filter(
      (l) =>
        (topic === "all" || l.topics.includes(topic)) &&
        (level === "all" || l.level === level) &&
        (!q ||
          [l.title, l.summary, ...l.tools, ...l.topics.map((t) => topics[t].title)]
            .join(" ")
            .toLowerCase()
            .includes(q)),
    );
  }, [lessons, query, topic, level]);

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm transition ${
      active ? "border-gold bg-gold text-bg" : "border-line text-muted hover:border-line-strong hover:text-fg"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search lessons</span>
          <svg aria-hidden viewBox="0 0 24 24" className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-subtle" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, tools, topics…"
            className="w-full rounded-full border border-line bg-surface py-3 pl-11 pr-4 text-fg placeholder:text-subtle focus:border-gold/60 focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-muted">
          Level
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level | "all")}
            className="rounded-full border border-line bg-surface px-4 py-3 text-fg focus:border-gold/60 focus:outline-none"
          >
            <option value="all">All levels</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {levelLabel[l]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div role="group" aria-label="Filter by topic" className="mt-5 flex flex-wrap gap-2">
        <button type="button" aria-pressed={topic === "all"} onClick={() => setTopic("all")} className={chip(topic === "all")}>
          All topics
        </button>
        {usedTopics.map((t) => (
          <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)} className={chip(topic === t)}>
            {topics[t].title}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-subtle" aria-live="polite">
        {results.length} {results.length === 1 ? "lesson" : "lessons"}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((l) => (
            <LessonCard key={l.slug} lesson={l} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-line-strong p-10 text-center">
          <p className="font-display text-xl text-fg">Nothing here yet.</p>
          <p className="mt-2 text-sm text-muted">
            Try a different filter, or{" "}
            <a href="/suggest" className="text-gold underline underline-offset-4">request this lesson</a>.
          </p>
        </div>
      )}
    </div>
  );
}
