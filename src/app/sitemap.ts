import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "/",
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "/collection",
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
