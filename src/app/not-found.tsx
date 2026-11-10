import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center">
    <Container className="py-32 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">404</p>
      <h1 className="mt-4 font-display text-5xl text-fg">This page sleeps with the fishes.</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">It was moved, renamed, or never existed.</p>
      <Link href="/lessons" className="mt-8 inline-block rounded-full bg-gold px-6 py-3 text-sm font-medium text-bg hover:bg-gold-bright">
        Browse lessons
      </Link>
    </Container>
    </main>
  );
}
