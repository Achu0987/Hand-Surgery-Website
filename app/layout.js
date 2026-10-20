import { Geist } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileActionBar from "@/components/MobileActionBar";
import Motion from "@/components/motion/Motion";
import { Copy, DraftBanner } from "@/components/ui";
import { site } from "@/lib/site";

// One family, weights 400 and 500 only (DESIGN.md §3)
const geist = Geist({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-geist", display: "swap" });

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Hand and wrist surgeon in Coral Springs, FL | ${site.surgeon}`,
    template: `%s | ${site.name}`,
  },
  description: `Plain-language guides to hand and wrist symptoms, and how to reach ${site.surgeon}, hand and wrist surgeon in Coral Springs, Florida.`,
  // Pre-launch: keep the site out of search indexes until approved.
  robots: { index: false, follow: false },
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-accent px-5 py-3 font-medium text-surface focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          <Copy path="ui.skip" />
        </a>
        <DraftBanner />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileActionBar />
        <Motion />
      </body>
    </html>
  );
}
