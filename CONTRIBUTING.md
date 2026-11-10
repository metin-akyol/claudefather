# Writing lessons for the Claudefather

## Quick start

```bash
cp templates/lesson.mdx src/content/lessons/my-new-lesson.mdx
npm run dev            # preview at /lessons/my-new-lesson (drafts visible locally)
npm run build          # validates frontmatter, topics, and path references
```

Set `draft: false` and push to `main` (or merge a PR) to publish. Vercel deploys automatically.

## Frontmatter

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Name the outcome: “Debugging with AI: reproduce first”, not “Debugging tips”. |
| `summary` | yes | 1–2 sentences. Shown on cards and as the meta description. |
| `published` | yes | `YYYY-MM-DD`. Drives ordering, the What’s new feed and the “New” badge (21 days). |
| `topics` | yes | One or more keys from `src/content/topics.ts`. Unknown keys fail the build. |
| `level` | yes | `foundation`, `intermediate`, or `advanced`. |
| `tools` | no | Free text, e.g. `[Claude Code, GitHub Actions]`. Searchable. |
| `featured` | no | `true` puts it in “The Don’s picks” on the home page (first 3 shown). Keep this list short. |
| `draft` | no | `true` hides it in production. Visible in `npm run dev` with a badge. |
| `updated` / `updateNote` | no | Set both when you meaningfully revise a lesson; it appears in What’s new. |
| `author` | no | Defaults to “The Family”. |

The filename is the slug. **Don't rename published lessons**, because that breaks links and orphans the lesson's discussion thread (comments are keyed on `lesson/<slug>`).

## Components

Available in every lesson without importing:

````mdx
<Callout type="when">When this technique is worth using.</Callout>
<Callout type="tip">…</Callout>
<Callout type="warning" title="Custom title">…</Callout>
<Callout type="note">…</Callout>

<Prompt title="Short name">

```text
A copyable, reusable prompt.
```

</Prompt>

<Exercise title="Try it">

1. Steps the reader does on their own code.

</Exercise>
````

Leave **blank lines** inside components when they contain Markdown (lists, code fences), or MDX treats the content as plain text.

**MDX gotcha:** `{`, `}` and `<` in normal prose are parsed as JSX. Put them inside backticks or code blocks.

Code blocks support a title: ```` ```json title=".claude/settings.json" ````. Every code block gets a copy button.

## Style

- **Short.** 4–8 minutes of reading. If it's longer, split it into two lessons, or a path.
- **Lead with “when.”** Every lesson opens with a `<Callout type="when">`, including when *not* to bother.
- **Show, don't describe.** At least one real `<Prompt>` the reader can paste, and one before/after or worked example.
- **End with an `<Exercise>`** the reader can do on their own codebase in under 30 minutes.
- **Be honest about uncertainty.** AI tools change monthly. For version-specific claims (flags, shortcuts, config schemas), check the official docs at the time of writing, and tell readers to verify. Never invent commands, flags or APIs.
- **Link related lessons** with relative links: `[text](/lessons/slug)`.
- **No confidential code** in examples. The repo and its Discussions are public.

## Topics and paths

- New topic: add a key to `src/content/topics.ts` (title + one-line description).
- Learning paths: `src/content/paths.ts` holds an ordered list of lesson slugs. A missing slug fails the build.

## Turning requests into lessons

1. Check the `/suggest` thread (GitHub Discussions → “lesson-requests”). Reactions show demand.
2. Pick one, and reply “Writing this” so nobody duplicates it.
3. When it's published, reply with the link.
