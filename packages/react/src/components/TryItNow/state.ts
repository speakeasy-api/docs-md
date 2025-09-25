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

  const execute = useCallback((code: string, externalDependencies: Record<string, string>) => {
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

    void bundle(code, externalDependencies)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return {
    status,
    execute,
  };
}
