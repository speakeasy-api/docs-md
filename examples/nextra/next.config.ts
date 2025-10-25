import nextra from "nextra";
import lit from "@lit-labs/nextjs";
import { resolve } from "node:path";
import type { Configuration } from "webpack";

// Set up Nextra with its configuration
const withNextra = nextra({
  // ... Add Nextra-specific options here
});

const withLit = lit({
  webpackModuleRulesTest: /.*\.(js|jsx|ts|tsx|mdx)$/,
});

// Export the final Next.js config with Nextra and Lit SSR included
export default withNextra(
  withLit({
    // Configure `pageExtensions` to include markdown and MDX files
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

    // Transpile @speakeasy-api packages so they work during SSR
    transpilePackages: [
      "@speakeasy-api/docs-md-components",
      "@speakeasy-api/docs-md-react",
    ],
    output: "export",

    // Configure webpack to process source maps from workspace packages
    webpack: (config: Configuration, { isServer }) => {
      if (!isServer) {
        const packagesDir = resolve(__dirname, "../../packages");
        config.module = config.module || {};
        config.module.rules = config.module.rules || [];
        config.module.rules.push({
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          // Process files from workspace packages
          include: packagesDir,
          enforce: "pre",
          use: [
            {
              loader: require.resolve("source-map-loader"),
            },
          ],
        });
      }

      return config;
    },
  })
);
