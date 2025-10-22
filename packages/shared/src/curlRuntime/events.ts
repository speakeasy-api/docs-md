type FetchStartedEvent = {
  type: "fetch:started";
};

type FetchFinishedEvent = {
  type: "fetch:finished";
  response: Response;
};

type FetchErrorEvent = {
  type: "fetch:error";
  error: unknown;
};

export type CurlRuntimeEvent =
  | FetchStartedEvent
  | FetchFinishedEvent
  | FetchErrorEvent;
