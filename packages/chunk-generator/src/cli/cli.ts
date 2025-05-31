#!/usr/bin/env node --experimental-strip-types

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import arg from "arg";
import { load } from "js-yaml";

import { generatePages } from "../generator/generatePages.ts";

const args = arg({
  "--help": Boolean,
  "--spec": String,
  "--page-out-dir": String,
  "--component-out-dir": String,
  "--framework": String,
  "-s": "--spec",
  "-p": "--page-out-dir",
  "-c": "--component-out-dir",
  "-f": "--framework",
});

function printHelp() {
  console.log(`Usage: docsmd [options]

Options:
  --help, -h     Show this help message
  --spec, -s     Path to OpenAPI spec
  --page-out-dir, -p  Output directory for page contents
  --component-out-dir, -c  Output directory for component contents
  --framework, -f  Framework to use (docusaurus, nextra)`);
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

const framework = args["--framework"] ?? "docusaurus";

const specData = readFileSync(spec, "utf-8");
const specContents = JSON.stringify(load(specData));

let buildPagePath: (slug: string) => string;
switch (framework) {
  case "docusaurus": {
    buildPagePath = (slug: string) => resolve(join(pageOutDir, `${slug}.mdx`));
    break;
  }
  case "nextra": {
    buildPagePath = (slug: string) =>
      resolve(join(pageOutDir, `${slug}/page.mdx`));
    break;
  }
  default: {
    throw new Error(`Unknown framework: ${framework}`);
  }
}

const pageContents = await generatePages({
  specContents,
  buildPagePath,
  baseComponentPath: componentOutDir,
});

switch (framework) {
  case "docusaurus": {
    pageContents[join(pageOutDir, "tag", "_category_.json")] = JSON.stringify(
      {
        position: 3,
        label: "Operations",
        collapsible: true,
        collapsed: false,
      },
      null,
      "  "
    );
    pageContents[join(pageOutDir, "_category_.json")] = JSON.stringify(
      {
        position: 2,
        label: "API Reference",
        collapsible: true,
        collapsed: false,
      },
      null,
      "  "
    );
    break;
  }
  case "nextra": {
    break;
  }
}

for (const [filename, contents] of Object.entries(pageContents)) {
  mkdirSync(dirname(filename), {
    recursive: true,
  });
  writeFileSync(filename, contents, {
    encoding: "utf-8",
  });
}
