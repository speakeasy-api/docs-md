import type {
  CurlRuntimeEvent,
  PythonRuntimeEvent,
  TypeScriptRuntimeEvent,
} from "@speakeasy-api/docs-md-shared";
import type { PropsWithChildren } from "react";

export type ExtendedTypeScriptRuntimeEvent = TypeScriptRuntimeEvent & {
  id: string;
};

export type ExtendedCurlRuntimeEvent = CurlRuntimeEvent & {
  id: string;
};

export type ExtendedPythonRuntimeEvent = PythonRuntimeEvent & {
  id: string;
};

export type ExtendedRuntimeEvent =
  | ExtendedTypeScriptRuntimeEvent
  | ExtendedCurlRuntimeEvent
  | ExtendedPythonRuntimeEvent;

export type TypeScriptStatus =
  | {
      state: "typescript:idle";
    }
  | {
      state: "typescript:compiling";
      previousEvents: ExtendedTypeScriptRuntimeEvent[];
    }
  | {
      state: "typescript:compile-error";
      previousEvents: ExtendedTypeScriptRuntimeEvent[];
      events: ExtendedTypeScriptRuntimeEvent[];
    }
  | {
      state: "typescript:executing";
      events: ExtendedTypeScriptRuntimeEvent[];
    };

export type PythonStatus =
  | {
      state: "python:idle";
    }
  | {
      state: "python:initializing";
      previousEvents: ExtendedPythonRuntimeEvent[];
    }
  | {
      state: "python:initialization-error";
      previousEvents: ExtendedPythonRuntimeEvent[];
      events: ExtendedPythonRuntimeEvent[];
    }
  | {
      state: "python:executing";
      events: ExtendedPythonRuntimeEvent[];
    };

export type CurlStatus =
  | {
      state: "curl:idle";
    }
  | {
      state: "curl:parsing";
      events: ExtendedCurlRuntimeEvent[];
    }
  | {
      state: "curl:parse-error";
      events: ExtendedCurlRuntimeEvent[];
    }
  | {
      state: "curl:fetching";
      events: ExtendedCurlRuntimeEvent[];
    }
  | {
      state: "curl:finished";
      events: ExtendedCurlRuntimeEvent[];
    }
  | {
      state: "curl:error";
      events: ExtendedCurlRuntimeEvent[];
    };

type Status = TypeScriptStatus | PythonStatus | CurlStatus;

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

export type PythonTryItNowProps = BaseTryItNowProps & {
  /**
   * The language of the code sample.
   */
  language: "python";
  /**
   * URL prefix to the prebuilt dependency bundle and types, as specified by
   * `codeSample.tryItNow.urlPrefix` in the Speakeasy docs config
   */
  dependencyUrlPrefix: string;
  /**
   * URL to the prebuilt Wheel bundle, as specified by
   * `codeSample.tryItNow.urlPrefix` in the Speakeasy docs config combined with
   * the name of the wheel file, e.g. /try-it-now/sdk-1.1.0-py3-none-any.whl
   */
  dependencyUrl: string;
};

export type CurlTryItNowProps = BaseTryItNowProps & {
  /**
   * The language of the code sample.
   */
  language: "curl";
};

export type TryItNowProps =
  | TypeScriptTryItNowProps
  | PythonTryItNowProps
  | CurlTryItNowProps;

export type EditorProps = {
  /**
   * The language of the code sample.
   */
  language: "typescript" | "curl" | "python";
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
