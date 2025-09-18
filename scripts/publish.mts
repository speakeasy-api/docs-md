import { join } from "node:path";
import {
  getPackagesDetails,
  ROOT_DIR,
  runCommand,
  userPrompt,
} from "./util.mts";

// Validate versions
import "./versionCheck.mts";

// Confirm the version we want to publish
const {
  shared: { version: sharedVersion, name: sharedName },
  react: { name: reactName },
  compiler: { name: compilerName },
} = getPackagesDetails();
const response = await userPrompt(
  `Publish version ${sharedVersion} of:\n - ${sharedName}\n - ${reactName}\n - ${compilerName}\n? (y/N)`
);
if (response !== "y" && response !== "Y") {
  console.log("Aborting publish");
  process.exit(0);
}

// Force a clean CI install of dependencies
console.log("Installing dependencies");
runCommand("npm", ["ci"], { cwd: ROOT_DIR });

// Build the packages
console.log("Building packages");
runCommand("make", ["lint-packages"], { cwd: ROOT_DIR });
runCommand("make", ["clean-packages"], { cwd: ROOT_DIR });
runCommand("make", ["build-packages"], { cwd: ROOT_DIR });

// Build examples as a sanity check
console.log("Building examples");
runCommand("make", ["build-api-docs"], { cwd: ROOT_DIR });
runCommand("make", ["build-examples"], { cwd: ROOT_DIR });

// Publish the packages
console.log("Publishing packages");
runCommand("npm", ["publish", "--access=public"], {
  cwd: join(ROOT_DIR, "packages", "shared"),
});
runCommand("npm", ["publish", "--access=public"], {
  cwd: join(ROOT_DIR, "packages", "react"),
});
runCommand("npm", ["publish", "--access=public"], {
  cwd: join(ROOT_DIR, "packages", "compiler"),
});

// Tag the release
runCommand(
  "git",
  [
    "tag",
    "-a",
    sharedVersion,
    "-m",
    `Published version ${sharedVersion} to npm`,
  ],
  { cwd: ROOT_DIR }
);
runCommand("git", ["push", "origin", "--tags"], {
  cwd: ROOT_DIR,
});
