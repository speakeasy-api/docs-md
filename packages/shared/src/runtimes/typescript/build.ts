import type { BuildOptions, BuildResult, SameShape } from "esbuild-wasm";

import { InternalError } from "../../util/internalError.ts";

let build:
  | (<T extends BuildOptions>(
      options: SameShape<BuildOptions, T>
    ) => Promise<BuildResult<T>>)
  | undefined;

// We have to dynamically import esbuild-wasm because it depends on a fully
// functional window at the module scope, which Docusaurus doesn't provide
// during SSG. Importing it statically causes it to crash, so we have to
// dynamically import it only after we've determined we can use it.
if (typeof window !== "undefined") {
  void import("esbuild-wasm").then((esbuild) => {
    build = esbuild.build;
    esbuild
      .initialize({
        // This version MUST match the version referenced in package.json
        wasmURL: "https://esm.sh/esbuild-wasm@0.25.10/esbuild.wasm",
      })
      .then(() => {
        console.log("ESBuild initialized");
      })
      .catch((e) => {
        console.error(e);
      });
  });
}

/**
 * Bundles user code that depends on pre-bundled dependencies
 * @param code - The user's TypeScript/JavaScript code to bundle
 * @param dependencyBundle - The pre-bundled dependencies code from bundleDependencies()
 * @returns Promise containing the build result
 */
export async function bundleCode(
  code: string,
  dependencyBundle: string
): Promise<BuildResult> {
  if (!build) {
    throw new InternalError("build is not defined");
  }

  // Extract available dependencies from the dependency bundle
  // The bundle contains code like: globalThis.__deps__.safeName = ...
  const depMatches = dependencyBundle.matchAll(
    /globalThis\.__deps__\.([a-zA-Z0-9_$]+)/g
  );
  const availableDeps = [...new Set([...depMatches].map((m) => m[1]))];

  return build({
    stdin: {
      contents: code,
      loader: "ts",
      resolveDir: "/",
    },
    bundle: true,
    format: "iife",
    write: false,
    platform: "browser",
    target: "es2020",
    plugins: [
      {
        name: "resolve-from-deps",
        setup(build) {
          // Intercept all npm package imports and resolve from __deps__ variable
          build.onResolve({ filter: /^[^./]/ }, (args) => {
            // Check if this dependency is available in __deps__
            const safeName = args.path.replace(/[^a-zA-Z0-9_$]/g, "_");
            if (availableDeps.includes(safeName)) {
              return {
                path: args.path,
                namespace: "deps-var",
              };
            }
            // Let other paths resolve normally (or fail)
            return undefined;
          });

          build.onLoad({ filter: /.*/, namespace: "deps-var" }, (args) => {
            const safeName = args.path.replace(/[^a-zA-Z0-9_$]/g, "_");
            return {
              contents: `module.exports = globalThis.__deps__.${safeName};`,
              loader: "js",
            };
          });
        },
      },
    ],
  });
}
