import { usePrismTheme } from "@docusaurus/theme-common";

import type { TryItNowProps } from "./Content/index.tsx";
import { Content } from "./Content/index.tsx";

type PrismThemeEntry = {
  color?: string;
  cursor?: string;
  background?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textShadow?: string;
  fontStyle?: "normal" | "italic";
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  textDecorationLine?:
    | "none"
    | "underline"
    | "line-through"
    | "underline line-through";
  opacity?: number;
};

export const TryItNowDocusaurus = (props: TryItNowProps) => {
  const prismTheme = usePrismTheme();

  const parsedPrismTheme = (theme: ReturnType<typeof usePrismTheme>) => {
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
  };

  const generateSandpackTheme = (
    theme: ReturnType<typeof usePrismTheme>
  ): TryItNowProps["theme"] => {
    const colorThemeMap = parsedPrismTheme(theme);
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
  };

  const sandpackTheme = generateSandpackTheme(prismTheme);

  return (
    <Content
      layoutStyle={{
        backgroundColor: `var(--ifm-background-surface-color)`,
        borderRadius: `var(--ifm-global-radius)`,
        boxShadow: `var(--ifm-global-shadow-lw)`,
      }}
      theme={sandpackTheme}
      {...props}
    />
  );
};
