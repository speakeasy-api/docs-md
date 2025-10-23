import type { PythonRuntimeEvent } from "@speakeasy-api/docs-md-shared";
import { PythonRuntime } from "@speakeasy-api/docs-md-shared";
import { useCallback, useRef, useState } from "react";

import { InternalError } from "../../../util/internalError.ts";
import type { ExtendedPythonRuntimeEvent, PythonStatus } from "../types.ts";
import { addEventId } from "./eventId.ts";

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
    state: "python:idle",
  });

  const runtimeRef = useRef<PythonRuntime | null>(null);
  const events = useRef<ExtendedPythonRuntimeEvent[]>([]);
  const previousEvents = useRef<ExtendedPythonRuntimeEvent[]>([]);

  const handleExecutionEvent = useCallback((event: PythonRuntimeEvent) => {
    events.current.push(addEventId(event));
    setStatus({
      state: "python:executing",
      events: events.current,
    });
  }, []);

  if (!runtimeRef.current) {
    runtimeRef.current = new PythonRuntime({
      dependencyUrl,
      dependencyUrlPrefix,
    });
    // TODO: Add event listeners
    runtimeRef.current.on("python:initialization:started", () => {
      previousEvents.current = events.current;
      // We don't store started and finished events to keep event history clean
      // for the UI. They can be inferred from the state, and don't contain
      // any useful information for the UI.
      events.current = [];
      setStatus({
        state: "python:initializing",
        previousEvents: previousEvents.current,
      });
    });
    runtimeRef.current.on("python:initialization:finished", () => {
      setStatus({
        state: "python:executing",
        events: events.current,
      });
    });
    runtimeRef.current.on("python:initialization:error", (event) => {
      // Save previous events to events, so that next time we try to run code,
      // they will again become previous events. This way, we always show the
      // last _successfully_ initialized events
      events.current = previousEvents.current;
      setStatus({
        state: "python:initialization-error",
        previousEvents: previousEvents.current,
        // We still want to send the initialization error event thoughs, so that
        // the UI can show a initialization error.
        events: [addEventId(event)],
      });
    });
    runtimeRef.current.on("python:execution:started", handleExecutionEvent);
    runtimeRef.current.on("python:execution:log", handleExecutionEvent);
    runtimeRef.current.on(
      "python:execution:uncaught-exception",
      handleExecutionEvent
    );
    runtimeRef.current.on(
      "python:execution:uncaught-rejection",
      handleExecutionEvent
    );
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
        state: "python:idle",
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
