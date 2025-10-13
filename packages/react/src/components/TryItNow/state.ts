import type { RuntimeEvents } from "@speakeasy-api/docs-md-shared";
import { Runtime } from "@speakeasy-api/docs-md-shared";
import { useCallback, useRef, useState } from "react";

import { InternalError } from "../../util/internalError.ts";
import type { ExtendedRuntimeEvent, Status } from "./types.ts";

type Options = {
  dependencyUrlPrefix: string;
  defaultValue: string;
};

export function useRuntime({ dependencyUrlPrefix, defaultValue }: Options) {
  const [status, setStatus] = useState<Status>({
    state: "idle",
  });
  const previousEvents = useRef<ExtendedRuntimeEvent[]>([]);
  const events = useRef<ExtendedRuntimeEvent[]>([]);
  const runtimeRef = useRef<Runtime | null>(null);
  const eventIdCounter = useRef<number>(0);
  const initialValue = useRef<string>(defaultValue);

  const addEventId = useCallback(
    (event: RuntimeEvents): ExtendedRuntimeEvent => {
      return { ...event, id: `event-${++eventIdCounter.current}` };
    },
    []
  );

  const handleExecutionEvent = useCallback(
    (event: RuntimeEvents) => {
      events.current.push(addEventId(event));
      setStatus({
        state: "executing",
        events: events.current,
      });
    },
    [addEventId]
  );

  if (!runtimeRef.current) {
    runtimeRef.current = new Runtime({ dependencyUrlPrefix });
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
        events: [addEventId(event)],
      });
    });
    runtimeRef.current.on("execution:started", handleExecutionEvent);
    runtimeRef.current.on("execution:log", handleExecutionEvent);
    runtimeRef.current.on("execution:uncaught-exception", handleExecutionEvent);
    runtimeRef.current.on("execution:uncaught-rejection", handleExecutionEvent);
  }

  const execute = useCallback((code: string) => {
    if (!runtimeRef.current) {
      throw new InternalError("Runtime not initialized");
    }
    runtimeRef.current.run(code);
  }, []);

  const reset = useCallback((onReset?: (initialValue: string) => void) => {
    previousEvents.current = [];
    events.current = [];
    eventIdCounter.current = 0;
    setStatus({
      state: "idle",
    });
    onReset?.(initialValue.current);
  }, []);

  return {
    status,
    execute,
    reset,
  };
}
