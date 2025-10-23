import type { LogLevel } from "../../types/logging.ts";

type InitializationStartedEvent = {
  type: "python:initialization:started";
};

type InitializationFinishedEvent = {
  type: "python:initialization:finished";
};

type InitializationErrorEvent = {
  type: "python:initialization:error";
  error: unknown;
};

type ExecutionStartedEvent = {
  type: "python:execution:started";
};

type ExecutionLogEvent = {
  type: "python:execution:log";
  level: LogLevel;
  message: unknown;
};

type ExecutionUncaughtExceptionEvent = {
  type: "python:execution:uncaught-exception";
  error: unknown;
};

type ExecutionUncaughtRejectionEvent = {
  type: "python:execution:uncaught-rejection";
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
