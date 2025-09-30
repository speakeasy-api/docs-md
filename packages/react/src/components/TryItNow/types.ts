import { Message } from "console-feed/lib/definitions/Component";
import type { FC } from "react";

export type TryItNowProps = {
  /**
   * These are dependencies that are required by the code snippet,
   * like "zod" or an npm package.
   */
  externalDependencies?: Record<string, string>;
  /**
   * The code sample for the editor to initially load
   */
  defaultValue: string;
  /**
   * Editor component to use. Defaults to `Editor`.
   */
  Editor?: FC<EditorProps>;
  /**
   * Run button component to use. Defaults to `RunButton`.
   */
  RunButton?: FC<RunButtonProps>;
  /**
   * Results component to use. Defaults to `Results`.
   */
  Results?: FC<ResultsProps>;
  /**
   * Layout component to use. Defaults to `Layout`.
   */
  Layout?: FC<LayoutProps>;
  /**
   * The theme of the editor
   */
  theme?: "light" | "dark";
  /**
   * URL to a CDN that is compatible with esm.sh
   */
  packageManagerUrl?: string;
};

export type EditorProps = {
  /**
   * The current code value in the editor
   */
  value: string;
  /**
   * Callback to invoke when the value changes
   */
  onValueChange: (value: string) => void;
  /**
   * The theme of the editor
   */
  theme?: "light" | "dark";
};

export type RunButtonProps = {
  /**
   * Callback to invoke when the run button is clicked
   */
  onClick: () => void;
  /**
   * Whether the run button is disabled
   */
  disabled?: boolean;
  /**
   * Whether the run button is loading
   */
  loading?: boolean;
};

export type ResultsProps = {
  // TODO: depends on the runtime
  output: Message[];
  loading?: boolean;
};

export type LayoutProps = {
  children: React.ReactNode;
};
