import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { build } from "esbuild";

import { debug, error, info } from "../logging.ts";
import { getSettings } from "../settings.ts";
import { InternalError } from "../util/internalError.ts";

export async function generateTryItNowBundle(
  sdkFolders: Map<string, string>
): Promise<void> {
  const settings = getSettings();
  const codeSample = settings.codeSamples?.find(
    (codeSample) => codeSample.language === "typescript" && codeSample.tryItNow
  );

  if (!codeSample) {
    info(
      "No Try It Now enabled TypeScript code sample config found, skipping Try It Now bundle generation"
    );
    return;
  }
  const sdkFolder = sdkFolders.get(codeSample.language);
  if (!sdkFolder) {
    throw new InternalError(`No SDK folder found for ${codeSample.language}`);
  }

  info(`Prebuilding Try It Now dependencies for ${codeSample.language}`);
  const dependencyBundle = await bundleTryItNowDeps(sdkFolder);

  if (!codeSample.tryItNow?.bundlePath) {
    throw new InternalError("tryItNow.bundlePathis unexpectdly undefined");
  }
  mkdirSync(dirname(codeSample.tryItNow.bundlePath), {
    recursive: true,
  });
  writeFileSync(codeSample.tryItNow.bundlePath, dependencyBundle, {
    encoding: "utf-8",
  });
}

async function bundleTryItNowDeps(sdkFolder: string): Promise<string> {
  const packageInstallDir = join(tmpdir(), "speakeasy-" + randomUUID());

  const packageFolder = readFileSync(join(sdkFolder, "package.json"), "utf-8");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const packageName = JSON.parse(packageFolder).name;
  if (typeof packageName !== "string") {
    error(`Could not find the "name" property in ${sdkFolder}/package.json`);
    process.exit(1);
  }

  // Create a package.json file in the temporary directory, and install dependencies
  debug(
    `Creating temporary project for ${packageName} to install dependencies`
  );
  try {
    // Create a new temporary directory where we can do a production install
    // of the SDK that also takes into account .npmignore. We don't want to use
    // the standard SDK folder becuase it includes dev-time dependencies, code,
    // etc. that would just bload the bundle size
    mkdirSync(packageInstallDir, {
      recursive: true,
    });

    // Create an empty package.json file. We'll install a tarball to it soon
    writeFileSync(join(packageInstallDir, "package.json"), "{}");

    // Now npm pack the SDK and save it to the new temporary working directory
    execSync(`npm pack -q --pack-destination ${packageInstallDir}`, {
      cwd: sdkFolder,
    });

    // Now install the tarball into the temporary directory, which will also
    // install transitive dependencies such as zod
    execSync(`npm install -q --omit=dev *.tgz`, {
      cwd: packageInstallDir,
    });

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
