"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion as useMotionReducedMotion } from "motion/react";
import { AmbientAudioController } from "@/components/ambient-audio-controller";
import { FortuneCard } from "@/components/fortune-card";
import { FortunePaper } from "@/components/fortune-paper";
import { SettingsModal } from "@/components/settings-modal";
import { ShrineScene } from "@/components/shrine-scene";
import { categoryAccentFallback, characterThemeMap } from "@/constants/design-tokens";
import { getOmamoriRoute, isOmamoriRouteId, OMAMORI_ROUTE_LIST } from "@/constants/fortune";
import { buildShareText, copyTextSafely, getDisplayFortuneTitle } from "@/lib/utils";
import { useOmamoriStore } from "@/store/omamori-store";
import type { OmamoriRouteId, OmikujiCategory, SavedFortune } from "@/types/omikuji";

interface CollectionListProps {
  categories: OmikujiCategory[];
}

function getSavedFortuneRouteId(fortune: SavedFortune): OmamoriRouteId {
  if (fortune.routeId && fortune.relatedSceneIds?.includes(fortune.routeId)) {
    return fortune.routeId;
  }

  const relatedRouteId = fortune.relatedSceneIds?.find(isOmamoriRouteId);
  return relatedRouteId ?? "hakurei";
}

export function CollectionList({ categories }: CollectionListProps) {
  const prefersReducedMotion = useMotionReducedMotion();
  const [copyState, setCopyState] = useState<{ id: null | string; status: "idle" | "copied" | "failed" }>({
    id: null,
    status: "idle",
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [routeFilter, setRouteFilter] = useState<"all" | OmamoriRouteId>("all");
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const {
    initialize,
    favorites,
    settings,
    removeFavorite,
    updateSettings,
    clearLocalRecords,
    notice,
    showNotice,
    clearNotice,
  } = useOmamoriStore((state) => state);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (copyState.status === "idle" || !copyState.id) {
      return;
    }

    const timer = window.setTimeout(
      () => setCopyState({ id: null, status: "idle" }),
      copyState.status === "failed" ? 2600 : 1800,
    );
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const visibleFavorites = useMemo(
    () => (routeFilter === "all" ? favorites : favorites.filter((item) => getSavedFortuneRouteId(item) === routeFilter)),
    [favorites, routeFilter],
  );
  const selected = useMemo<SavedFortune | null>(
    () => visibleFavorites.find((item) => item.id === selectedId) ?? visibleFavorites[0] ?? null,
    [visibleFavorites, selectedId],
  );
  const selectedRoute = getOmamoriRoute(selected ? getSavedFortuneRouteId(selected) : settings.defaultRouteId);
  const selectedCategory = selected ? categories.find((item) => item.id === selected.category) : categories[0];
  const selectedTheme = selected ? characterThemeMap[selected.character] : null;
  const stageTint =
    selectedTheme?.stageGlow ??
    (selectedCategory ? `${selectedCategory.accent}22` : `${categoryAccentFallback.study}22`);
  const stageAura =
    selectedTheme?.stageAura ??
    (selectedCategory ? `radial-gradient(circle at 50% 20%, ${selectedCategory.glow}22, transparent 26%)` : undefined);
  const reducedMotion = Boolean(prefersReducedMotion || settings.reduceMotion);

  const handleCopy = async (fortune: SavedFortune) => {
    const copiedSuccessfully = await copyTextSafely(buildShareText(fortune, getOmamoriRoute(getSavedFortuneRouteId(fortune))));
    if (copiedSuccessfully) {
      setCopyState({ id: fortune.id, status: "copied" });
      showNotice({
        tone: "success",
        title: "签册文案已复制",
        message: `${fortune.character} 的这张签文可以直接分享了。`,
      });
      return;
    }

    setCopyState({ id: fortune.id, status: "failed" });
    showNotice({
      tone: "error",
      title: "复制没有成功",
      message: "浏览器没有完成自动复制，你仍然可以手动复制签册中的文字。",
    });
  };

  const handleConfirmReset = () => {
    clearLocalRecords();
    setCopyState({ id: null, status: "idle" });
    setSelectedId(null);
    setResetConfirmOpen(false);
    setSettingsOpen(false);
    showNotice({
      tone: "info",
      title: "签册已清空",
      message: "本地保存的签册、设置与访客标识都已经被重置。",
    });
  };

  const handleRemoveFavorite = (fortune: SavedFortune) => {
    if (selectedId === fortune.id) {
      setSelectedId(null);
    }

    removeFavorite(fortune.id);
    showNotice({
      tone: "info",
      title: "已从签册移除",
      message: `${fortune.character} 的这张签纸已经从本地签册中删除。`,
    });
  };

  return (
    <>
      <AmbientAudioController />
      <ShrineScene
        title="本地签册"
        tagline="十四场景本地签册"
        description=""
        notice={notice}
        onDismissNotice={clearNotice}
        stageTint={stageTint}
        stageAura={stageAura}
        reducedMotion={reducedMotion}
        routeConfig={selectedRoute}
        actions={
          <>
            <Link
              href="/"
              className="glass-panel min-h-11 rounded-full px-4 py-2 text-sm text-ink-primary transition hover:border-white/20 hover:text-white"
            >
              返回首页
            </Link>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              className="glass-panel min-h-11 rounded-full px-4 py-2 text-sm text-ink-primary transition hover:border-white/20 hover:text-white"
            >
              设置
            </button>
          </>
        }
        stage={
          <div className="space-y-4 lg:-mt-3">
            <div className="glass-panel collection-panel rounded-[1.75rem] p-5">
              <p className="text-xs tracking-[0.24em] text-[#5f4555] uppercase">本地签册数</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="soft-title text-5xl text-[#352632]">{favorites.length}</span>
                <span className="pb-2 text-sm text-[#5f4555]">枚已收入签册</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRouteFilter("all");
                    setSelectedId(null);
                  }}
                  aria-pressed={routeFilter === "all"}
                  className="min-h-11 rounded-full border border-[#7a5d6e]/18 bg-white/54 px-4 py-2 text-sm text-[#493344] transition hover:border-[#7a5d6e]/28 hover:bg-white/72 aria-pressed:border-[#e84f72]/38 aria-pressed:bg-white/82"
                >
                  全部入口
                </button>
                {OMAMORI_ROUTE_LIST.map((route) => (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => {
                      setRouteFilter(route.id);
                      setSelectedId(null);
                    }}
                    aria-pressed={routeFilter === route.id}
                    className="min-h-11 rounded-full border bg-white/54 px-4 py-2 text-sm transition hover:bg-white/72 aria-pressed:bg-white/82"
                    style={{ borderColor: routeFilter === route.id ? `${route.visual.accent}66` : "rgba(122,93,110,0.18)" }}
                  >
                    {route.label}
                  </button>
                ))}
              </div>
            </div>

            {visibleFavorites.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visibleFavorites.map((fortune) => (
                  <motion.article
                    key={fortune.id}
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reducedMotion ? { duration: 0.16 } : { duration: 0.26, ease: "easeOut" }}
                    className="glass-panel collection-panel rounded-[1.6rem] p-4 transition"
                    style={
                      selected?.id === fortune.id
                        ? {
                            borderColor: `${selectedTheme?.frame ?? selectedCategory?.accent ?? "#78d9e8"}66`,
                            background:
                              selectedTheme?.crest ??
                              "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
                          }
                        : undefined
                    }
                  >
                    <p className="text-xs tracking-[0.24em] text-[#5f4555] uppercase">
                      来源入口：{getOmamoriRoute(getSavedFortuneRouteId(fortune)).label}
                    </p>
                    <h3 className="soft-title mt-3 text-2xl text-[#352632]">
                      {getDisplayFortuneTitle(fortune.title, fortune.character)}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5f4555]">{fortune.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedId(fortune.id)}
                        aria-pressed={selected?.id === fortune.id}
                        className="min-h-11 rounded-full border border-[#7a5d6e]/18 bg-white/54 px-4 py-2 text-sm text-[#493344] transition hover:border-[#7a5d6e]/28 hover:bg-white/72"
                      >
                        {selected?.id === fortune.id ? "正在查看" : "查看详情"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(fortune)}
                        className="min-h-11 rounded-full border border-[#7a5d6e]/18 bg-white/54 px-4 py-2 text-sm text-[#493344] transition hover:border-[#7a5d6e]/28 hover:bg-white/72"
                      >
                        {copyState.id === fortune.id && copyState.status === "copied"
                          ? "已复制"
                          : copyState.id === fortune.id && copyState.status === "failed"
                            ? "请手动复制"
                            : "复制签文"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFavorite(fortune)}
                        className="min-h-11 rounded-full border border-[#d35d61]/24 bg-[#d35d61]/10 px-4 py-2 text-sm text-[#ffb5b7] transition hover:border-[#d35d61]/40"
                      >
                        移出签册
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="glass-panel collection-panel rounded-[1.75rem] p-6">
                <h3 className="soft-title text-2xl text-[#352632]">签册还空着</h3>
                <p className="mt-3 max-w-lg text-sm leading-7 text-[#5f4555]">
                  {routeFilter === "all"
                    ? "当你在首页遇到想留下的今日签时，点一下“收进签册”，它就会出现在这里。"
                    : `${getOmamoriRoute(routeFilter).label} 还没有收入签册的签文。换个入口看看，或者先回首页再抽一枚。`}
                </p>
              </div>
            )}
          </div>
        }
        aside={
          selected ? (
            <FortunePaper open rarity={selected.rarity} reducedMotion={reducedMotion}>
              <FortuneCard
                fortune={selected}
                categories={categories}
                isFavorite
                copyStatus={
                  copyState.id === selected.id
                    ? copyState.status
                    : "idle"
                }
                reducedMotion={reducedMotion}
                onToggleFavorite={() => handleRemoveFavorite(selected)}
                onCopy={() => handleCopy(selected)}
                readOnly
                routeConfig={selectedRoute}
              />
            </FortunePaper>
          ) : (
            <div className="glass-panel collection-panel rounded-[2rem] p-5">
              <p className="text-xs tracking-[0.24em] text-[#5f4555] uppercase">签册详情</p>
              <p className="mt-3 text-sm leading-7 text-[#5f4555]">先收进签册一枚喜欢的签，这里才会显示它的完整内容。</p>
            </div>
          )
        }
        footer={
          <div className="glass-panel collection-panel rounded-[1.75rem] p-4">
            <p className="text-xs tracking-[0.24em] text-[#5f4555] uppercase">说明</p>
            <p className="mt-2 text-sm leading-7 text-[#493344]">
              签册会把每一枚签纸留在本地。等你再次翻开它时，入口、人物与当日签意都会一并回来。
            </p>
          </div>
        }
      />

      <SettingsModal
        open={settingsOpen}
        settings={settings}
        reducedMotion={reducedMotion}
        routeConfig={selectedRoute}
        onClose={() => {
          setSettingsOpen(false);
          setResetConfirmOpen(false);
        }}
        onChange={updateSettings}
        onResetRequest={() => setResetConfirmOpen(true)}
        resetConfirmOpen={resetConfirmOpen}
        onCancelReset={() => setResetConfirmOpen(false)}
        onConfirmReset={handleConfirmReset}
      />
    </>
  );
}
