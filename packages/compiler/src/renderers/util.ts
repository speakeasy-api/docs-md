import type { CodeSampleLanguage } from "../settings.ts";

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

type Escape = "markdown" | "html" | "mdx" | "none";

export type EscapeOptions = {
  escape?: Escape;
};

export function escapeText(text: string, { escape }: Required<EscapeOptions>) {
  switch (escape) {
    case "markdown":
      return (
        text
          .replaceAll("\\", "\\\\")
          .replaceAll("`", "\\`")
          .replaceAll("*", "\\*")
          .replaceAll("_", "\\_")
          .replaceAll("{", "\\{")
          .replaceAll("}", "\\}")
          .replaceAll("[", "\\[")
          .replaceAll("]", "\\]")
          .replaceAll("<", "\\<")
          .replaceAll(">", "\\>")
          .replaceAll("(", "\\(")
          .replaceAll(")", "\\)")
          .replaceAll("#", "\\#")
          .replaceAll("+", "\\+")
          // .replace("-", "\\-")
          // .replace(".", "\\.")
          .replaceAll("!", "\\!")
          .replaceAll("|", "\\|")
      );
    case "mdx":
      return text.replaceAll("{", "\\{").replaceAll("}", "\\}");
    case "html":
      return text.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    case "none":
      return text;
  }
}
