import type { Metadata } from "next";
import categories from "../../content/omikuji/categories.json";
import fortunes from "../../content/omikuji/fortunes.json";
import { DailyDrawPanel } from "@/components/daily-draw-panel";
import type { Fortune, OmikujiCategory } from "@/types/omikuji";

export const metadata: Metadata = {
  title: "今日签文 | 御守社",
  description:
    "从博丽神社、红魔馆或永远亭进入明亮日式二次元签文场景，抽取今日东方Project同人风格签文。",
};

export default function Home() {
  return (
    <DailyDrawPanel
      categories={categories as OmikujiCategory[]}
      fortunes={fortunes as Fortune[]}
    />
  );
}
