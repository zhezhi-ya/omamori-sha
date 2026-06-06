import type { Fortune } from "@/types/omikuji";

const ENABLE_LOCAL_CHARACTER_IMAGES = process.env.NEXT_PUBLIC_ENABLE_LOCAL_CHARACTER_IMAGES === "true";
const ENABLE_LOCAL_MUSIC = process.env.NEXT_PUBLIC_ENABLE_LOCAL_MUSIC === "true";

export function canUseLocalCharacterImages(): boolean {
  return ENABLE_LOCAL_CHARACTER_IMAGES;
}

export function canUseLocalMusicTracks(): boolean {
  return ENABLE_LOCAL_MUSIC;
}

export function publicCharacterImage(path?: string): string | undefined {
  return canUseLocalCharacterImages() ? path : undefined;
}

export function publicFortunes(fortunes: Fortune[]): Fortune[] {
  if (canUseLocalCharacterImages()) {
    return fortunes;
  }

  return fortunes.map((fortune) => {
    const publicFortune = { ...fortune };
    delete publicFortune.characterImage;
    delete publicFortune.characterImageSource;
    return publicFortune;
  });
}
