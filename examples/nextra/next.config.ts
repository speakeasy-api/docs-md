import nextra from "nextra";
import lit from "@lit-labs/nextjs";

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
    // Transpile @speakeasy-api packages so they work during SSR
    transpilePackages: [
      "@speakeasy-api/docs-md-components",
      "@speakeasy-api/docs-md-react",
    ],
    output: "export",
  })
);
