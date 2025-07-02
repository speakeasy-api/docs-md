"use client";

import type { SandpackTheme } from "@codesandbox/sandpack-react";
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useErrorMessage,
} from "@codesandbox/sandpack-react";
import { useAtomValue } from "jotai";

import { CodeEditor } from "../CodeEditor/index.tsx";
import { ConsoleOutput } from "../ConsoleOutput/index.tsx";
import { dependenciesAtom, lastEditorValueAtom } from "../state/index.ts";
import { styles } from "../styles.ts";

type DependencyName = string;
type DependencyVersion = string;
type Dependencies = Record<DependencyName, DependencyVersion>;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type TryItNowProps = {
  /**
   * These are dependencies that are required by the code snippet,
   * like "zod" or an npm package.
   */
  externalDependencies?: Dependencies;
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
  theme?: DeepPartial<SandpackTheme> | "auto" | "dark" | "light";
  layoutStyle?: React.CSSProperties;
};

const TryItNowContents = ({
  _enableUnsafeAutoImport,
  layoutStyle,
}: {
  _enableUnsafeAutoImport?: boolean;
  layoutStyle?: React.CSSProperties;
}) => {
  const error = useErrorMessage();

  return (
    <SandpackLayout style={layoutStyle}>
      {_enableUnsafeAutoImport ? <CodeEditor /> : <SandpackCodeEditor />}
      {!error && <ConsoleOutput />}
      <SandpackPreview style={error ? undefined : styles.preview}>
        {error ? <pre>{error}</pre> : null}
      </SandpackPreview>
    </SandpackLayout>
  );
};

export const Content = ({
  externalDependencies,
  defaultValue = "",
  theme = "dark",
  _enableUnsafeAutoImport,
  layoutStyle,
}: TryItNowProps) => {
  const autoImportDependencies = useAtomValue(dependenciesAtom);
  const previousCodeAtomValue = useAtomValue(lastEditorValueAtom);

  return (
    <SandpackProvider
      options={{
        autoReload: false,
        autorun: false,
        activeFile: "index.ts",
      }}
      theme={theme}
      template="vanilla-ts"
      files={{
        "index.ts": {
          code:
            _enableUnsafeAutoImport && previousCodeAtomValue
              ? previousCodeAtomValue
              : defaultValue,
          active: true,
        },
      }}
      customSetup={{
        dependencies:
          autoImportDependencies && _enableUnsafeAutoImport
            ? { ...autoImportDependencies, ...externalDependencies }
            : externalDependencies,
        entry: "index.ts",
      }}
    >
      <TryItNowContents layoutStyle={layoutStyle} />
    </SandpackProvider>
  );
};
