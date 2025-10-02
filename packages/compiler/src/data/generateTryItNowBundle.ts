import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { build } from "esbuild";

import { debug, info } from "../logging.ts";
import { getSettings } from "../settings.ts";
import { InternalError } from "../util/internalError.ts";

export async function generateTryItNowBundle(
  sdkFolders: Map<string, string>
): Promise<void> {
  const settings = getSettings();
  const codeSample = settings.codeSamples?.find(
    (codeSample) =>
      codeSample.language === "typescript" && codeSample.enableTryItNow
  );

  if (!codeSample) {
    info(
      "No Try It Now enabled TypeScript code sample config found, skipping Try It Now bundle generation"
    );
    return;
  }
  const sdkFolder = sdkFolders.get(codeSample.packageName);
  if (!sdkFolder) {
    throw new InternalError(
      `No SDK folder found for ${codeSample.packageName}`
    );
  }

  info(`Prebuilding Try It Now dependencies for ${codeSample.packageName}`);
  const dependencyBundle = await bundleTryItNowDeps({
    packageName: codeSample.packageName,
    version: "latest",
  });

  if (!codeSample.tryItNowBundlePath) {
    throw new InternalError("tryItNowBundlePathis unexpectdly undefined");
  }
  mkdirSync(dirname(codeSample.tryItNowBundlePath), {
    recursive: true,
  });
  writeFileSync(codeSample.tryItNowBundlePath, dependencyBundle, {
    encoding: "utf-8",
  });
}

async function bundleTryItNowDeps({
  packageName,
  version,
}: {
  packageName: string;
  version: string;
}): Promise<string> {
  const packageInstallDir = join(tmpdir(), "speakeasy-" + randomUUID());

  // Create a package.json file in the temporary directory, and install dependencies
  debug(`Installing minimal dependencies for ${packageName}`);
  try {
    mkdirSync(packageInstallDir, {
      recursive: true,
    });
    writeFileSync(
      join(packageInstallDir, "package.json"),
      JSON.stringify({
        dependencies: {
          [packageName]: version,
        },
      })
    );
    execSync(`npm install --prefix ${packageInstallDir}`);

    const safeDepName = packageName.replace(/[^a-zA-Z0-9_$]/g, "_");
    const virtualEntry = `import * as ${safeDepName} from "${packageName}";\nglobalThis.__deps__.${safeDepName} = ${safeDepName};`;

    const result = await build({
      stdin: {
        contents: `globalThis.__deps__ = globalThis.__deps__ || {};\n${virtualEntry}`,
        loader: "js",
        resolveDir: packageInstallDir,
      },
      bundle: true,
      format: "iife",
      write: false,
      platform: "browser",
      target: "es2020",
      absWorkingDir: packageInstallDir,
    });

    // Return the bundled code
    const code = result.outputFiles?.[0]?.text;
    if (!code) {
      throw new Error("Failed to generate dependency bundle");
    }

    return code;
  } finally {
    rmSync(packageInstallDir, {
      recursive: true,
    });
  }
}
