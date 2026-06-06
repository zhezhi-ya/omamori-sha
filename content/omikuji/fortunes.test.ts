import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import fortunes from "./fortunes.json";
import { OMAMORI_ROUTE_IDS } from "@/constants/fortune";
import type { Fortune } from "@/types/omikuji";

const typedFortunes = fortunes as Fortune[];
const validCategories = new Set(["study", "love", "slacking", "lateNight", "social", "wealth", "hidden"]);
const validTiers = new Set(["small-blessing", "middle-blessing", "great-blessing", "shadow", "secret"]);
const validRarities = new Set(["common", "uncommon", "rare", "epic", "legendary"]);

describe("fortunes.json", () => {
  it("contains unique ids and complete required fields", () => {
    const ids = new Set<string>();

    for (const fortune of typedFortunes) {
      expect(ids.has(fortune.id), fortune.id).toBe(false);
      ids.add(fortune.id);

      expect(fortune.id).toBeTruthy();
      expect(validCategories.has(fortune.category), fortune.id).toBe(true);
      expect(validTiers.has(fortune.tier), fortune.id).toBe(true);
      expect(validRarities.has(fortune.rarity), fortune.id).toBe(true);
      expect(fortune.title).toBeTruthy();
      expect(fortune.character).toBeTruthy();
      expect(fortune.summary).toBeTruthy();
      expect(fortune.advice).toBeTruthy();
      expect(fortune.luckyColor).toBeTruthy();
      expect(fortune.luckyItem).toBeTruthy();
      expect(fortune.tags.length, fortune.id).toBeGreaterThan(0);
      expect(fortune.relatedSceneIds?.length, fortune.id).toBeGreaterThan(0);
    }
  });

  it("keeps official route pools at the minimum content target", () => {
    for (const routeId of OMAMORI_ROUTE_IDS) {
      const count = typedFortunes.filter((fortune) => fortune.relatedSceneIds?.includes(routeId)).length;
      expect(count, routeId).toBeGreaterThanOrEqual(12);
    }
  });

  it("does not point to missing local character images", () => {
    for (const fortune of typedFortunes) {
      if (!fortune.characterImage) {
        continue;
      }

      const localPath = path.join(process.cwd(), "public", fortune.characterImage.replace(/^\//, ""));
      expect(fs.existsSync(localPath), `${fortune.id}: ${fortune.characterImage}`).toBe(true);
    }
  });
});
