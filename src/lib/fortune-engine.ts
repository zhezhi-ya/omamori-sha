import { CATEGORY_DRAW_MODIFIER, FORTUNE_RARITY_WEIGHTS } from "@/constants/fortune";
import type { DailyDrawRecord, Fortune, OmamoriRouteId } from "@/types/omikuji";
import { getShanghaiDateKey } from "@/lib/date";

function hashSeed(input: string): number {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createMulberry32(seed: number): () => number {
  let value = seed;

  return () => {
    value += 0x6d2b79f5;
    let temp = Math.imul(value ^ (value >>> 15), value | 1);
    temp ^= temp + Math.imul(temp ^ (temp >>> 7), temp | 61);
    return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296;
  };
}

function getFortuneWeight(fortune: Fortune): number {
  return FORTUNE_RARITY_WEIGHTS[fortune.rarity] * CATEGORY_DRAW_MODIFIER[fortune.category];
}

export function filterFortunesForScene(fortunes: Fortune[], sceneId?: string): Fortune[] {
  if (!sceneId) {
    return fortunes;
  }

  return fortunes.filter((fortune) => fortune.relatedSceneIds?.includes(sceneId));
}

export function pickDailyFortune(
  fortunes: Fortune[],
  userId: string,
  dateKey = getShanghaiDateKey(),
  sceneId?: string,
): Fortune {
  const scenePool = filterFortunesForScene(fortunes, sceneId);
  if (scenePool.length === 0) {
    throw new Error(`Fortune pool is empty for scene: ${sceneId ?? "all"}.`);
  }

  const seed = hashSeed(`${userId}:${dateKey}:${sceneId ?? "all"}:cyber-omamori-sha`);
  const random = createMulberry32(seed);
  const weightedPool = scenePool.map((fortune) => ({
    fortune,
    weight: getFortuneWeight(fortune),
  }));

  const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);
  let target = random() * totalWeight;

  for (const item of weightedPool) {
    target -= item.weight;
    if (target <= 0) {
      return item.fortune;
    }
  }

  return scenePool[0];
}

export function createTodayRecord(
  fortune: Fortune,
  dateKey = getShanghaiDateKey(),
  routeId?: OmamoriRouteId,
): DailyDrawRecord {
  return {
    dateKey,
    drawnAt: new Date().toISOString(),
    fortune,
    routeId,
  };
}
