type ParseStartedEvent = {
  type: "parse:started";
};

type ParseFinishedEvent = {
  type: "parse:finished";
};

type ParseErrorEvent = {
  type: "parse:error";
  error: unknown;
};

type FetchStartedEvent = {
  type: "fetch:started";
};

type FetchFinishedEvent = {
  type: "fetch:finished";
  response: Response;
  body: unknown;
};

type FetchErrorEvent = {
  type: "fetch:error";
  error: unknown;
};

export type CurlRuntimeEvent =
  | ParseStartedEvent
  | ParseFinishedEvent
  | ParseErrorEvent
  | FetchStartedEvent
  | FetchFinishedEvent
  | FetchErrorEvent;
