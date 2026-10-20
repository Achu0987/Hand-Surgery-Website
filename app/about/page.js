import { Container, Copy, Eyebrow, ScheduleButton, Todo } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = {
  title: "About Dr. Purnell Traverso",
  description: "Dr. Purnell Traverso, hand and wrist surgeon in Coral Springs, Florida.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <div className="border-b border-line bg-surface">
        <Container wide className="py-10 md:py-14">
          <Eyebrow>
            <Copy path="pages.about.eyebrow" />
          </Eyebrow>
          <h1 className="type-title mt-3">{site.surgeon}</h1>
          <p className="mt-2 text-muted">
            {site.role}, {site.city}
          </p>
        </Container>
      </div>
      <Container wide className="grid gap-12 py-10 md:grid-cols-[0.7fr_1.3fr] md:gap-16 md:py-14">
        <div className="flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-card border border-line bg-surface p-8 text-center">
          <Todo kind="image">Portrait, supplied by the practice</Todo>
        </div>
        <div className="reading">
          <h2 className="mt-0!">
            <Copy path="pages.about.approach" />
          </h2>
          <p>
            <Todo>In Dr. Traverso&apos;s own words: how they approach a first consultation and treatment decisions</Todo>
          </p>
          <h2>
            <Copy path="pages.about.training" />
          </h2>
          <ul>
            <li><Todo>Medical school</Todo></li>
            <li><Todo>Residency</Todo></li>
            <li><Todo>Hand surgery fellowship</Todo></li>
            <li><Todo>Board certification</Todo></li>
          </ul>
          <h2>
            <Copy path="pages.about.affiliations" />
          </h2>
          <p><Todo>Affiliations, as confirmed by the practice</Todo></p>
          <h2>
            <Copy path="pages.about.memberships" />
          </h2>
          <p><Todo>Memberships, as confirmed by the practice</Todo></p>
          <ScheduleButton className="mt-6" />
        </div>
      </Container>
    </>
  );
}
