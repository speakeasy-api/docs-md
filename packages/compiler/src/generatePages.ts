import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { FrameworkConfig } from "./compiler.ts";
import { renderContent } from "./content/renderContent.ts";
import type { CodeSamples } from "./data/generateCodeSamples.ts";
import { generateCodeSamples } from "./data/generateCodeSamples.ts";
import { generateTryItNowBundle } from "./data/generateTryItNowBundle.ts";
import { getData } from "./data/getDocsData.ts";
import { extractSdks } from "./data/sdk.ts";
import { info } from "./logging.ts";
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

  let docsCodeSamples: CodeSamples = {};
  if (settings.codeSamples) {
    const extractionTempDirBase = join(tmpdir(), "speakeasy-" + randomUUID());
    try {
      // Extract all SDKs and save their locations first
      const sdkFolders = await extractSdks(extractionTempDirBase);

      // Generate the code samples
      docsCodeSamples = generateCodeSamples(data, sdkFolders);

      // Generate the Try It Now bundle
      await generateTryItNowBundle(sdkFolders);
    } finally {
      rmSync(extractionTempDirBase, {
        recursive: true,
      });
    }
  }

  // Render the content
  info("Rendering Markdown");
  renderContent(site, frameworkConfig, data, docsCodeSamples);
}
