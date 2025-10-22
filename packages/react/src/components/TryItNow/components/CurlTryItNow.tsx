"use client";

import { useState } from "react";

import { useCurlRuntime } from "../runtime/curl.ts";
import type { CurlTryItNowProps } from "../types.ts";
import {
  DefaultCopyButton,
  DefaultResetButton,
  DefaultRunButton,
} from "./Button.tsx";
import { Editor as DefaultEditor } from "./Editor.tsx";
import { Layout as DefaultLayout } from "./Layout.tsx";
import { Results as DefaultResults } from "./Results.tsx";
import styles from "./styles.module.css";

export function CurlTryItNow({
  defaultValue,
  Layout = DefaultLayout,
  Editor = DefaultEditor,
  RunButton = DefaultRunButton,
  ResetButton = DefaultResetButton,
  Results = DefaultResults,
  CopyButton = DefaultCopyButton,
  theme = "dark",
}: CurlTryItNowProps) {
  const [value, setValue] = useState(defaultValue);
  const { status, execute, reset } = useCurlRuntime({
    defaultValue,
  });
  const showResults = status.state !== "idle";

  function handleReset() {
    reset(setValue);
  }

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
            language="curl"
          />
        </div>
        <div slot="runButton" className={styles.runButtonContainer}>
          <RunButton
            onClick={() => {
              execute(value);
            }}
          />
        </div>
        <div slot="copyButton">
          <CopyButton copyValue={value} />
        </div>
        <div slot="resetButton">
          <ResetButton onClick={handleReset} />
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
