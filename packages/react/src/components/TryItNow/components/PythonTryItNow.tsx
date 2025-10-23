"use client";

import { useState } from "react";

import { usePythonRuntime } from "../runtime/python.ts";
import type { PythonTryItNowProps } from "../types.ts";
import { CopyButton, ResetButton, RunButton } from "./Button.tsx";
import { Editor } from "./Editor.tsx";
import { Layout } from "./Layout.tsx";
import { Results } from "./Results.tsx";
import styles from "./styles.module.css";

export function PythonTryItNow({
  defaultValue,
  theme = "dark",
  dependencyUrl,
  dependencyUrlPrefix,
}: PythonTryItNowProps) {
  const [value, setValue] = useState(defaultValue);
  const { status, execute, reset } = usePythonRuntime({
    dependencyUrl,
    dependencyUrlPrefix,
    defaultValue,
  });
  const showResults = status.state !== "python:idle";

  return (
    <>
      <Layout status={status}>
        <div slot="editor">
          <Editor
            theme={theme}
            value={value}
            onValueChange={setValue}
            packageName={null}
            types={null}
            language="python"
          />
        </div>
        <div slot="runButton" className={styles.runButtonContainer}>
          <RunButton onClick={() => execute(value)} />
        </div>
        <div slot="copyButton">
          <CopyButton copyValue={value} />
        </div>
        <div slot="resetButton">
          <ResetButton onClick={() => reset(setValue)} />
        </div>
        {showResults && (
          <div slot="results" className={styles.results}>
            <Results status={status} />
          </div>
        )}
      </Layout>
    </>
  );
}
