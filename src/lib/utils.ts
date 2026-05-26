import type { Fortune, OmamoriRouteConfig } from "@/types/omikuji";
import { CATEGORY_LABELS, RARITY_LABELS, TIER_LABELS } from "@/constants/fortune";

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function createStableId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getDisplayFortuneTitle(rawTitle: string, characterName: string): string {
  const title = rawTitle.trim() || "未命名签文";
  const compactName = characterName.replace(/\s+/g, "");
  const shortPrefix = Array.from(compactName).slice(0, 2).join("");
  const prefixCandidates = Array.from(new Set([compactName, shortPrefix].filter(Boolean))).sort(
    (first, second) => second.length - first.length,
  );

  for (const prefix of prefixCandidates) {
    if (title.length > prefix.length && title.startsWith(prefix)) {
      return title.slice(prefix.length).replace(/^[\s·・:：-]+/, "") || title;
    }
  }

  return title;
}

export async function copyTextSafely(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback to legacy copy flow below.
    }
  }

  if (typeof document === "undefined" || !document.body) {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  textarea.style.top = "0";
  textarea.style.left = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export function buildShareText(fortune: Fortune, routeConfig?: OmamoriRouteConfig): string {
  const categoryLabel = CATEGORY_LABELS[fortune.category] || "今日签";
  const tierLabel = TIER_LABELS[fortune.tier] || "未定签阶";
  const rarityLabel = RARITY_LABELS[fortune.rarity] || "未知稀有度";
  const labels = routeConfig?.copyLabels;
  const title = getDisplayFortuneTitle(fortune.title || "未命名签文", fortune.character || "匿名签主");

  return [
    `${routeConfig?.resultTitle ?? "今日签文"}已展开`,
    `【${fortune.character || "匿名签主"} / ${categoryLabel} / ${tierLabel}】${title}`,
    fortune.quote ? `${labels?.quote ?? "寄语"}：${fortune.quote}` : null,
    fortune.summary || "今日的讯号尚未完全显现。",
    `${labels?.advice ?? "建议"}：${fortune.advice || "先把节奏放慢半拍。"}`,
    `${labels?.luckyColor ?? "幸运色"}：${fortune.luckyColor || "薄雾金"} ｜ ${labels?.luckyItem ?? "幸运物"}：${fortune.luckyItem || "随身签纸"}`,
    `稀有度：${rarityLabel}`,
    "本页为东方Project同人风格致敬内容，非官方作品。",
    `来自「${routeConfig?.shareFrom ?? "御守社"}」`,
  ]
    .filter(Boolean)
    .join("\n");
}
