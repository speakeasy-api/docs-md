import type { BuildOptions, BuildResult, SameShape } from "esbuild-wasm";

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

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function bundle(
  code: string,
  dependencies: Record<string, string> = {}
) {
  while (!build) {
    await delay(100);
  }

  const bundle = await build({
    stdin: {
      contents: code,
      loader: "ts",
      resolveDir: "/", // Virtual resolve directory
    },
    bundle: true,
    format: "iife",
    write: false, // Get result in memory instead of writing to file
    platform: "browser",
    target: "es2020",
    plugins: [
      {
        name: "resolve-dependencies",
        setup(build) {
          // Only handle npm module imports - fetch and bundle them
          build.onResolve({ filter: /.*/ }, (args) => {
            // Handle esm.sh internal imports (like /zod-to-json-schema@^3.24.1?target=es2022 or /@mistralai/mistralai@1.10.0/es2022/mistralai.mjs)
            if (args.path.startsWith("/") && args.path.includes("@")) {
              return {
                path: `https://esm.sh${args.path}`,
                namespace: "esm-internal",
              };
            }

            // If this is a relative import or other internal module path, let ESBuild handle it normally
            if (
              args.path.startsWith(".") ||
              args.path.startsWith("/") ||
              args.path.includes("/es2022/") ||
              args.path.includes(".mjs") ||
              args.path.includes(".js")
            ) {
              return undefined; // Let ESBuild handle this normally
            }

            // Only intercept actual npm package names
            return {
              path: args.path,
              namespace: "npm-module",
            };
          });

          // Load npm modules from CDN and bundle them
          build.onLoad(
            { filter: /.*/, namespace: "npm-module" },
            async (args) => {
              try {
                const version = dependencies[args.path] ?? "latest";
                const url = `https://esm.sh/${args.path}@${version}`;

                const response = await fetch(url);

                if (!response.ok) {
                  throw new Error(
                    `Failed to fetch ${args.path}@${version}: ${response.status}`
                  );
                }

                const contents = await response.text();

                return {
                  contents,
                  loader: "js",
                };
              } catch (error) {
                console.error(`Failed to load ${args.path}:`, error);
                return {
                  contents: `throw new Error("Failed to load module: ${args.path}");`,
                  loader: "js",
                };
              }
            }
          );

          // Load esm.sh internal dependencies
          build.onLoad(
            { filter: /.*/, namespace: "esm-internal" },
            async (args) => {
              try {
                const response = await fetch(args.path);

                if (!response.ok) {
                  throw new Error(
                    `Failed to fetch ${args.path}: ${response.status}`
                  );
                }

                const contents = await response.text();
                return {
                  contents,
                  loader: "js",
                };
              } catch (error) {
                console.error(
                  `Failed to load esm.sh internal ${args.path}:`,
                  error
                );
                return {
                  contents: `throw new Error("Failed to load esm.sh internal: ${args.path}");`,
                  loader: "js",
                };
              }
            }
          );
        },
      },
    ],
  });

  return bundle;
}
