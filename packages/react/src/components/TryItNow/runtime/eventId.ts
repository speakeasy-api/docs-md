import type {
  CurlRuntimeEvent,
  TypeScriptRuntimeEvent,
} from "@speakeasy-api/docs-md-shared";

let eventIdCounter = 0;

export function addEventId<T extends TypeScriptRuntimeEvent | CurlRuntimeEvent>(
  event: T
) {
  return { ...event, id: `event-${++eventIdCounter}` };
}
