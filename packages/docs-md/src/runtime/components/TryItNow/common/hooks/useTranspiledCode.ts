"use client";

import type {
  BundlerState,
  SandpackClient,
  SandpackMessage,
} from "@codesandbox/sandpack-client";
import { useSandpack } from "@codesandbox/sandpack-react";
import { useEffect, useState } from "react";

const getTranspiledCode = (client: SandpackClient): string | null => {
  if (!client) return null;

  const bundlerState = client[
    "bundlerState" as keyof SandpackClient
  ] as BundlerState;

  if (bundlerState == null) return null;

  const tModule = bundlerState.transpiledModules["/index.tsx:"];

  return tModule?.source?.compiledCode ?? null;
};

/**
 * Returns the evaluated and transpiled code from the sandpack client whenever it is evaluating code.
 * @returns
 */
export const useEvaluatedCode = (): string | null => {
  const { sandpack, listen } = useSandpack();
  const [evaluatedCode, setEvaluatedCode] = useState<string | null>(null);
  const client = Object.values(sandpack.clients)[0];

  useEffect(() => {
    listen((msg: SandpackMessage) => {
      if (msg.type === "status" && msg.status === "evaluating") {
        if (!client) return;
        const transpiledCode = getTranspiledCode(client);
        if (transpiledCode) {
          setEvaluatedCode(transpiledCode);
        }
      }
    });
  }, [listen, client]);

  return evaluatedCode;
};
