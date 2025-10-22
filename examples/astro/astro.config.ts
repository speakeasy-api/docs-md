// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx({
      gfm: false,
      syntaxHighlight: false,
      smartypants: false,
    }),
    react({
      experimentalReactChildren: true,
      experimentalDisableStreaming: true,
    }),
  ],
});
