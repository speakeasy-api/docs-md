import type { TypeScriptRuntimeEvent } from "@speakeasy-api/docs-md-shared";
import { TypeScriptRuntime } from "@speakeasy-api/docs-md-shared";
import { useCallback, useRef, useState } from "react";

import { InternalError } from "../../../util/internalError.ts";
import type {
  ExtendedTypeScriptRuntimeEvent,
  TypeScriptStatus,
} from "../types.ts";
import { addEventId } from "./eventId.ts";

type Options = {
  dependencyUrlPrefix: string;
  defaultValue: string;
};

export function useTypeScriptRuntime({
  dependencyUrlPrefix,
  defaultValue,
}: Options) {
  const [status, setStatus] = useState<TypeScriptStatus>({
    state: "typescript:idle",
  });
  const previousEvents = useRef<ExtendedTypeScriptRuntimeEvent[]>([]);
  const events = useRef<ExtendedTypeScriptRuntimeEvent[]>([]);
  const runtimeRef = useRef<TypeScriptRuntime | null>(null);
  const initialValue = useRef<string>(defaultValue);

  const handleExecutionEvent = useCallback((event: TypeScriptRuntimeEvent) => {
    events.current.push(addEventId(event));
    setStatus({
      state: "typescript:executing",
      events: events.current,
    });
  }, []);

  if (!runtimeRef.current) {
    runtimeRef.current = new TypeScriptRuntime({ dependencyUrlPrefix });
    runtimeRef.current.on("typescript:compilation:started", () => {
      previousEvents.current = events.current;
      // We don't store started and finished events to keep event history clean
      // for the UI. They can be inferred from the state, and don't contain
      // any useful information for the UI.
      events.current = [];
      setStatus({
        state: "typescript:compiling",
        previousEvents: previousEvents.current,
      });
    });
    runtimeRef.current.on("typescript:compilation:finished", () => {
      setStatus({
        state: "typescript:executing",
        events: events.current,
      });
    });
    runtimeRef.current.on("typescript:compilation:error", (event) => {
      // Save previous events to events, so that next time we try to run code,
      // they will again become previous events. This way, we always show the
      // last _successfully_ compiled events
      events.current = previousEvents.current;
      setStatus({
        state: "typescript:compile-error",
        previousEvents: previousEvents.current,
        // We still want to send the compilation error event thoughs, so that
        // the UI can show a compilation error.
        events: [addEventId(event)],
      });
    });
    runtimeRef.current.on("typescript:execution:started", handleExecutionEvent);
    runtimeRef.current.on("typescript:execution:log", handleExecutionEvent);
    runtimeRef.current.on(
      "typescript:execution:uncaught-exception",
      handleExecutionEvent
    );
    runtimeRef.current.on(
      "typescript:execution:uncaught-rejection",
      handleExecutionEvent
    );
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
    setStatus({
      state: "typescript:idle",
    });
    onReset?.(initialValue.current);
  }, []);

  return {
    status,
    execute,
    reset,
  };
}
