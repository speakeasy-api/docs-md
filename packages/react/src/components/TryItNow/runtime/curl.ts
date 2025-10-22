import { CurlRuntime } from "@speakeasy-api/docs-md-shared";
import { useCallback, useRef, useState } from "react";

import { InternalError } from "../../../util/internalError.ts";
import type { CurlStatus, ExtendedCurlRuntimeEvent } from "../types.ts";
import { addEventId } from "./eventId.ts";

export function useCurlRuntime({ defaultValue }: { defaultValue: string }) {
  const [status, setStatus] = useState<CurlStatus>({
    state: "idle",
    language: "curl",
  });

  const runtimeRef = useRef<CurlRuntime | null>(null);
  const events = useRef<ExtendedCurlRuntimeEvent[]>([]);

  if (!runtimeRef.current) {
    runtimeRef.current = new CurlRuntime();
    runtimeRef.current.on("parse:started", () => {
      // We don't store started and finished events to keep event history clean
      // for the UI. They can be inferred from the state, and don't contain
      // any useful information for the UI.
      events.current = [];
      setStatus({
        state: "parsing",
        language: "curl",
        events: events.current,
      });
    });
    runtimeRef.current.on("parse:error", (event) => {
      events.current.push(addEventId(event));
      setStatus({
        state: "error",
        language: "curl",
        events: events.current,
      });
    });
    runtimeRef.current.on("fetch:started", () => {
      // We don't store started and finished events to keep event history clean
      // for the UI. They can be inferred from the state, and don't contain
      // any useful information for the UI.
      events.current = [];
      setStatus({
        state: "fetching",
        language: "curl",
        events: events.current,
      });
    });
    runtimeRef.current.on("fetch:finished", (event) => {
      events.current.push(addEventId(event));
      setStatus({
        state: "finished",
        language: "curl",
        events: events.current,
      });
    });
    runtimeRef.current.on("fetch:error", (event) => {
      // Save previous events to events, so that next time we try to run code,
      // they will again become previous events. This way, we always show the
      // last _successfully_ compiled events
      events.current = [];
      setStatus({
        state: "error",
        language: "curl",
        // We still want to send the compilation error event thoughs, so that
        // the UI can show a compilation error.
        events: [addEventId(event)],
      });
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
        language: "curl",
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
