import type {
  CurlRuntimeEvent,
  PythonRuntimeEvent,
  TypeScriptRuntimeEvent,
} from "@speakeasy-api/docs-md-shared";

let eventIdCounter = 0;

export function addEventId<
  T extends TypeScriptRuntimeEvent | CurlRuntimeEvent | PythonRuntimeEvent,
>(event: T) {
  return { ...event, id: `event-${++eventIdCounter}` };
}
