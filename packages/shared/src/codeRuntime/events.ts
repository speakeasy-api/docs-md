type CompilationStartedEvent = {
  type: "compilation:started";
  id: string;
};

type CompilationFinishedEvent = {
  type: "compilation:finished";
  id: string;
};

type CompilationErrorEvent = {
  type: "compilation:error";
  id: string;
  error: unknown;
};

type ExecutionStartedEvent = {
  type: "execution:started";
  id: string;
};

export type LogLevel = "log" | "info" | "warn" | "error" | "debug";

type ExecutionLogEvent = {
  type: "execution:log";
  id: string;
  level: LogLevel;
  message: unknown;
};

type ExecutionUncaughtExceptionEvent = {
  type: "execution:uncaught-exception";
  id: string;
  error: unknown;
};

type ExecutionUncaughtRejectionEvent = {
  type: "execution:uncaught-rejection";
  id: string;
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
