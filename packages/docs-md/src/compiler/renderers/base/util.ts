import { join } from "node:path";

import type { CodeSampleLanguage } from "../.././settings.ts";
import { getSettings } from "../.././settings.ts";

export function getEmbedPath(
  embedName: string,
  { extension = "mdx" }: { extension?: string } = {}
) {
  return join(
    getSettings().output.componentOutDir,
    "embeds",
    embedName + "." + extension
  );
}

export function getEmbedSymbol(embedName: string) {
  return `Embed${embedName}`;
}

const languageToPrettyLanguage: Record<CodeSampleLanguage, string> = {
  typescript: "TypeScript",
  go: "Go",
  java: "Java",
  python: "Python",
  csharp: "C#",
  terraform: "Terraform",
  unity: "Unity",
  php: "PHP",
  swift: "Swift",
  ruby: "Ruby",
  postman: "Postman",
};

export function getPrettyCodeSampleLanguage(language: CodeSampleLanguage) {
  return languageToPrettyLanguage[language];
}
