"use client";

import { SandpackCodeEditor, useActiveCode } from "@codesandbox/sandpack-react";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { useTranspileDependencyMatches } from "../hooks/useCodeDependencies.ts";
import { useEvaluatedCode } from "../hooks/useTranspiledCode.ts";
import { setDependenciesAtom } from "../state/atoms.ts";

export function CodeEditor() {
  const evaluatedCode = useEvaluatedCode();
  const { code } = useActiveCode();
  const dependencies = useTranspileDependencyMatches(evaluatedCode ?? "");
  const setDependenciesAtomValue = useSetAtom(setDependenciesAtom);

  useEffect(() => {
    if (dependencies && Object.keys(dependencies).length > 0) {
      setDependenciesAtomValue(dependencies, code);
    }
  }, [dependencies, code, setDependenciesAtomValue]);

  return <SandpackCodeEditor />;
}
