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

const language = z.enum([
  "typescript",
  "go",
  "java",
  "python",
  "csharp",
  "terraform",
  "unity",
  "php",
  "swift",
  "ruby",
  "postman",
]);

export type CodeSampleLanguage = z.infer<typeof language>;

export const settingsSchema = z.strictObject({
  spec: z.string(),
  output: z.strictObject({
    pageOutDir: z.string(),
    framework: z.enum(["docusaurus", "nextra", "custom"]),
    createSite: z.function().optional() as z.ZodOptional<
      z.ZodType<(() => Site) | undefined>
    >,
    aboutPage: z.boolean().default(true),
    singlePage: z.boolean().default(false),
  }),
  display: z
    .strictObject({
      visibleResponses: z
        .enum(["success", "explicit", "all"])
        .default("explicit"),
      showDebugPlaceholders: z.boolean().default(false),
      expandTopLevelPropertiesOnPageLoad: z.boolean().default(true),
    })
    .default({
      visibleResponses: "explicit",
      showDebugPlaceholders: false,
      expandTopLevelPropertiesOnPageLoad: true,
    }),
  tryItNow: z
    .array(
      z.strictObject({
        language,
        sdkClassName: z.string(),
        packageName: z.string(),
      })
    )
    .min(1)
    .optional(),
});

export type ParsedSettings = z.infer<typeof settingsSchema>;
