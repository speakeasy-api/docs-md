import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkHeadingId],
    rehypePlugins: [],
  },
});

// Merge MDX config with Next.js config
export default withMDX({
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  output: "export",
});
