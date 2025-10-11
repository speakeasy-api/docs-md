"use client";

import type { Monaco } from "@monaco-editor/react";
import MonacoEditor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useState } from "react";

import type { EditorProps } from "../types.ts";
import styles from "./styles.module.css";

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: {
    enabled: false,
  },
  lineNumbers: "off",
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
};

export function Editor({
  value,
  onValueChange,
  theme,
  types,
  packageName,
  editorPadding = {
    top: 12,
    bottom: 80,
  },
}: EditorProps) {
  const handleValueChange = useCallback(
    (newValue: string | undefined, _: editor.IModelContentChangedEvent) => {
      onValueChange(newValue ?? "");
    },
    [onValueChange]
  );

  const [monaco, setMonaco] = useState<Monaco | null>(null);
  const onMount = useCallback((_: unknown, monaco: Monaco) => {
    setMonaco(monaco);
  }, []);

  // Wait till both Monaco and types are loaded before adding the extra lib
  useEffect(() => {
    if (!monaco || !types) {
      return;
    }

    // compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ["node_modules/@types"],
    });

    // extra libraries
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      types,
      `node_modules/@types/${packageName}/index.d.ts`
    );

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  }, [types, monaco, packageName]);

  return (
    <MonacoEditor
      loading=""
      options={{
        ...editorOptions,
        padding: editorPadding,
      }}
      className={styles.editor}
      language="typescript"
      theme={theme === "dark" ? "vs-dark" : "light"}
      value={value}
      onChange={handleValueChange}
      onMount={onMount}
    />
  );
}
