import { PythonRuntime } from "@speakeasy-api/docs-md-shared";
import { useCallback, useRef, useState } from "react";

import { InternalError } from "../../../util/internalError.ts";
import type { ExtendedPythonRuntimeEvent, PythonStatus } from "../types.ts";

type Options = {
  dependencyUrl: string;
  dependencyUrlPrefix: string;
  defaultValue: string;
};

export function usePythonRuntime({
  dependencyUrl,
  dependencyUrlPrefix,
  defaultValue,
}: Options) {
  const [status, setStatus] = useState<PythonStatus>({
    state: "idle",
    language: "python",
  });

  const runtimeRef = useRef<PythonRuntime | null>(null);
  const events = useRef<ExtendedPythonRuntimeEvent[]>([]);

  if (!runtimeRef.current) {
    runtimeRef.current = new PythonRuntime({
      dependencyUrl,
      dependencyUrlPrefix,
    });
    // TODO: Add event listeners
    runtimeRef.current.on("initialization:started", () => {
      console.log("initialization:started");
    });
    runtimeRef.current.on("initialization:finished", () => {
      console.log("initialization:finished");
    });
    runtimeRef.current.on("initialization:error", () => {
      console.log("initialization:error");
    });
    runtimeRef.current.on("execution:log", () => {
      console.log("execution:log");
    });
    runtimeRef.current.on("execution:log", (event) => {
      console.log("execution:log", event);
    });
    runtimeRef.current.on("execution:uncaught-exception", (event) => {
      console.log("execution:uncaught-exception");
      console.log(event);
    });
    runtimeRef.current.on("execution:uncaught-rejection", (event) => {
      console.log("execution:uncaught-rejection");
      console.log(event);
    });
  }

  const execute = useCallback((code: string) => {
    if (!runtimeRef.current) {
      throw new InternalError("Runtime not initialized");
    }
    runtimeRef.current.run(code);
  }, []);

  const reset = useCallback(
    (onReset?: (initialValue: string) => void) => {
      events.current = [];
      setStatus({
        state: "idle",
        language: "python",
      });
      onReset?.(defaultValue);
    },
    [defaultValue]
  );

  return {
    status,
    execute,
    reset,
  };
}
