"use client";

import MonacoEditor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback } from "react";

import type { EditorProps } from "../types.ts";
import styles from "./styles.module.css";

const editorOptions = {
  minimap: {
    enabled: false,
  },
  lineNumbers: "off",
  padding: {
    top: 12,
    bottom: 12,
  },
  lineDecorationsWidth: 12,
  lineNumbersMinChars: 0,
  glyphMargin: false,
  folding: false,
  fontFamily: "var(--speakeasy-font-mono)",
  fontLigatures: true,
  renderLineHighlight: "none",
  scrollBeyondLastLine: false,
  wordWrap: "on",
  wrappingIndent: "indent",
  automaticLayout: true,
  fixedOverflowWidgets: true,
  scrollbar: {
    vertical: "auto",
    horizontal: "auto",
    useShadows: false,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  renderWhitespace: "none",
  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: "on",
  smoothScrolling: true,
  mouseWheelZoom: false,
  contextmenu: true,
  quickSuggestions: {
    strings: true,
    comments: false,
    other: true,
  },
  tabSize: 2,
} as editor.IStandaloneEditorConstructionOptions;

export function Editor({ value, onValueChange, theme }: EditorProps) {
  const handleValueChange = useCallback(
    (newValue: string | undefined, _: editor.IModelContentChangedEvent) => {
      onValueChange(newValue ?? "");
    },
    [onValueChange]
  );

  return (
    <MonacoEditor
      loading=""
      options={editorOptions}
      className={styles.editor}
      language="typescript"
      theme={theme === "dark" ? "vs-dark" : "light"}
      value={value}
      onChange={handleValueChange}
    />
  );
}
