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

type InternalSettings = {
  typeScriptPackageName?: string;
  onPageComplete?: OnPageComplete;
};

const internalSettings: InternalSettings = {};

export function getInternalSetting<Key extends keyof InternalSettings>(
  key: Key
) {
  const value = internalSettings[key];
  if (!value) {
    throw new InternalError(`Internal setting ${key} not set`);
  }
  return value;
}

export function setInternalSetting<Key extends keyof InternalSettings>(
  key: Key,
  value: InternalSettings[Key]
) {
  internalSettings[key] = value;
}

const curl = z.object({
  language: z.literal("curl"),
  tryItNow: z.boolean().optional().default(false),
});

const sdkCommonProperties = {
  sdkTarballPath: z.string().optional(),
  sdkFolder: z.string().optional(),
};

const typescript = z.object({
  language: z.literal("typescript"),
  tryItNow: z
    .strictObject({
      outDir: z.string(),
      urlPrefix: z.string(),
    })
    .optional(),
  ...sdkCommonProperties,
});

const otherSdkLanguages = z.object({
  language: z.enum([
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
  ]),
  ...sdkCommonProperties,
});

const codeSample = z.union([curl, typescript, otherSdkLanguages]);

export const settingsSchema = z.strictObject({
  spec: z.string().optional(),
  specData: z.string().optional(),
  output: z.strictObject({
    pageOutDir: z.string(),
    embedOutDir: z.string().optional(),
    framework: z.enum(["docusaurus", "nextra", "llms"]).or(
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
    aboutPage: z.boolean().optional().default(true),
    singlePage: z.boolean().optional().default(false),
    generateRequestBodyExamples: z.boolean().optional().default(true),
    generateResponseExamples: z.boolean().optional().default(true),
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
  codeSamples: z.array(codeSample).min(1).optional(),
});

type ZodSettings = z.infer<typeof settingsSchema>;

export type Settings = Omit<ZodSettings, "output"> & {
  output: Omit<ZodSettings["output"], "framework"> & {
    // Defining FrameworkConfig in Zod would be excruciatingly verbose, so we
    // define it in Zod as just an object, and then override its type here
    framework: "docusaurus" | "nextra" | "llms" | FrameworkConfig;
  };
};
