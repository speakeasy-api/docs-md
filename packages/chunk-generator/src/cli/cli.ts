import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import arg from "arg";
import { load } from "js-yaml";

import { generatePages } from "../generator/generatePages.ts";

const args = arg({
  "--help": Boolean,
  "--spec": String,
  "--page-out-dir": String,
  "--component-out-dir": String,
  "-s": "--spec",
  "-p": "--page-out-dir",
  "-c": "--component-out-dir",
});

function printHelp() {
  console.log(`Usage: docsmd [options]

Options:
  --help, -h     Show this help message
  --spec, -s     Path to OpenAPI spec
  --page-out-dir, -p  Output directory for page contents
  --component-out-dir, -c  Output directory for component contents`);
}

if (args["--help"]) {
  printHelp();
  process.exit(0);
}

const spec = args["--spec"];

if (!spec) {
  console.error("Missing required argument: --spec\n");
  printHelp();
  process.exit(1);
}

if (!existsSync(spec)) {
  console.error(`Spec file "${spec}" does not exist\n`);
  process.exit(1);
}

const pageOutDir = args["--page-out-dir"];

if (!pageOutDir) {
  console.error("Missing required argument: --page-out-dir\n");
  printHelp();
  process.exit(1);
}

const componentOutDir = args["--component-out-dir"];

if (!componentOutDir) {
  console.error("Missing required argument: --component-out-dir\n");
  printHelp();
  process.exit(1);
}

const specData = readFileSync(spec, "utf-8");
const specContents = JSON.stringify(load(specData));

const chunkContents = await generatePages({
  specContents,
  basePagePath: pageOutDir,
  baseComponentPath: componentOutDir,
});

for (const [filename, contents] of Object.entries(chunkContents)) {
  mkdirSync(dirname(filename), {
    recursive: true,
  });
  writeFileSync(filename, contents, {
    encoding: "utf-8",
  });
}
