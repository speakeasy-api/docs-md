"use client";

import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

import { useTypeScriptRuntime } from "../runtime/typescript.ts";
import type { TypeScriptTryItNowProps } from "../types.ts";
import {
  DefaultCopyButton,
  DefaultResetButton,
  DefaultRunButton,
} from "./Button.tsx";
import { Editor as DefaultEditor } from "./Editor.tsx";
import { Layout as DefaultLayout } from "./Layout.tsx";
import { Results as DefaultResults } from "./Results.tsx";
import styles from "./styles.module.css";

const typesAtom = atom<string | null>(null);
const dependencyUrlPrefixAtom = atom<string | null>(null);
const errorAtom = atom<string | null>(null);
const fetchTypesAtom = atom(
  null,
  async (get, set, dependencyUrlPrefix: string) => {
    // Only fetch if we haven't already fetched for this prefix
    const currentPrefix = get(dependencyUrlPrefixAtom);
    if (currentPrefix === dependencyUrlPrefix) {
      return; // Already fetched or in progress
    }

    // Mark this prefix as being fetched
    set(dependencyUrlPrefixAtom, dependencyUrlPrefix);

    try {
      const res = await fetch(dependencyUrlPrefix + "/types.d.ts");
      if (!res.ok) {
        set(
          errorAtom,
          `Failed to load types: server returned ${res.status} ${res.statusText}`
        );
        return;
      }
      const types = await res.text();
      set(typesAtom, types);
    } catch (err) {
      set(errorAtom, String(err));
    }
  }
);

export function TypeScriptTryItNow({
  defaultValue,
  Layout = DefaultLayout,
  Editor = DefaultEditor,
  RunButton = DefaultRunButton,
  ResetButton = DefaultResetButton,
  Results = DefaultResults,
  CopyButton = DefaultCopyButton,
  theme = "dark",
  dependencyUrlPrefix,
  packageName,
}: TypeScriptTryItNowProps) {
  const [types] = useAtom(typesAtom);
  const [error] = useAtom(errorAtom);
  const [, fetchTypes] = useAtom(fetchTypesAtom);
  const [value, setValue] = useState(defaultValue);
  const { status, execute, reset } = useTypeScriptRuntime({
    dependencyUrlPrefix,
    defaultValue,
  });
  const showResults = status.state !== "idle";

  useEffect(() => {
    void fetchTypes(dependencyUrlPrefix);
  }, [dependencyUrlPrefix, fetchTypes]);

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(
        "Failed to load types, type checking disabled in editor:",
        error
      );
    }
  }, [error]);

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
            types={types}
            packageName={packageName}
            language="typescript"
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
