"use client";

import { useEffect, useState } from "react";

import { useRuntime } from "../state.ts";
import type { TryItNowProps } from "../types.ts";
import { Editor as DefaultEditor } from "./Editor.tsx";
import { Layout as DefaultLayout } from "./Layout.tsx";
import { Results as DefaultResults } from "./Results.tsx";
import { RunButton as DefaultRunButton } from "./RunButton.tsx";
import styles from "./styles.module.css";

export function TryItNowContents({
  defaultValue,
  dependencyUrlPrefix,
  packageName,
  Layout = DefaultLayout,
  Editor = DefaultEditor,
  RunButton = DefaultRunButton,
  Results = DefaultResults,
  theme = "dark",
}: TryItNowProps) {
  const [types, setTypes] = useState<string | null>(null);
  // TODO: do something with the error value
  const [, setError] = useState<string | null>(null);
  const [value, setValue] = useState(defaultValue);
  const { status, execute } = useRuntime({
    dependencyUrlPrefix,
  });
  const showResults = status.state !== "idle";

  useEffect(() => {
    fetch(dependencyUrlPrefix + "/types.d.ts")
      .then((res) => {
        if (!res.ok) {
          setError(
            `Failed to load types: server returned ${res.status} ${res.statusText}`
          );
        }
        return res.text();
      })
      .then((types) => {
        setTypes(types);
      })
      .catch((err) => {
        setError(String(err));
      });
  }, [dependencyUrlPrefix]);

  return (
    <Layout>
      <div slot="editor">
        <Editor
          theme={theme}
          value={value}
          onValueChange={setValue}
          types={types}
          packageName={packageName}
        />
      </div>
      <div slot="runButton" className={styles.runButtonContainer}>
        <RunButton
          onClick={() => {
            execute(value);
          }}
        />
      </div>
      {showResults && (
        <div slot="results" className={styles.results}>
          <Results status={status} />
        </div>
      )}
    </Layout>
  );
}
