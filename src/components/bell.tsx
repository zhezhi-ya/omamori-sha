"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { OmamoriRouteId } from "@/types/omikuji";

interface BellProps {
  active: boolean;
  reducedMotion: boolean;
  disabled?: boolean;
  label?: string;
  caption?: string;
  variant?: OmamoriRouteId;
  onClick: () => void;
}

export function Bell({
  active,
  reducedMotion,
  disabled,
  label = "摇动神社铃铛，开始今日签文仪式",
  caption = "神乐铃",
  variant = "hakurei",
  onClick,
}: BellProps) {
  const isScarlet = variant === "scarlet";
  const isEientei = variant === "eientei";
  const glowColor = isEientei ? "#65b987" : isScarlet ? "#e84f72" : "#d8b15f";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "group relative flex h-56 w-40 items-center justify-center rounded-[2.75rem]",
        "bg-transparent drop-shadow-[0_30px_60px_rgba(0,0,0,0.42)]",
        "transition-opacity disabled:cursor-not-allowed disabled:opacity-60",
      )}
      animate={
        active && !reducedMotion
          ? { rotate: [0, 12, -14, 10, -7, 4, 0], y: [0, -10, 7, -5, 0] }
          : { rotate: 0, y: 0 }
      }
      transition={{ duration: 1.28, ease: [0.2, 0.85, 0.24, 1] }}
      whileHover={disabled || reducedMotion ? undefined : { scale: 1.04, y: -3 }}
      whileTap={disabled || reducedMotion ? undefined : { scale: 0.96 }}
    >
      <motion.span
        aria-hidden
        className="absolute inset-x-1/2 top-0 h-28 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#fff0da] via-[#d8b15f]/70 to-transparent"
        animate={active && !reducedMotion ? { scaleY: [1, 1.22, 0.9, 1.12, 1] } : { scaleY: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.span
        aria-hidden
        className="absolute inset-x-1/2 top-20 h-36 w-36 -translate-x-1/2 rounded-full bg-[#d8b15f]/24 blur-3xl"
        style={{ background: `${glowColor}3d` }}
        animate={
          active && !reducedMotion
            ? { opacity: [0.34, 0.95, 0.36], scale: [0.8, 1.5, 1.05] }
            : { opacity: [0.28, 0.48, 0.28], scale: [0.95, 1.08, 0.95] }
        }
        transition={{ duration: active ? 0.86 : 4.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden
        className="absolute inset-x-1/2 top-24 h-28 w-28 -translate-x-1/2 rounded-full border border-[#fff0da]/18"
        animate={active && !reducedMotion ? { scale: [0.85, 1.45], opacity: [0.7, 0] } : { scale: 1, opacity: 0.28 }}
        transition={{ duration: 0.82, repeat: active ? 2 : 0, ease: "easeOut" }}
      />
      {isEientei ? (
        <div className="relative z-10 mt-12 flex h-32 w-32 items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full border border-[#65b987]/42 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.9),rgba(201,244,211,0.78)_45%,rgba(101,185,135,0.7)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_22px_48px_rgba(101,185,135,0.24)]" />
          <div className="absolute h-24 w-24 rounded-full border border-white/70" />
          <div className="absolute h-14 w-14 rounded-full border border-[#d6b8ff]/60" />
          <div className="absolute h-[2px] w-28 bg-white/70" />
          <div className="absolute h-28 w-[2px] bg-white/70" />
          <motion.div
            className="absolute h-3 w-3 rounded-full bg-[#d6b8ff] shadow-[0_0_26px_rgba(214,184,255,0.74)]"
            animate={active && !reducedMotion ? { x: [0, 34, -22, 0], y: [0, -20, 26, 0], opacity: [0.9, 1, 0.84, 1] } : { x: 0, y: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </div>
      ) : isScarlet ? (
        <div className="relative z-10 mt-12 flex h-32 w-32 items-center justify-center">
          <div className="absolute h-28 w-28 rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.92),rgba(255,205,220,0.86)_46%,rgba(232,79,114,0.82)_100%)] shadow-[inset_0_8px_18px_rgba(255,255,255,0.42),0_22px_48px_rgba(232,79,114,0.26)]" />
          <div className="absolute top-8 h-5 w-20 rounded-full border border-white/70 bg-white/48" />
          <div className="absolute bottom-8 h-9 w-20 rounded-xl border border-white/60 bg-[#8fc5ff]/38" />
          <motion.div
            className="absolute h-16 w-2 rounded-full bg-gradient-to-b from-[#fff8f6] to-[#e84f72] shadow-[0_0_24px_rgba(232,79,114,0.42)]"
            animate={active && !reducedMotion ? { rotate: [0, -16, 18, -8, 0], y: [0, 6, -4, 0] } : { rotate: 0, y: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </div>
      ) : (
        <div className="relative z-10 mt-12 flex h-32 w-32 items-center justify-center">
          <div className="absolute top-0 h-8 w-16 rounded-t-full border border-[#f4d69a]/50 bg-[linear-gradient(180deg,#f4d69a,#8b5a42)] shadow-[0_0_28px_rgba(217,178,111,0.28)]" />
          <div className="absolute top-6 h-24 w-28 rounded-[46%_46%_42%_42%] border border-[#f4d7a5]/50 bg-[radial-gradient(circle_at_50%_18%,rgba(255,235,184,0.95),rgba(214,130,91,0.68)_34%,rgba(80,28,33,0.98)_78%)] shadow-[inset_0_8px_18px_rgba(255,255,255,0.22),inset_0_-18px_32px_rgba(30,16,24,0.46),0_22px_48px_rgba(0,0,0,0.34)]" />
          <div className="absolute top-11 h-[2px] w-20 rounded-full bg-white/24" />
          <motion.div
            className="absolute bottom-1 h-11 w-5 rounded-full bg-gradient-to-b from-[#ffe4a8] to-[#a06a43] shadow-[0_0_24px_rgba(217,178,111,0.42)]"
            animate={active && !reducedMotion ? { y: [0, 8, -5, 4, 0], rotate: [0, -10, 12, -6, 0] } : { y: 0, rotate: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </div>
      )}
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#ead6aa]/18 bg-black/24 px-3 py-1 text-[0.68rem] tracking-[0.34em] text-ink-secondary/90 uppercase backdrop-blur">
        {caption}
      </span>
    </motion.button>
  );
}
