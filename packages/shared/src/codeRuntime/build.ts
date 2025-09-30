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
  dependencies: Record<string, string> = {},
  { packageManagerUrl }: { packageManagerUrl?: string } = {}
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
          // Track package URLs for resolving relative imports
          const packageUrls = new Map<string, string>();

          // Only handle npm module imports - fetch and bundle them
          build.onResolve({ filter: /.*/ }, (args) => {
            if (packageManagerUrl) {
              // Handle relative imports - resolve them relative to the importer
              if (args.path.startsWith(".")) {
                // If importer is from npm-module namespace, look up the package URL
                if (args.namespace === "npm-module") {
                  const pkgUrl = packageUrls.get(args.importer);
                  if (pkgUrl) {
                    // pkgUrl is now the full entry point file URL, so resolve relative to it
                    return {
                      path: new URL(args.path, pkgUrl).href,
                      namespace: "static-file",
                    };
                  }
                  throw new Error(
                    `Failed to find package URL for: ${args.importer}`
                  );
                }
                // If importer is already a URL (from static-file namespace), use it directly
                if (args.importer?.startsWith("http")) {
                  return {
                    path: new URL(args.path, args.importer).href,
                    namespace: "static-file",
                  };
                }
                throw new Error(
                  `Unable to resolve relative import: ${args.path} from ${args.importer}`
                );
              }

              // Handle absolute paths from the static server
              if (args.path.startsWith(packageManagerUrl)) {
                return {
                  path: args.path,
                  namespace: "static-file",
                };
              }

              // Handle npm package imports - mark them for resolution
              return {
                path: args.path,
                namespace: "npm-module",
              };
            } else {
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
            }
          });

          // Load npm modules from CDN and bundle them
          build.onLoad(
            { filter: /.*/, namespace: "npm-module" },
            async (args) => {
              if (packageManagerUrl) {
                try {
                  // Construct path to package directory
                  // Ensure packageManagerUrl is an absolute URL
                  let baseUrl = packageManagerUrl;
                  if (!baseUrl.startsWith("http")) {
                    // If relative, construct absolute URL from current location
                    baseUrl = new URL(baseUrl, window.location.href).href;
                  }

                  const pkgPath = args.path.startsWith("@")
                    ? `${baseUrl}/${args.path}`
                    : `${baseUrl}/${args.path}`;

                  // Fetch package.json to resolve entry point
                  const pkgJsonUrl = `${pkgPath}/package.json`;
                  const pkgJsonResponse = await fetch(pkgJsonUrl);

                  if (!pkgJsonResponse.ok) {
                    throw new Error(
                      `Failed to fetch package.json for ${args.path}: ${pkgJsonResponse.status}`
                    );
                  }

                  const pkgJson = (await pkgJsonResponse.json()) as {
                    module?: string;
                    main?: string;
                    exports?:
                      | string
                      | {
                          "."?: string | { import?: string; default?: string };
                        };
                  };

                  // Resolve entry point (prefer module/exports, fallback to main)
                  let entryPoint = "index.js";
                  if (pkgJson.module) {
                    entryPoint = pkgJson.module;
                  } else if (pkgJson.exports) {
                    // Handle exports field (simplified - just look for "." or "./index")
                    const exports = pkgJson.exports;
                    if (typeof exports === "string") {
                      entryPoint = exports;
                    } else if (
                      typeof exports["."] === "object" &&
                      exports["."]?.import
                    ) {
                      entryPoint = exports["."].import;
                    } else if (
                      typeof exports["."] === "object" &&
                      exports["."]?.default
                    ) {
                      entryPoint = exports["."].default;
                    } else if (typeof exports["."] === "string") {
                      entryPoint = exports["."];
                    }
                  } else if (pkgJson.main) {
                    entryPoint = pkgJson.main;
                  }

                  // Remove leading ./ if present
                  entryPoint = entryPoint.replace(/^\.\//, "");

                  // Fetch the actual module file
                  const moduleUrl = `${pkgPath}/${entryPoint}`;
                  packageUrls.set(args.path, moduleUrl);
                  const moduleResponse = await fetch(moduleUrl);

                  if (!moduleResponse.ok) {
                    throw new Error(
                      `Failed to fetch ${args.path} entry point: ${moduleResponse.status}`
                    );
                  }

                  const contents = await moduleResponse.text();

                  return {
                    contents,
                    loader: "js",
                  };
                } catch (error) {
                  const errorMessage =
                    error instanceof Error ? error.message : String(error);
                  console.error(`Failed to load ${args.path}:`, error);
                  return {
                    contents: `throw new Error("Failed to load module: ${args.path}\\n${errorMessage}");`,
                    loader: "js",
                  };
                }
              } else {
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
            }
          );

          // Load static files from the package manager URL
          build.onLoad(
            { filter: /.*/, namespace: "static-file" },
            async (args) => {
              try {
                // If path doesn't have an extension, try common extensions first
                const pathsToTry = !/\.\w+$/.test(args.path)
                  ? [`${args.path}.js`, `${args.path}.mjs`, args.path]
                  : [args.path];

                let response: Response | null = null;
                let lastError: Error | null = null;

                for (const path of pathsToTry) {
                  try {
                    response = await fetch(path);
                    if (response.ok) {
                      break; // Success, stop trying
                    }
                  } catch (err) {
                    lastError =
                      err instanceof Error ? err : new Error(String(err));
                  }
                }

                if (!response?.ok) {
                  throw (
                    lastError ??
                    new Error(
                      `Failed to fetch ${args.path}: ${response?.status ?? "unknown"}`
                    )
                  );
                }

                const contents = await response.text();
                return {
                  contents,
                  loader: "js",
                };
              } catch (error) {
                throw new Error(
                  `Failed to load static file ${args.path}:`,
                  error instanceof Error ? error : undefined
                );
              }
            }
          );

          // Load esm.sh internal dependencies
          build.onLoad(
            { filter: /.*/, namespace: "esm-internal" },
            async (args) => {
              if (packageManagerUrl) {
                // Not used with static file server
                return undefined;
              } else {
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
                  throw new Error(
                    `Failed to load esm.sh internal ${args.path}:`,
                    error instanceof Error ? error : undefined
                  );
                }
              }
            }
          );
        },
      },
    ],
  });

  return bundle;
}
