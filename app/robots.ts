import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Discussion pages stay crawlable so their `noindex` can be read and link
 * previews work; the API (sheets carry team codes) and the sign-in return do not.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/socket.io", "/student/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
