import type { FrameworkConfig } from "./compiler.ts";
import { renderContent } from "./content/renderContent.ts";
import { generateCodeSamples } from "./data/generateCodeSamples.ts";
import { getData } from "./data/getDocsData.ts";
import { info } from "./logging.js";
import type { Site } from "./renderers/base.ts";
import type { Settings } from "./settings.ts";
import { setOnPageComplete, setSettings } from "./settings.ts";

/**
 * Given an OpenAPI spec, generate Markdown pages of the spec. The returned
 * object is a map of page filenames to page contents.
 */
export async function generatePages({
  site,
  frameworkConfig,
  specContents,
  settings,
  onPageComplete,
}: {
  site: Site;
  frameworkConfig: FrameworkConfig;
  specContents: string;
  settings: Settings;
  onPageComplete: (pagePath: string, pageContents: string) => void;
}) {
  // Save settings to a global location so we can easily access it around the codebase
  setSettings(settings);
  setOnPageComplete(onPageComplete);

  // Get the docs data from the spec
  info("Parsing OpenAPI spec (ignore lock file errors printed below)");
  const data = await getData(specContents);
  site.setDocsData(data);

  // Get code snippets
  info("Generating Code Snippets");
  const docsCodeSnippets = await generateCodeSamples(data);

  // Render the content
  info("Rendering Markdown");
  renderContent(site, frameworkConfig, data, docsCodeSnippets);
}
