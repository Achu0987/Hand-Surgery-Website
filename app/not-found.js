import { ButtonLink, Container, Copy } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="bg-surface">
      <Container wide className="py-20 md:py-28">
        <h1 className="type-title">
          <Copy path="pages.notFound.title" />
        </h1>
        <p className="reading mt-4 text-muted">
          <Copy path="pages.notFound.body" />
        </p>
        <ButtonLink href="/#symptoms" className="mt-8">
          <Copy path="pages.notFound.cta" />
        </ButtonLink>
      </Container>
    </div>
  );
}
