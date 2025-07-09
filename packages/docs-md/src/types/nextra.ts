import type { Theme as RehypeTheme } from "rehype-pretty-code";
import type { ThemeRegistrationResolved } from "shiki";

export type ShikiTheme = {
  dark?: string | ThemeRegistrationResolved;
  light?: string | ThemeRegistrationResolved;
};

export type NextraTheme =
  | {
      dark?: string;
      light?: string;
    }
  | RehypeTheme
  | undefined;
