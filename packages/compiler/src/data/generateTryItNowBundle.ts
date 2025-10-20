import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  Extractor,
  ExtractorConfig,
  ExtractorLogLevel,
} from "@microsoft/api-extractor";
import { build } from "esbuild";

import { debug, error, info } from "../logging.ts";
import {
  getInternalSetting,
  getSettings,
  setInternalSetting,
} from "../settings.ts";
import { InternalError } from "../util/internalError.ts";
import type { SdkFolder } from "./types.ts";

export async function generateTryItNowBundle(
  sdkFolders: Map<string, SdkFolder>
): Promise<void> {
  const settings = getSettings();
  const codeSample = settings.codeSamples?.find(
    (codeSample) => codeSample.language === "typescript" && codeSample.tryItNow
  );

  // Note: check if codeSample exists and has the correct language
  if (codeSample?.language !== "typescript") {
    debug(
      "No Try It Now enabled TypeScript code sample config found, skipping Try It Now bundle generation"
    );
    return;
  }
  const sdkFolder = sdkFolders.get(codeSample.language);
  if (!sdkFolder) {
    throw new InternalError(`No SDK folder found for ${codeSample.language}`);
  }

  if (!codeSample.tryItNow?.outDir) {
    throw new InternalError("tryItNow.outDiris unexpectedly undefined");
  }

  // Read in the package.json file
  const packageFolder = readFileSync(
    join(sdkFolder.path, "package.json"),
    "utf-8"
  );
  const packageJson = JSON.parse(packageFolder) as Record<string, string>;
  if (typeof packageJson.name !== "string") {
    error(
      `Could not find the "name" property in ${sdkFolder.path}/package.json`
    );
    process.exit(1);
  }
  setInternalSetting("typeScriptPackageName", packageJson.name);

  info(`Prebuilding Try It Now dependencies for ${codeSample.language}`);
  const dependencyBundle = await bundleTryItNowDeps(sdkFolder);
  mkdirSync(codeSample.tryItNow.outDir, {
    recursive: true,
  });
  writeFileSync(join(codeSample.tryItNow.outDir, "deps.js"), dependencyBundle, {
    encoding: "utf-8",
  });

  const workerCode = bundleTryItNowWorker();
  writeFileSync(join(codeSample.tryItNow.outDir, "worker.js"), workerCode, {
    encoding: "utf-8",
  });

  info(`Prebuilding Try It Now types for ${codeSample.language}`);
  bundleTryItNowTypes(
    packageJson,
    sdkFolder,
    join(codeSample.tryItNow.outDir, "types.d.ts")
  );
}

function bundleTryItNowTypes(
  packageJson: Record<string, string>,
  sdkFolder: SdkFolder,
  outFile: string
) {
  // Find the path to the type declaration file
  let typeDeclarationPath = packageJson.types;
  if (!typeDeclarationPath) {
    if (!packageJson.main) {
      throw new InternalError(
        "No 'main' or 'types' field found in package.json, cannot bundle types"
      );
    }
    // Try to find types associated with the entry point
    const entryPoint = join(sdkFolder.path, packageJson.main);
    if (existsSync(entryPoint.replace(extname(entryPoint), ".d.ts"))) {
      typeDeclarationPath = entryPoint.replace(extname(entryPoint), ".d.ts");
    } else {
      throw new InternalError(
        "No types field found in package.json, cannot bundle types"
      );
    }
  }

  // Create the API Extractor config file
  const apiExtractorJsonPath = join(sdkFolder.path, "api-extractor.json");

  try {
    writeFileSync(
      apiExtractorJsonPath,
      JSON.stringify({
        mainEntryPointFilePath: typeDeclarationPath,
        apiReport: {
          enabled: false,
        },
        docModel: {
          enabled: false,
        },
        dtsRollup: {
          enabled: true,
          untrimmedFilePath: outFile,
        },
        tsdocMetadata: {
          enabled: false,
        },
      }),
      {
        encoding: "utf-8",
      }
    );

    // Run API Extractor
    const extractorConfig =
      ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);
    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: true,
      messageCallback(message) {
        if (message.logLevel === ExtractorLogLevel.Error) {
          throw new Error(message.text);
        }
        message.handled = true;
      },
    });

    if (!extractorResult.succeeded) {
      throw new InternalError(
        `API Extractor completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings`
      );
    }
  } finally {
    // Remove the API Extractor config file, in case we're running this
    // directly from an SDK folder, in which case we don't want to mess with
    // the users git status
    rmSync(apiExtractorJsonPath, { force: true });
  }
}

async function bundleTryItNowDeps(sdkFolder: SdkFolder): Promise<string> {
  const packageInstallDir = join(tmpdir(), "speakeasy-" + randomUUID());
  const packageName = getInternalSetting("typeScriptPackageName");

  // Create a package.json file in the temporary directory, and install dependencies
  debug(
    `Creating temporary project for ${packageName} to install dependencies`
  );
  try {
    // Create a new temporary directory where we can do a production install
    // of the SDK that also takes into account .npmignore. We don't want to use
    // the standard SDK folder because it includes dev-time dependencies, code,
    // etc. that would just bloat the bundle size
    mkdirSync(packageInstallDir, {
      recursive: true,
    });

    // Create an empty package.json file. We'll install a tarball to it soon
    writeFileSync(join(packageInstallDir, "package.json"), "{}");

    // Now npm pack the SDK and save it to the new temporary working directory
    execSync(`npm pack -q --pack-destination ${packageInstallDir}`, {
      cwd: sdkFolder.path,
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
      force: true,
    });
  }
}

function bundleTryItNowWorker(): string {
  const workerUrl = import.meta.resolve("@speakeasy-api/docs-md-shared/worker");
  const workerPath = fileURLToPath(workerUrl);
  const workerCode = readFileSync(workerPath, "utf-8");
  return workerCode;
}
