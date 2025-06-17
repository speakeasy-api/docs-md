import type { UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path, { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import react from '@vitejs/plugin-react';

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  plugins: [
    react(),
    tailwindcss(),
    dts({ rollupTypes: true }),
    cssInjectedByJsPlugin(),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development'
    ),
    'process.env.SNIPPET_AI_SERVER': JSON.stringify(
      process.env.SNIPPET_AI_SERVER ||
        'https://snippet-ai.speakeasy-cloud.com/api'
    ),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'tailwindcss',
        'clsx',
        'lucide-react',
        '@tanstack/react-query',
        'kbar',
        'react-markdown',
        'react-shadow',
        'react-syntax-highlighter',
        'react-virtual',
        /^react-syntax-highlighter\/.*/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    open: true, // Auto open browser
    watch: {
      usePolling: true, // Ensures updates are detected
    },
  },
} satisfies UserConfig;
