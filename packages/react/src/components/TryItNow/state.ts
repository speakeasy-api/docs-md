import { bundle, run } from "@speakeasy-api/docs-md-shared";
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
      type: "buildError";
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

type Options = {
  packageManagerUrl?: string;
};

export function useRuntime({ packageManagerUrl }: Options = {}) {
  const [status, setStatus] = useState<Status>({
    state: "idle",
  });

  const execute = useCallback(
    async (code: string, externalDependencies: Record<string, string>) => {
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
              type: "other",
              message: errors.join("\n"),
            },
          });
        } else if (logs.length > 0) {
          setStatus({
            state: "success",
            results: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              output: JSON.parse(logs[0] ?? "{}"),
            },
          });
        }
      } catch (error) {
        setStatus({
          state: "error",
          error: {
            type: "other",
            message: error instanceof Error ? error.message : "Unknown error",
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
