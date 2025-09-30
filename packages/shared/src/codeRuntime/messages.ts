import type { LogLevel } from "./events.ts";

type WorkerExecuteMessage = {
  type: "execute";
  bundle: string;
};

type WorkerLogMessage = {
  type: "log";
  level: LogLevel;
  message: string;
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
