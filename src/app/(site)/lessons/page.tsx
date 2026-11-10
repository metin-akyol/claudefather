import type { Metadata } from "next";
import { getAllLessons } from "@/lib/content";
import { LessonBrowser } from "@/components/lesson-browser";
import { Container, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "All lessons",
  description: "Every lesson in the Claudefather: prompting, context, debugging, testing, review, automation and more.",
  alternates: { canonical: "/lessons" },
};

export default async function LessonsPage() {
  const lessons = await getAllLessons();
  return (
    <>
      <PageHero
        eyebrow="The archive"
        title="All lessons"
        description="Each one is short, has prompts you can copy, and ends with an exercise to run on your own code."
      />
      <Container className="py-12">
        <LessonBrowser lessons={lessons} />
      </Container>
    </>
  );
}
