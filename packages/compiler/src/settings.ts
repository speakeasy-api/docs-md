import { z } from "zod";

import type { FrameworkConfig } from "./types/FrameworkConfig.ts";
import type { OnPageComplete } from "./types/util.ts";
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

let onPageComplete: OnPageComplete | undefined;
export function setOnPageComplete(fn: OnPageComplete) {
  onPageComplete = fn;
}

export function getOnPageComplete() {
  if (!onPageComplete) {
    throw new InternalError("OnPageComplete not initialized");
  }
  return onPageComplete;
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
  spec: z.string().optional(),
  specData: z.string().optional(),
  output: z.strictObject({
    pageOutDir: z.string(),
    embedOutDir: z.string().optional(),
    framework: z.enum(["docusaurus", "nextra"]).or(
      // This type MUST be kept in sync with src/types/compilerConfig.ts
      z.object({
        rendererType: z.string(),
        componentPackageName: z.string(),
        buildPagePath: z.function(),
        buildEmbedPath: z.function().optional(),
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
      maxNestingLevel: z.number().optional(),
    })
    .default({
      visibleResponses: "explicit",
      showDebugPlaceholders: false,
      expandTopLevelPropertiesOnPageLoad: true,
    }),
  codeSamples: z
    .array(
      z.strictObject({
        language,
        sdkClassName: z.string(),
        packageName: z.string(),
        enableTryItNow: z.boolean().default(true),
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
