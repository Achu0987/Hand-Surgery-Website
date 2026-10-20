import Link from "next/link";
import { Container, Copy, Disclaimer, Eyebrow, Todo } from "@/components/ui";
import { conditions } from "@/lib/conditions";
import { text } from "@/lib/copy";

export const metadata = {
  title: text("pages.conditions.title") || "Symptoms",
  alternates: { canonical: "/conditions" },
};

export default function ConditionsIndex() {
  return (
    <>
      <div className="border-b border-line bg-surface">
        <Container wide className="py-10 md:py-14">
          <Eyebrow>
            <Copy path="pages.conditions.eyebrow" />
          </Eyebrow>
          <h1 className="type-title mt-3 max-w-3xl">
            <Copy path="pages.conditions.title" />
          </h1>
          <p className="reading mt-4 text-muted">
            <Copy path="site.reassurance" />
          </p>
        </Container>
      </div>
      <Container wide className="py-10 md:py-14">
        <ul className="border-y border-line">
          {conditions.map((c) => (
            <li key={c.slug} className="border-b border-line last:border-b-0">
              <Link href={`/conditions/${c.slug}`} className="group grid gap-1 py-5 sm:grid-cols-[1.2fr_1fr] sm:items-center sm:gap-8">
                <span className="font-medium text-ink group-hover:underline group-hover:underline-offset-4">
                  &ldquo;<Copy path={`symptoms.${c.slug}.card`} />&rdquo;
                </span>
                <span className="text-small text-muted">{c.name}</span>
              </Link>
            </li>
          ))}
          <li className="py-5 text-small">
            <Todo>Eighth symptom page, not yet named</Todo>
          </li>
        </ul>
        <Disclaimer className="mt-10" />
      </Container>
    </>
  );
}
