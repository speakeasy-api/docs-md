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
import { MdxSite } from "../renderers/mdx.ts";
import { type Settings, settingsSchema } from "../settings.ts";
import { docusaurusConfig } from "./configs/docusaurus.ts";
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
  "--clean": Boolean,
  "--verbose": Boolean,
  "-h": "--help",
  "-c": "--config",
  "-C": "--clean",
  "-v": "--verbose",
});

function printHelp() {
  info(`Usage: docsmd [options]

Options:
  --help, -h     Show this help message
  --config, -c   Path to config file
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

  // Validate and format various settings, as needed
  const configFileDirectory = dirname(configFilePath);
  if (!isAbsolute(configFileContents.data.spec)) {
    configFileContents.data.spec = resolve(
      configFileDirectory,
      configFileContents.data.spec
    );
  }
  if (!existsSync(configFileContents.data.spec)) {
    throw new Error(
      `OpenAPI spec file "${configFileContents.data.spec}" does not exist`
    );
  }
  if (!isAbsolute(configFileContents.data.output.pageOutDir)) {
    configFileContents.data.output.pageOutDir = resolve(
      configFileDirectory,
      configFileContents.data.output.pageOutDir
    );
  }

  return configFileContents.data as Settings;
}

const settings = await getSettings();

const specData = readFileSync(settings.spec, "utf-8");
const specContents = JSON.stringify(load(specData));

let frameworkConfig: FrameworkConfig;
switch (settings.output.framework) {
  case "docusaurus": {
    if (settings.output.singlePage) {
      throw new Error("output.singlePage can only be used with custom sites");
    }
    frameworkConfig = docusaurusConfig;
    break;
  }
  case "nextra": {
    if (settings.output.singlePage) {
      throw new Error("output.singlePage can only be used with custom sites");
    }
    frameworkConfig = nextraConfig;
    break;
  }
  default: {
    if (settings.output.singlePage) {
      warn(
        "Compiling all docs into a single page is likely to cause performance issues. It is strongly recommended that you enable scroll virtualization in a custom component, but take care not to break SEO."
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
}

let site: Site;
switch (frameworkConfig.rendererType) {
  case "mdx": {
    site = new MdxSite(frameworkConfig);
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
