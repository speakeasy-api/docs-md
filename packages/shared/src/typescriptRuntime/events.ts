import type { LogLevel } from "../types/logging.ts";

type CompilationStartedEvent = {
  type: "compilation:started";
};

type CompilationFinishedEvent = {
  type: "compilation:finished";
};

type CompilationErrorEvent = {
  type: "compilation:error";
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

export type TypeScriptRuntimeEvent =
  | CompilationStartedEvent
  | CompilationFinishedEvent
  | CompilationErrorEvent
  | ExecutionStartedEvent
  | ExecutionLogEvent
  | ExecutionUncaughtExceptionEvent
  | ExecutionUncaughtRejectionEvent;
