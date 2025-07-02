import type { Site } from "../renderers/base/base.ts";
import type { ParsedSettings } from "../types/settings.ts";
import { setSettings } from "../util/settings.ts";
import type { DocsCodeSnippets } from "./codeSnippets/generateCodeSnippets.ts";
import { generateCodeSnippets } from "./codeSnippets/generateCodeSnippets.ts";
import { renderContent } from "./content/renderContent.ts";
import { getData } from "./data/getDocsData.ts";

/**
 * Given an OpenAPI spec, generate Markdown pages of the spec. The returned
 * object is a map of page filenames to page contents.
 */
export async function generatePages({
  site,
  specContents,
  settings,
}: {
  site: Site;
  specContents: string;
  settings: ParsedSettings;
}): Promise<Record<string, string>> {
  // Save settings to a global location so we can easily access it around the codebase
  setSettings(settings);

  // Get the docs data from the spec
  const data = await getData(specContents);

  // Get code snippets
  let docsCodeSnippets: DocsCodeSnippets = {};
  if (settings.tryItNow) {
    console.log("Generating Code Snippets");
    docsCodeSnippets = await generateCodeSnippets(data, specContents);
  }

  // Render the content
  console.log("Rendering Markdown");
  return renderContent(site, data, docsCodeSnippets);
}
