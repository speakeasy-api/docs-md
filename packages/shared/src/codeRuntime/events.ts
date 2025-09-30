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

export type LogLevel = "log" | "info" | "warn" | "error" | "debug";

type ExecutionLogEvent = {
  type: "execution:log";
  level: LogLevel;
  message: string;
};

type ExecutionUncaughtExceptionEvent = {
  type: "execution:uncaught-exception";
  error: unknown;
};

type ExecutionUncaughtRejectionEvent = {
  type: "execution:uncaught-rejection";
  error: unknown;
};

export type RuntimeEvents =
  | CompilationStartedEvent
  | CompilationFinishedEvent
  | CompilationErrorEvent
  | ExecutionStartedEvent
  | ExecutionLogEvent
  | ExecutionUncaughtExceptionEvent
  | ExecutionUncaughtRejectionEvent;
