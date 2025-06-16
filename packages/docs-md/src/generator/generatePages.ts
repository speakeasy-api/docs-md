import type { Settings } from "../types/settings.ts";
import type { DocsCodeSnippets } from "./codeSnippets.ts";
import { generateDocsCodeSnippets } from "./codeSnippets.ts";
import { getDocsData } from "./docsData/getDocsData.ts";
import { generateContent } from "./mdx/generateContent.ts";
import { setSettings } from "./settings.ts";

/**
 * Given an OpenAPI spec, generate Markdown pages of the spec. The returned
 * object is a map of page filenames to page contents.
 */
export async function generatePages({
  specContents,
  settings,
}: {
  specContents: string;
  settings: Settings;
}): Promise<Record<string, string>> {
  // Save settings to a global location so we can easily access it around the codebase
  setSettings(settings);

  // Get the docs data from the spec
  const data = await getDocsData(specContents);

  // Get code snippets
  let docsCodeSnippets: DocsCodeSnippets = {};
  if (settings.tryItNow) {
    console.log("Generating Code Snippets");
    docsCodeSnippets = await generateDocsCodeSnippets(data, specContents);
  }

  // Generate the content
  console.log("Generating Markdown Pages");
  return generateContent(data, docsCodeSnippets);
}
