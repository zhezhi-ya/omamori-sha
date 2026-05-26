import { DEFAULT_SETTINGS, isOmamoriRouteId } from "@/constants/fortune";
import { APP_STORAGE_KEYS, CURRENT_STORAGE_SCHEMA_VERSION, STORAGE_KEYS } from "@/constants/storage";
import { clamp, createStableId } from "@/lib/utils";
import type { DailyDrawRecord, Fortune, OmamoriRouteId, OmamoriSettings, SavedFortune } from "@/types/omikuji";

const VALID_CATEGORIES = new Set(["study", "love", "slacking", "lateNight", "social", "wealth", "hidden"]);
const VALID_TIERS = new Set(["small-blessing", "middle-blessing", "great-blessing", "shadow", "secret"]);
const VALID_RARITIES = new Set(["common", "uncommon", "rare", "epic", "legendary"]);
const MAX_FAVORITES = 120;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isValidFortuneShape(candidate: unknown): boolean {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const fortune = candidate as Record<string, unknown>;

  return (
    typeof fortune.id === "string" &&
    typeof fortune.category === "string" &&
    VALID_CATEGORIES.has(fortune.category) &&
    typeof fortune.tier === "string" &&
    VALID_TIERS.has(fortune.tier) &&
    typeof fortune.title === "string" &&
    typeof fortune.character === "string" &&
    typeof fortune.summary === "string" &&
    typeof fortune.advice === "string" &&
    typeof fortune.luckyColor === "string" &&
    typeof fortune.luckyItem === "string" &&
    (typeof fortune.characterImage === "undefined" || typeof fortune.characterImage === "string") &&
    (typeof fortune.characterImageSource === "undefined" || typeof fortune.characterImageSource === "string") &&
    (
      typeof fortune.relatedSceneIds === "undefined" ||
      (Array.isArray(fortune.relatedSceneIds) && fortune.relatedSceneIds.every((sceneId) => typeof sceneId === "string"))
    ) &&
    typeof fortune.rarity === "string" &&
    VALID_RARITIES.has(fortune.rarity) &&
    Array.isArray(fortune.tags) &&
    fortune.tags.every((tag) => typeof tag === "string")
  );
}

function isIsoDateString(candidate: unknown): candidate is string {
  return typeof candidate === "string" && ISO_DATE_PATTERN.test(candidate) && !Number.isNaN(Date.parse(candidate));
}

function isDateKey(candidate: unknown): candidate is string {
  return typeof candidate === "string" && DATE_KEY_PATTERN.test(candidate);
}

function normalizeFortune(candidate: unknown): Fortune | null {
  return isValidFortuneShape(candidate) ? (candidate as Fortune) : null;
}

function normalizeRouteId(candidate: unknown, fallback: OmamoriRouteId = DEFAULT_SETTINGS.defaultRouteId): OmamoriRouteId {
  return isOmamoriRouteId(candidate) ? candidate : fallback;
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or serialization failures so the app remains usable.
  }
}

function writeText(key: string, value: string): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or security failures so the app remains usable.
  }
}

function removeKey(key: string): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(key);
}

function markCurrentStorageSchema(): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEYS.schemaVersion, CURRENT_STORAGE_SCHEMA_VERSION);
  } catch {
    // Ignore storage quota or security failures during schema marking.
  }
}

function normalizeSettings(candidate: Partial<OmamoriSettings>): OmamoriSettings {
  return {
    ...DEFAULT_SETTINGS,
    ambienceEnabled:
      typeof candidate.ambienceEnabled === "boolean"
        ? candidate.ambienceEnabled
        : DEFAULT_SETTINGS.ambienceEnabled,
    sfxEnabled:
      typeof candidate.sfxEnabled === "boolean" ? candidate.sfxEnabled : DEFAULT_SETTINGS.sfxEnabled,
    ambienceVolume:
      typeof candidate.ambienceVolume === "number" && Number.isFinite(candidate.ambienceVolume)
        ? clamp(candidate.ambienceVolume, 0, 1)
        : DEFAULT_SETTINGS.ambienceVolume,
    sfxVolume:
      typeof candidate.sfxVolume === "number" && Number.isFinite(candidate.sfxVolume)
        ? clamp(candidate.sfxVolume, 0, 1)
        : DEFAULT_SETTINGS.sfxVolume,
    reduceMotion:
      typeof candidate.reduceMotion === "boolean" ? candidate.reduceMotion : DEFAULT_SETTINGS.reduceMotion,
    defaultRouteId: normalizeRouteId(candidate.defaultRouteId),
    askRouteOnLaunch:
      typeof candidate.askRouteOnLaunch === "boolean" ? candidate.askRouteOnLaunch : DEFAULT_SETTINGS.askRouteOnLaunch,
  };
}

function normalizeTodayRecord(candidate: unknown): DailyDrawRecord | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const record = candidate as Partial<DailyDrawRecord>;
  const fortune = normalizeFortune(record.fortune);

  if (!isDateKey(record.dateKey) || !isIsoDateString(record.drawnAt) || !fortune) {
    return null;
  }

  return {
    dateKey: record.dateKey,
    drawnAt: record.drawnAt,
    fortune,
    routeId: normalizeRouteId(record.routeId),
  };
}

function normalizeFavorite(candidate: unknown): SavedFortune | null {
  if (!candidate || typeof candidate !== "object" || !isIsoDateString((candidate as Partial<SavedFortune>).savedAt)) {
    return null;
  }

  const fortune = normalizeFortune(candidate);
  if (!fortune) {
    return null;
  }

  return {
    ...fortune,
    savedAt: (candidate as Partial<SavedFortune>).savedAt as string,
    routeId: normalizeRouteId((candidate as Partial<SavedFortune>).routeId),
  };
}

function normalizeFavorites(candidate: unknown): SavedFortune[] {
  if (!Array.isArray(candidate)) {
    return [];
  }

  const seen = new Set<string>();
  const favorites: SavedFortune[] = [];

  for (const item of candidate) {
    const normalized = normalizeFavorite(item);
    if (!normalized || seen.has(normalized.id)) {
      continue;
    }

    seen.add(normalized.id);
    favorites.push(normalized);

    if (favorites.length >= MAX_FAVORITES) {
      break;
    }
  }

  return favorites;
}

export function migrateOmamoriStorage(): void {
  if (!canUseStorage()) {
    return;
  }

  const normalizedSettings = normalizeSettings(readJson<Partial<OmamoriSettings>>(STORAGE_KEYS.settings, {}));
  writeJson(STORAGE_KEYS.settings, normalizedSettings);

  const todayRecord = normalizeTodayRecord(readJson<unknown>(STORAGE_KEYS.todayRecord, null));
  if (todayRecord) {
    writeJson(STORAGE_KEYS.todayRecord, todayRecord);
  } else {
    removeKey(STORAGE_KEYS.todayRecord);
  }

  const normalizedFavorites = normalizeFavorites(readJson<unknown>(STORAGE_KEYS.favorites, []));
  writeJson(STORAGE_KEYS.favorites, normalizedFavorites);

  const selectedRouteId = window.localStorage.getItem(STORAGE_KEYS.selectedRouteId);
  if (selectedRouteId && !isOmamoriRouteId(selectedRouteId)) {
    removeKey(STORAGE_KEYS.selectedRouteId);
  }

  const userId = window.localStorage.getItem(STORAGE_KEYS.userId);
  if (userId !== null) {
    const normalizedUserId = userId.trim();
    if (normalizedUserId) {
      writeText(STORAGE_KEYS.userId, normalizedUserId);
    } else {
      removeKey(STORAGE_KEYS.userId);
    }
  }

  markCurrentStorageSchema();
}

function createLocalId(): string {
  return createStableId("omamori");
}

export function getOrCreateUserId(): string {
  if (!canUseStorage()) {
    return "server-visitor";
  }

  const existing = window.localStorage.getItem(STORAGE_KEYS.userId);
  const normalized = existing?.trim();
  if (normalized) {
    if (normalized !== existing) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.userId, normalized);
      } catch {
        // Ignore storage write failures and continue using the normalized value in memory.
      }
    }

    return normalized;
  }

  const created = createLocalId();
  writeText(STORAGE_KEYS.userId, created);
  return created;
}

export function loadTodayRecord(): DailyDrawRecord | null {
  return normalizeTodayRecord(readJson<unknown>(STORAGE_KEYS.todayRecord, null));
}

export function saveTodayRecord(record: DailyDrawRecord): void {
  const normalized = normalizeTodayRecord(record);
  if (normalized) {
    writeJson(STORAGE_KEYS.todayRecord, normalized);
  }
}

export function clearTodayRecord(): void {
  removeKey(STORAGE_KEYS.todayRecord);
}

export function loadSettings(): OmamoriSettings {
  return normalizeSettings(readJson<Partial<OmamoriSettings>>(STORAGE_KEYS.settings, {}));
}

export function saveSettings(settings: OmamoriSettings): void {
  writeJson(STORAGE_KEYS.settings, normalizeSettings(settings));
}

export function loadFavorites(): SavedFortune[] {
  return normalizeFavorites(readJson<unknown>(STORAGE_KEYS.favorites, []));
}

export function saveFavorites(favorites: SavedFortune[]): void {
  writeJson(STORAGE_KEYS.favorites, normalizeFavorites(favorites));
}

export function clearOmamoriStorage(): void {
  if (!canUseStorage()) {
    return;
  }

  APP_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
}

export function loadSelectedRouteId(): OmamoriRouteId | null {
  if (!canUseStorage()) {
    return null;
  }

  const routeId = window.localStorage.getItem(STORAGE_KEYS.selectedRouteId);
  return isOmamoriRouteId(routeId) ? routeId : null;
}

export function saveSelectedRouteId(routeId: OmamoriRouteId): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.selectedRouteId, routeId);
}

export function clearSelectedRouteId(): void {
  removeKey(STORAGE_KEYS.selectedRouteId);
}
