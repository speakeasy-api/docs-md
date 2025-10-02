import { execSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { extract } from "tar";

import { getSettings } from "../settings.ts";

export async function extractSdks(extractionTempDirBase: string) {
  const sdkPaths = new Map<string, string>();
  const { codeSamples } = getSettings();
  if (!codeSamples) {
    return sdkPaths;
  }
  for (const codeSample of codeSamples) {
    // Set up the temp directory for the code sample
    let extractionDir = join(extractionTempDirBase, codeSample.language);
    mkdirSync(extractionDir, { recursive: true });

    // Extract the tarball
    await extract({
      file: codeSample.sdkTarballPath,
      cwd: extractionDir,
    });

    // SDKs are extracted to a subdirectory, so adjust the path to compensate,
    // and save the path to the list
    const extractedDirName = readdirSync(extractionDir);
    if (extractedDirName.length !== 1) {
      throw new Error(
        `Expected exactly one directory in ${extractionDir}, got ${extractedDirName.length}`
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    extractionDir = join(extractionDir, extractedDirName[0]!);
    sdkPaths.set(codeSample.language, extractionDir);

    // If this is TypeScript, build the SDK so we can compile it later
    if (codeSample.language === "typescript") {
      execSync(`npm install --prefix ${extractionDir}`);
      execSync(`npm run build --prefix ${extractionDir}`);
    }
  }

  return sdkPaths;
}
