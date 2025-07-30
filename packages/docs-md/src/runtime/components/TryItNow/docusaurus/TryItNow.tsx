import type { SandpackTheme } from "@codesandbox/sandpack-react";
import { usePrismTheme } from "@docusaurus/theme-common";
import { useMemo } from "react";
import type { PartialDeep } from "type-fest";

import { Content } from "../common/components/Content.tsx";
import type { TryItNowProps } from "../common/types.ts";

type PrismThemeEntry = {
  color?: string;
  background?: string;
  backgroundColor?: string;
  fontStyle?: "normal" | "italic";
};

export const TryItNowDocusaurus = (
  props: Omit<TryItNowProps, "themes" | "currentTheme">
) => {
  const prismTheme = usePrismTheme();

  const sandpackTheme = useMemo((): PartialDeep<SandpackTheme> => {
    const colorThemeMap = new Map<string, PrismThemeEntry>();
    const { styles, plain } = prismTheme;

    colorThemeMap.set("plain", {
      color: plain.color,
      backgroundColor: plain.backgroundColor,
    });

    styles.forEach(({ types, style }) => {
      types.forEach((type) => {
        colorThemeMap.set(type, style);
      });
    });

    return {
      colors: {
        base: colorThemeMap.get("plain")?.color,
        surface1: colorThemeMap.get("plain")?.backgroundColor,
      },
      syntax: {
        string: colorThemeMap.get("string")?.color,
        comment: colorThemeMap.get("comment")?.color,
        keyword: colorThemeMap.get("keyword")?.color,
        property: colorThemeMap.get("property")?.color,
        tag: colorThemeMap.get("tag")?.color,
        plain: colorThemeMap.get("plain")?.color,
        definition: colorThemeMap.get("variable")?.color,
        punctuation: colorThemeMap.get("punctuation")?.color,
      },
    };
  }, [prismTheme]);

  return (
    <Content
      layoutStyle={{
        borderRadius: `var(--ifm-code-border-radius)`,
        boxShadow: `var(--ifm-global-shadow-lw)`,
      }}
      currentTheme="dark"
      themes={{
        dark: sandpackTheme,
        light: sandpackTheme,
      }}
      {...props}
    />
  );
};
