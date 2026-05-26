"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { CATEGORY_LABELS, RARITY_LABELS, TIER_LABELS } from "@/constants/fortune";
import { characterThemeMap, luckyColorSwatches } from "@/constants/design-tokens";
import { cn, getDisplayFortuneTitle } from "@/lib/utils";
import { OMAMORI_ROUTES } from "@/constants/fortune";
import type { Fortune, OmamoriRouteConfig, OmikujiCategory } from "@/types/omikuji";

interface FortuneCardProps {
  fortune: Fortune;
  categories: OmikujiCategory[];
  isFavorite: boolean;
  copyStatus: "idle" | "copied" | "failed";
  reducedMotion: boolean;
  onToggleFavorite: () => void;
  onCopy: () => void;
  readOnly?: boolean;
  routeConfig?: OmamoriRouteConfig;
}

function getCategoryMeta(categories: OmikujiCategory[], categoryId: Fortune["category"]): OmikujiCategory | undefined {
  return categories.find((item) => item.id === categoryId);
}

function CharacterPortrait({
  fortune,
  image,
  imageSource,
  characterName,
  motif,
  frameColor,
  reducedMotion,
}: {
  fortune: Fortune;
  image?: string;
  imageSource?: string;
  characterName: string;
  motif: string;
  frameColor: string;
  reducedMotion: boolean;
}) {
  const theme = characterThemeMap[fortune.character];
  const fallbackHair = theme?.fallbackHair ?? "#2e2330";
  const fallbackAccent = theme?.fallbackAccent ?? frameColor;
  const fallbackMark = theme?.fallbackMark ?? characterName.slice(0, 2);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, scale: 0.92, rotate: -1.5 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: reducedMotion ? 0.18 : 0.46, ease: [0.21, 0.9, 0.24, 1] }}
      className="character-portrait relative min-h-[19rem] overflow-hidden rounded-[1.75rem] border"
      style={{
        borderColor: `${frameColor}30`,
        background: `${theme?.aura ?? `radial-gradient(circle at 35% 20%, ${frameColor}55, transparent 56%)`}, linear-gradient(180deg, rgba(37, 27, 42, 0.2), rgba(255, 249, 238, 0.72))`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.74),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(85,45,61,0.16))]" />
      <motion.div
        aria-hidden
        className="absolute -right-10 top-8 h-36 w-36 rounded-full blur-2xl"
        style={{ background: `${frameColor}66` }}
        animate={reducedMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.34, 0.58, 0.34] }}
        transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      {image ? (
        <>
          <Image
            src={image}
            alt={`${characterName} 角色图`}
            width={520}
            height={720}
            className="absolute inset-x-0 bottom-0 mx-auto h-full w-full object-contain object-bottom saturate-[0.92] sepia-[0.08] drop-shadow-[0_24px_40px_rgba(35,20,26,0.28)]"
            sizes="(max-width: 768px) 100vw, 360px"
          />
          <div className="absolute inset-0 bg-[url('/images/textures/washi-noise.svg')] opacity-[0.14] mix-blend-multiply" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 14%, rgba(255,255,255,0.2), transparent 30%), linear-gradient(180deg, ${frameColor}18, rgba(31,24,36,0.08) 38%, rgba(31,24,36,0.9))`,
            }}
          />
          <div className="absolute inset-3 rounded-[1.4rem] border border-white/24" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-end justify-center px-6 pb-7">
          <div className="relative h-64 w-52">
            <div
              className="absolute left-1/2 top-3 h-28 w-32 -translate-x-1/2 rounded-[48%_48%_42%_42%] shadow-[inset_0_-18px_22px_rgba(0,0,0,0.16)]"
              style={{ background: fallbackHair }}
            />
            <div className="absolute left-1/2 top-20 h-20 w-20 -translate-x-1/2 rounded-[44%_44%_48%_48%] bg-[#ffe8d1] shadow-[inset_0_-8px_12px_rgba(120,60,60,0.12)]" />
            <div className="absolute left-[4.8rem] top-[6.2rem] h-2 w-2 rounded-full bg-[#4b3034]" />
            <div className="absolute right-[4.8rem] top-[6.2rem] h-2 w-2 rounded-full bg-[#4b3034]" />
            <div className="absolute left-1/2 top-[7.45rem] h-1 w-8 -translate-x-1/2 rounded-full bg-[#cc8b84]" />
            <div
              className="absolute bottom-8 left-1/2 h-28 w-40 -translate-x-1/2 rounded-[44%_44%_22%_22%] border border-white/40 shadow-[0_20px_50px_rgba(46,30,42,0.22)]"
              style={{ background: `linear-gradient(180deg, ${fallbackAccent}f0, ${fallbackAccent}88)` }}
            />
            <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full border border-white/45 bg-white/22 px-3 py-1 text-[0.62rem] tracking-[0.2em] text-[#49372d] backdrop-blur">
              {fallbackMark}
            </div>
            <div className="absolute bottom-2 left-1/2 h-4 w-36 -translate-x-1/2 rounded-full bg-black/20 blur-lg" />
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="rounded-[1.15rem] border border-white/30 bg-[#2a2028]/58 px-4 py-3 text-white shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-md">
          <p className="text-[0.62rem] tracking-[0.24em] text-white/72 uppercase">{motif}</p>
          <p className="mt-1 soft-title text-2xl leading-tight">{characterName}</p>
          {imageSource ? <p className="mt-1 text-[0.62rem] text-white/58">图源：{imageSource}</p> : null}
        </div>
      </div>
    </motion.div>
  );
}

export function FortuneCard({
  fortune,
  categories,
  isFavorite,
  copyStatus,
  reducedMotion,
  onToggleFavorite,
  onCopy,
  readOnly = false,
  routeConfig = OMAMORI_ROUTES.hakurei,
}: FortuneCardProps) {
  const category = getCategoryMeta(categories, fortune.category);
  const characterTheme = characterThemeMap[fortune.character];
  const accent = category?.accent ?? "#b88d5d";
  const glow = category?.glow ?? "#f0d8a4";
  const frameColor = characterTheme?.frame ?? accent;
  const categoryLabel = category?.label || CATEGORY_LABELS[fortune.category] || "今日签";
  const tierLabel = TIER_LABELS[fortune.tier] || "未定签阶";
  const rarityLabel = RARITY_LABELS[fortune.rarity] || "未知稀有度";
  const characterName = fortune.character || "匿名来访者";
  const title = getDisplayFortuneTitle(fortune.title || "未命名签文", characterName);
  const archetype = fortune.archetype || "幻想乡来客";
  const quote = fortune.quote || "这张签会用角色自己的口吻，把今天该留意的重点说清楚。";
  const motif = fortune.motif || category?.motif || "签面纹样";
  const summary = fortune.summary || "今日的讯号还没说完，但它已经在朝你这边偏了。";
  const advice = fortune.advice || "先把节奏放慢半拍，再决定今天把力气交给哪件事。";
  const luckyColor = fortune.luckyColor || "薄金雾";
  const luckyColorSwatch = luckyColorSwatches[luckyColor] ?? accent;
  const luckyItem = fortune.luckyItem || "随身小物";
  const tags = Array.isArray(fortune.tags) && fortune.tags.length > 0 ? fortune.tags : ["电子签文"];
  const labels = routeConfig.copyLabels;
  const copyButtonLabel =
    copyStatus === "copied" ? "分享文案已复制" : copyStatus === "failed" ? "请手动复制签文" : "复制签文文案";
  const characterImage = fortune.characterImage ?? characterTheme?.portrait;
  const characterImageSource = fortune.characterImageSource ?? characterTheme?.portraitSource;

  return (
    <div className="relative space-y-6 overflow-hidden rounded-[2rem] border border-[#8f714b]/14 bg-[linear-gradient(180deg,rgba(255,252,245,0.92),rgba(237,220,190,0.88))] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.38)] sm:p-5">
      <div className="pointer-events-none absolute right-1 top-1 hidden h-40 w-40 sm:block lg:h-44 lg:w-44">
        <Image
          src={routeConfig.ritualAssets.resultCorner}
          alt=""
          fill
          sizes="8rem"
          className="object-contain opacity-85"
        />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.24em] text-[#7d6754] uppercase">
            <span
              className="rounded-full border px-3 py-1"
              style={{
                borderColor: `${accent}44`,
                background: `${glow}22`,
              }}
            >
              {categoryLabel}
            </span>
            <span className="rounded-full border border-[#a27f4f]/20 bg-[#fff7e8]/60 px-3 py-1">
              {tierLabel}
            </span>
            <span className="rounded-full border border-[#9871d1]/18 bg-[#f8f3ff]/70 px-3 py-1">
              {rarityLabel}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm tracking-[0.2em] text-[#8b7360]">{labels.heading}</p>
            <h2 className="soft-title text-3xl leading-tight text-[#2b2124] sm:text-4xl">{title}</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#6b5550]">
              <span className="font-medium">{characterName}</span>
              {fortune.alias ? <span>· {fortune.alias}</span> : null}
              {archetype ? <span>· {archetype}</span> : null}
            </div>
          </div>
        </div>
        <div
          className="relative min-w-[13.5rem] max-w-[18rem] overflow-hidden rounded-[1.5rem] border p-5"
          style={{
            borderColor: `${frameColor}30`,
            background: `${characterTheme?.crest ?? `linear-gradient(180deg, ${glow}26, rgba(255,255,255,0.5))`}`,
          }}
        >
          <p className="text-xs tracking-[0.24em] text-[#7b604e] uppercase">{labels.channel}</p>
          <p className="mt-2 text-base leading-6 text-[#3f3027]">{motif}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {characterTheme?.sigil ? (
              <span
                className="inline-flex rounded-full border px-3 py-1 text-[0.65rem] tracking-[0.22em] text-[#6d5448]"
                style={{
                  borderColor: `${frameColor}28`,
                  background: `${frameColor}12`,
                }}
              >
                {characterTheme.sigil}
              </span>
            ) : null}
            {fortune.rarity !== "common" ? (
              <span className="inline-flex rounded-full border border-[#a46adf]/22 bg-[#fbf6ff]/70 px-3 py-1 text-[0.65rem] tracking-[0.22em] text-[#7c5aa8] uppercase">
                {labels.rare}
              </span>
            ) : null}
          </div>
          {fortune.unlockedVisualTheme ? (
            <p className="mt-3 text-[0.65rem] leading-5 text-[#7a6452]">已触发稀有视觉回响</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="space-y-4"
        >
          <CharacterPortrait
            fortune={fortune}
            image={characterImage}
            imageSource={characterImageSource}
            characterName={characterName}
            motif={motif}
            frameColor={frameColor}
            reducedMotion={reducedMotion}
          />
          <div
            className="rounded-[1.5rem] border p-4 shadow-[0_16px_38px_rgba(78,48,26,0.08)]"
            style={{
              borderColor: `${frameColor}22`,
              background:
                characterTheme?.aura
                  ? `${characterTheme.aura}, linear-gradient(180deg, rgba(255,252,245,0.92), rgba(246,236,218,0.86))`
                  : "linear-gradient(180deg,rgba(255,252,245,0.92),rgba(246,236,218,0.86))",
            }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.6rem] border border-[#b18961]/20">
                {characterImage ? (
                  <Image
                    src={characterImage}
                    alt=""
                    width={160}
                    height={160}
                    className="h-full w-full object-cover object-top"
                    sizes="96px"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center soft-title text-3xl text-[#3d2a28]"
                    style={{
                      background: `${characterTheme?.aura ?? `radial-gradient(circle at 30% 20%, ${glow}88, transparent 36%)`}, linear-gradient(180deg, ${accent}33, rgba(30, 27, 42, 0.18))`,
                    }}
                  >
                    {characterName.slice(0, 1) || "御"}
                  </div>
                )}
                <div className="absolute inset-3 rounded-[1.1rem] border border-white/40" />
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-[0.22em] text-[#8b7664] uppercase">{labels.quote}</p>
                <p className="text-base leading-8 text-[#342922]">{quote}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#ae8f67]/16 bg-white/62 p-4 shadow-[0_16px_38px_rgba(78,48,26,0.06)]">
              <p className="text-xs tracking-[0.22em] text-[#8b7664] uppercase">{labels.summary}</p>
              <p className="mt-2 text-[0.98rem] leading-7 text-[#342922]">{summary}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#ae8f67]/16 bg-white/58 p-4 shadow-[0_16px_38px_rgba(78,48,26,0.06)]">
              <p className="text-xs tracking-[0.22em] text-[#8b7664] uppercase">{labels.advice}</p>
              <p className="mt-2 text-[0.98rem] leading-7 text-[#342922]">{advice}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="space-y-4"
        >
          <div className="rounded-[1.5rem] border p-4" style={{ borderColor: `${frameColor}18`, background: "rgba(255,255,255,0.58)" }}>
            <p className="text-xs tracking-[0.22em] text-[#8b7664] uppercase">{labels.luckyColor}</p>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="h-9 w-9 rounded-full border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_8px_18px_rgba(0,0,0,0.08)]"
                style={{
                  background: luckyColorSwatch,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.45), 0 0 0 1px ${frameColor}18, 0 8px 18px rgba(0,0,0,0.08)`,
                }}
              />
              <span className="text-base text-[#342922]">{luckyColor}</span>
            </div>
          </div>
          <div className="rounded-[1.5rem] border p-4" style={{ borderColor: `${frameColor}18`, background: "rgba(255,255,255,0.52)" }}>
            <p className="text-xs tracking-[0.22em] text-[#8b7664] uppercase">{labels.luckyItem}</p>
            <p className="mt-2 text-base text-[#342922]">{luckyItem}</p>
          </div>
          <div className="rounded-[1.5rem] border p-4" style={{ borderColor: `${frameColor}18`, background: "rgba(255,255,255,0.52)" }}>
            <p className="text-xs tracking-[0.22em] text-[#8b7664] uppercase">{labels.motif}</p>
            <p className="mt-2 text-base text-[#342922]">{motif}</p>
          </div>
          <div className="rounded-[1.5rem] border p-4" style={{ borderColor: `${frameColor}18`, background: "rgba(255,255,255,0.52)" }}>
            <p className="text-xs tracking-[0.22em] text-[#8b7664] uppercase">标签</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#a58360]/18 bg-[#fff9ec]/90 px-3 py-1 text-sm text-[#5a4537]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.24 }}
        className="space-y-3 border-t border-[#8f714b]/12 pt-2"
      >
        <p className="text-xs leading-6 text-[#7a6452]">东方Project同人风格角色签。</p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            className={cn(
              "min-h-11 rounded-full border px-4 py-2 text-sm transition-all",
              isFavorite
                ? "border-[#c56f72]/34 bg-[#fff0ef] text-[#9b4e52]"
                : "border-[#8f714b]/16 bg-white/50 text-[#5f4939] hover:border-[#c3996d]/34 hover:bg-white/80",
              readOnly ? "opacity-85" : "",
            )}
          >
            {isFavorite ? "移出签册" : "收进签册"}
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="min-h-11 rounded-full border border-[#8f714b]/16 bg-white/50 px-4 py-2 text-sm text-[#5f4939] transition-all hover:border-[#79d8e7]/28 hover:bg-white/80"
          >
            {copyButtonLabel}
          </button>
        </div>
        {copyStatus === "failed" ? (
          <p className="text-xs leading-6 text-[#8b6f61]" aria-live="polite">
            当前环境不支持自动复制，请手动复制这段签文文案。
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}
