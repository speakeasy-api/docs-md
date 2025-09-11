import { InternalError } from "./internalError.ts";

export function assertNever(_: never): never {
  throw new InternalError("Unexpected value");
}
