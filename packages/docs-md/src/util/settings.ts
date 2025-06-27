import type { ParsedSettings } from "../types/settings.ts";
import { InternalError } from "./internalError.ts";

let settings: ParsedSettings | undefined;
export function setSettings(newSettings: ParsedSettings) {
  settings = newSettings;
}

export function getSettings() {
  if (!settings) {
    throw new InternalError("Settings not initialized");
  }
  return settings;
}
