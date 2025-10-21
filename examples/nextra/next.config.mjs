import nextra from "nextra";
import lit from "@lit-labs/nextjs";

// Set up Nextra with its configuration
const withNextra = nextra({
  // ... Add Nextra-specific options here
});

const withLitSSR = lit({
  webpackModuleRulesTest: /.*\.(js|jsx|ts|tsx|mdx)$/,
});

// Export the final Next.js config with Nextra and Lit SSR included
export default withNextra(
  withLitSSR({
    output: "export",
  })
);
