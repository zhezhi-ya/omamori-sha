import { ImageResponse } from "next/og";
import { SocialPreviewArt } from "@/components/social-preview-art";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <SocialPreviewArt
      title="御守社"
      subtitle="从博丽神社、红魔馆或永远亭，收下一枚今日签文。"
      footer="东方Project同人风格签文"
    />,
    size,
  );
}
