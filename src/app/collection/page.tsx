import type { Metadata } from "next";
import categories from "../../../content/omikuji/categories.json";
import { CollectionList } from "@/components/collection-list";
import type { OmikujiCategory } from "@/types/omikuji";

export const metadata: Metadata = {
  title: "本地签册",
  description:
    "查看本地签册中的签文与角色寄语，整理你在博丽神社、红魔馆与永远亭留下的今日回声。",
};

export default function CollectionPage() {
  return <CollectionList categories={categories as OmikujiCategory[]} />;
}
