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
      showInlineTypeSignatures: z.boolean().default(true),
    })
    .default({
      showSchemasInNav: true,
      showInlineTypeSignatures: true,
    }),
});

export type Settings = z.infer<typeof settingsSchema>;
