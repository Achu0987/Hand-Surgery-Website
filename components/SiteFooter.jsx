import Link from "next/link";
import { site } from "@/lib/site";
import { conditions } from "@/lib/conditions";
import { Logo } from "./SiteHeader";
import { Container, Copy, Disclaimer, Todo } from "./ui";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-base pb-28 pt-14 sm:pb-12">
      <Container wide>
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-small text-muted">
              {site.surgeon}, {site.role.toLowerCase()}, {site.city}.
            </p>
            <p className="mt-3 text-small">
              <Todo>{site.placeholders.address}</Todo>
            </p>
          </div>
          <FooterCol title="ui.footer.symptoms">
            {conditions.map((c) => (
              <FooterLink key={c.slug} href={`/conditions/${c.slug}`}>
                {c.name}
              </FooterLink>
            ))}
          </FooterCol>
          <FooterCol title="ui.footer.patients">
            <FooterLink href="/#symptoms" path="ui.footer.startSymptom" />
            <FooterLink href="/#visit" path="ui.footer.firstVisit" />
            <FooterLink href="/contact" path="ui.footer.schedule" />
            <FooterLink href="/about" path="ui.footer.about" />
          </FooterCol>
          <FooterCol title="ui.footer.professionals">
            <FooterLink href="/physicians" path="ui.footer.referring" />
            <FooterLink href="/physicians#how-to-refer" path="ui.footer.howToRefer" />
            <FooterLink href="/accessibility" path="ui.footer.accessibility" />
          </FooterCol>
        </div>
        <div className="mt-12 space-y-3 border-t border-line pt-6 text-small text-muted">
          <Disclaimer />
          <p>
            <Copy path="site.emergency" /> <Copy path="site.noHealthDetails" />
          </p>
          <p>
            <Copy path="ui.footer.credit" />{" "}
            <a href="https://anatomytool.org/open3dmodel" className="underline underline-offset-2">
              AnatomyTOOL
            </a>
            ,{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline underline-offset-2">
              CC BY-SA 4.0
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <h2 className="text-small font-medium text-muted">
        <Copy path={title} />
      </h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, path, children }) {
  return (
    <li>
      <Link href={href} className="text-ink hover:underline hover:underline-offset-4">
        {path ? <Copy path={path} /> : children}
      </Link>
    </li>
  );
}
