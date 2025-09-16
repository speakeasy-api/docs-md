import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runCommand, userPrompt } from "./util.mts";

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function getPackageDetails(packagePath: string) {
  const packageJson = JSON.parse(
    readFileSync(
      join(ROOT_DIR, "packages", packagePath, "package.json"),
      "utf-8"
    )
  );
  return {
    name: packageJson.name as string,
    version: packageJson.version as string,
  };
}

// Make sure all versions are the same
const { version: sharedVersion, name: sharedName } =
  getPackageDetails("shared");
const { version: reactVersion, name: reactName } = getPackageDetails("react");
const { version: compilerVersion, name: compilerName } =
  getPackageDetails("compiler");

if (sharedVersion !== reactVersion || sharedVersion !== compilerVersion) {
  throw new Error(
    `Versions do not match: shared=${sharedVersion}, react=${reactVersion}, compiler=${compilerVersion}`
  );
}

// Confirm the version we want to publish
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
