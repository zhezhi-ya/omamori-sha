import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "御守社",
    short_name: "御守社",
    description: "从博丽神社、红魔馆或永远亭进入明亮动漫风今日签文场景。",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7e8",
    theme_color: "#ffedf3",
    lang: "zh-CN",
    icons: [
      {
        src: "/images/ui/app-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/images/ui/app-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
