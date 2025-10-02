#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import arg from "arg";
import { load } from "js-yaml";
import z from "zod/v4";

import type { FrameworkConfig } from "../compiler.ts";
import { generatePages } from "../generatePages.ts";
import { error, info, setLevel, warn } from "../logging.ts";
import type { Site } from "../renderers/base.ts";
import { LLMSite } from "../renderers/llms.ts";
import { MdxSite } from "../renderers/mdx.ts";
import { type Settings, settingsSchema } from "../settings.ts";
import { docusaurusConfig } from "./configs/docusaurus.ts";
import { llmsConfig } from "./configs/llms.ts";
import { nextraConfig } from "./configs/nextra.ts";

const CONFIG_FILE_NAMES = [
  "speakeasy.config.js",
  "speakeasy.config.mjs",
  "speakeasy.config.cjs",
  "speakeasy.config.ts",
  "speakeasy.config.mts",
  "speakeasy.config.cts",
];

const args = arg({
  "--help": Boolean,
  "--config": String,
  "--spec": String,
  "--clean": Boolean,
  "--verbose": Boolean,
  "-h": "--help",
  "-c": "--config",
  "-s": "--spec",
  "-C": "--clean",
  "-v": "--verbose",
});

function printHelp() {
  info(`Usage: docsmd [options]

Options:
  --help, -h     Show this help message
  --config, -c   Path to config file
  --spec, -s     Path to OpenAPI spec file
  --clean, -C    Clean the output directories before generating
  --verbose, -v  Show debug output`);
}

if (args["--help"]) {
  printHelp();
  process.exit(0);
}

if (args["--verbose"]) {
  setLevel("debug");
}

function reportError(message: string): never {
  error(message + "\n");
  printHelp();
  process.exit(1);
}

// TODO: add TypeScript support here
async function importConfigFile(configFilePath: string): Promise<unknown> {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (await import(pathToFileURL(configFilePath).href)).default as unknown
  );
}

async function getSettings(): Promise<Settings> {
  // First, determine the config file path
  let configFilePath = args["--config"];
  if (!configFilePath) {
    // If it wasn't supplied, we'll look for a config file in the current directory
    const dirContents = readdirSync(process.cwd());
    for (const fileName of dirContents) {
      if (CONFIG_FILE_NAMES.includes(fileName)) {
        if (configFilePath) {
          reportError("Multiple config files found in current directory");
        }
        configFilePath = resolve(join(process.cwd(), fileName));
      }
    }
  }

  // Sanity check the config file path
  if (!configFilePath) {
    reportError(
      `No config file found in ${process.cwd()}. Please supply a config file with the --config option`
    );
  }
  if (!existsSync(configFilePath)) {
    reportError(`Config file "${configFilePath}" does not exist`);
  }

  // Note: typing below is something of an abomination of casts, but that's ok
  // since we do runtime validation with Zod after we're done with these casts.
  // The Zod validation is what ensures the types are correct.

  // Read in the config file. We wrap in a try-catch in case there are syntax
  // errors in the config file, which we want to report with a more
  // user-friendly error message than the standard thrown exception
  let configFileImport: Record<string, unknown>;
  try {
    const importedConfig = await importConfigFile(configFilePath);
    if (typeof importedConfig !== "object" || importedConfig === null) {
      reportError(`The default export in the config file must be an object`);
    }
    configFileImport = importedConfig as Record<string, unknown>;
  } catch (e) {
    reportError(
      `Error importing config file "${configFilePath}": ${(e as Error).message}`
    );
  }

  configFileImport.output ??= {};

  // Parse the settings using Zod to ensure accuracy
  const configFileContents = settingsSchema.safeParse(configFileImport);
  if (!configFileContents.success) {
    reportError(
      `Error parsing config file "${configFilePath}": ${z.prettifyError(configFileContents.error)}`
    );
  }

  if (args["--spec"]) {
    const cliSpecPath = args["--spec"];
    configFileContents.data.spec = isAbsolute(cliSpecPath)
      ? cliSpecPath
      : resolve(process.cwd(), cliSpecPath);
    configFileContents.data.specData = undefined;
  }

  if (!configFileContents.data.spec && !configFileContents.data.specData) {
    reportError(
      `Must provide either 'spec', 'specData', or use the --spec option`
    );
  }
  if (configFileContents.data.spec && configFileContents.data.specData) {
    reportError(`Cannot provide both 'spec' and 'specData'`);
  }

  // Validate and format various settings, as needed
  const configFileDirectory = dirname(configFilePath);
  function resolveAndValidatePath({
    path,
    name,
    validateExists,
  }: {
    path: string | undefined;
    name: string;
    validateExists: boolean;
  }) {
    if (!path) {
      error(`"${name}" must be specified`);
      process.exit(1);
    }
    if (!isAbsolute(path)) {
      path = resolve(configFileDirectory, path);
    }
    if (validateExists && !existsSync(path)) {
      error(`${name} path "${path}" does not exist`);
      process.exit(1);
    }
    return path;
  }

  if (configFileContents.data.spec) {
    configFileContents.data.spec = resolveAndValidatePath({
      path: configFileContents.data.spec,
      name: "spec",
      validateExists: true,
    });
  }
  configFileContents.data.output.pageOutDir = resolveAndValidatePath({
    path: configFileContents.data.output.pageOutDir,
    name: "output.pageOutDir",
    validateExists: false,
  });
  if (configFileContents.data.display.maxNestingLevel !== undefined) {
    if (configFileContents.data.display.maxNestingLevel < 1) {
      error(
        `display.maxNestingLevel must be at least 1, but was ${configFileContents.data.display.maxNestingLevel}`
      );
      process.exit(1);
    }
    configFileContents.data.output.embedOutDir = resolveAndValidatePath({
      path: configFileContents.data.output.embedOutDir,
      name: "output.embedOutDir",
      validateExists: false,
    });
    if (
      typeof configFileContents.data.output.framework !== "string" &&
      typeof configFileContents.data.output.framework.buildEmbedPath !==
        "function"
    ) {
      error(
        `output.framework must have a buildEmbedPath function when display.maxNestingLevel is specified`
      );
      process.exit(1);
    }
  }
  for (const codeSample of configFileContents.data.codeSamples ?? []) {
    if (!codeSample.enableTryItNow) {
      continue;
    }
    if (!codeSample.tryItNowBundlePath) {
      error(
        `codeSample.tryItNowBundlePath must be specified when codeSample.enableTryItNow is true`
      );
      process.exit(1);
    }
    codeSample.sdkTarballPath = resolveAndValidatePath({
      path: codeSample.sdkTarballPath,
      name: "codeSample.sdkTarballPath",
      validateExists: true,
    });
    if (!codeSample.sdkTarballPath.endsWith("tar.gz")) {
      error(
        `SDK tarball path ${codeSample.sdkTarballPath} must end in .tar.gz`
      );
      process.exit(1);
    }
    codeSample.tryItNowBundlePath = resolveAndValidatePath({
      path: codeSample.tryItNowBundlePath,
      name: "codeSample.tryItNowBundlePath",
      validateExists: false,
    });
    if (!codeSample.tryItNowBundleUrl) {
      error(
        `codeSample.tryItNowBundleUrl must be specified when codeSample.enableTryItNow is true`
      );
      process.exit(1);
    }
  }

  return configFileContents.data as Settings;
}

const settings = await getSettings();

let specData: string;
if (settings.spec) {
  specData = readFileSync(settings.spec, "utf-8");
} else if (settings.specData) {
  specData = settings.specData;
} else {
  // Already checked, so this is really just to make TypeScript happy
  error("Must provide either 'spec' or 'specData'");
  process.exit(1);
}
const specContents = JSON.stringify(load(specData));

let frameworkConfig: FrameworkConfig;
switch (settings.output.framework) {
  case "docusaurus": {
    if (settings.output.singlePage) {
      error("output.singlePage can only be used with custom sites");
      process.exit(1);
    }
    frameworkConfig = docusaurusConfig;
    break;
  }
  case "nextra": {
    if (settings.output.singlePage) {
      error("output.singlePage can only be used with custom sites");
      process.exit(1);
    }
    frameworkConfig = nextraConfig;
    break;
  }
  case "llms": {
    settings.output.singlePage = true;
    frameworkConfig = llmsConfig;
    break;
  }
  default: {
    if (settings.output.singlePage) {
      warn(
        "Compiling all docs into a single page is likely to cause performance issues if you have a large spec. It is strongly recommended that you enable scroll virtualization in a custom component, but take care not to break SEO."
      );
    }
    frameworkConfig = settings.output.framework;
    break;
  }
}

if (args["--clean"]) {
  info("Cleaning output directories");
  rmSync(settings.output.pageOutDir, {
    recursive: true,
    force: true,
  });
  if (settings.output.embedOutDir) {
    rmSync(settings.output.embedOutDir, {
      recursive: true,
      force: true,
    });
  }
}

let site: Site;
switch (frameworkConfig.rendererType) {
  case "mdx": {
    site = new MdxSite(frameworkConfig);
    break;
  }
  case "markdown": {
    site = new LLMSite(frameworkConfig);
    break;
  }
}

await generatePages({
  site,
  frameworkConfig,
  specContents,
  settings,
  onPageComplete: (pagePath, pageContents) => {
    mkdirSync(dirname(pagePath), {
      recursive: true,
    });
    writeFileSync(pagePath, pageContents, {
      encoding: "utf-8",
    });
  },
});

info("Success!");
