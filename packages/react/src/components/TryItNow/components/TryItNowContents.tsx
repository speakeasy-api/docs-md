"use client";

import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

import { useRuntime } from "../state.ts";
import type { TryItNowProps } from "../types.ts";
import { Editor as DefaultEditor } from "./Editor.tsx";
import { Layout as DefaultLayout } from "./Layout.tsx";
import { Results as DefaultResults } from "./Results.tsx";
import { RunButton as DefaultRunButton } from "./RunButton.tsx";
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
  const [types] = useAtom(typesAtom);
  const [error] = useAtom(errorAtom);
  const [, fetchTypes] = useAtom(fetchTypesAtom);
  const [value, setValue] = useState(defaultValue);
  const { status, execute } = useRuntime({
    dependencyUrlPrefix,
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

  return (
    <>
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
    </>
  );
}
