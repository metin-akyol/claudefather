/**
 * The topic registry. Every `topics:` entry in a lesson's frontmatter must be a
 * key here; the build fails on an unknown topic so typos never ship.
 */
export const topics = {
  prompting: {
    title: "Prompting",
    description: "Writing requests that get the right result on the first or second try.",
  },
  "claude-code": {
    title: "Claude Code",
    description: "Getting the most out of Claude Code in the terminal and the editor.",
  },
  context: {
    title: "Context & large codebases",
    description: "Feeding the model what it needs, and nothing it doesn't, on big repos.",
  },
  workflow: {
    title: "Workflows",
    description: "Repeatable loops for turning a ticket into merged code.",
  },
  debugging: {
    title: "Debugging",
    description: "Using AI to find root causes instead of patching symptoms.",
  },
  testing: {
    title: "Testing",
    description: "Test-first loops, coverage gaps, and keeping the model honest.",
  },
  "code-review": {
    title: "Code review",
    description: "Reviewing AI-written code, and using AI to review yours.",
  },
  "docs-research": {
    title: "Docs & research",
    description: "Explaining unfamiliar code, writing docs, and researching with sources.",
  },
  automation: {
    title: "Automation & CI",
    description: "Hooks, scripts, and pipelines that run AI without a human typing.",
  },
  tooling: {
    title: "Beyond Claude",
    description: "The wider AI tooling landscape and where each tool fits.",
  },
} as const satisfies Record<string, { title: string; description: string }>;

export type TopicSlug = keyof typeof topics;
