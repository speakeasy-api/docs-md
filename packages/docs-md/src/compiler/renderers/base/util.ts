import type { CodeSampleLanguage } from "../.././settings.ts";

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
