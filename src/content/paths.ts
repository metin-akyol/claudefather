/**
 * Learning paths: ordered sequences of lessons. Lesson slugs are validated at
 * build time, so renaming a lesson without updating a path fails the build.
 */
export interface LearningPath {
  slug: string;
  /** Short themed label shown above the title. */
  rank: string;
  title: string;
  description: string;
  lessons: string[];
}

export const paths: LearningPath[] = [
  {
    slug: "foundations",
    rank: "The Associate",
    title: "Foundations",
    description:
      "Start here. How to ask, how to give Claude the context it needs, and the core loop every other workflow builds on.",
    lessons: [
      "anatomy-of-a-coding-prompt",
      "explore-plan-code-verify",
      "claude-md-that-works",
      "managing-context-in-large-codebases",
    ],
  },
  {
    slug: "everyday-workflows",
    rank: "The Made Developer",
    title: "Everyday workflows",
    description:
      "The day-to-day jobs: chasing bugs, writing tests, reviewing changes, and getting up to speed on unfamiliar code.",
    lessons: [
      "debugging-reproduce-first",
      "test-first-with-claude",
      "ai-assisted-code-review",
      "docs-and-research-with-receipts",
    ],
  },
  {
    slug: "automation",
    rank: "The Consigliere",
    title: "Automation & the wider toolbox",
    description:
      "Make good behaviour automatic with hooks and scripts, and know which other AI tools earn a place in your setup.",
    lessons: ["hooks-as-guardrails", "headless-claude-in-scripts-and-ci", "the-wider-toolbox"],
  },
];
