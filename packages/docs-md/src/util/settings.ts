import type { Settings } from "../types/settings.ts";
import { InternalError } from "./internalError.ts";

let settings: Settings | undefined;
export function setSettings(newSettings: Settings) {
  settings = newSettings;
}

export function getSettings() {
  if (!settings) {
    throw new InternalError("Settings not initialized");
  }
  return settings;
}
