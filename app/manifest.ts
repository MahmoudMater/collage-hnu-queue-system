import type { MetadataRoute } from "next";
import { themeColor } from "@/lib/site";
import { t } from "@/lib/strings";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: t.appName,
    short_name: t.seo.shortName,
    description: t.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: themeColor.dark,
    theme_color: themeColor.dark,
    lang: "en",
    dir: "ltr",
    categories: ["education"],
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
