import createMDX from "@next/mdx";
import createLit from "@lit-labs/nextjs";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";

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
  })
);
