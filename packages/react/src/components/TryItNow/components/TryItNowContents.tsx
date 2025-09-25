"use client";

import { useState } from "react";

import type { TryItNowProps } from "../types.ts";
import { Editor as DefaultEditor } from "./Editor.tsx";
import { Results as DefaultResults } from "./Results.tsx";
import { RunButton as DefaultRunButton } from "./RunButton.tsx";
import { Layout as DefaultLayout } from "./Layout.tsx";

export function TryItNowContents({
  externalDependencies,
  defaultValue,
  Layout = DefaultLayout,
  Editor = DefaultEditor,
  RunButton = DefaultRunButton,
  Results = DefaultResults,
  theme = "dark",
}: TryItNowProps) {
  const [value, setValue] = useState(defaultValue);
  console.log(externalDependencies);
  console.log(value);
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
              console.log("Run");
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
