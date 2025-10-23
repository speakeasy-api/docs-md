"use client";

import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

import { useTypeScriptRuntime } from "../runtime/typescript.ts";
import type { TypeScriptTryItNowProps } from "../types.ts";
import { CopyButton, ResetButton, RunButton } from "./Button.tsx";
import { Editor } from "./Editor.tsx";
import { Layout } from "./Layout.tsx";
import { Results } from "./Results.tsx";
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
  const showResults = status.state !== "typescript:idle";

  useEffect(() => {
    void fetchTypes(dependencyUrlPrefix);
  }, [dependencyUrlPrefix, fetchTypes]);

  useEffect(() => {
    if (error) {
      console.error(
        "Failed to load types, type checking disabled in editor:",
        error
      );
    }
  }, [error]);

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
