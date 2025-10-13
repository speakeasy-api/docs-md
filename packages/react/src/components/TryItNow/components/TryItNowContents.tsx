"use client";

import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { CheckIcon as DefaultCheckIcon } from "../../CheckIcon/CheckIcon.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { CopyIcon as DefaultCopyIcon } from "../../CopyIcon/CopyIcon.tsx";
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { ResetIcon as DefaultResetIcon } from "../../ResetIcon/ResetIcon.tsx";
import { useRuntime } from "../state.ts";
import type {
  ButtonProps,
  CopyButtonProps,
  ResetButtonProps,
  TryItNowProps,
} from "../types.ts";
import { Button } from "./Button.tsx";
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

function DefaultRunButton({ onClick }: Pick<ButtonProps, "onClick">) {
  return (
    <Button onClick={onClick} ariaLabel="Run code">
      Run
    </Button>
  );
}

function DefaultResetButton({
  onClick,
  ResetIcon = DefaultResetIcon,
}: ResetButtonProps) {
  return (
    <Button
      className={styles.iconButton}
      onClick={onClick}
      ariaLabel="Reset code"
    >
      <ResetIcon />
    </Button>
  );
}

function DefaultCopyButton({
  copyValue,
  CheckIcon = DefaultCheckIcon,
  CopyIcon = DefaultCopyIcon,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    if (copyValue) {
      void navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Button
      className={styles.iconButton}
      onClick={handleClick}
      ariaLabel={copied ? "Copied!" : "Copy code"}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}

export function TryItNowContents({
  defaultValue,
  dependencyUrlPrefix,
  packageName,
  Layout = DefaultLayout,
  Editor = DefaultEditor,
  RunButton = DefaultRunButton,
  ResetButton = DefaultResetButton,
  Results = DefaultResults,
  CopyButton = DefaultCopyButton,
  editorProps = {},
  theme = "dark",
}: TryItNowProps) {
  const [types] = useAtom(typesAtom);
  const [error] = useAtom(errorAtom);
  const [, fetchTypes] = useAtom(fetchTypesAtom);
  const [value, setValue] = useState(defaultValue);
  const { status, execute, reset } = useRuntime({
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
            {...editorProps}
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
