"use client";

import { useState } from "react";

import { useRuntime } from "../state.ts";
import type { TryItNowProps } from "../types.ts";
import { Editor as DefaultEditor } from "./Editor.tsx";
import { Layout as DefaultLayout } from "./Layout.tsx";
import { Results as DefaultResults } from "./Results.tsx";
import { RunButton as DefaultRunButton } from "./RunButton.tsx";

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
  const { status, execute } = useRuntime({ packageManagerUrl });
  console.log(status);
  return (
    <div>
      <Layout>
        <div slot="editor">
          <Editor
            theme={theme}
            defaultValue={defaultValue}
            onValueChange={setValue}
          />
        </div>
        <div slot="runButton">
          <RunButton
            onClick={() => {
              void execute(value, externalDependencies);
            }}
          />
        </div>
        <div slot="results">
          <Results output={""} />
        </div>
      </Layout>
    </div>
  );
}
