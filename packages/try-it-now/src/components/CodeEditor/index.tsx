import { useActiveCode, SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useTranspileDependencyMatches } from "@/hooks/useCodeDependencies";
import { useEvaluatedCode } from "@/hooks/useTranspiledCode";
import { setDependenciesAtom } from "@/state";

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
