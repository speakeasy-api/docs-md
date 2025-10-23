import { CurlRuntime } from "@speakeasy-api/docs-md-shared";
import { useCallback, useRef, useState } from "react";

import { InternalError } from "../../../util/internalError.ts";
import type { CurlStatus, ExtendedCurlRuntimeEvent } from "../types.ts";
import { addEventId } from "./eventId.ts";

export function useCurlRuntime({ defaultValue }: { defaultValue: string }) {
  const [status, setStatus] = useState<CurlStatus>({
    state: "curl:idle",
  });

  const runtimeRef = useRef<CurlRuntime | null>(null);
  const events = useRef<ExtendedCurlRuntimeEvent[]>([]);

  if (!runtimeRef.current) {
    runtimeRef.current = new CurlRuntime();
    runtimeRef.current.on("curl:parse:started", () => {
      // We don't store started and finished events to keep event history clean
      // for the UI. They can be inferred from the state, and don't contain
      // any useful information for the UI.
      events.current = [];
      setStatus({
        state: "curl:parsing",
        events: events.current,
      });
    });
    runtimeRef.current.on("curl:parse:error", (event) => {
      events.current.push(addEventId(event));
      setStatus({
        state: "curl:parse-error",
        events: events.current,
      });
    });
    runtimeRef.current.on("curl:fetch:started", () => {
      // We don't store started and finished events to keep event history clean
      // for the UI. They can be inferred from the state, and don't contain
      // any useful information for the UI.
      events.current = [];
      setStatus({
        state: "curl:fetching",
        events: events.current,
      });
    });
    runtimeRef.current.on("curl:fetch:finished", (event) => {
      events.current.push(addEventId(event));
      setStatus({
        state: "curl:finished",
        events: events.current,
      });
    });
    runtimeRef.current.on("curl:fetch:error", (event) => {
      // Save previous events to events, so that next time we try to run code,
      // they will again become previous events. This way, we always show the
      // last _successfully_ compiled events
      events.current = [];
      setStatus({
        state: "curl:error",
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
        state: "curl:idle",
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
