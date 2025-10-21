import nextra from "nextra";

// Set up Nextra with its configuration
const withNextra = nextra({
  // ... Add Nextra-specific options here
});

const lit =
  (pluginOptions = {}) =>
  (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      webpack: (config, options) => {
        const { isServer } = options;

        const {
          addDeclarativeShadowDomPolyfill = true,
          webpackModuleRulesTest = /\/pages\/.*\.(?:j|t)sx?$|\/app\/.*\.(?:j|t)sx?$/,
          webpackModuleRulesExclude = [/next\/dist\//, /node_modules/],
        } = pluginOptions;

        // This adds a side-effectful import which monkey patches
        // `React.createElement` and Runtime JSX functions in the server and
        // imports `@lit-labs/ssr-client/lit-element-hydrate-support.js` in the
        // client.
        const imports = ["side-effects @lit-labs/ssr-react/enable-lit-ssr.js"];

        if (!isServer && addDeclarativeShadowDomPolyfill) {
          // Add script that applies @webcomponents/template-shadowroot ponyfill
          // on document.body
          imports.push(
            "side-effects @lit-labs/nextjs/lib/apply-dsd-polyfill.js"
          );
        }

        config.module.rules.unshift({
          // Grab entry points for all pages.
          // TODO(augustjk) It would nicer to inject only once in either
          // `pages/_document.tsx`, `pages/_app.tsx`, or `app/layout.tsx` but
          // they're not guaranteed to exist.
          test: webpackModuleRulesTest,
          // Exclude Next's own distributed files as they're commonjs and won't
          // play nice with `imports-loader`.
          exclude: webpackModuleRulesExclude,
          loader: "imports-loader",
          options: {
            imports,
          },
        });

        // Apply user provided custom webpack config function if it exists.
        if (typeof nextConfig.webpack === "function") {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    });
  };

const withLitSSR = lit({
  webpackModuleRulesTest: /.*\.(js|jsx|ts|tsx|mdx)$/,
});

// Export the final Next.js config with Nextra and Lit SSR included
export default withNextra(
  withLitSSR({
    output: "export",
  })
);
