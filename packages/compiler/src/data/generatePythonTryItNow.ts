import { execSync } from "node:child_process";
import {
  copyFileSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

import { debug, error, info } from "../logging.ts";
import { getSettings, setInternalSetting } from "../settings.ts";
import { InternalError } from "../util/internalError.ts";
import type { SdkFolder } from "./types.ts";

function getPythonExecutableName(): string {
  const candidates = ["python", "python3"];

  for (const candidate of candidates) {
    try {
      // Try to run --version to check if the executable exists and works
      execSync(`${candidate} --version`);
      debug(`Using Python executable "${candidate}"`);
      return candidate;
    } catch {
      // If we got here, then this executable doesn't exist
      continue;
    }
  }

  // Neither candidate worked
  throw new Error(
    "Python is not installed or not available in PATH. Please install Python 3 and ensure it's available as 'python' or 'python3'."
  );
}

export function generatePythonTryItNow(sdkFolders: Map<string, SdkFolder>) {
  const settings = getSettings();
  const codeSample = settings.codeSamples?.find(
    (codeSample) => codeSample.language === "python" && codeSample.tryItNow
  );
  if (codeSample?.language !== "python") {
    return;
  }

  // These should always be defined due to our Zod checks, and are here just to
  // make TypeScript happy
  const sdkFolder = sdkFolders.get(codeSample.language);
  if (!sdkFolder) {
    throw new InternalError(`No SDK folder found for ${codeSample.language}`);
  }
  if (!codeSample.tryItNow?.outDir) {
    throw new InternalError("tryItNow.outDir is unexpectedly undefined");
  }

  // Prepare the README
  info(`Prebuilding Try It Now dependencies for ${codeSample.language}`);
  const pythonExecutable = getPythonExecutableName();
  execSync(`${pythonExecutable} scripts/prepare_readme.py`, {
    cwd: sdkFolder.path,
  });

  // Build wheel
  try {
    execSync(`${pythonExecutable} -m poetry --version`);
  } catch (e) {
    error(String(e));
    throw new Error(
      "Poetry is not installed. Please install poetry with `pip install poetry` and try again."
    );
  }
  execSync(`${pythonExecutable} -m poetry build`, {
    cwd: sdkFolder.path,
  });

  // Find the wheel file and save it to the Try It Now directory
  const contents = readdirSync(join(sdkFolder.path, "dist")).filter((file) =>
    file.endsWith(".whl")
  );
  if (contents.length !== 1) {
    throw new InternalError(
      `Expected exactly one wheel file in ${join(sdkFolder.path, "dist")}, found ${contents.length}`
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const wheelPath = join(sdkFolder.path, "dist", contents[0]!);
  const wheelName = basename(wheelPath);
  copyFileSync(wheelPath, join(codeSample.tryItNow.outDir, wheelName));

  // Store the filename for later use. We have to preserve the filename because
  // Python tooling stores semantic information in the filename that micropop
  // needs in order to function
  setInternalSetting("pythonWheelName", wheelName);

  // "Bundle" the worker by moving it to a spot where the browser can fetch it
  const workerUrl = import.meta.resolve(
    "@speakeasy-api/docs-md-shared/pyworker"
  );
  const workerPath = fileURLToPath(workerUrl);
  const workerCode = readFileSync(workerPath, "utf-8");
  writeFileSync(join(codeSample.tryItNow.outDir, "pyworker.js"), workerCode, {
    encoding: "utf-8",
  });
}
