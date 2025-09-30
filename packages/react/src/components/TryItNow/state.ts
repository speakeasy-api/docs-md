import { bundle, run } from "@speakeasy-api/docs-md-shared";
import { useCallback, useState } from "react";

import type { Status } from "./types";

type Options = {
  packageManagerUrl?: string;
};

export function useRuntime({ packageManagerUrl }: Options = {}) {
  const [status, setStatus] = useState<Status>({
    state: "idle",
  });

  const execute = useCallback(
    async (code: string, externalDependencies: Record<string, string>) => {
      console.log(code);
      setStatus((prevStatus) => {
        switch (prevStatus.state) {
          case "success":
            return {
              state: "running",
              previousResults: prevStatus.results,
            };
          case "error":
            return {
              state: "running",
              previousError: prevStatus.error,
            };
          case "idle":
            return {
              state: "running",
            };
          case "running":
            throw new Error("Cannot run while already running");
        }
      });

      try {
        const result = await bundle(code, externalDependencies, {
          packageManagerUrl,
        });
        const parsedCode = result.outputFiles[0]?.contents
          ? new TextDecoder().decode(result.outputFiles[0].contents)
          : "";
        const { logs, errors } = await run(parsedCode);
        if (errors.length > 0) {
          setStatus({
            state: "error",
            error: {
              output: errors,
            },
          });
        } else if (logs.length > 0) {
          setStatus({
            state: "success",
            results: {
              output: logs,
            },
          });
        }
      } catch (error) {
        setStatus({
          state: "error",
          error: {
            output: error instanceof Error ? [error] : ["Unknown error"],
          },
        });
      }
    },
    [packageManagerUrl]
  );

  return {
    status,
    execute,
  };
}
