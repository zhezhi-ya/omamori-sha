import { ImageResponse } from "next/og";
import { SocialPreviewArt } from "@/components/social-preview-art";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <SocialPreviewArt
      title="御守社"
      subtitle="从 14 处幻想乡签路，收下一枚今日签文。"
      footer="14 处幻想乡签路"
    />,
    size,
  );
}
