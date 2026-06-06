import { describe, expect, it } from "vitest";
import {
  canUseLocalCharacterImages,
  canUseLocalMusicTracks,
  publicCharacterImage,
  publicFortunes,
} from "@/lib/public-assets";
import type { Fortune } from "@/types/omikuji";

describe("public asset gates", () => {
  it("keeps local character images enabled unless the build opts out", () => {
    expect(canUseLocalCharacterImages()).toBe(true);
    expect(publicCharacterImage("/images/characters/moegirl/002-reimu-hakurei.jpg")).toBe(
      "/images/characters/moegirl/002-reimu-hakurei.jpg",
    );
  });

  it("keeps local music tracks enabled unless the build opts out", () => {
    expect(canUseLocalMusicTracks()).toBe(true);
  });

  it("keeps local character image metadata in public fortune payloads by default", () => {
    const fortunes = [
      {
        id: "study-reimu-01",
        category: "study",
        tier: "middle-blessing",
        title: "结界静心签",
        character: "博丽灵梦",
        summary: "先稳住。",
        advice: "整理桌面。",
        luckyColor: "博丽朱红",
        luckyItem: "便签",
        tags: ["先稳住"],
        rarity: "common",
        characterImage: "/images/characters/moegirl/002-reimu-hakurei.jpg",
        characterImageSource: "萌娘百科：博丽灵梦",
      },
    ] satisfies Fortune[];

    expect(publicFortunes(fortunes)).toEqual(fortunes);
  });
});
