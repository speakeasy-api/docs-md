import { usePrismTheme } from "@docusaurus/theme-common";
import { useMemo } from "react";

import { Content } from "../common/components/Content.tsx";
import type { TryItNowProps } from "../common/types.ts";

type PrismThemeEntry = {
  color?: string;
  background?: string;
  backgroundColor?: string;
  fontStyle?: "normal" | "italic";
};

export const TryItNowDocusaurus = (props: TryItNowProps) => {
  const prismTheme = usePrismTheme();

  const sandpackTheme = useMemo((): TryItNowProps["theme"] => {
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
        borderRadius: `var(--ifm-global-radius)`,
        boxShadow: `var(--ifm-global-shadow-lw)`,
      }}
      theme={sandpackTheme}
      {...props}
    />
  );
};
