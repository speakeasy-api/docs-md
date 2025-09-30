import type { RuntimeEvents } from "@speakeasy-api/docs-md-shared";
import { Runtime } from "@speakeasy-api/docs-md-shared";
import { useCallback, useRef, useState } from "react";

import { InternalError } from "../../util/internalError.ts";
import type { Status } from "./types.ts";

type Options = {
  packageManagerUrl?: string;
  dependencies: Record<string, string>;
};

export function useRuntime({ packageManagerUrl, dependencies }: Options) {
  const [status, setStatus] = useState<Status>({
    state: "idle",
  });
  const previousEvents = useRef<RuntimeEvents[]>([]);
  const events = useRef<RuntimeEvents[]>([]);
  const runtimeRef = useRef<Runtime | null>(null);

  if (!runtimeRef.current) {
    runtimeRef.current = new Runtime({
      packageManagerUrl,
      dependencies,
    });
    runtimeRef.current.on("compilation:started", () => {
      previousEvents.current = events.current;
      // We don't store started and finished events to keep event history clean
      // for the UI. They can be inferred from the state, and don't contain
      // any useful information for the UI.
      events.current = [];
      setStatus({
        state: "compiling",
        previousEvents: previousEvents.current,
      });
    });
    runtimeRef.current.on("compilation:finished", () => {
      setStatus({
        state: "executing",
        events: events.current,
      });
    });
    runtimeRef.current.on("compilation:error", (event) => {
      // Save previous events to events, so that next time we try to run code,
      // they will again become previous events. This way, we always show the
      // last _successfully_ compiled events
      events.current = previousEvents.current;
      setStatus({
        state: "compile-error",
        previousEvents: previousEvents.current,
        // We still want to send the compilation error event thoughs, so that
        // the UI can show a compilation error.
        events: [event],
      });
    });
    runtimeRef.current.on("execution:started", (event) => {
      events.current.push(event);
      setStatus({
        state: "executing",
        events: events.current,
      });
    });
    runtimeRef.current.on("execution:log", (event) => {
      events.current.push(event);
      setStatus({
        state: "executing",
        events: events.current,
      });
    });
    runtimeRef.current.on("execution:uncaught-exception", (event) => {
      events.current.push(event);
      setStatus({
        state: "executing",
        events: events.current,
      });
    });
    runtimeRef.current.on("execution:uncaught-rejection", (event) => {
      events.current.push(event);
      setStatus({
        state: "executing",
        events: events.current,
      });
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
