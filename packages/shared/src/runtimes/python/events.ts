import type { LogLevel } from "../../types/logging.ts";

type InitializationStartedEvent = {
  type: "initialization:started";
};

type InitializationFinishedEvent = {
  type: "initialization:finished";
};

type InitializationErrorEvent = {
  type: "initialization:error";
  error: unknown;
};

type ExecutionStartedEvent = {
  type: "execution:started";
};

type ExecutionLogEvent = {
  type: "execution:log";
  level: LogLevel;
  message: unknown;
};

type ExecutionUncaughtExceptionEvent = {
  type: "execution:uncaught-exception";
  error: unknown;
};

type ExecutionUncaughtRejectionEvent = {
  type: "execution:uncaught-rejection";
  error: unknown;
};

export type PythonRuntimeEvent =
  | InitializationStartedEvent
  | InitializationFinishedEvent
  | InitializationErrorEvent
  | ExecutionStartedEvent
  | ExecutionLogEvent
  | ExecutionUncaughtExceptionEvent
  | ExecutionUncaughtRejectionEvent;
