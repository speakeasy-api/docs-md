import { usePrismTheme } from "@docusaurus/theme-common";
import { useCallback, useMemo } from "react";

import type { TryItNowProps } from "./Content/index.tsx";
import { Content } from "./Content/index.tsx";

type PrismThemeEntry = {
  color?: string;
  background?: string;
  backgroundColor?: string;
  fontStyle?: "normal" | "italic";
};

export const TryItNowDocusaurus = (props: TryItNowProps) => {
  const prismTheme = usePrismTheme();

  const parsePrismTheme = useCallback(
    (theme: ReturnType<typeof usePrismTheme>) => {
      const colorThemeMap = new Map<string, PrismThemeEntry>();
      const styles = theme.styles;
      const plain = theme.plain;
      colorThemeMap.set("plain", {
        color: plain.color,
        backgroundColor: plain.backgroundColor,
      });

      styles.forEach(({ types, style }) => {
        types.forEach((type) => {
          colorThemeMap.set(type, style);
        });
      });
      return colorThemeMap;
    },
    []
  );

  const sandpackTheme = useMemo((): TryItNowProps["theme"] => {
    const colorThemeMap = parsePrismTheme(prismTheme);
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
  }, [prismTheme, parsePrismTheme]);

  return (
    <Content
      layoutStyle={{
        borderRadius: `var(--ifm-global-radius)`,
        boxShadow: `var(--ifm-global-shadow-lw)`,
      }}
      theme={sandpackTheme}
      {...props}
    />
  );
};
