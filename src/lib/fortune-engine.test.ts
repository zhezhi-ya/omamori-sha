import { describe, expect, it } from "vitest";
import fortunes from "../../content/omikuji/fortunes.json";
import { OMAMORI_ROUTE_IDS } from "@/constants/fortune";
import { filterFortunesForScene, pickDailyFortune } from "@/lib/fortune-engine";
import type { Fortune } from "@/types/omikuji";

const typedFortunes = fortunes as Fortune[];

describe("fortune-engine", () => {
  it("filters every official route to a non-empty fortune pool", () => {
    for (const routeId of OMAMORI_ROUTE_IDS) {
      expect(filterFortunesForScene(typedFortunes, routeId).length, routeId).toBeGreaterThanOrEqual(12);
    }
  });

  it("keeps daily fortune stable for the same user, date, and route", () => {
    const first = pickDailyFortune(typedFortunes, "visitor-a", "2026-06-06", "hakurei");
    const second = pickDailyFortune(typedFortunes, "visitor-a", "2026-06-06", "hakurei");

    expect(second.id).toBe(first.id);
    expect(second.relatedSceneIds).toContain("hakurei");
  });

  it("changes the daily seed when route changes", () => {
    const hakurei = pickDailyFortune(typedFortunes, "visitor-a", "2026-06-06", "hakurei");
    const scarlet = pickDailyFortune(typedFortunes, "visitor-a", "2026-06-06", "scarlet");

    expect(hakurei.relatedSceneIds).toContain("hakurei");
    expect(scarlet.relatedSceneIds).toContain("scarlet");
  });

  it("throws an explicit error for an empty scene pool", () => {
    expect(() => pickDailyFortune(typedFortunes, "visitor-a", "2026-06-06", "missing-scene")).toThrow(
      "Fortune pool is empty",
    );
  });
});
