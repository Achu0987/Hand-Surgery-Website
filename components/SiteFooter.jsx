import Link from "next/link";
import { site } from "@/lib/site";
import { conditions } from "@/lib/conditions";
import { Logo } from "./SiteHeader";
import { Container, Placeholder } from "./ui";

export default function SiteFooter() {
  return (
    <footer className="bg-indigo-950 pb-28 pt-16 text-white/80 on-dark sm:pb-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm">
              {site.surgeon}, {site.role.toLowerCase()}, {site.city}.
            </p>
            <p className="mt-3 text-sm">
              <Placeholder>{site.placeholders.address}</Placeholder>
            </p>
          </div>
          <FooterCol title="Conditions">
            {conditions.slice(0, 5).map((c) => (
              <FooterLink key={c.slug} href={`/conditions/${c.slug}`}>
                {c.name}
              </FooterLink>
            ))}
            <FooterLink href="/conditions">All conditions</FooterLink>
          </FooterCol>
          <FooterCol title="Patients">
            <FooterLink href="/#explore">Start with a symptom</FooterLink>
            <FooterLink href="/#visit">Your first visit</FooterLink>
            <FooterLink href="/contact">Request an appointment</FooterLink>
            <FooterLink href="/about">About the surgeon</FooterLink>
          </FooterCol>
          <FooterCol title="Professionals">
            <FooterLink href="/physicians">Referring physicians</FooterLink>
            <FooterLink href="/physicians#how-to-refer">How to refer</FooterLink>
            <FooterLink href="/accessibility">Accessibility</FooterLink>
          </FooterCol>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/60">
          <p>
            The information on this site is general and educational. It is not medical advice and does not replace a consultation.
            If you think you need urgent care, contact emergency services. Please do not send health details through this website.
          </p>
          <p className="mt-3">
            3D anatomy:{" "}
            <a href="https://anatomytool.org/open3dmodel" className="underline underline-offset-2 hover:text-white">
              Open3DModel &ldquo;Hand, complete&rdquo;
            </a>
            , Open3D project, AnatomyTOOL.org, based on BodyParts3D and Z-Anatomy, licensed{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline underline-offset-2 hover:text-white">
              CC BY-SA 4.0
            </a>
            ; simplified for the web. Skin: WebXR Input Profiles generic hand, MIT license, copyright 2019 Amazon, smoothed and
            re-rigged. The ganglion shown is an illustration.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-300">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-[15px]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="hover:text-white hover:underline hover:underline-offset-4">
        {children}
      </Link>
    </li>
  );
}
