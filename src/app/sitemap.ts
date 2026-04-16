import type { MetadataRoute } from "next";

import { candidateProfiles } from "@/lib/winchester-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
    },
    {
      url: `${baseUrl}/sources`,
    },
  ];

  return routes.concat(
    candidateProfiles.map((candidate) => ({
      url: `${baseUrl}/candidates/${candidate.slug}`,
    })),
  );
}
