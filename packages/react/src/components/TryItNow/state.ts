import { Runtime } from "@speakeasy-api/docs-md-shared";
import { useCallback, useRef, useState } from "react";

import { InternalError } from "../../util/internalError";
import type { Status } from "./types";

type Options = {
  packageManagerUrl?: string;
  dependencies: Record<string, string>;
};

export function useRuntime({ packageManagerUrl, dependencies }: Options) {
  const [status] = useState<Status>({
    state: "idle",
  });
  const runtimeRef = useRef<Runtime | null>(null);

  if (!runtimeRef.current) {
    runtimeRef.current = new Runtime({
      packageManagerUrl,
      dependencies,
    });
    runtimeRef.current.on("compilation:started", (event) => {
      console.log("compilation:started", event);
    });
    runtimeRef.current.on("compilation:finished", (event) => {
      console.log("compilation:finished", event);
    });
    runtimeRef.current.on("compilation:error", (event) => {
      console.log("compilation:error", event);
    });
    runtimeRef.current.on("execution:started", (event) => {
      console.log("execution:started", event);
    });
    runtimeRef.current.on("execution:log", (event) => {
      console.log("execution:log", event);
    });
    runtimeRef.current.on("execution:uncaught-exception", (event) => {
      console.log("execution:uncaught-exception", event);
    });
    runtimeRef.current.on("execution:uncaught-rejection", (event) => {
      console.log("execution:uncaught-rejection", event);
    });
  }

  const execute = useCallback((code: string) => {
    if (!runtimeRef.current) {
      throw new InternalError("Runtime not initialized");
    }
    runtimeRef.current.run(code);
  }, []);

  return {
    status,
    execute,
  };
}
