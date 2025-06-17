import { z } from "zod";

export const settingsSchema = z.strictObject({
  spec: z.string(),
  output: z.strictObject({
    pageOutDir: z.string(),
    componentOutDir: z.string(),
    framework: z.enum(["docusaurus", "nextra"]),
  }),
  display: z
    .strictObject({
      showSchemasInNav: z.boolean().default(true),
      showTypeSignatures: z.boolean().default(true),
      maxTypeSignatureLineLength: z.number().default(80),
      maxSchemaNesting: z.number().default(5),
    })
    .default({
      showSchemasInNav: true,
      showTypeSignatures: true,
      maxTypeSignatureLineLength: 80,
      maxSchemaNesting: 5,
    }),
  tryItNow: z
    .strictObject({
      npmPackageName: z.string(),
      sdkClassName: z.string(),
    })
    .optional(),
});

export type Settings = z.infer<typeof settingsSchema>;
