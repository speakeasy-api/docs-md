import { z } from "zod";

import type { Site } from "../renderers/base/base.ts";

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
      maxSchemaNesting: z.number().default(5),
      visibleResponses: z
        .enum(["success", "explicit", "all"])
        .default("explicit"),
    })
    .default({
      showSchemasInNav: false,
      showTypeSignatures: true,
      maxTypeSignatureLineLength: 80,
      maxSchemaNesting: 5,
      visibleResponses: "explicit",
    }),
  tryItNow: z
    .strictObject({
      npmPackageName: z.string(),
      sdkClassName: z.string(),
    })
    .optional(),
});

export type ParsedSettings = z.infer<typeof settingsSchema>;
export type Settings = Pick<ParsedSettings, "spec" | "output"> &
  Partial<Pick<ParsedSettings, "display" | "tryItNow">>;
