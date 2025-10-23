import { z } from "zod";

import type { FrameworkConfig } from "./types/FrameworkConfig.ts";
import type { OnPageComplete } from "./types/util.ts";
import { InternalError } from "./util/internalError.ts";

let settings: Settings | undefined;

export function setSettings(newSettings: Settings) {
  settings = newSettings;
}

export function getSettings() {
  if (!settings) {
    throw new InternalError("Settings not initialized");
  }
  return settings;
}

type InternalSettings = {
  typeScriptPackageName?: string;
  onPageComplete?: OnPageComplete;
};

const internalSettings: InternalSettings = {};

export function getInternalSetting<Key extends keyof InternalSettings>(
  key: Key
) {
  const value = internalSettings[key];
  if (!value) {
    throw new InternalError(`Internal setting ${key} not set`);
  }
  return value;
}

export function setInternalSetting<Key extends keyof InternalSettings>(
  key: Key,
  value: InternalSettings[Key]
) {
  internalSettings[key] = value;
}

const sdkCommonProperties = {
  /**
   * The path to a tarball file of the SDK. Use this option if, for example,
   * you are downloading an SDK from GitHub releases.
   */
  sdkTarballPath: z.string().optional(),

  /**
   * The path to a folder containing the SDK. Use this option if, for example,
   * your SDK is located in the same repo as docs.
   */
  sdkFolder: z.string().optional(),
};

const curl = z.object({
  /**
   * The language to use for the code sample.
   */
  language: z.literal("curl"),

  /**
   * Whether or not to enable Try It Now.
   */
  tryItNow: z.boolean().optional().default(false),
});

const typescript = z.object({
  /**
   * The language to use for the code sample.
   */
  language: z.literal("typescript"),

  /**
   * Configuration for Try It Now, if supplied. If this object is not supplied,
   * then Try It Now will be disabled.
   */
  tryItNow: z
    .strictObject({
      /**
       * The output directory to place generated artifacts in.
       *
       * When docs are build, the SDK and types are prebundled into a browser
       * friendly format, and then placed in this directory.
       *
       * This directory should be a publicly accessible static asset directory.
       *
       * For example, if you are using Next.js, this directory should be a
       * directory that is a sub folder of `public`.
       */
      outDir: z.string(),

      /**
       * The URL prefix to use for the Try It Now endpoint. This should be a URL
       * that points to the `outDir` directory.
       *
       * For example, In Next.js, if `outDir` is `./public/try-it-now/ts`, then
       * `urlPrefix` should be `/try-it-now/ts`.
       */
      urlPrefix: z.string(),
    })
    .optional(),
  ...sdkCommonProperties,
});

const otherSdkLanguages = z.object({
  /**
   * The language to use for the code sample.
   */
  language: z.enum([
    "go",
    "java",
    "python",
    "csharp",
    "terraform",
    "unity",
    "php",
    "swift",
    "ruby",
    "postman",
  ]),
  ...sdkCommonProperties,
});

const codeSample = z.union([curl, typescript, otherSdkLanguages]);

export const settingsSchema = z.strictObject({
  /**
   * The path to the OpenAPI spec file in JSON or YAML format.
   *
   * If you wish to load the spec from a location other than a file on disk,
   * use `specData` instead.
   */
  spec: z.string().optional(),

  /**
   * The text contents of the OpenAPI spec file, in JSON or YAML format.
   *
   * You can use this property instead of `spec` if you wish to load the file
   * from a location other than a file on disk.
   */
  specData: z.string().optional(),

  /**
   * Configuration for the output of the generated site.
   */
  output: z.strictObject({
    /**
     * The location to put generated markdown page files.
     *
     * Examples:
     * - Docusaurus: `./docs/api`
     * - Next.js: `./src/app/api`
     */
    pageOutDir: z.string(),

    /**
     * The location to put generated markdown embed files. This setting is only
     * required if `display.maxNestingLevel` is specified.
     *
     * These files should _not_ go in a folder that the site framework
     * interprets as a page route. For example, if you are using Docusaurus,
     * you should not put embed files in a folder that is a child of
     * `docs`.
     */
    embedOutDir: z.string().optional(),

    /**
     * The site framework you are using. This can be either a string for a
     * preconfigured framework, or a custom configuration for use in any
     * framework.
     */
    framework: z.enum(["docusaurus", "nextra", "llms"]).or(
      // This type MUST be kept in sync with src/types/compilerConfig.ts
      z.object({
        /**
         * The base renderer type to use. If you are using an MDX capable
         * framework, then specifying `mdx` will use React versions of our
         * components. If you are using a Markdown capable framework, then
         * specifying `markdown` will use web component versions of our
         * components.
         */
        rendererType: z.enum(["mdx", "markdown"]),

        /**
         * For use with the `mdx` renderer only. This property is the module
         * name of the package containing components. Defaults to
         * `@speakeasy-api/docs-md-react`.
         *
         * If you wish to override components, then you can set this to a local
         * import, e.g. `@/components/my-custom-docs-components`. Note that
         * this path cannot be relative due to varying nesting levels of pages.
         */
        componentPackageName: z
          .string()
          .optional()
          .default("@speakeasy-api/docs-md-react"),

        /**
         * A function that builds a path to a file on disk to compute a page
         * page. File-based routing frameworks all have their own quirks and
         * requirements, so this function exists to customize pathing to match.
         *
         * This function takes in two arguments:
         * - `slug`: The slug of the page relative to `outDir` without a leading
         *   slash, e.g. `endpoints/myTag`
         * - `options`: An object containing optional properties
         *     - `options.appendIndex`: Whether or not this indicates an "index"
         *       or root-level page, e.g. the compiled `/outDir/index.html` page
         *
         * The function should return an absolute path to a file on disk,
         * including file extension, that we will save markdown to.
         */
        buildPagePath: z.function(),

        /**
         * A function that works just like `buildPagePath`, but for embed files.
         * This function is only called when `display.maxNestingLevel` is
         * specified.
         */
        buildEmbedPath: z.function().optional(),

        /**
         * A function that builds a page preamble. You can add anything here
         * that you would like at the start of a markdown file, such as metadata
         * for the page (title, ordering, etc.). You can also add global imports
         * of files in MDX pages, etc.
         */
        buildPagePreamble: z.function(),

        /**
         * A function that is called after all pages have been generated.
         * Metadata about all pages is passed in, which you can do things like
         * creating a left navigation menu, metadata files for frameworks (such
         * as `_category_.json` in Docusaurus), etc.
         */
        postProcess: z.function().optional(),

        /**
         * A function that formats a heading ID. Different markdown parsers and
         * plugins have different syntax for formatting a heading ID.
         *
         * This function defaults to the most common format, which looks like:
         *
         * ```
         * # Heading Text \{#heading-id\}
         * ```
         *
         * The default function returns ` \\{#${id}\\}`.
         *
         * If you are using a framework that uses a different syntax, you can
         * override this function to conform to your framework.
         */
        formatHeadingId: z.function().optional(),

        /**
         * The separator to use between elements in an ID. Defaults to "+".
         */
        elementIdSeparator: z.string().optional(),
      })
    ),

    /**
     * Whether or not to generate an "About" page. This page is generated
     * automatically and contains information about the API, such as its
     * description, version, servers, etc.
     */
    aboutPage: z.boolean().optional().default(true),

    /**
     * Whether or not to generate a single-page site. If this is set to true,
     * then all pages will be generated in a single markdown file.
     *
     * WARNING: we do not provide any virtualization of the page. Enabling this
     * on large specs will cause significant performance problems unless you
     * implement your own virtualization strategy.
     *
     * As such, this option is only available for custom frameworks.
     */
    singlePage: z.boolean().optional().default(false),

    /**
     * Whether or not to auto generate request body examples.
     */
    generateRequestBodyExamples: z.boolean().optional().default(true),

    /**
     * Whether or not to auto generate response body examples.
     */
    generateResponseExamples: z.boolean().optional().default(true),
  }),

  /**
   * Configuration for the display of the generated site.
   */
  display: z
    .strictObject({
      /**
       * Configures what type of responses to show.
       * - `success`: Only 200 responses will be shown.
       * - `explicit`: Only 400+ responses with a specifif code are shown. For
       *    example, we will see `402` but not `4XX` responses
       * - `all`: All responses will be shown, including auto-generated `4XX`
       *    and `5XX` responses
       */
      visibleResponses: z
        .enum(["success", "explicit", "all"])
        .default("explicit"),

      /**
       * Whether or not to show debug placeholders. Debug placeholders are a UI
       * placeholder in generated files that indicate a value was not supplied
       * in the spec, along with tips on how to add it.
       *
       * This is useful if you are wondering why, e.g. an object property does
       * not contain a description.
       *
       * This should not be enabled in production.
       */
      showDebugPlaceholders: z.boolean().default(false),

      /**
       * Whether or not to expand top-level properties by default on page load.
       */
      expandTopLevelPropertiesOnPageLoad: z.boolean().default(true),

      /**
       * The maximum nesting level to show. If this is set, then any properties
       * that are nested deeper than this will be shown inside of a modal
       * instead of inline in the page.
       *
       * If you notice that generated pages are too big, or indentation takes
       * up too much horizontal space, you can use this setting to fix it.
       *
       * When this setting is enabled, you must also set `output.embedOutDir`
       */
      maxNestingLevel: z.number().optional(),
    })
    .default({
      visibleResponses: "explicit",
      showDebugPlaceholders: false,
      expandTopLevelPropertiesOnPageLoad: true,
    }),

  /**
   * Configuration for code samples.
   */
  codeSamples: z.array(codeSample).min(1).optional(),
});

type ZodSettings = z.infer<typeof settingsSchema>;

export type Settings = Omit<ZodSettings, "output"> & {
  output: Omit<ZodSettings["output"], "framework"> & {
    // Defining FrameworkConfig in Zod would be excruciatingly verbose, so we
    // define it in Zod as just an object, and then override its type here
    /**
     * The site framework you are using. This can be either a string for a
     * preconfigured framework, or a custom configuration for use in any
     * framework.
     */
    framework: "docusaurus" | "nextra" | "llms" | FrameworkConfig;
  };
};
