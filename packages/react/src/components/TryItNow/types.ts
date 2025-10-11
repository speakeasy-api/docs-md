import type { RuntimeEvents } from "@speakeasy-api/docs-md-shared";
import type { ComponentType, CSSProperties, FC } from "react";

export type ExtendedRuntimeEvent = RuntimeEvents & { id: string };

export type Status =
  | {
      state: "idle";
    }
  | {
      state: "compiling";
      previousEvents: ExtendedRuntimeEvent[];
    }
  | {
      state: "compile-error";
      previousEvents: ExtendedRuntimeEvent[];
      events: ExtendedRuntimeEvent[];
    }
  | {
      state: "executing";
      events: ExtendedRuntimeEvent[];
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
   * Copy button component to use. Defaults to `CopyButton`.
   */
  CopyButton?: FC<CopyButtonProps>;
  /**
   * Run button component to use. Defaults to `RunButton`.
   */
  RunButton?: FC<ButtonProps>;
  /**
   * Reset button component to use. Defaults to `ResetButton`.
   */
  ResetButton?: FC<ResetButtonProps>;
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
   * Editor props to pass to the editor component
   */
  editorProps?: Partial<EditorProps>;
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
  editorPadding?: {
    top?: number;
    bottom?: number;
  };
};

export type ButtonProps = {
  /**
   * Callback to invoke when the run button is clicked
   */
  onClick?: () => void;
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
};

export type ResetButtonProps = Pick<ButtonProps, "onClick"> & {
  ResetIcon?: ComponentType<ResetIconProps>;
};

export type CopyButtonProps = {
  copyValue?: string;
  CheckIcon?: ComponentType<CheckIconProps>;
  CopyIcon?: ComponentType<CopyIconProps>;
};

export type ResultsProps = {
  status: Status;
};

export type LayoutProps = {
  children: React.ReactNode;
  status: Status;
};

export type ControlsProps = {
  children: React.ReactNode;
  status: Status;
};

export type ResetIconProps = {
  className?: string;
  style?: CSSProperties;
};

export type CheckIconProps = {
  className?: string;
  style?: CSSProperties;
};

export type CopyIconProps = {
  className?: string;
  style?: CSSProperties;
};
