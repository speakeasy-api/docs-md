"use client";

import { useState } from "react";

import { useRuntime } from "../state.ts";
import type { TryItNowProps } from "../types.ts";
import { Editor as DefaultEditor } from "./Editor.tsx";
import { Layout as DefaultLayout } from "./Layout.tsx";
import { Results as DefaultResults } from "./Results.tsx";
import { RunButton as DefaultRunButton } from "./RunButton.tsx";
import { EditorLayout } from "./EditorLayout.tsx";

export function TryItNowContents({
  externalDependencies = {},
  defaultValue,
  Layout = DefaultLayout,
  Editor = DefaultEditor,
  RunButton = DefaultRunButton,
  Results = DefaultResults,
  theme = "dark",
  packageManagerUrl,
}: TryItNowProps) {
  const [value, setValue] = useState(defaultValue);
  const { status, execute } = useRuntime({
    packageManagerUrl,
    dependencies: externalDependencies,
  });
  return (
    <div>
      <Layout>
        <EditorLayout>
          <div slot="editor">
            <Editor theme={theme} value={value} onValueChange={setValue} />
          </div>
          <div slot="runButton">
            <RunButton
              onClick={() => {
                execute(value);
              }}
            />
          </div>
        </EditorLayout>
        <Results status={status} />
      </Layout>
    </div>
  );
}
