import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { Site } from "../renderers/base.ts";
import { getSettings } from "../settings.ts";
import {
  type CodeSamples,
  generateCodeSamples,
  generateRequestResponseExamples,
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
  const data = await generateDocsData(specContents);
  site.setDocsData(data);

  // Generate the request/response examples
  generateRequestResponseExamples(data);

  // Generate the code samples
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
