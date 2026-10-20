import { ButtonLink, Container, Copy, Eyebrow, Todo } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = { title: "Request received" };

export default function SentPage() {
  return (
    <div className="bg-surface">
      <Container wide className="py-16 md:py-24">
        <div className="max-w-2xl">
          <Eyebrow>
            <Copy path="pages.sent.eyebrow" />
          </Eyebrow>
          <h1 className="type-title mt-3">
            <Copy path="pages.sent.title" />
          </h1>
          <p className="reading mt-5 text-muted">
            <Copy path="pages.sent.body" /> <Todo>{site.placeholders.callback}</Todo>
          </p>
          <p className="mt-4 border-l-2 border-line pl-4 text-small text-muted">
            <Copy path="pages.sent.prototype" />
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/#symptoms">
              <Copy path="pages.sent.read" />
            </ButtonLink>
            <ButtonLink href="/" variant="secondary">
              <Copy path="pages.sent.home" />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </div>
  );
}
