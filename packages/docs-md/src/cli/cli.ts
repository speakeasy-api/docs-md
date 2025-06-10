#!/usr/bin/env node --experimental-strip-types

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";

import arg from "arg";
import { load } from "js-yaml";
import z from "zod/v4";

import { generatePages } from "../generator/generatePages.ts";
import { type Settings, settingsSchema } from "../types/settings.ts";

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
  "--page-out-dir": String,
  "--component-out-dir": String,
  "--framework": String,
  "-c": "--config",
  "-s": "--spec",
  "-p": "--page-out-dir",
  "-o": "--component-out-dir",
  "-f": "--framework",
});

function printHelp() {
  console.log(`Usage: docsmd [options]

Options:
  --help, -h     Show this help message
  --config, -c   Path to config file
  --spec, -s     Path to OpenAPI spec
  --page-out-dir, -p  Output directory for page contents
  --component-out-dir, -o  Output directory for component contents
  --framework, -f  Framework to use (docusaurus, nextra)`);
}

if (args["--help"]) {
  printHelp();
  process.exit(0);
}

function reportError(msg: string): never {
  console.error(msg + "\n");
  printHelp();
  process.exit(1);
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
    // TODO: this _probably_ doesn't work for CommonJS. Not sure we care though
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const importedConfig = (await import(configFilePath)).default as unknown;
    if (typeof importedConfig !== "object" || importedConfig === null) {
      reportError(`The default export in the config file must be an object`);
    }
    configFileImport = importedConfig as Record<string, unknown>;
  } catch (e) {
    reportError(
      `Error importing config file "${configFilePath}": ${(e as Error).message}`
    );
  }

  if (!configFileImport.output) {
    configFileImport.output = {};
  }

  // Now, override the read config with any supplied CLI args
  if (args["--spec"]) {
    configFileImport.spec = args["--spec"];
  }
  if (args["--page-out-dir"]) {
    (configFileImport.output as Record<string, unknown>).pageOutDir =
      args["--page-out-dir"];
  }
  if (args["--component-out-dir"]) {
    (configFileImport.output as Record<string, unknown>).componentOutDir =
      args["--component-out-dir"];
  }
  if (args["--framework"]) {
    (configFileImport.output as Record<string, unknown>).framework =
      args["--framework"];
  }

  // Parse the settings using Zod to ensure accuracy
  const configFileContents = settingsSchema.safeParse(configFileImport);
  if (!configFileContents.success) {
    reportError(
      `Error parsing config file "${configFilePath}": ${z.prettifyError(configFileContents.error)}`
    );
  }

  // Validate and format various settings, as needed
  if (!existsSync(configFileContents.data.spec)) {
    throw new Error(
      `OpenAPI spec file "${configFileContents.data.spec}" does not exist`
    );
  }
  const configFileDirectory = dirname(configFilePath);
  if (!isAbsolute(configFileContents.data.output.pageOutDir)) {
    configFileContents.data.output.pageOutDir = resolve(
      configFileDirectory,
      configFileContents.data.output.pageOutDir
    );
  }
  if (!isAbsolute(configFileContents.data.output.componentOutDir)) {
    configFileContents.data.output.componentOutDir = resolve(
      configFileDirectory,
      configFileContents.data.output.componentOutDir
    );
  }

  return configFileContents.data;
}

const settings = await getSettings();

const specData = readFileSync(settings.spec, "utf-8");
const specContents = JSON.stringify(load(specData));

const pageContents = await generatePages({
  specContents,
  settings,
});

for (const [filename, contents] of Object.entries(pageContents)) {
  mkdirSync(dirname(filename), {
    recursive: true,
  });
  writeFileSync(filename, contents, {
    encoding: "utf-8",
  });
}
