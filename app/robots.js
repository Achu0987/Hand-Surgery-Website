import { site } from "@/lib/site";

// Pre-launch: block all crawlers. At launch, switch to `allow: "/"` and remove
// `robots: { index: false }` from the root layout metadata.
export default function robots() {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
