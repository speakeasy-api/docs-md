import type { SandpackTheme } from "@codesandbox/sandpack-react";
import type { DeepPartial } from "@codesandbox/sandpack-react";
import type { Theme } from "rehype-pretty-code";
import type { BundledTheme, ThemeRegistration, ThemeRegistrationAny } from "shiki";
import { bundledThemes, normalizeTheme } from "shiki";

import type { RehypeTheme } from "../types/nextra.ts";

async function loadBundledShikiTheme(theme: BundledTheme) {
  const shikiTheme = await bundledThemes[theme]();
  if (!shikiTheme) {
    throw new Error(`Shiki theme ${theme} not found`);
  }
  return normalizeTheme(shikiTheme.default);
}

export async function loadRehypeThemes(
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
    const processedThemes: Record<'dark' | 'light', ThemeRegistration> = {
      dark: defaultDarkTheme,
      light: defaultLightTheme,
    };

    for (const [themeName, shikiTheme] of Object.entries(
      themes
    )) {
      if (typeof shikiTheme === "string") {
        // Load the bundled theme
        const loadedTheme = await loadBundledShikiTheme(shikiTheme as BundledTheme);
        processedThemes[themeName as "dark" | "light"] = loadedTheme;
      } else {
        // normalize the imported theme
        processedThemes[themeName as "dark" | "light"] = normalizeTheme(shikiTheme as ThemeRegistrationAny);
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

export function convertRehypeThemeToSandpackTheme(rehypeTheme: RehypeTheme): {
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
