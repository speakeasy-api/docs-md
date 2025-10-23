type ParseStartedEvent = {
  type: "curl:parse:started";
};

type ParseFinishedEvent = {
  type: "curl:parse:finished";
};

type ParseErrorEvent = {
  type: "curl:parse:error";
  error: unknown;
};

type FetchStartedEvent = {
  type: "curl:fetch:started";
};

type FetchFinishedEvent = {
  type: "curl:fetch:finished";
  response: Response;
  body: unknown;
};

type FetchErrorEvent = {
  type: "curl:fetch:error";
  error: unknown;
};

export type CurlRuntimeEvent =
  | ParseStartedEvent
  | ParseFinishedEvent
  | ParseErrorEvent
  | FetchStartedEvent
  | FetchFinishedEvent
  | FetchErrorEvent;
