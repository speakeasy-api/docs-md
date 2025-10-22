import { useCallback, useRef, useState } from "react";

import type { CurlStatus, ExtendedCurlRuntimeEvent } from "../types.ts";

export function useCurlRuntime({ defaultValue }: { defaultValue: string }) {
  const [status] = useState<CurlStatus>({
    state: "idle",
    language: "curl",
  });

  const events = useRef<ExtendedCurlRuntimeEvent[]>([]);

  // eslint-disable-next-line no-console
  console.log(defaultValue, events.current);

  const execute = useCallback((code: string) => {
    // eslint-disable-next-line no-console
    console.log(code);
  }, []);

  const reset = useCallback((onReset?: (initialValue: string) => void) => {
    // eslint-disable-next-line no-console
    console.log(onReset);
  }, []);

  return {
    status,
    execute,
    reset,
  };
}
