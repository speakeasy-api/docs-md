import { existsSync } from "node:fs";
import { join } from "node:path";

import type { DeepPartial, SandpackTheme } from "@codesandbox/sandpack-react";
import type { NextConfig } from "next";
import type { NextraConfig } from "nextra";
import type { Theme } from "rehype-pretty-code";
import type {
  BundledTheme,
  ThemeRegistration,
  ThemeRegistrationAny,
} from "shiki";
import { bundledThemes, normalizeTheme } from "shiki";

import type { RehypeTheme } from "../../types/nextra.ts";
import type { TryItNowProps } from "../../types/shared.ts";

// TODO: This import is dynamically imported in the CLI. fast-import is
// supposed to support this case, and it should be fixed.
// eslint-disable-next-line fast-import/no-unused-exports
export async function getNextraThemeConfig(): Promise<
  Theme | Record<string, Theme> | undefined | null
> {
  // this will be exported an object from next.config.js or next.config.mjs
  // import it and return the object

  let nextraConfig: NextConfig | null = null;

  // first check if next.config.js exists
  let nextConfigPath = join(process.cwd(), "next.config.js");
  if (existsSync(nextConfigPath)) {
    const config = (await import(nextConfigPath)) as { default: NextConfig };
    nextraConfig = config.default;
  }

  // if not, check if next.config.mjs exists
  nextConfigPath = join(process.cwd(), "next.config.mjs");
  if (existsSync(nextConfigPath)) {
    const config = (await import(nextConfigPath)) as { default: NextConfig };
    nextraConfig = config.default;
  }

  if (!nextraConfig) {
    throw new Error("Could not find Nextra config file.");
  }

  if (nextraConfig) {
    // check the experimental.turbo.rules
    if (nextraConfig.experimental?.turbo?.rules?.["*.{md,mdx}"]) {
      // check the loaders
      const rules = nextraConfig.experimental.turbo.rules["*.{md,mdx}"];
      if (typeof rules === "object" && "loaders" in rules) {
        const loaders = rules.loaders;
        if (Array.isArray(loaders)) {
          for (const loader of loaders) {
            if (typeof loader === "string") {
              // we can't process a string loader.
              continue;
            }
            const options = loader.options;
            const mdxOptions =
              options?.mdxOptions as NextraConfig["mdxOptions"];

            const theme = mdxOptions?.rehypePrettyCodeOptions?.theme;
            return theme;
          }
        }
      }
    }
  }

  return null;
}

async function loadBundledShikiTheme(theme: BundledTheme) {
  const shikiTheme = await bundledThemes[theme]();
  if (!shikiTheme) {
    throw new Error(`Shiki theme ${theme} not found`);
  }
  return normalizeTheme(shikiTheme.default);
}

async function loadRehypeThemes(
  themes: Theme | Record<string, Theme> | null | undefined
): Promise<RehypeTheme> {
  // fallthrough case, return the default shiki theme
  const githubDark = await loadBundledShikiTheme("github-dark");
  const githubLight = await loadBundledShikiTheme("github-light");

  const defaultDarkTheme = normalizeTheme(githubDark);
  const defaultLightTheme = normalizeTheme(githubLight);

  // Handle the case where a user set the site theme to single Shiki theme
  if (typeof themes === "string") {
    const shikiTheme = await loadBundledShikiTheme(themes);
    // In this case, we are gonna set both dark and light mode to the same theme
    return {
      dark: shikiTheme,
      light: shikiTheme,
    };
  }

  // We are handling the case where the user imported via JSON and set just one theme
  // for dark and light mode.
  if (
    themes &&
    "name" in themes &&
    "displayName" in themes &&
    "type" in themes
  ) {
    return themes.type === "dark"
      ? {
          dark: themes,
          light: defaultLightTheme,
        }
      : {
          light: themes,
          dark: defaultDarkTheme,
        };
  }

  // Handle the case where the user did a mix of the two, a JSON theme
  // and a bundled theme name
  if (typeof themes === "object" && themes !== null) {
    const processedThemes: Record<"dark" | "light", ThemeRegistration> = {
      dark: defaultDarkTheme,
      light: defaultLightTheme,
    };

    for (const [themeName, shikiTheme] of Object.entries(themes)) {
      if (typeof shikiTheme === "string") {
        // Load the bundled theme
        const loadedTheme = await loadBundledShikiTheme(
          shikiTheme as BundledTheme
        );
        processedThemes[themeName as "dark" | "light"] = loadedTheme;
      } else {
        // normalize the imported theme
        processedThemes[themeName as "dark" | "light"] = normalizeTheme(
          shikiTheme as ThemeRegistrationAny
        );
      }
    }

    return {
      dark: processedThemes.dark,
      light: processedThemes.light,
    };
  }

  return {
    dark: defaultDarkTheme,
    light: defaultLightTheme,
  };
}

function convertRehypeThemeToSandpackTheme(rehypeTheme: RehypeTheme): {
  dark: DeepPartial<SandpackTheme>;
  light: DeepPartial<SandpackTheme>;
} {
  const darkTheme = rehypeTheme.dark;
  const lightTheme = rehypeTheme.light;

  const convertTheme = (theme: ThemeRegistration) => {
    const { settings } = theme;
    const scopeKeyWords = [
      "comment",
      "punctuation.definition.tag",
      "keyword",
      "variable.language",
      "constant",
      "entity.name",
      "string",
      "meta.property-name",
      "variable.parameter.function",
    ];

    const colorThemeMap = new Map<string, string>();

    settings?.forEach((setting) => {
      const scope = setting.scope;

      if (typeof scope === "string" && scopeKeyWords.includes(scope)) {
        colorThemeMap.set(scope, setting.settings.foreground ?? "");
      }

      if (Array.isArray(scope)) {
        // check if scope has a value from scopeKeyWords
        const hasScopeKeyWord = scope.some((s) => scopeKeyWords.includes(s));
        if (hasScopeKeyWord) {
          scope.forEach((s) => {
            colorThemeMap.set(s, setting.settings.foreground ?? "");
          });
        }
      }
    });

    return {
      colors: {
        base: theme?.colors?.["editor.foreground"],
        surface1: theme?.colors?.["editor.background"],
        surface2: theme?.colors?.["panel.border"],
        surface3: theme?.colors?.["editor.lineHighlightBackground"],
      },
      font: {
        mono: "var(--x-font-mono)",
      },
      syntax: {
        string: colorThemeMap.get("string"),
        comment: colorThemeMap.get("comment"),
        keyword: colorThemeMap.get("keyword"),
        // Color for object properties, variable properties, etc.
        property: theme?.colors?.["editor.foreground"],
        tag: colorThemeMap.get("punctuation.definition.tag"),
        // The color for variable names, import names, etc.
        plain: colorThemeMap.get("meta.property-name"),
        definition: colorThemeMap.get("entity.name"),
        punctuation: theme?.colors?.["editor.foreground"],
        // literal variable values like a number or boolean
        static: colorThemeMap.get("constant"),
      },
    } as DeepPartial<SandpackTheme>;
  };

  return {
    dark: convertTheme(darkTheme),
    light: convertTheme(lightTheme),
  };
}

// TODO: This import is dynamically imported in the CLI. fast-import is
// supposed to support this case, and it should be fixed.
// eslint-disable-next-line fast-import/no-unused-exports
export async function getCodeThemesFromThemeConfig(
  themeConfig: Awaited<ReturnType<typeof getNextraThemeConfig>>
): Promise<TryItNowProps["themes"]> {
  const rehypeTheme = await loadRehypeThemes(themeConfig);
  return convertRehypeThemeToSandpackTheme(rehypeTheme);
}
