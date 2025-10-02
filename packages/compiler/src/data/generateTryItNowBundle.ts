import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { build } from "esbuild";

import { debug, info } from "../logging.ts";
import { getSettings } from "../settings.ts";

export async function generateTryItNowBundle(): Promise<void> {
  const settings = getSettings();
  for (const codeSample of settings.codeSamples ?? []) {
    if (!codeSample.enableTryItNow || codeSample.language !== "typescript") {
      continue;
    }
    info(`Prebuilding dependencies for ${codeSample.packageName}`);
    const dependencyBundle = await bundleTryItNowDeps({
      packageName: codeSample.packageName,
      version: "latest",
    });
    const dependencyBundlePath = join(
      settings.output.pageOutDir,
      "tryItNowDeps.js"
    );
    mkdirSync(dirname(dependencyBundlePath), {
      recursive: true,
    });
    writeFileSync(dependencyBundlePath, dependencyBundle, {
      encoding: "utf-8",
    });
  }
}

async function bundleTryItNowDeps({
  packageName,
  version,
}: {
  packageName: string;
  version: string;
}): Promise<string> {
  const settings = getSettings();
  for (const codeSample of settings.codeSamples ?? []) {
    if (!codeSample.enableTryItNow || codeSample.language !== "typescript") {
      continue;
    }
    info(`Prebuilding dependencies for ${codeSample.packageName}`);
    const dependencyBundle = await bundleTryItNowDeps({
      packageName: codeSample.packageName,
      version: "latest",
    });
    const dependencyBundlePath = join(
      settings.output.pageOutDir,
      "tryItNowDeps.js"
    );
    mkdirSync(dirname(dependencyBundlePath), {
      recursive: true,
    });
    writeFileSync(dependencyBundlePath, dependencyBundle, {
      encoding: "utf-8",
    });
  }

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
