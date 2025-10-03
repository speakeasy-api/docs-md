import type { RuntimeEvents } from "@speakeasy-api/docs-md-shared";
import type { FC } from "react";

export type Status =
  | {
      state: "idle";
    }
  | {
      state: "compiling";
      previousEvents: RuntimeEvents[];
    }
  | {
      state: "compile-error";
      previousEvents: RuntimeEvents[];
      events: RuntimeEvents[];
    }
  | {
      state: "executing";
      events: RuntimeEvents[];
    };

export type TryItNowProps = {
  /**
   * The code sample for the editor to initially load
   */
  defaultValue: string;
  /**
   * URL prefix to the prebuilt dependency bundle and types, as specified by
   * `codeSample.tryItNow.urlPrefix` in the Speakeasy docs config
   */
  dependencyUrlPrefix: string;
  /**
   * The name of the npm package that the bundle and types represent
   */
  packageName: string;
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
};

export type EditorProps = {
  /**
   * The current code value in the editor
   */
  value: string;
  /**
   * The name of the npm package that the bundle and types represent
   */
  packageName: string;
  /**
   * Callback to invoke when the value changes
   */
  onValueChange: (value: string) => void;
  /**
   * Contents of a bundled TypeScript Definition File (`.d.ts`) that contains
   * type information for the SDK. The value is `null` if they haven't loaded
   * yet, or errored while loading
   */
  types: string | null;
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
};

export type ResultsProps = {
  status: Status;
};

export type LayoutProps = {
  children: React.ReactNode;
};
