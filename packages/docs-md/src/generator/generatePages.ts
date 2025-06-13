import type { Settings } from "../types/settings.ts";
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
  console.log("Getting docs data");
  const data = await getDocsData(specContents);

  // Get code snippets
  console.log("Generating code snippets");
  const docsCodeSnippets = await generateDocsCodeSnippets(data, specContents);

  // Generate the content
  console.log("Generating Markdown pages");
  return generateContent(data, docsCodeSnippets);
}
