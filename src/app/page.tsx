import type { Metadata } from "next";
import categories from "../../content/omikuji/categories.json";
import fortunes from "../../content/omikuji/fortunes.json";
import { DailyDrawPanel } from "@/components/daily-draw-panel";
import { publicFortunes } from "@/lib/public-assets";
import type { Fortune, OmikujiCategory } from "@/types/omikuji";

export const metadata: Metadata = {
  title: "今日签文 | 御守社",
  description:
    "从 14 处幻想乡签路进入明亮日式二次元签文场景，抽取非官方东方 Project 二次创作今日签文。",
};

export default function Home() {
  return (
    <DailyDrawPanel
      categories={categories as OmikujiCategory[]}
      fortunes={publicFortunes(fortunes as Fortune[])}
    />
  );
}
