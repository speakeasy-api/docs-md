import { bundle } from "@speakeasy-api/docs-md-shared";
import { useCallback, useState } from "react";

type Results = {
  output: Record<string, unknown>;
};

type RuntimeError =
  | {
      type: "serverError";
      status: number;
      message: string;
    }
  | {
      type: "other";
      message: string;
    };

type Status =
  | {
      state: "idle";
    }
  | {
      state: "running";
      previousResults?: Results;
      previousError?: RuntimeError;
    }
  | {
      state: "success";
      results: Results;
    }
  | {
      state: "error";
      error: RuntimeError;
    };

export function useRuntime() {
  const [status, setStatus] = useState<Status>({
    state: "idle",
  });

  const execute = useCallback(
    (code: string, externalDependencies: Record<string, string>) => {
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

      async function run() {
        try {
          const result = await bundle(code, externalDependencies);
          console.log(result);
        } catch (error) {
          setStatus({
            state: "error",
            error: {
              type: "other",
              message: error instanceof Error ? error.message : "Unknown error",
            },
          });
        }
      }

      void run();
    },
    []
  );

  return {
    status,
    execute,
  };
}
