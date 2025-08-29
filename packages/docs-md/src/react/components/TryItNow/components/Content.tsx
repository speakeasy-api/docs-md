"use client";

import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useErrorMessage,
} from "@codesandbox/sandpack-react";
import { useAtomValue } from "jotai";

import type { TryItNowProps } from "../../../../types/shared.ts";
import { dependenciesAtom, lastEditorValueAtom } from "../state/atoms.ts";
import { CodeEditor } from "./CodeEditor.tsx";
import { ConsoleOutput } from "./ConsoleOutput.tsx";

const TryItNowContents = ({
  _enableUnsafeAutoImport,
  layoutStyle,
  readonly,
}: {
  _enableUnsafeAutoImport?: boolean;
  layoutStyle?: React.CSSProperties;
  readonly?: boolean;
}) => {
  const error = useErrorMessage();

  return (
    <SandpackLayout style={layoutStyle}>
      {_enableUnsafeAutoImport ? (
        <CodeEditor readonly={readonly} />
      ) : (
        <SandpackCodeEditor
          showReadOnly={false}
          readOnly={readonly}
          showRunButton={!readonly}
        />
      )}
      {!error && !readonly && <ConsoleOutput />}
      <SandpackPreview
        style={
          error
            ? undefined
            : {
                display: "none",
              }
        }
      >
        {error ? <pre>{error}</pre> : null}
      </SandpackPreview>
    </SandpackLayout>
  );
};

export const Content = ({
  externalDependencies,
  defaultValue = "",
  _enableUnsafeAutoImport,
  layoutStyle,
  readonly,
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
      theme="dark"
      template="vanilla-ts"
      files={{
        "index.ts": {
          code:
            _enableUnsafeAutoImport && previousCodeAtomValue
              ? previousCodeAtomValue
              : defaultValue,
          active: true,
          readOnly: readonly,
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
      <TryItNowContents
        layoutStyle={layoutStyle}
        readonly={readonly}
        _enableUnsafeAutoImport={_enableUnsafeAutoImport}
      />
    </SandpackProvider>
  );
};
