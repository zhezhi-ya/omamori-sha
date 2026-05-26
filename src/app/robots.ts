import type { MetadataRoute } from "next";

export const dynamic = "force-static";

function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return siteUrl.replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
