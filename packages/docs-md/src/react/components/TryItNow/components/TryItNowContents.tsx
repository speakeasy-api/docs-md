"use client";

import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useErrorMessage,
} from "@codesandbox/sandpack-react";

import type { TryItNowProps } from "../types.ts";
import { CodeEditor } from "./CodeEditor.tsx";
import { ConsoleOutput } from "./ConsoleOutput.tsx";

function InnerContents() {
  const error = useErrorMessage();

  return (
    <SandpackLayout>
      <CodeEditor />
      {!error && <ConsoleOutput />}
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
}

export function TryItNowContents({
  externalDependencies,
  defaultValue = "",
}: TryItNowProps) {
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
          code: defaultValue,
          active: true,
        },
      }}
      customSetup={{
        dependencies: externalDependencies,
        entry: "index.ts",
      }}
    >
      <InnerContents />
    </SandpackProvider>
  );
}
