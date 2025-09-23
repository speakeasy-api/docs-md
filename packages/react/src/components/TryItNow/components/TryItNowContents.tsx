"use client";

import { useState } from "react";

import type { TryItNowProps } from "../types.ts";
import { Editor as DefaultEditor } from "./Editor.tsx";
import { Results as DefaultResults } from "./Results.tsx";
import { RunButton as DefaultRunButton } from "./RunButton.tsx";

export function TryItNowContents({
  externalDependencies,
  defaultValue,
  Editor = DefaultEditor,
  RunButton = DefaultRunButton,
  Results = DefaultResults,
}: TryItNowProps) {
  const [value, setValue] = useState(defaultValue);
  console.log(externalDependencies);
  console.log(value);
  return (
    <div>
      <Editor defaultValue={defaultValue} onValueChange={setValue} />
      <RunButton
        onClick={() => {
          console.log("Run");
        }}
      />
      <Results output={""} />
    </div>
  );
}
