"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { rarityGlow } from "@/constants/design-tokens";
import { assetPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import type { FortuneRarity } from "@/types/omikuji";

interface FortunePaperProps {
  open: boolean;
  rarity: FortuneRarity;
  reducedMotion: boolean;
  children: React.ReactNode;
}

export function FortunePaper({ open, rarity, reducedMotion, children }: FortunePaperProps) {
  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.section
          key="fortune-paper"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 12 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99, y: 8 }}
          transition={{ duration: reducedMotion ? 0.14 : 0.24, ease: "easeOut" }}
          className={cn(
            "relative mx-auto w-full max-w-2xl overflow-hidden rounded-[1.45rem] px-3 py-3 transform-gpu [backface-visibility:hidden] [will-change:opacity,transform] sm:rounded-[2rem] sm:px-6 sm:py-6",
            "washi-card paper-texture",
          )}
          style={{ boxShadow: rarityGlow[rarity] }}
        >
          <div className="absolute inset-x-6 top-0 h-2 rounded-b-full bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
          <div className="absolute inset-y-5 left-5 w-[1px] bg-[#6e5132]/12" />
          <div className="absolute inset-y-5 right-5 w-[1px] bg-[#6e5132]/12" />
          <Image
            src={assetPath("/images/ui/paper-corner.svg")}
            alt=""
            width={240}
            height={240}
            priority
            loading="eager"
            className="absolute left-0 top-0 w-24 opacity-55 sm:w-28"
          />
          <Image
            src={assetPath("/images/ui/paper-corner.svg")}
            alt=""
            width={240}
            height={240}
            priority
            loading="eager"
            className="absolute bottom-0 right-0 w-24 rotate-180 opacity-45 sm:w-28"
          />
          <div className="relative">{children}</div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
