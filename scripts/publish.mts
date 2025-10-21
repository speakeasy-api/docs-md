import { join } from "node:path";
import {
  getPackagesDetails,
  ROOT_DIR,
  runCommand,
  userPrompt,
} from "./util.mts";

// Make sure we're on main
const currentBranchOutput = runCommand("git", ["branch", "--show-current"], {
  cwd: ROOT_DIR,
  stdio: "pipe",
});
const currentBranch = currentBranchOutput[1]?.trim();
if (currentBranch !== "main") {
  console.error("Must be on main branch");
  process.exit(1);
}

// Make sure there are no uncommitted changes
const statusOutput = runCommand("git", ["status", "-s"], {
  cwd: ROOT_DIR,
  stdio: "pipe",
});
const status = statusOutput[1]?.trim();
if (status !== "") {
  console.error("Must have no uncommitted changes");
  process.exit(1);
}

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
runCommand("make", ["build-api-docs"], { cwd: ROOT_DIR });

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
