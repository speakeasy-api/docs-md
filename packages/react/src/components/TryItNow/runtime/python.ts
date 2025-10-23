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
    runtimeRef.current.on("compilation:started", () => {
      // TODO
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
