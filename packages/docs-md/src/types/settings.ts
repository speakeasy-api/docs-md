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
      maxSchemaNesting: z.number().default(3),
    })
    .default({
      showSchemasInNav: true,
      showTypeSignatures: true,
      maxTypeSignatureLineLength: 80,
      maxSchemaNesting: 3,
    }),
  snippetAI: z
    .strictObject({
      apiKey: z.string(),
      suggestions: z.array(z.string()).optional(),
    })
    .optional(),
});

export type Settings = z.infer<typeof settingsSchema>;
