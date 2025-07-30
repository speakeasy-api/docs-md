import { z } from "zod";

import { InternalError } from "../util/internalError.ts";
import type { Site } from "./renderers/base/base.ts";

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

export const settingsSchema = z.strictObject({
  spec: z.string(),
  output: z.strictObject({
    pageOutDir: z.string(),
    componentOutDir: z.string(),
    framework: z.enum(["docusaurus", "nextra", "custom"]),
    createSite: z.function().optional() as z.ZodOptional<
      z.ZodType<(() => Site) | undefined>
    >,
  }),
  display: z
    .strictObject({
      showSchemasInNav: z.boolean().default(false),
      showTypeSignatures: z.boolean().default(true),
      maxTypeSignatureLineLength: z.number().default(80),
      maxSchemaNesting: z.number().default(10),
      visibleResponses: z
        .enum(["success", "explicit", "all"])
        .default("explicit"),
      showDebugPlaceholders: z.boolean().default(false),
    })
    .default({
      showSchemasInNav: false,
      showTypeSignatures: true,
      maxTypeSignatureLineLength: 80,
      maxSchemaNesting: 10,
      visibleResponses: "explicit",
      showDebugPlaceholders: false,
    }),
  tryItNow: z
    .strictObject({
      npmPackageName: z.string(),
      sdkClassName: z.string(),
    })
    .optional(),
});

export type ParsedSettings = z.infer<typeof settingsSchema>;
