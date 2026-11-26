import type { MetadataRoute } from "next";
import { apiGet } from "@/lib/api";
import { siteUrl } from "@/lib/site";
import type { SubjectsResponse } from "@/lib/types";

const levels = [1, 2, 3, 4];

/** The pages worth finding in a search: home, the levels and their subjects. A discussion is not one of them. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A level the API cannot answer for is listed without its subjects.
  const subjects = (
    await Promise.all(
      levels.map((level) =>
        apiGet<SubjectsResponse>(`/api/v1/discussions/subjects?level=${level}`)
          .then((r) => r.subjects)
          .catch(() => []),
      ),
    )
  ).flat();
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...levels.map((level) => ({ url: `${siteUrl}/levels/${level}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...subjects.map((s) => ({ url: `${siteUrl}/subjects/${encodeURIComponent(s.id)}`, changeFrequency: "daily" as const, priority: 0.6 })),
  ];
}
