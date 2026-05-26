"use client";

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { OMAMORI_ROUTE_LIST, OMAMORI_ROUTES } from "@/constants/fortune";
import type { OmamoriRouteConfig, OmamoriSettings } from "@/types/omikuji";

interface SettingsModalProps {
  open: boolean;
  settings: OmamoriSettings;
  reducedMotion: boolean;
  onClose: () => void;
  onChange: (patch: Partial<OmamoriSettings>) => void;
  onResetRequest: () => void;
  resetConfirmOpen: boolean;
  onCancelReset: () => void;
  onConfirmReset: () => void;
  routeConfig?: OmamoriRouteConfig;
}

export function SettingsModal({
  open,
  settings,
  reducedMotion,
  onClose,
  onChange,
  onResetRequest,
  resetConfirmOpen,
  onCancelReset,
  onConfirmReset,
  routeConfig = OMAMORI_ROUTES.hakurei,
}: SettingsModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const confirmResetRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const hasCapturedFocusRef = useRef(false);

  useEffect(() => {
    if (!open || !resetConfirmOpen) {
      return;
    }

    const timer = window.setTimeout(() => confirmResetRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open, resetConfirmOpen]);

  useEffect(() => {
    if (open) {
      if (!hasCapturedFocusRef.current) {
        hasCapturedFocusRef.current = true;
        previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 40);
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          );

          if (focusableElements && focusableElements.length > 0) {
            const focusables = Array.from(focusableElements).filter(
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
        }

        if (event.key !== "Escape") {
          return;
        }

        if (resetConfirmOpen) {
          onCancelReset();
          return;
        }

        onClose();
      };

      window.addEventListener("keydown", onKeyDown);

      return () => {
        window.clearTimeout(focusTimer);
        window.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = previousOverflow;
      };
    }

    if (!hasCapturedFocusRef.current) {
      return;
    }

    hasCapturedFocusRef.current = false;
    previousFocusRef.current?.focus();
    previousFocusRef.current = null;
  }, [onCancelReset, onClose, open, resetConfirmOpen]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#04060d]/78 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            className="thin-scrollbar max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-[#d8b58a]/34 bg-[#fff7eb] bg-[image:var(--asset-washi-noise)] p-6 text-[#493344] shadow-[0_30px_100px_rgba(92,60,45,0.3),inset_0_1px_0_rgba(255,255,255,0.72)]"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: reducedMotion ? 0.16 : 0.28, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#7b604e] uppercase">运行设置</p>
                <h2 id={titleId} className="soft-title mt-2 text-2xl text-[#352632]">
                  {routeConfig.shortLabel}入口设置
                </h2>
                <p id={descriptionId} className="mt-2 max-w-md text-sm leading-7 text-[#5f4555]">
                  调整背景音、音效、默认入口与动效强度。第一次交互后才会播放音频，避免浏览器拦截。
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="min-h-11 rounded-full border border-[#7a5d6e]/18 bg-white/56 px-4 py-2 text-sm text-[#493344] transition hover:border-[#7a5d6e]/30 hover:bg-white/78"
              >
                关闭
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <label className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-[#b5926d]/18 bg-white/50 px-4 py-4">
                <div>
                  <p className="text-sm text-[#352632]">背景环境音</p>
                  <p className="text-xs text-[#6b5550]">随机使用已配置曲目，缺少文件时会回退到合成旋律</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.ambienceEnabled}
                  onChange={(event) => onChange({ ambienceEnabled: event.target.checked })}
                  className="h-5 w-5 accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-[#b5926d]/18 bg-white/50 px-4 py-4">
                <div>
                  <p className="text-sm text-[#352632]">仪式音效</p>
                  <p className="text-xs text-[#6b5550]">铃响、摇签和纸签展开的声音</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.sfxEnabled}
                  onChange={(event) => onChange({ sfxEnabled: event.target.checked })}
                  className="h-5 w-5 accent-cyan-400"
                />
              </label>

              <label className="block rounded-[1.5rem] border border-[#b5926d]/18 bg-white/50 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#352632]">背景音量</p>
                    <p className="text-xs text-[#6b5550]">建议保持轻量，让签文始终最先被看见</p>
                  </div>
                  <span className="text-xs text-[#5f4555]">{Math.round(settings.ambienceVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(settings.ambienceVolume * 100)}
                  onChange={(event) => onChange({ ambienceVolume: Number(event.target.value) / 100 })}
                  className="mt-3 w-full"
                />
              </label>

              <label className="block rounded-[1.5rem] border border-[#b5926d]/18 bg-white/50 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#352632]">音效音量</p>
                    <p className="text-xs text-[#6b5550]">仪式节点的存在感强度</p>
                  </div>
                  <span className="text-xs text-[#5f4555]">{Math.round(settings.sfxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(settings.sfxVolume * 100)}
                  onChange={(event) => onChange({ sfxVolume: Number(event.target.value) / 100 })}
                  className="mt-3 w-full"
                />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-[#b5926d]/18 bg-white/50 px-4 py-4">
                <div>
                  <p className="text-sm text-[#352632]">动效减弱模式</p>
                  <p className="text-xs text-[#6b5550]">更适合对动态敏感或想快速看结果时使用</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(event) => onChange({ reduceMotion: event.target.checked })}
                  className="h-5 w-5 accent-cyan-400"
                />
              </label>

              <div className="rounded-[1.5rem] border border-[#b5926d]/18 bg-white/50 px-4 py-4">
                <div>
                  <p className="text-sm text-[#352632]">默认入口</p>
                  <p className="text-xs text-[#6b5550]">刷新页面后会自动回到这个入口</p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {OMAMORI_ROUTE_LIST.map((route) => (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => onChange({ defaultRouteId: route.id })}
                      aria-pressed={settings.defaultRouteId === route.id}
                      className="min-h-11 rounded-full border bg-white/54 px-3 py-2 text-sm text-[#493344] transition hover:bg-white/78 aria-pressed:bg-white/90"
                      style={{
                        borderColor: settings.defaultRouteId === route.id ? `${route.visual.accent}66` : "rgba(122,93,110,0.18)",
                      }}
                    >
                      {route.shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-[#b5926d]/18 bg-white/50 px-4 py-4">
                <div>
                  <p className="text-sm text-[#352632]">每次打开都重新选择入口</p>
                  <p className="text-xs text-[#6b5550]">适合每天先决定从哪条路线进入时使用</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.askRouteOnLaunch}
                  onChange={(event) => onChange({ askRouteOnLaunch: event.target.checked })}
                  className="h-5 w-5 accent-cyan-400"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#8f714b]/14 pt-5">
              <p className="text-xs leading-6 text-[#6b5550]">清空后会移除今日签文记录、签册和本地身份标识。</p>
              <button
                type="button"
                onClick={onResetRequest}
                className="min-h-11 rounded-full border border-[#d35d61]/24 bg-[#d35d61]/10 px-4 py-2 text-sm text-[#8d3e42] transition hover:border-[#d35d61]/40 hover:bg-[#d35d61]/16"
              >
                清空本地记录
              </button>
            </div>

            <AnimatePresence>
              {resetConfirmOpen ? (
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  className="mt-5 rounded-[1.5rem] border border-[#d35d61]/30 bg-[#fff0ef]/88 p-4"
                >
                  <p className="text-sm text-[#7e383b]">确认清空这台设备上的本地记录？</p>
                  <p className="mt-2 text-xs leading-6 text-[#6b5550]">
                    这会移除今日签文记录、签册、设置和本地身份标识，页面会回到初始状态。
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      ref={confirmResetRef}
                      type="button"
                      onClick={onConfirmReset}
                      className="min-h-11 rounded-full border border-[#d35d61]/28 bg-[#d35d61]/14 px-4 py-2 text-sm text-[#8d3e42] transition hover:border-[#d35d61]/42 hover:bg-[#d35d61]/20"
                    >
                      确认清空
                    </button>
                    <button
                      type="button"
                      onClick={onCancelReset}
                      className="min-h-11 rounded-full border border-[#7a5d6e]/18 bg-white/56 px-4 py-2 text-sm text-[#493344] transition hover:border-[#7a5d6e]/30 hover:bg-white/78"
                    >
                      先保留
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
