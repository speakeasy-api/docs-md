import { promises as fs } from "node:fs";
import path from "node:path";

import { build } from "esbuild";

export async function bundleTryItNowDeps(
  // Path to a folder with the structure of `node_modules`. It can be an actual
  // node_modules folder, or a folder with the same structure.
  dependencyRoot: string
): Promise<string> {
  // Discover available dependencies by walking the directory tree
  // The structure matches node_modules, including scoped packages like @scope/package
  const topLevelEntries = await fs.readdir(dependencyRoot);
  const depNames: string[] = [];

  for (const entry of topLevelEntries) {
    const entryPath = path.join(dependencyRoot, entry);
    const stat = await fs.stat(entryPath);

    if (!stat.isDirectory()) {
      continue;
    }

    // If it's a scoped package (starts with @), read its subdirectories
    if (entry.startsWith("@")) {
      const scopedPackages = await fs.readdir(entryPath);
      for (const pkg of scopedPackages) {
        const pkgPath = path.join(entryPath, pkg);
        const pkgStat = await fs.stat(pkgPath);
        if (pkgStat.isDirectory()) {
          depNames.push(`${entry}/${pkg}`);
        }
      }
    } else {
      // Regular package
      depNames.push(entry);
    }
  }
  if (depNames.length === 0) {
    // No dependencies, return empty bundle
    return "globalThis.__deps__ = {};";
  }

  const virtualEntry = depNames
    .map((dep) => {
      const safeName = dep.replace(/[^a-zA-Z0-9_$]/g, "_");
      return `import * as ${safeName} from "${dep}";\nglobalThis.__deps__.${safeName} = ${safeName};`;
    })
    .join("\n");

  const result = await build({
    stdin: {
      contents: `globalThis.__deps__ = globalThis.__deps__ || {};\n${virtualEntry}`,
      loader: "js",
      resolveDir: dependencyRoot,
    },
    bundle: true,
    format: "iife",
    write: false,
    platform: "browser",
    target: "es2020",
    plugins: [
      {
        name: "node-modules-resolver",
        setup(build) {
          // Redirect bare imports (package names) to resolve from dependencyRoot
          build.onResolve({ filter: /^[^./]/ }, async (args) => {
            // Only intercept top-level bare imports from stdin
            if (args.namespace === "file" || args.namespace === "") {
              // Use esbuild's resolve function to resolve the package from dependencyRoot
              const resolved = await build.resolve(args.path, {
                kind: args.kind,
                resolveDir: dependencyRoot,
              });
              
              if (resolved.errors.length > 0) {
                return { errors: resolved.errors };
              }
              
              return { path: resolved.path };
            }
            return undefined;
          });
        },
      },
    ],
  });

  // Return the bundled code
  const code = result.outputFiles?.[0]?.text;
  if (!code) {
    throw new Error("Failed to generate dependency bundle");
  }

  return code;
}
