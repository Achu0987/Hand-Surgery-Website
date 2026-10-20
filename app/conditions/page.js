import Link from "next/link";
import { Container, Disclaimer, DraftTag, Eyebrow } from "@/components/ui";
import { conditions } from "@/lib/conditions";

export const metadata = {
  title: "Hand and wrist conditions",
  description: "Plain-language guides to common hand and wrist conditions, starting from the symptoms people notice.",
  alternates: { canonical: "/conditions" },
};

export default function ConditionsIndex() {
  return (
    <Container className="py-14 sm:py-20">
      <Eyebrow>Guides</Eyebrow>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-indigo-950 sm:text-5xl">Hand and wrist conditions</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Each guide starts with what people tend to notice, then explains what is happening in the hand and what is worth asking.
        <DraftTag label="Drafts" />
      </p>
      <ul className="mt-12 divide-y divide-line border-y border-line">
        {conditions.map((c) => (
          <li key={c.slug}>
            <Link href={`/conditions/${c.slug}`} className="group grid gap-1 py-6 sm:grid-cols-[1fr_1.3fr_auto] sm:items-center sm:gap-8">
              <span className="font-serif text-2xl font-semibold text-indigo-950 group-hover:underline group-hover:underline-offset-4">{c.name}</span>
              <span className="text-ink-soft">&ldquo;{c.symptom}&rdquo;</span>
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-700">{c.area}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-ink-soft">
        Not sure which applies? <Link href="/#explore" className="font-bold text-indigo-800 underline underline-offset-4">Start from a symptom</Link>.
      </p>
      <Disclaimer className="mt-6" />
    </Container>
  );
}
