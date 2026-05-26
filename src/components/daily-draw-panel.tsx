"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion as useMotionReducedMotion } from "motion/react";
import { AmbientAudioController } from "@/components/ambient-audio-controller";
import { FortuneCard } from "@/components/fortune-card";
import { FortunePaper } from "@/components/fortune-paper";
import { FortuneTube } from "@/components/fortune-tube";
import { SettingsModal } from "@/components/settings-modal";
import { ShrineScene } from "@/components/shrine-scene";
import { categoryAccentFallback, characterThemeMap } from "@/constants/design-tokens";
import { DRAW_TIMINGS, getOmamoriRoute, SCENE_CANDIDATES } from "@/constants/fortune";
import { getShanghaiReadableDate } from "@/lib/date";
import { omamoriAudio } from "@/lib/audio";
import { filterFortunesForScene } from "@/lib/fortune-engine";
import { assetPath } from "@/lib/paths";
import { buildShareText, cn, copyTextSafely } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { useOmamoriStore } from "@/store/omamori-store";
import type { Fortune, OmamoriRouteConfig, OmikujiCategory, SceneCandidate } from "@/types/omikuji";

type DrawPhase = "idle" | "closed" | "shaking" | "emerging" | "open" | "flash" | "revealed";

interface DailyDrawPanelProps {
  categories: OmikujiCategory[];
  fortunes: Fortune[];
}

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function SceneArtwork({
  scene,
  sizes,
  eager = false,
}: {
  scene: SceneCandidate;
  sizes: string;
  eager?: boolean;
}) {
  return (
    <>
      <Image
        src={assetPath(scene.sceneImage)}
        alt=""
        fill
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        sizes={sizes}
        className="object-cover transition duration-700 group-hover:scale-[1.045]"
      />
    </>
  );
}

function RouteSelectionPanel({
  currentRoute,
  onSelectRoute,
  onPreviewLocked,
  reducedMotion,
}: {
  currentRoute: OmamoriRouteConfig;
  onSelectRoute: (route: OmamoriRouteConfig) => void;
  onPreviewLocked: (scene: SceneCandidate) => void;
  reducedMotion: boolean;
}) {
  const [focusedSceneId, setFocusedSceneId] = useState<string>(() => currentRoute.id);
  const previewButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastWheelAt = useRef(0);
  const focusedScene =
    SCENE_CANDIDATES.find((scene) => scene.id === focusedSceneId) ??
    SCENE_CANDIDATES.find((scene) => scene.id === currentRoute.id) ??
    SCENE_CANDIDATES[0];
  const focusedIndex = Math.max(0, SCENE_CANDIDATES.findIndex((scene) => scene.id === focusedScene.id));

  const focusSceneAt = (targetIndex: number, moveDomFocus = false) => {
    const sceneCount = SCENE_CANDIDATES.length;
    const nextIndex = (targetIndex + sceneCount) % sceneCount;
    const nextScene = SCENE_CANDIDATES[nextIndex];
    setFocusedSceneId(nextScene.id);

    window.requestAnimationFrame(() => {
      const button = previewButtonRefs.current[nextScene.id];
      button?.scrollIntoView({ block: "nearest", inline: "nearest" });
      if (moveDomFocus) {
        button?.focus({ preventScroll: true });
      }
    });
  };

  const handleSceneAction = (scene: SceneCandidate) => {
    setFocusedSceneId(scene.id);

    if (scene.routeId) {
      omamoriAudio.playRitualPreview(scene.routeId);
      onSelectRoute(getOmamoriRoute(scene.routeId));
      return;
    }

    omamoriAudio.playRitualPreview(scene.id);
    onPreviewLocked(scene);
  };

  const previewScene = (scene: SceneCandidate) => {
    setFocusedSceneId(scene.id);
  };

  const handlePreviewKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      focusSceneAt(focusedIndex + 1, true);
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusSceneAt(focusedIndex - 1, true);
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusSceneAt(0, true);
    }

    if (event.key === "End") {
      event.preventDefault();
      focusSceneAt(SCENE_CANDIDATES.length - 1, true);
    }
  };

  const handlePreviewWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const wheelDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(wheelDelta) < 16) {
      return;
    }

    const now = Date.now();
    if (now - lastWheelAt.current < 180) {
      return;
    }

    lastWheelAt.current = now;
    focusSceneAt(focusedIndex + (wheelDelta > 0 ? 1 : -1));
  };

  return (
    <main id="main-content" tabIndex={-1} className="scene-shell h-dvh overflow-hidden px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
      <motion.section
        initial={reducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
        className="relative mx-auto h-[calc(100dvh-1.5rem)] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/74 bg-white/64 shadow-[0_34px_110px_rgba(147,110,84,0.18)] sm:h-[calc(100dvh-2rem)] sm:rounded-[2.4rem]"
      >
        <div className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={focusedScene.id}
              className="absolute inset-0"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0.18, scale: 1.012 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.08 : 0.24, ease: "easeOut" }}
            >
              <Image
                src={assetPath(focusedScene.sceneImage)}
                alt=""
                fill
                loading="eager"
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-[image:var(--asset-washi-noise)] opacity-[0.14]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,248,239,0.6)_0%,rgba(255,248,239,0.34)_39%,rgba(255,248,239,0.06)_66%,rgba(44,30,38,0.48)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03)_44%,rgba(47,31,39,0.58)_100%)]" />
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col gap-4 p-4 sm:p-6 lg:p-7">
          <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
            <div className="rounded-full border border-white/70 bg-white/54 px-4 py-2 text-xs tracking-[0.26em] text-[#5b4250] shadow-[0_10px_28px_rgba(72,42,50,0.1)] backdrop-blur uppercase">
              幻想乡场景
            </div>
            <div className="hidden rounded-full border border-white/62 bg-white/42 px-4 py-2 text-xs text-[#5b4250]/76 shadow-[0_10px_28px_rgba(72,42,50,0.08)] backdrop-blur sm:block">
              {getShanghaiReadableDate()}
            </div>
          </div>

          <div className="grid min-h-0 flex-1 items-end gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="max-w-3xl rounded-[1.75rem] border border-white/30 bg-white/16 p-4 pb-5 shadow-[0_20px_58px_rgba(72,42,50,0.12)] backdrop-blur-[2px] sm:bg-transparent sm:pt-0 sm:pr-0 sm:pb-2 sm:pl-3 sm:shadow-none sm:backdrop-blur-0 lg:pl-4">
              <p className="text-sm tracking-[0.28em] text-white/92 drop-shadow-[0_2px_10px_rgba(72,42,50,0.34)]">
                {focusedScene.subtitle}
              </p>
              <h1 className="soft-title mt-3 text-4xl leading-[1.06] text-white drop-shadow-[0_5px_22px_rgba(72,42,50,0.34)] sm:text-6xl lg:text-7xl">
                {focusedScene.label}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/94 drop-shadow-[0_2px_12px_rgba(72,42,50,0.24)] sm:text-base sm:leading-7">
                {focusedScene.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSceneAction(focusedScene)}
                  className="min-h-12 rounded-full border border-white/76 bg-white/74 px-5 py-3 text-sm text-[#604052] shadow-[0_18px_46px_rgba(72,42,50,0.16)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus-visible:-translate-y-0.5"
                >
                  进入{focusedScene.label}
                </button>
                <span
                  className="rounded-full border border-white/54 bg-white/34 px-4 py-2 text-xs text-white shadow-[0_12px_32px_rgba(72,42,50,0.1)] backdrop-blur"
                  style={{ borderColor: `${focusedScene.visual.accent}66` }}
                >
                  {focusedScene.cornerLabel}
                </span>
              </div>
            </div>

            <div className="min-h-0 min-w-0 pb-2">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs tracking-[0.24em] text-white/84 drop-shadow uppercase">场景</p>
              </div>
              <div
                className="thin-scrollbar flex max-w-full gap-3 overflow-x-auto pb-2 lg:max-h-[calc(100dvh-9.5rem)] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pr-2"
                aria-label="场景列表"
                onWheel={handlePreviewWheel}
              >
                {SCENE_CANDIDATES.map((scene, index) => {
                  const active = scene.id === focusedScene.id;

                  return (
                    <motion.button
                      key={scene.id}
                      ref={(node) => {
                        previewButtonRefs.current[scene.id] = node;
                      }}
                      type="button"
                      onClick={() => handleSceneAction(scene)}
                      onFocus={() => previewScene(scene)}
                      onPointerEnter={() => previewScene(scene)}
                      onKeyDown={handlePreviewKeyDown}
                      aria-pressed={active}
                      aria-label={`${scene.label}，可进入抽签`}
                      initial={reducedMotion ? false : { opacity: 0, x: 22 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.32, delay: reducedMotion ? 0 : Math.min(index * 0.025, 0.22), ease: "easeOut" }}
                      className={cn(
                        "group relative min-h-[9rem] w-[min(17.5rem,78vw)] flex-none overflow-hidden rounded-[1.45rem] border text-left shadow-[0_20px_54px_rgba(72,42,50,0.18)] transition hover:-translate-y-0.5 focus-visible:-translate-y-0.5 lg:min-h-[8.25rem] lg:w-full",
                        active ? "border-white/90" : "border-white/52",
                      )}
                      style={{
                        background: `linear-gradient(180deg, ${scene.visual.surface}, rgba(255,255,255,0.62))`,
                      }}
                    >
                      <div className="absolute inset-0">
                        <SceneArtwork
                          scene={scene}
                          sizes="(max-width: 1024px) 78vw, 25rem"
                          eager={false}
                        />
                        <div className="absolute inset-0 bg-[image:var(--asset-washi-noise)] opacity-[0.16]" />
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.12),rgba(57,33,42,0.18)),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(43,29,37,0.7))]" />
                      </div>
                      <div className="relative z-10 flex min-h-[9rem] flex-col justify-end p-3.5 lg:min-h-[8.25rem]">
                        <div>
                          <p className="line-clamp-1 text-xs tracking-[0.16em] text-white/88 drop-shadow">
                            {scene.subtitle}
                          </p>
                          <h2 className="soft-title mt-1.5 text-2xl leading-tight text-white drop-shadow-[0_3px_14px_rgba(72,42,50,0.34)]">
                            {scene.label}
                          </h2>
                          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-white/90 drop-shadow">
                            {scene.cardDescription}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export function DailyDrawPanel({ categories, fortunes }: DailyDrawPanelProps) {
  const mounted = useMounted();
  const prefersReducedMotion = useMotionReducedMotion();
  const [phase, setPhase] = useState<DrawPhase>("idle");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasConfirmedRouteThisSession, setHasConfirmedRouteThisSession] = useState(false);
  const [isPending, startTransition] = useTransition();
  const resultDialogRef = useRef<HTMLDivElement>(null);
  const resultCloseButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusBeforeResultRef = useRef<HTMLElement | null>(null);
  const hasCapturedResultFocusRef = useRef(false);

  const {
    initialize,
    isHydrated,
    selectedRouteId,
    todayRecord,
    favorites,
    settings,
    selectRoute,
    clearRouteSelection,
    drawFortune,
    toggleFavorite,
    updateSettings,
    clearLocalRecords,
    notice,
    showNotice,
    clearNotice,
  } = useOmamoriStore((state) => state);

  const reducedMotion = mounted && Boolean(prefersReducedMotion || settings.reduceMotion);
  const routeConfig = getOmamoriRoute(selectedRouteId ?? todayRecord?.routeId ?? settings.defaultRouteId);
  const recordRouteConfig = getOmamoriRoute(todayRecord?.routeId ?? routeConfig.id);
  const shouldShowRouteSelection =
    !isHydrated || !selectedRouteId || (settings.askRouteOnLaunch && !hasConfirmedRouteThisSession);
  const isBusy = isPending || isDrawing;
  const hasTodayRecordForCurrentRoute =
    todayRecord?.routeId === routeConfig.id && todayRecord.fortune.relatedSceneIds?.includes(routeConfig.id);
  const currentFortune = hasTodayRecordForCurrentRoute ? todayRecord.fortune : null;
  const isFavorite = currentFortune ? favorites.some((item) => item.id === currentFortune.id) : false;
  const visiblePhase = phase;
  const currentCategory = currentFortune ? categories.find((item) => item.id === currentFortune.category) : categories[0];
  const currentTheme = currentFortune ? characterThemeMap[currentFortune.character] : null;
  const showTube = !resultOpen;
  const activeRouteConfig = hasTodayRecordForCurrentRoute ? recordRouteConfig : routeConfig;
  const stageTint = currentTheme?.stageGlow ?? activeRouteConfig.visual.glow ?? (currentCategory ? `${currentCategory.accent}22` : `${categoryAccentFallback.study}22`);
  const stageAura =
    currentTheme?.stageAura ??
    `radial-gradient(circle at 50% 18%, ${activeRouteConfig.visual.glow}, transparent 28%), radial-gradient(circle at 24% 70%, ${activeRouteConfig.visual.shadow}, transparent 36%)`;

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (copyStatus === "idle") {
      return;
    }

    const timer = window.setTimeout(() => setCopyStatus("idle"), copyStatus === "failed" ? 2600 : 1800);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  useEffect(() => {
    if (resultOpen) {
      if (!hasCapturedResultFocusRef.current) {
        hasCapturedResultFocusRef.current = true;
        previousFocusBeforeResultRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const focusTimer = window.setTimeout(() => resultCloseButtonRef.current?.focus(), 40);

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          const focusableElements = resultDialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          );
          const focusables = Array.from(focusableElements ?? []).filter(
            (element) => !element.hasAttribute("hidden") && element.offsetParent !== null,
          );

          if (focusables.length > 0) {
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;

            if (!event.shiftKey && active === last) {
              event.preventDefault();
              first.focus();
              return;
            }

            if (event.shiftKey && active === first) {
              event.preventDefault();
              last.focus();
              return;
            }
          }
        }

        if (event.key === "Escape") {
          setResultOpen(false);
        }
      };

      window.addEventListener("keydown", onKeyDown);
      return () => {
        window.clearTimeout(focusTimer);
        window.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = previousOverflow;
      };
    }

    if (!hasCapturedResultFocusRef.current) {
      return;
    }

    hasCapturedResultFocusRef.current = false;
    previousFocusBeforeResultRef.current?.focus();
    previousFocusBeforeResultRef.current = null;
  }, [resultOpen]);

  const finishSequence = (fortune: Fortune) => {
    setPhase("revealed");
    setResultOpen(true);
    if (fortune.rarity !== "common") {
      showNotice({
        tone: "success",
        title: `稀有签文已出现：${fortune.title}`,
        message: `${fortune.character} 的寄语落到了今天的签纸上。`,
      });
    }
  };

  const handleDraw = async () => {
    if (!mounted || isBusy) {
      return;
    }

    if (fortunes.length === 0) {
      showNotice({
        tone: "error",
        title: "签池暂时不可用",
        message: "当前没有可抽取的签文数据，请稍后刷新页面再试。",
      });
      return;
    }

    if (filterFortunesForScene(fortunes, routeConfig.id).length === 0) {
      showNotice({
        tone: "error",
        title: "当前场景签池未配置",
        message: `没有找到归属于${routeConfig.label}的人物签文，请先补齐 relatedSceneIds 分类。`,
      });
      return;
    }

    if (hasTodayRecordForCurrentRoute) {
      setPhase("revealed");
      setResultOpen(true);
      return;
    }

    setIsDrawing(true);
    setResultOpen(false);

    try {
      setPhase("closed");
      await omamoriAudio.unlock();
      omamoriAudio.playBell(routeConfig.id);
      await wait(reducedMotion ? DRAW_TIMINGS.reducedBell : DRAW_TIMINGS.closed);

      setPhase("shaking");
      omamoriAudio.playTubeShake(routeConfig.id);
      await wait(reducedMotion ? DRAW_TIMINGS.reducedTube : DRAW_TIMINGS.shaking);

      setPhase("emerging");
      omamoriAudio.playPaper(routeConfig.id);
      await wait(reducedMotion ? DRAW_TIMINGS.reducedEmerging : DRAW_TIMINGS.emerging);

      let drawn: Fortune | null = null;
      startTransition(() => {
        drawn = drawFortune(fortunes, routeConfig.id);
      });

      setPhase("flash");
      await wait(reducedMotion ? DRAW_TIMINGS.reducedFlash : DRAW_TIMINGS.flash);
      finishSequence((drawn ?? fortunes[0]) as Fortune);
    } finally {
      setIsDrawing(false);
    }
  };

  const handleCopy = async () => {
    if (!currentFortune) {
      return;
    }

    const text = buildShareText(currentFortune, recordRouteConfig);
    const copiedSuccessfully = await copyTextSafely(text);
    if (copiedSuccessfully) {
      setCopyStatus("copied");
      showNotice({
        tone: "success",
        title: "分享文案已复制",
        message: `可以把 ${currentFortune.character} 的寄语发给今天想分享的人了。`,
      });
      return;
    }

    setCopyStatus("failed");
    showNotice({
      tone: "error",
        title: "自动复制失败",
        message: "当前浏览器环境没有完成复制，你仍然可以手动复制这张签文内容。",
    });
  };

  const handleConfirmReset = () => {
    clearLocalRecords();
    setCopyStatus("idle");
    setPhase("idle");
    setResultOpen(false);
    setResetConfirmOpen(false);
    setSettingsOpen(false);
    setHasConfirmedRouteThisSession(false);
    showNotice({
      tone: "info",
      title: "本地记录已清空",
      message: "今日签文记录、签册和场景设置都已重置，入口会重新等待选择。",
    });
  };

  const handleToggleFavorite = () => {
    if (!currentFortune) {
      return;
    }

    toggleFavorite(currentFortune, recordRouteConfig.id);
    showNotice(
      isFavorite
        ? {
            tone: "info",
            title: recordRouteConfig.stage.favoriteRemoved,
            message: `${currentFortune.character} 的这枚签纸被放回了${recordRouteConfig.shortLabel}的回声里。`,
          }
        : {
            tone: "success",
            title: recordRouteConfig.stage.favoriteAdded,
            message: `${currentFortune.character} 的寄语已经收入你的本地签册。`,
          },
    );
  };

  const statusText = useMemo(() => {
    if (!mounted) {
      return "正在准备入口...";
    }
    if (visiblePhase === "closed") {
      return activeRouteConfig.stage.ringing;
    }
    if (visiblePhase === "shaking") {
      return activeRouteConfig.stage.shaking;
    }
    if (visiblePhase === "emerging" || visiblePhase === "open" || visiblePhase === "flash") {
      return activeRouteConfig.stage.revealing;
    }
    if (hasTodayRecordForCurrentRoute) {
      return `${recordRouteConfig.resultTitle}已记录 · ${getShanghaiReadableDate()}`;
    }
    return `${activeRouteConfig.statusIdle} · ${getShanghaiReadableDate()}`;
  }, [mounted, visiblePhase, hasTodayRecordForCurrentRoute, activeRouteConfig, recordRouteConfig]);

  if (shouldShowRouteSelection) {
    return (
      <>
        <AmbientAudioController />
        <RouteSelectionPanel
          currentRoute={routeConfig}
          reducedMotion={reducedMotion}
          onSelectRoute={(route) => {
            selectRoute(route.id);
            setHasConfirmedRouteThisSession(true);
            window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
            showNotice({
              tone: "info",
            title: `已切换到${route.label}`,
            message: route.description,
          });
          }}
          onPreviewLocked={(scene) => {
            showNotice({
              tone: "info",
            title: `${scene.label}还没有开门`,
            message: "这处入口暂时只能听见一点场景回声。",
            });
          }}
        />
      </>
    );
  }

  return (
    <>
      <AmbientAudioController />
      <ShrineScene
        title={activeRouteConfig.label}
        tagline={activeRouteConfig.subtitle}
        description={activeRouteConfig.description}
        routeConfig={activeRouteConfig}
        useRitualBackdrop
        compact
        notice={notice}
        onDismissNotice={clearNotice}
        stageTint={stageTint}
        stageAura={stageAura}
        reducedMotion={reducedMotion}
        actions={
          <>
            <Link
              href="/collection"
              className="glass-panel min-h-11 rounded-full px-4 py-2 text-sm text-ink-primary transition hover:border-white/20 hover:text-white"
            >
              签册
            </Link>
            <button
              type="button"
              onClick={() => {
                setHasConfirmedRouteThisSession(false);
                setPhase("idle");
                setResultOpen(false);
                clearRouteSelection();
              }}
              className="glass-panel min-h-11 rounded-full px-4 py-2 text-sm text-ink-primary transition hover:border-white/20 hover:text-white"
            >
              {activeRouteConfig.backLabel}
            </button>
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
          <div className="relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden py-3">
            <motion.div
              aria-hidden
              className="absolute inset-x-1/2 top-14 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-cyan/16 blur-[90px]"
              animate={
                reducedMotion
                  ? undefined
                  : {
                      scale: visiblePhase === "idle" || visiblePhase === "revealed" ? [0.96, 1.06, 0.96] : [1, 1.38, 1.08],
                      opacity: visiblePhase === "idle" || visiblePhase === "revealed" ? [0.34, 0.58, 0.34] : [0.46, 0.92, 0.52],
                    }
              }
              transition={{ duration: visiblePhase === "idle" || visiblePhase === "revealed" ? 4.8 : 0.9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="absolute bottom-12 left-1/2 h-44 w-[32rem] -translate-x-1/2 rounded-full bg-accent-crimson/20 blur-[88px]"
              animate={reducedMotion ? undefined : { x: visiblePhase === "shaking" ? [-10, 18, -14, 10, 0] : [0, 10, 0] }}
              transition={{ duration: visiblePhase === "shaking" ? 0.65 : 5.2, repeat: visiblePhase === "shaking" ? 3 : Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />

            <div className="relative z-10 flex w-full flex-col items-center gap-4">
              <div className="text-center">
                <p className="text-xs tracking-[0.34em] text-white/84 drop-shadow uppercase">
                  {activeRouteConfig.stage.eyebrow}
                </p>
                <h2 className="soft-title mt-2 text-2xl text-white drop-shadow-[0_4px_18px_rgba(72,42,50,0.36)] sm:text-3xl lg:text-4xl">
                  {activeRouteConfig.stage.title}
                </h2>
                <p className="mx-auto mt-2 max-w-xl rounded-[1.25rem] border border-white/40 bg-white/28 px-4 py-2 text-sm leading-6 text-[#54384a] shadow-[0_14px_38px_rgba(72,42,50,0.08)] backdrop-blur-sm">
                  {activeRouteConfig.stage.description}
                </p>
              </div>

              <div className="relative flex min-h-[15.5rem] w-full items-center justify-center sm:min-h-[16.5rem]">
                {showTube ? (
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key="fortune-tube"
                      className="absolute"
                      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.78, rotate: -7, y: 24 }}
                      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: resultOpen ? 0 : reducedMotion ? 0.12 : 0.4, ease: [0.21, 0.9, 0.24, 1] }}
                    >
                      <FortuneTube
                        active={visiblePhase === "shaking"}
                        revealing={visiblePhase === "emerging" || visiblePhase === "open" || visiblePhase === "flash"}
                        ritualPhase={visiblePhase}
                        reducedMotion={reducedMotion}
                        disabled={isBusy}
                        label={activeRouteConfig.drawLabel}
                        variant={activeRouteConfig.id}
                        ritualAssets={activeRouteConfig.ritualAssets}
                        onClick={handleDraw}
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : null}
              </div>

              <motion.div
                className="mt-2 flex flex-col items-center gap-3 sm:mt-3"
                animate={reducedMotion ? undefined : visiblePhase === "emerging" || visiblePhase === "open" || visiblePhase === "flash" ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  type="button"
                  onClick={handleDraw}
                  disabled={isBusy}
                  className={cn(
                    "lantern-glow min-h-12 rounded-full border border-white/72 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,238,229,0.66))] px-7 py-3 text-sm tracking-[0.28em] text-[#6f3f52] uppercase transition",
                    "hover:translate-y-[-1px] hover:border-[#e84f72]/45 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                >
              {hasTodayRecordForCurrentRoute ? recordRouteConfig.revisitLabel : isBusy ? statusText : activeRouteConfig.drawLabel}
                </button>
              </motion.div>
            </div>
          </div>
        }
      />

      <AnimatePresence>
        {resultOpen && currentFortune ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#05070f]/72 px-3 py-6 backdrop-blur-xl sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.24 }}
            role="dialog"
            aria-modal="true"
            aria-label="今日签面"
            onClick={() => setResultOpen(false)}
          >
            <motion.div
              ref={resultDialogRef}
              className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto thin-scrollbar"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 26 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 14 }}
              transition={{ duration: reducedMotion ? 0.16 : 0.42, ease: [0.21, 0.9, 0.24, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                ref={resultCloseButtonRef}
                type="button"
                onClick={() => setResultOpen(false)}
                className="glass-panel sticky top-0 z-20 ml-auto mb-3 flex min-h-11 rounded-full px-4 py-2 text-sm text-ink-primary transition hover:border-white/20 hover:text-white"
              >
                关闭签面
              </button>
              <FortunePaper open rarity={currentFortune.rarity} reducedMotion={reducedMotion}>
                <FortuneCard
                  fortune={currentFortune}
                  categories={categories}
                  isFavorite={isFavorite}
                  copyStatus={copyStatus}
                  reducedMotion={reducedMotion}
                  onToggleFavorite={handleToggleFavorite}
                  onCopy={handleCopy}
                  routeConfig={recordRouteConfig}
                />
              </FortunePaper>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SettingsModal
        open={settingsOpen}
        settings={settings}
        reducedMotion={reducedMotion}
        routeConfig={activeRouteConfig}
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

