import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { info } from "../logging.ts";
import type { Site } from "../renderers/base.ts";
import { getSettings } from "../settings.ts";
import {
  type CodeSamples,
  generateCodeSamples,
} from "./generateCodeSamples.ts";
import { generateDocsData } from "./generateDocsData.ts";
import { generateTryItNowBundle } from "./generateTryItNowBundle.ts";
import { prepareSdks } from "./prepareSdks.ts";

export async function generateData({
  site,
  specContents,
}: {
  site: Site;
  specContents: string;
}) {
  // Get the docs data from the spec
  info("Parsing OpenAPI spec (ignore lock file errors printed below)");
  const data = await generateDocsData(specContents);
  site.setDocsData(data);

  let docsCodeSamples: CodeSamples = {};
  const { codeSamples } = getSettings();
  if (codeSamples) {
    const extractionTempDirBase = join(tmpdir(), "speakeasy-" + randomUUID());
    try {
      // Extract all SDKs and save their locations first
      const sdkFolders = await prepareSdks(extractionTempDirBase);

      // Generate the code samples
      docsCodeSamples = generateCodeSamples(data, sdkFolders);

      // Generate the Try It Now bundle
      await generateTryItNowBundle(sdkFolders);
    } finally {
      rmSync(extractionTempDirBase, {
        recursive: true,
        force: true,
      });
    }
  }

  return { data, docsCodeSamples };
}
