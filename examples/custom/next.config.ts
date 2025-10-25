import createMDX from "@next/mdx";
import createLit from "@lit-labs/nextjs";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import { resolve } from "node:path";
import type { Configuration } from "webpack";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkHeadingId],
    rehypePlugins: [],
  },
});

const withLit = createLit({
  webpackModuleRulesTest: /.*\.(js|jsx|ts|tsx|mdx)$/,
});

// Merge MDX config with Next.js config
export default withLit(
  withMDX({
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
