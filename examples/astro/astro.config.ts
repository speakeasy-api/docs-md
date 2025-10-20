// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [react({
    experimentalReactChildren: true,
  }), mdx()],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
        'styles': '/src/styles'
      }
    }
  }
});
