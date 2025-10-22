type FetchStartedEvent = {
  type: "fetch:started";
};

type FetchFinishedEvent = {
  type: "fetch:finished";
};

type FetchErrorEvent = {
  type: "fetch:error";
  error: unknown;
};

export type CurlRuntimeEvents =
  | FetchStartedEvent
  | FetchFinishedEvent
  | FetchErrorEvent;
