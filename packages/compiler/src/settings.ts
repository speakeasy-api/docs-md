import { z } from "zod";

import type { FrameworkConfig } from "./types/compilerConfig.ts";
import { InternalError } from "./util/internalError.ts";

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
    framework: z.enum(["docusaurus", "nextra"]).or(
      // This type MUST be kept in sync with src/types/compilerConfig.ts
      z.object({
        rendererType: z.string(),
        componentPackageName: z.string(),
        buildPagePath: z.function(),
        buildPagePreamble: z.function(),
        postProcess: z.function().optional(),
        formatHeadingId: z.function().optional(),
        elementIdSeparator: z.string().optional(),
      })
    ),
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

type ZodSettings = z.infer<typeof settingsSchema>;

export type Settings = Omit<ZodSettings, "output"> & {
  output: Omit<ZodSettings["output"], "framework"> & {
    // Defining FrameworkConfig in Zod would be excruciatingly verbose, so we
    // define it in Zod as just an object, and then override its type here
    framework: "docusaurus" | "nextra" | FrameworkConfig;
  };
};
