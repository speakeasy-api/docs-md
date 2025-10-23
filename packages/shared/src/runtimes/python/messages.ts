import type { LogLevel } from "../../types/logging.ts";

type WorkerExecuteMessage = {
  type: "execute";
  dependencyUrl: string;
  code: string;
};

type WorkerLogMessage = {
  type: "log";
  level: LogLevel;
  message: unknown;
};

type WorkerUncaughtExceptionMessage = {
  type: "uncaught-exception";
  error: unknown;
};

type WorkerUncaughtRejectMessage = {
  type: "uncaught-reject";
  error: unknown;
};

export type WorkerMessage =
  | WorkerExecuteMessage
  | WorkerLogMessage
  | WorkerUncaughtExceptionMessage
  | WorkerUncaughtRejectMessage;
