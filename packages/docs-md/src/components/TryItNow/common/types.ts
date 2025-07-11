import type { SandpackTheme } from "@codesandbox/sandpack-react";
import type { PartialDeep } from "type-fest";

type TryItNowPropsBase = {
  /**
   * These are dependencies that are required by the code snippet,
   * like "zod" or an npm package.
   */
  externalDependencies?: Record<string, string>;
  /**
   * Starting value of the editor
   */
  defaultValue?: string;
  /**
   * Experimental: When enabled, the editor will automatically
   * scan for external dependencies from npm as the user adds them
   * as imports.
   */
  _enableUnsafeAutoImport?: boolean;
  layoutStyle?: React.CSSProperties;
};


type TryItNowPropsWithAutoTheme = TryItNowPropsBase & {
  currentTheme?: "auto" | "dark" | "light";
  codeThemes?: undefined;
};

type TryItNowPropsWithCustomThemes = TryItNowPropsBase & {
  currentTheme: "dark" | "light";
  codeThemes: Record<"dark" | "light", PartialDeep<SandpackTheme>>;
};

export type TryItNowProps = TryItNowPropsWithAutoTheme | TryItNowPropsWithCustomThemes;
