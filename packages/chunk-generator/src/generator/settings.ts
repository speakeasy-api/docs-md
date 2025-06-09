import type { Settings } from "../types/settings.ts";

let settings: Settings | undefined;
export function setSettings(newSettings: Settings) {
  settings = newSettings;
}

export function getSettings() {
  if (!settings) {
    throw new Error("Settings not initialized");
  }
  return settings;
}
