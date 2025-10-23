import type {
  CurlRuntimeEvent,
  TypeScriptRuntimeEvent,
} from "@speakeasy-api/docs-md-shared";
import type { PropsWithChildren } from "react";

export type ExtendedTypeScriptRuntimeEvent = TypeScriptRuntimeEvent & {
  id: string;
};

export type ExtendedCurlRuntimeEvent = CurlRuntimeEvent & {
  id: string;
};

export type ExtendedRuntimeEvent =
  | ExtendedTypeScriptRuntimeEvent
  | ExtendedCurlRuntimeEvent;

export type TypeScriptStatus =
  | {
      state: "idle";
      language: "typescript";
    }
  | {
      state: "compiling";
      language: "typescript";
      previousEvents: ExtendedTypeScriptRuntimeEvent[];
    }
  | {
      state: "compile-error";
      language: "typescript";
      previousEvents: ExtendedTypeScriptRuntimeEvent[];
      events: ExtendedTypeScriptRuntimeEvent[];
    }
  | {
      state: "executing";
      language: "typescript";
      events: ExtendedTypeScriptRuntimeEvent[];
    };

export type CurlStatus =
  | {
      state: "idle";
      language: "curl";
    }
  | {
      state: "parsing";
      language: "curl";
      events: ExtendedCurlRuntimeEvent[];
    }
  | {
      state: "parse-error";
      language: "curl";
      events: ExtendedCurlRuntimeEvent[];
    }
  | {
      state: "fetching";
      language: "curl";
      events: ExtendedCurlRuntimeEvent[];
    }
  | {
      state: "finished";
      language: "curl";
      events: ExtendedCurlRuntimeEvent[];
    }
  | {
      state: "error";
      language: "curl";
      events: ExtendedCurlRuntimeEvent[];
    };

type Status = TypeScriptStatus | CurlStatus;

type BaseTryItNowProps = {
  /**
   * The code sample for the editor to initially load
   */
  defaultValue: string;
  /**
   * The theme of the editor
   */
  theme?: "light" | "dark";
};

export type TypeScriptTryItNowProps = BaseTryItNowProps & {
  /**
   * The language of the code sample.
   */
  language: "typescript";
  /**
   * URL prefix to the prebuilt dependency bundle and types, as specified by
   * `codeSample.tryItNow.urlPrefix` in the Speakeasy docs config
   */
  dependencyUrlPrefix: string;
  /**
   * The name of the npm package that the bundle and types represent
   */
  packageName: string;
};

export type CurlTryItNowProps = BaseTryItNowProps & {
  /**
   * The language of the code sample.
   */
  language: "curl";
};

export type TryItNowProps = TypeScriptTryItNowProps | CurlTryItNowProps;

export type EditorProps = {
  /**
   * The language of the code sample.
   */
  language: "typescript" | "curl";
  /**
   * The current code value in the editor
   */
  value: string;
  /**
   * The name of the npm package that the bundle and types represent
   */
  packageName: string | null;
  /**
   * Callback to invoke when the value changes
   */
  onValueChange: (value: string) => void;
  /**
   * Contents of a bundled TypeScript Definition File (`.d.ts`) that contains
   * type information for the SDK. The value is `null` if they haven't loaded
   * yet, or errored while loading.
   *
   * Will always be `null` for non-TypeScript SDKs
   */
  types: string | null;
  /**
   * The theme of the editor
   */
  theme?: "light" | "dark";
  /**
   * Padding to apply to the editor. This padding shows up inside of the editor
   * boundary around the code being displayed.
   *
   * Note: We set this via JavaScript because Monaco requires it.
   */
  editorPadding?: {
    top?: number;
    bottom?: number;
  };
};

export type ButtonProps = PropsWithChildren<{
  /**
   * Callback to invoke when the run button is clicked
   */
  onClick?: () => void;
  /**
   * The aria label for the button
   */
  ariaLabel?: string;
  /**
   * Extra classes to apply to the button
   */
  className?: string;
}>;

export type ResetButtonProps = Pick<ButtonProps, "onClick">;

export type CopyButtonProps = {
  /**
   * The value to copy to the clipboard when the button is clicked
   */
  copyValue?: string;
};

export type ResultsProps = {
  /**
   * The current status of the try it now component, from the runtime hook
   */
  status: Status;
};

export type LayoutProps = PropsWithChildren<{
  /**
   * The current status of the try it now component, from the runtime hook
   */
  status: Status;
}>;

export type ControlsProps = PropsWithChildren<{
  /**
   * The current status of the try it now component, from the runtime hook
   */
  status: Status;
}>;
