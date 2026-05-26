export const STORAGE_KEYS = {
  schemaVersion: "cyber-omamori-sha/schema-version",
  userId: "cyber-omamori-sha/user-id",
  todayRecord: "cyber-omamori-sha/today-record",
  settings: "cyber-omamori-sha/settings",
  favorites: "cyber-omamori-sha/favorites",
  selectedRouteId: "cyber-omamori-sha/selected-route-id",
} as const;

export const CURRENT_STORAGE_SCHEMA_VERSION = "2";

export const APP_STORAGE_KEYS = Object.values(STORAGE_KEYS);
