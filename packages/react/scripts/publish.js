#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Build the package
spawnSync("npm", ["run", "lint"], { stdio: "inherit" });
spawnSync("npm", ["run", "clean"], { stdio: "inherit" });
spawnSync("npm", ["run", "build"], { stdio: "inherit" });

// Publish the package
spawnSync("npm", ["publish", "--access=public"], { stdio: "inherit" });

// Tag the release
const { version } = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../package.json"),
    "utf-8"
  )
);
spawnSync(
  "git",
  ["tag", "-a", version, "-m", `Published version ${version} to npm`],
  { stdio: "inherit" }
);
spawnSync("git", ["push", "origin", "--tags"], { stdio: "inherit" });
