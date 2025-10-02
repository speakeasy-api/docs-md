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
   * URL to the prebuilt dependency bundle, as specified by
   * `codeSample.tryItNowBundleUrl` in the Speakeasy docs config
   */
  dependencyBundleUrl: string;
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
};

export type ResultsProps = {
  status: Status;
};

export type LayoutProps = {
  children: React.ReactNode;
};
