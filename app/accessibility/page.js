import { Container, Copy, CopyList, Eyebrow, Todo } from "@/components/ui";
import { text } from "@/lib/copy";

export const metadata = { title: text("meta.accessibility") || undefined, alternates: { canonical: "/accessibility" } };

const P = "pages.accessibility";

export default function AccessibilityPage() {
  return (
    <>
      <div className="border-b border-line bg-surface">
        <Container wide className="py-10 md:py-14">
          <Eyebrow>
            <Copy path={`${P}.eyebrow`} />
          </Eyebrow>
          <h1 className="type-title mt-3">
            <Copy path={`${P}.title`} />
          </h1>
        </Container>
      </div>
      <Container wide className="py-10 md:py-14">
        <div className="reading">
          <p>
            <Copy path={`${P}.intro`} />
          </p>
          <h2>
            <Copy path={`${P}.figureTitle`} />
          </h2>
          <CopyList path={`${P}.points`} />
          <h2>
            <Copy path={`${P}.contactTitle`} />
          </h2>
          <p>
            <Copy path={`${P}.contactLine`} /> <Todo>Accessibility contact</Todo>
          </p>
        </div>
      </Container>
    </>
  );
}
