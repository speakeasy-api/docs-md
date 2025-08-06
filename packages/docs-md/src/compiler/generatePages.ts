import { renderContent } from "./content/renderContent.ts";
import type { DocsCodeSnippets } from "./data/generateCodeSnippets.ts";
import { generateCodeSnippets } from "./data/generateCodeSnippets.ts";
import { getData } from "./data/getDocsData.ts";
import { info } from "./logging.js";
import type { Site } from "./renderers/base/base.ts";
import type { ParsedSettings } from "./settings.ts";
import { setSettings } from "./settings.ts";

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
  site.setDocsData(data);

  // Get code snippets
  let docsCodeSnippets: DocsCodeSnippets = {};
  if (settings.tryItNow) {
    info("Generating Code Snippets");
    docsCodeSnippets = await generateCodeSnippets(data, specContents);
  }

  // Render the content
  info("Rendering Markdown");
  return renderContent(site, data, docsCodeSnippets);
}
