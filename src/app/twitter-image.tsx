import { ImageResponse } from "next/og";
import { SocialPreviewArt } from "@/components/social-preview-art";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    <SocialPreviewArt
      title="御守社"
      subtitle="给自己抽一枚今日签文，看看幻想乡今天会回应什么。"
      footer="博丽神社 / 红魔馆 / 永远亭"
    />,
    size,
  );
}
