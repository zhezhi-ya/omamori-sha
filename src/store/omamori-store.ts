"use client";

import { create } from "zustand";
import { DEFAULT_SETTINGS } from "@/constants/fortune";
import { getShanghaiDateKey } from "@/lib/date";
import { createTodayRecord, pickDailyFortune } from "@/lib/fortune-engine";
import { clamp, createStableId } from "@/lib/utils";
import {
  clearOmamoriStorage,
  clearSelectedRouteId,
  getOrCreateUserId,
  migrateOmamoriStorage,
  loadFavorites,
  loadSelectedRouteId,
  loadSettings,
  loadTodayRecord,
  saveFavorites,
  saveSelectedRouteId,
  saveSettings,
  saveTodayRecord,
} from "@/lib/storage";
import type {
  DailyDrawRecord,
  Fortune,
  OmamoriRouteId,
  OmamoriSettings,
  SavedFortune,
  SceneNotice,
} from "@/types/omikuji";

interface OmamoriState {
  isHydrated: boolean;
  userId: string | null;
  selectedRouteId: OmamoriRouteId | null;
  todayRecord: DailyDrawRecord | null;
  favorites: SavedFortune[];
  settings: OmamoriSettings;
  notice: SceneNotice | null;
  initialize: () => void;
  selectRoute: (routeId: OmamoriRouteId) => void;
  clearRouteSelection: () => void;
  drawFortune: (fortunes: Fortune[], routeId: OmamoriRouteId) => Fortune;
  toggleFavorite: (fortune: Fortune, routeId: OmamoriRouteId) => void;
  removeFavorite: (fortuneId: string) => void;
  updateSettings: (patch: Partial<OmamoriSettings>) => void;
  clearLocalRecords: () => void;
  showNotice: (notice: Omit<SceneNotice, "id">) => void;
  clearNotice: () => void;
}

export const useOmamoriStore = create<OmamoriState>((set, get) => ({
  isHydrated: false,
  userId: null,
  selectedRouteId: null,
  todayRecord: null,
  favorites: [],
  settings: DEFAULT_SETTINGS,
  notice: null,
  initialize: () => {
    migrateOmamoriStorage();
    const userId = getOrCreateUserId();
    const todayKey = getShanghaiDateKey();
    const storedRecord = loadTodayRecord();
    const todayRecord = storedRecord?.dateKey === todayKey ? storedRecord : null;

    const settings = loadSettings();
    const selectedRouteId = settings.askRouteOnLaunch ? null : (loadSelectedRouteId() ?? settings.defaultRouteId);

    set({
      isHydrated: true,
      userId,
      selectedRouteId,
      todayRecord,
      favorites: loadFavorites(),
      settings,
    });
  },
  selectRoute: (routeId) => {
    saveSelectedRouteId(routeId);
    set({ selectedRouteId: routeId });
  },
  clearRouteSelection: () => {
    clearSelectedRouteId();
    set({ selectedRouteId: null });
  },
  drawFortune: (fortunes, routeId) => {
    if (fortunes.length === 0) {
      throw new Error("Fortune pool is empty.");
    }

    const state = get();
    const dateKey = getShanghaiDateKey();

    if (
      state.todayRecord?.dateKey === dateKey &&
      state.todayRecord.routeId === routeId &&
      state.todayRecord.fortune.relatedSceneIds?.includes(routeId)
    ) {
      return state.todayRecord.fortune;
    }

    const userId = state.userId ?? getOrCreateUserId();
    const fortune = pickDailyFortune(fortunes, userId, dateKey, routeId);
    const todayRecord = createTodayRecord(fortune, dateKey, routeId);

    saveTodayRecord(todayRecord);
    saveSelectedRouteId(routeId);
    set({ userId, todayRecord, selectedRouteId: routeId });

    return fortune;
  },
  toggleFavorite: (fortune, routeId) => {
    const current = get().favorites;
    const exists = current.some((item) => item.id === fortune.id);
    const nextFavorites = exists
      ? current.filter((item) => item.id !== fortune.id)
      : [{ ...fortune, savedAt: new Date().toISOString(), routeId }, ...current];

    saveFavorites(nextFavorites);
    set({ favorites: nextFavorites });
  },
  removeFavorite: (fortuneId) => {
    const nextFavorites = get().favorites.filter((item) => item.id !== fortuneId);
    saveFavorites(nextFavorites);
    set({ favorites: nextFavorites });
  },
  updateSettings: (patch) => {
    const nextSettings = {
      ...get().settings,
      ...patch,
      ambienceVolume: clamp(
        patch.ambienceVolume ?? get().settings.ambienceVolume,
        0,
        1,
      ),
      sfxVolume: clamp(patch.sfxVolume ?? get().settings.sfxVolume, 0, 1),
    };

    saveSettings(nextSettings);
    if (patch.defaultRouteId) {
      saveSelectedRouteId(patch.defaultRouteId);
    }

    set({
      settings: nextSettings,
      selectedRouteId: nextSettings.askRouteOnLaunch
        ? null
        : (patch.defaultRouteId ?? get().selectedRouteId ?? nextSettings.defaultRouteId),
    });
  },
  clearLocalRecords: () => {
    clearOmamoriStorage();
    const userId = getOrCreateUserId();
    set({
      isHydrated: true,
      userId,
      selectedRouteId: DEFAULT_SETTINGS.askRouteOnLaunch ? null : DEFAULT_SETTINGS.defaultRouteId,
      todayRecord: null,
      favorites: [],
      settings: DEFAULT_SETTINGS,
      notice: null,
    });
  },
  showNotice: (notice) => {
    set({
      notice: {
        ...notice,
        id: createStableId("notice"),
      },
    });
  },
  clearNotice: () => {
    set({ notice: null });
  },
}));
