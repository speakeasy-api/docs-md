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
};

export type EditorProps = {
  /**
   * The code sample for the editor to initially load
   */
  defaultValue: string;
  /**
   * Callback to invoke when the value changes
   */
  onValueChange: (value: string) => void;
};

export type RunButtonProps = {
  /**
   * Callback to invoke when the run button is clicked
   */
  onClick: () => void;
};

export type ResultsProps = {
  // TODO: depends on the runtime
  output: unknown;
};
