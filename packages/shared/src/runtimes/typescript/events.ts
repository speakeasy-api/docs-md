import type { LogLevel } from "../../types/logging.ts";

type CompilationStartedEvent = {
  type: "typescript:compilation:started";
};

type CompilationFinishedEvent = {
  type: "typescript:compilation:finished";
};

type CompilationErrorEvent = {
  type: "typescript:compilation:error";
  error: unknown;
};

type ExecutionStartedEvent = {
  type: "typescript:execution:started";
};

type ExecutionLogEvent = {
  type: "typescript:execution:log";
  level: LogLevel;
  message: unknown;
};

type ExecutionUncaughtExceptionEvent = {
  type: "typescript:execution:uncaught-exception";
  error: unknown;
};

type ExecutionUncaughtRejectionEvent = {
  type: "typescript:execution:uncaught-rejection";
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
