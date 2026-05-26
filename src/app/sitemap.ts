import type { MetadataRoute } from "next";

export const dynamic = "force-static";

function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return siteUrl.replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/collection/`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
