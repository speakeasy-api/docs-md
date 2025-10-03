import { execSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { extract } from "tar";

import { info } from "../logging.ts";
import { getSettings } from "../settings.ts";
import type { SdkFolder } from "./types.ts";

export async function prepareSdks(extractionTempDirBase: string) {
  const sdkPaths = new Map<string, SdkFolder>();
  const { codeSamples } = getSettings();
  if (!codeSamples) {
    return sdkPaths;
  }
  for (const codeSample of codeSamples) {
    let sdkDir: string;
    if (codeSample.sdkFolder) {
      sdkDir = codeSample.sdkFolder;
      sdkPaths.set(codeSample.language, {
        path: codeSample.sdkFolder,
        isUserFolder: true,
      });
    } else {
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
      sdkDir = extractionDir;
      sdkPaths.set(codeSample.language, {
        path: extractionDir,
        isUserFolder: false,
      });
    }

    // If this is TypeScript, build the SDK so we can compile it later
    if (codeSample.language === "typescript") {
      // If we're operating in the user folder, give them a heads up
      if (codeSample.sdkFolder) {
        info(
          `Installing dependencies and building TypeScript SDK at ${sdkDir}`
        );
      }
      execSync(`npm install --prefix ${sdkDir}`);
      execSync(`npm run build --prefix ${sdkDir}`);
    }
  }

  return sdkPaths;
}
