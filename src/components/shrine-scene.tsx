"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { particleOffsets } from "@/constants/design-tokens";
import { OMAMORI_ROUTES } from "@/constants/fortune";
import { assetPath, optimizedImageFallbackPath } from "@/lib/paths";
import type { OmamoriRouteConfig, SceneNotice } from "@/types/omikuji";

interface ShrineSceneProps {
  title: string;
  tagline: string;
  description: string;
  actions?: React.ReactNode;
  stage: React.ReactNode;
  aside?: React.ReactNode;
  footer?: React.ReactNode;
  notice?: SceneNotice | null;
  onDismissNotice?: () => void;
  stageTint?: string;
  stageAura?: string;
  reducedMotion?: boolean;
  routeConfig?: OmamoriRouteConfig;
  useRitualBackdrop?: boolean;
  compact?: boolean;
}

function SceneRouteLayers({ route, useRitualBackdrop = false }: { route: OmamoriRouteConfig; useRitualBackdrop?: boolean }) {
  const backdropImage = useRitualBackdrop && route.ritualImage ? route.ritualImage : route.sceneImage;

  return (
    <>
      <FallbackImage
        src={backdropImage}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        className={useRitualBackdrop ? "object-cover opacity-[0.94]" : "object-cover opacity-[0.96]"}
      />
      <div className="absolute inset-0 bg-[image:var(--asset-washi-noise)] opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,249,238,0.05)_50%,rgba(70,43,54,0.42))]" />
    </>
  );
}

type FallbackImageProps = Omit<React.ComponentProps<typeof Image>, "src"> & {
  src: string;
};

function FallbackImage({ src, onError, ...props }: FallbackImageProps) {
  const [imageState, setImageState] = useState({ source: src, resolved: src });
  const resolvedSrc = imageState.source === src ? imageState.resolved : src;
  const fallbackSrc = optimizedImageFallbackPath(src);

  return (
    <Image
      key={src}
      {...props}
      alt={props.alt ?? ""}
      src={assetPath(resolvedSrc)}
      onError={(event) => {
        if (fallbackSrc && resolvedSrc !== fallbackSrc) {
          setImageState({ source: src, resolved: fallbackSrc });
          return;
        }

        onError?.(event);
      }}
    />
  );
}

export function ShrineScene({
  title,
  tagline,
  description,
  actions,
  stage,
  aside,
  footer,
  notice,
  onDismissNotice,
  stageTint,
  stageAura,
  reducedMotion = false,
  routeConfig = OMAMORI_ROUTES.hakurei,
  useRitualBackdrop = false,
  compact = false,
}: ShrineSceneProps) {
  const hasPageRitualBackdrop = compact && useRitualBackdrop && Boolean(routeConfig.ritualImage);
  const pageBackdropImage = routeConfig.ritualImage ?? routeConfig.sceneImage;

  useEffect(() => {
    if (!notice || !onDismissNotice) {
      return;
    }

    const timer = window.setTimeout(onDismissNotice, notice.tone === "error" ? 4600 : 3200);
    return () => window.clearTimeout(timer);
  }, [notice, onDismissNotice]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={
        compact
          ? "scene-shell h-dvh overflow-hidden px-3 py-3 sm:px-5 sm:py-4 lg:px-6"
          : "scene-shell min-h-screen px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
      }
    >
      <AnimatePresence>
        {notice ? (
          <motion.div
            key={notice.id}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.96 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.16 : 0.24, ease: "easeOut" }}
            className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex justify-center px-4"
            aria-live={notice.tone === "error" ? "assertive" : "polite"}
            role={notice.tone === "error" ? "alert" : "status"}
          >
            <div className="glass-panel pointer-events-auto w-full max-w-lg rounded-[1.9rem] border border-white/12 px-5 py-4 shadow-[0_22px_66px_rgba(0,0,0,0.32)]">
              <div className="flex items-start gap-3.5">
                <span
                  className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                  style={{
                    background:
                      notice.tone === "success"
                        ? "#78d9e8"
                        : notice.tone === "error"
                          ? "#d35d61"
                          : "#d9b26f",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-base text-[#493344]">{notice.title}</p>
                  {notice.message ? (
                    <p className="mt-1.5 text-sm leading-6 text-ink-secondary">{notice.message}</p>
                  ) : null}
                </div>
                {onDismissNotice ? (
                  <button
                    type="button"
                    onClick={onDismissNotice}
                    className="min-h-11 rounded-full border border-white/10 px-3.5 text-sm text-ink-secondary transition hover:border-white/18 hover:text-white"
                    aria-label="关闭提示"
                  >
                    关闭
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div
        className={
          compact
            ? "relative mx-auto flex h-[calc(100dvh-1.5rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.48),rgba(255,247,235,0.24))] px-3 py-3 shadow-[0_30px_100px_rgba(149,97,90,0.16)] sm:h-[calc(100dvh-2rem)] sm:rounded-[2.25rem] sm:px-6 sm:py-5"
            : "mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-col rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,247,235,0.58))] px-5 py-5 shadow-[0_30px_100px_rgba(149,97,90,0.16)] sm:rounded-[2.5rem] sm:px-8 sm:py-8"
        }
      >
        {hasPageRitualBackdrop ? (
          <div className="pointer-events-none absolute inset-0">
            <FallbackImage
              src={pageBackdropImage}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 100vw"
              loading="eager"
              priority
              className="object-cover object-[50%_30%] opacity-[0.94] lg:object-center lg:opacity-[0.98]"
            />
            <div className="absolute inset-0 bg-[image:var(--asset-washi-noise)] opacity-[0.08] lg:opacity-[0.1]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.44)_0%,rgba(255,246,235,0.2)_28%,rgba(53,32,42,0.28)_100%)] lg:bg-[linear-gradient(180deg,rgba(28,18,26,0.58)_0%,rgba(74,47,58,0.26)_36%,rgba(255,247,236,0.58)_100%)]" />
            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(28,18,26,0.66)_0%,rgba(62,38,48,0.38)_46%,rgba(255,244,229,0.14)_100%)] lg:block" />
          </div>
        ) : null}
        <header className={compact ? "relative z-20 flex shrink-0 flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between" : "relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"}>
          <div className={compact ? "max-w-2xl pr-28 sm:pr-0" : "max-w-2xl"}>
            <p className={hasPageRitualBackdrop ? "text-xs tracking-[0.32em] text-[#6d5664] uppercase drop-shadow-[0_1px_10px_rgba(255,255,255,0.66)] lg:text-white/84 lg:drop-shadow-[0_2px_14px_rgba(20,12,18,0.5)]" : "text-xs tracking-[0.35em] text-ink-secondary uppercase"}>{tagline}</p>
            <h1 className={compact ? (hasPageRitualBackdrop ? "soft-title mt-1 text-3xl leading-tight text-[#493344] drop-shadow-[0_2px_14px_rgba(255,255,255,0.72)] sm:mt-2 sm:text-4xl lg:text-5xl lg:text-white lg:drop-shadow-[0_6px_26px_rgba(20,12,18,0.62)]" : "soft-title mt-1.5 text-3xl leading-tight text-[#493344] sm:mt-2 sm:text-4xl lg:text-5xl") : "soft-title mt-3 text-4xl leading-tight text-[#493344] sm:text-5xl lg:text-6xl"}>
              {title}
            </h1>
            {description ? (
              <p className={compact ? (hasPageRitualBackdrop ? "mt-1 max-w-2xl line-clamp-2 text-sm leading-6 text-[#6d5664] drop-shadow-[0_1px_10px_rgba(255,255,255,0.66)] sm:mt-2 lg:text-white/90 lg:drop-shadow-[0_2px_14px_rgba(20,12,18,0.56)]" : "mt-1.5 max-w-2xl line-clamp-2 text-sm leading-6 text-ink-secondary sm:mt-2") : "mt-4 max-w-xl text-sm leading-8 text-ink-secondary sm:text-base"}>
                {description}
              </p>
            ) : null}
          </div>
          <div className={compact ? "absolute top-0 right-0 flex items-center gap-1.5 sm:gap-2" : "flex flex-wrap items-center gap-3"}>{actions}</div>
        </header>

        <section className={compact ? "relative mt-2 flex min-h-0 flex-1 flex-col gap-2 sm:mt-3 sm:gap-3" : "relative mt-5 flex flex-1 flex-col gap-5"}>
          <div
            className={
              compact
                ? "relative min-h-0 flex-1 overflow-hidden rounded-[1.6rem] border border-white/52 px-2.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] sm:px-5 sm:py-4"
                : "relative overflow-hidden rounded-[2rem] border border-white/72 px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.64)] sm:px-6 lg:min-h-[650px] lg:px-8 lg:py-6"
            }
            style={{
              background: compact
                ? hasPageRitualBackdrop
                  ? "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,246,236,0.08))"
                  : `${stageAura ?? "radial-gradient(circle at 50% 20%,rgba(255,255,255,0.3),transparent 24%)"}, linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,246,236,0.1))`
                : `${stageAura ?? "radial-gradient(circle at 50% 20%,rgba(255,255,255,0.44),transparent 24%)"}, linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,246,236,0.22))`,
              boxShadow: stageTint
                ? `inset 0 0 0 1px ${compact ? "rgba(255,255,255,0.36)" : "rgba(255,255,255,0.52)"}, 0 30px 80px ${stageTint}`
                : undefined,
            }}
          >
            <div className="pointer-events-none absolute inset-0">
              {particleOffsets.map((particle) =>
                reducedMotion ? (
                  <span
                    key={`${particle.left}-${particle.top}`}
                    className="absolute h-2 w-2 rounded-full blur-[1px]"
                    style={{ left: particle.left, top: particle.top, opacity: 0.18, background: routeConfig.visual.particle }}
                  />
                ) : (
                  <motion.span
                    key={`${particle.left}-${particle.top}`}
                    className="absolute h-2 w-2 rounded-full blur-[1px]"
                    style={{ left: particle.left, top: particle.top, background: routeConfig.visual.particle }}
                    animate={{ y: [0, -18, 0], opacity: [0.14, 0.55, 0.18] }}
                    transition={{
                      duration: particle.duration,
                      delay: particle.delay,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                ),
              )}
              <div
                className="absolute inset-x-1/2 top-10 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl"
                style={{ background: stageTint ?? "rgba(120,217,232,0.1)" }}
              />
              <div
                className="absolute inset-x-1/2 top-16 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl"
                style={{ background: stageTint ? stageTint.replace("0.18", "0.1") : "rgba(153,122,226,0.1)" }}
              />
              {hasPageRitualBackdrop ? null : (
                <div className="absolute inset-0">
                  <SceneRouteLayers route={routeConfig} useRitualBackdrop={useRitualBackdrop} />
                </div>
              )}
            </div>
            <div className="relative z-10">{stage}</div>
          </div>

          {aside ? <div className="relative">{aside}</div> : null}
        </section>

        {footer ? <footer className="mt-6">{footer}</footer> : null}
      </div>
    </main>
  );
}
