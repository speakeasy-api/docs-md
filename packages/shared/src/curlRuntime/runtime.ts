import type { CurlRuntimeEvents } from "./events.ts";

export class CurlRuntime {
  public run(code: string) {
    console.log(code);
  }

  public cancel() {
    console.log("Canceling");
  }

  public on(
    event: CurlRuntimeEvents["type"],
    callback: (event: CurlRuntimeEvents) => void
  ) {
    console.log("Listening for", event, callback);
  }
}
