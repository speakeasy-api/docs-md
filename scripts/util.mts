import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

export const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function runCommand(
  command: string,
  args: string[],
  { cwd, stdio = "inherit" }: { cwd: string; stdio?: "inherit" | "pipe" }
) {
  const result = spawnSync(command, args, { stdio, cwd });

  // Check if process was terminated by signal (exit code 128 + signal number)
  if (result.status !== null && result.status >= 128) {
    process.exit(result.status);
  }

  // Check if process failed
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }

  return result.output.map((output) => {
    if (Buffer.isBuffer(output)) {
      return output.toString();
    }
    return output;
  });
}

export async function userPrompt(question: string) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.on("SIGINT", () => {
    rl.close();
    process.exit(130);
  });
  const result = await rl.question(question);
  rl.close();
  return result;
}

type PackagesDetails = {
  shared: {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  react: {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  compiler: {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  webComponents: {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
};

let packagesDetails: PackagesDetails | undefined;
export function getPackagesDetails() {
  if (packagesDetails) {
    return packagesDetails;
  }
  const sharedPackageJson = JSON.parse(
    readFileSync(join(ROOT_DIR, "packages", "shared", "package.json"), "utf-8")
  );
  const reactPackageJson = JSON.parse(
    readFileSync(join(ROOT_DIR, "packages", "react", "package.json"), "utf-8")
  );
  const webComponentsPackageJson = JSON.parse(
    readFileSync(
      join(ROOT_DIR, "packages", "web-components", "package.json"),
      "utf-8"
    )
  );
  const compilerPackageJson = JSON.parse(
    readFileSync(
      join(ROOT_DIR, "packages", "compiler", "package.json"),
      "utf-8"
    )
  );
  packagesDetails = {
    shared: {
      name: sharedPackageJson.name as string,
      version: sharedPackageJson.version as string,
      dependencies: sharedPackageJson.dependencies as Record<string, string>,
      devDependencies: sharedPackageJson.devDependencies as Record<
        string,
        string
      >,
    },
    react: {
      name: reactPackageJson.name as string,
      version: reactPackageJson.version as string,
      dependencies: reactPackageJson.dependencies as Record<string, string>,
      devDependencies: reactPackageJson.devDependencies as Record<
        string,
        string
      >,
    },
    compiler: {
      name: compilerPackageJson.name as string,
      version: compilerPackageJson.version as string,
      dependencies: compilerPackageJson.dependencies as Record<string, string>,
      devDependencies: compilerPackageJson.devDependencies as Record<
        string,
        string
      >,
    },
    webComponents: {
      name: webComponentsPackageJson.name as string,
      version: webComponentsPackageJson.version as string,
      dependencies: webComponentsPackageJson.dependencies as Record<
        string,
        string
      >,
      devDependencies: webComponentsPackageJson.devDependencies as Record<
        string,
        string
      >,
    },
  };
  return packagesDetails;
}
