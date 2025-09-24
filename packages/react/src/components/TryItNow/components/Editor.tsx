"use client";

import { useState, useCallback } from "react";
import type { EditorProps } from "../types";
import type { editor } from "monaco-editor";
import MonacoEditor, { Monaco } from "@monaco-editor/react";
import styles from "./styles.module.css";

export function Editor({ defaultValue, onValueChange }: EditorProps) {
  const [_, setIsEditorReady] = useState(false);

  function handleEditorDidMount(_: editor.IStandaloneCodeEditor, _2: Monaco) {
    setIsEditorReady(true);
  }

  const handleValueChange = useCallback(
    (value: string | undefined, _: editor.IModelContentChangedEvent) => {
      onValueChange(value ?? "");
    },
    [onValueChange]
  );

  return (
    <MonacoEditor
      height={"100%"}
      loading=""
      wrapperProps={{
        className: styles.editorWrapper,
      }}
      options={{
        minimap: {
          enabled: false,
        },
      }}
      language="typescript"
      value={defaultValue}
      onChange={handleValueChange}
      onMount={handleEditorDidMount}
    />
  );
}
