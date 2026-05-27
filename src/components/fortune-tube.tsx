"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { assetPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import type { OmamoriRouteId, RitualAssetSet } from "@/types/omikuji";

export type RitualPhase = "idle" | "closed" | "shaking" | "emerging" | "open" | "flash" | "revealed";

interface FortuneTubeProps {
  active: boolean;
  reducedMotion: boolean;
  disabled?: boolean;
  revealing?: boolean;
  ritualPhase?: RitualPhase;
  label?: string;
  variant?: OmamoriRouteId;
  ritualAssets?: RitualAssetSet;
  onClick: () => void;
}

const ritualAssetSizeClass = "h-[min(68vw,16.5rem)] w-[min(68vw,16.5rem)] sm:h-80 sm:w-80";
const ritualAssetSizes = "(max-width: 640px) 68vw, 20rem";

function RevealFlash({ reducedMotion, src }: { reducedMotion: boolean; src: string }) {
  return (
    <div
      aria-hidden
      data-ritual-layer="fx-reveal"
      className="absolute inset-0 z-0 ritual-fx-reveal"
      style={{
        animationDelay: reducedMotion ? "40ms" : undefined,
      }}
    >
      <Image src={assetPath(src)} alt="" fill sizes={ritualAssetSizes} className="object-contain" />
    </div>
  );
}

export function FortuneTube({
  active,
  reducedMotion,
  disabled,
  revealing = false,
  ritualPhase = revealing ? "emerging" : active ? "shaking" : "idle",
  label = "摇动抽签筒，抽取今日签文",
  variant = "hakurei",
  ritualAssets,
  onClick,
}: FortuneTubeProps) {
  const isScarlet = variant === "scarlet";
  const isEientei = variant === "eientei";
  const glowColor = isEientei ? "#65b987" : isScarlet ? "#e84f72" : "#d8b15f";
  const isClosed = ritualPhase === "closed";
  const isShaking = ritualPhase === "shaking";
  const isEmerging = ritualPhase === "emerging";
  const isOpen = ritualPhase === "open";
  const isFlash = ritualPhase === "flash";
  const isRevealed = ritualPhase === "revealed";
  const shouldShowBase = ritualPhase === "idle";
  const shouldShowClosedPaper = isClosed || isShaking;
  const shouldShowParticles = isShaking;
  const shouldShowEmerging = isEmerging;
  const shouldShowOpen = isOpen || isFlash || isRevealed;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "group relative flex items-end justify-center rounded-[2.8rem] bg-transparent",
        ritualAssets ? `${ritualAssetSizeClass} pb-0` : "h-64 w-48 pb-7",
        "drop-shadow-[0_30px_64px_rgba(0,0,0,0.42)] transition-opacity disabled:cursor-not-allowed",
      )}
      data-ritual-phase={ritualPhase}
      data-ritual-variant={variant}
      animate={
        active && !reducedMotion
          ? { rotate: [0, -1.8, 1.9, -1.2, 1, 0], x: [0, -2, 2, -1, 1, 0], y: [0, -1, 1, 0] }
          : { rotate: 0, x: 0, y: 0 }
      }
      transition={{ duration: active ? 0.96 : 1.35, ease: [0.2, 0.85, 0.24, 1] }}
      whileHover={disabled || reducedMotion ? undefined : { scale: 1.025, y: -3 }}
      whileTap={disabled || reducedMotion ? undefined : { scale: 0.98 }}
    >
      <motion.span
        aria-hidden
        className="absolute inset-x-1/2 bottom-8 h-24 w-24 -translate-x-1/2 rounded-full bg-[#d8b15f]/18 blur-2xl sm:h-36 sm:w-36 sm:blur-3xl"
        style={{ background: `${glowColor}2e` }}
        animate={
          active && !reducedMotion
            ? { opacity: [0.28, 0.84, 0.38], scale: [0.85, 1.35, 1.06] }
            : { opacity: [0.28, 0.44, 0.28], scale: [0.95, 1.08, 0.95] }
        }
        transition={{ duration: active ? 0.7 : 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      {ritualAssets ? (
        <div
          className={cn("relative z-10", ritualAssetSizeClass)}
          data-ritual-stage="asset-stack"
          data-reduced-motion={reducedMotion ? "true" : "false"}
        >
          {shouldShowBase ? (
            <motion.div
              aria-hidden
              data-ritual-layer="ritual-base"
              className="absolute inset-0"
              animate={reducedMotion ? { scale: 1 } : { scale: [1, 1.012, 1] }}
              transition={{ duration: 4.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <Image
                src={assetPath(ritualAssets.ritualBase)}
                alt=""
                fill
                sizes={ritualAssetSizes}
                fetchPriority="high"
                className="object-contain"
              />
            </motion.div>
          ) : null}
          {shouldShowClosedPaper ? (
            <div
              aria-hidden
              data-ritual-layer="paper-closed"
              className={cn(
                "absolute inset-0",
                isClosed && "ritual-paper-closed-closed",
                isShaking && "ritual-paper-closed-shaking",
              )}
            >
              <Image src={assetPath(ritualAssets.paperClosed)} alt="" fill sizes={ritualAssetSizes} className="object-contain" />
            </div>
          ) : null}
          {shouldShowEmerging ? (
            <div
              aria-hidden
              data-ritual-layer="paper-emerging"
              className="absolute inset-0 ritual-paper-emerging"
            >
              <Image src={assetPath(ritualAssets.paperEmerging)} alt="" fill sizes={ritualAssetSizes} className="object-contain" />
            </div>
          ) : null}
          {shouldShowParticles ? (
            <div
              aria-hidden
              data-ritual-layer="fx-particles"
              className="absolute inset-0 ritual-fx-particles-shaking"
            >
              <Image src={assetPath(ritualAssets.fxParticles)} alt="" fill sizes={ritualAssetSizes} className="object-contain" />
            </div>
          ) : null}
          {isFlash ? (
            <RevealFlash reducedMotion={reducedMotion} src={ritualAssets.fxReveal} />
          ) : null}
          {shouldShowOpen ? (
            <div
              aria-hidden
              data-ritual-layer="paper-open"
              className={cn("absolute inset-0 z-10", isOpen || isFlash ? "ritual-paper-open" : "ritual-paper-open-revealed")}
            >
              <Image src={assetPath(ritualAssets.paperOpen)} alt="" fill sizes={ritualAssetSizes} className="object-contain" />
            </div>
          ) : null}
        </div>
      ) : (
      <motion.div
        className={cn(
          "relative z-10 flex h-56 w-32 flex-col items-center overflow-hidden border shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-24px_48px_rgba(0,0,0,0.34),0_20px_48px_rgba(0,0,0,0.34)]",
          isEientei
            ? "rounded-[1.6rem] border-[#65b987]/36 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.76),rgba(201,244,211,0.86)_50%,rgba(101,185,135,0.88)_100%)]"
            : isScarlet
              ? "rounded-[1.6rem] border-[#e84f72]/30 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.78),rgba(255,205,220,0.9)_48%,rgba(232,79,114,0.88)_100%)]"
              : "rounded-[2.2rem] border-[#f2caa0]/38 bg-[radial-gradient(circle_at_50%_12%,rgba(255,222,175,0.72),rgba(132,57,42,0.92)_44%,rgba(37,22,22,0.98)_100%)]",
        )}
        animate={revealing && !reducedMotion ? { scale: [1, 1.08, 0.98, 1], y: [0, -8, 2, 0] } : { scale: 1, y: 0 }}
        transition={{ duration: 0.62, ease: "easeOut" }}
      >
        {isEientei ? (
          <>
            <div className="mt-5 h-5 w-24 rounded-full border border-white/70 bg-[#f7fff7]/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.56)]" />
            <div className="relative mt-8 h-28 w-28 rounded-full border border-[#65b987]/42">
              <div className="absolute inset-5 rounded-full border border-white/70" />
              <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-white/70" />
              <div className="absolute top-1/2 left-0 h-[1px] w-full -translate-y-1/2 bg-white/70" />
              <motion.span
                className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-[#d6b8ff] shadow-[0_0_18px_rgba(214,184,255,0.72)]"
                animate={active && !reducedMotion ? { x: [-5, 24, -18, -5], y: [-5, -24, 18, -5] } : { x: -5, y: -5 }}
                transition={{ duration: 0.9, repeat: active ? 1 : 0, ease: "easeInOut" }}
              />
            </div>
            <div className="mt-5 text-[0.56rem] tracking-[0.18em] text-[#4f8f6d]/70">MOON SIGN</div>
          </>
        ) : isScarlet ? (
          <>
            <div className="mt-5 h-5 w-24 rounded-full border border-white/70 bg-white/54 shadow-[inset_0_1px_0_rgba(255,255,255,0.48)]" />
            <div className="mt-6 grid w-full flex-1 grid-cols-2 gap-2 px-5 pb-8">
              {Array.from({ length: 6 }, (_, index) => (
                <motion.span
                  key={index}
                  className="self-end rounded-xl border border-white/60 bg-gradient-to-b from-[#fff8f6] to-[#e84f72]"
                  style={{ height: `${34 + (index % 3) * 20}px` }}
                  animate={
                    active && !reducedMotion
                      ? { y: [0, -10 - (index % 2) * 5, 6, 0], opacity: [0.72, 1, 0.86] }
                      : { y: 0, opacity: 0.86 }
                  }
                  transition={{ duration: 0.72, delay: index * 0.026, ease: "easeInOut" }}
                />
              ))}
            </div>
            <div className="absolute inset-x-5 top-12 h-[2px] rounded-full bg-white/16" />
          </>
        ) : (
          <>
            <div className="mt-5 h-5 w-24 rounded-full border border-[#f0d2b6]/36 bg-[#271923]/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" />
            <div className="mt-5 grid w-full flex-1 grid-cols-4 gap-1.5 px-4 pb-8">
              {Array.from({ length: 12 }, (_, index) => (
                <motion.span
                  key={index}
                  className="self-end rounded-full bg-gradient-to-b from-[#ffe9bc] via-[#d9a25f] to-[#8f5b38]"
                  style={{ height: `${46 + (index % 4) * 18}px` }}
                  animate={
                    active && !reducedMotion
                      ? { y: [0, -14 - (index % 3) * 5, 8, -6, 0], opacity: [0.82, 1, 0.9] }
                      : { y: 0, opacity: 0.9 }
                  }
                  transition={{ duration: 0.72, delay: index * 0.018, ease: "easeInOut" }}
                />
              ))}
            </div>
            <div className="absolute inset-y-0 left-1/2 w-[1px] -translate-x-1/2 bg-white/10" />
            <div className="absolute inset-x-5 top-12 h-[2px] rounded-full bg-white/18" />
          </>
        )}
      </motion.div>
      )}
      <motion.div
        aria-hidden
        className="absolute bottom-7 h-4 w-40 rounded-full bg-black/30 blur-md"
        animate={active && !reducedMotion ? { scaleX: [1, 0.8, 1.12, 1], opacity: [0.28, 0.2, 0.34, 0.28] } : undefined}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-2 top-12 h-16 w-16 rounded-full border border-[#fff0da]/18"
        animate={revealing && !reducedMotion ? { scale: [0.7, 1.8], opacity: [0.8, 0] } : { opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </motion.button>
  );
}
