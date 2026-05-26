"use client";

import { useEffect, useRef } from "react";
import { omamoriAudio } from "@/lib/audio";
import { useOmamoriStore } from "@/store/omamori-store";

export function AmbientAudioController() {
  const settings = useOmamoriStore((state) => state.settings);
  const latestSettingsRef = useRef(settings);

  useEffect(() => {
    latestSettingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    omamoriAudio.setSettings(settings);
  }, [settings]);

  useEffect(() => {
    const unlockAudio = () => {
      void omamoriAudio.unlock().then(() => {
        omamoriAudio.setSettings(latestSettingsRef.current);
      });
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  return null;
}
