import type { CurlRuntimeEvent } from "./events.ts";

export class CurlRuntime {
  #listeners: Record<
    CurlRuntimeEvent["type"],
    ((event: CurlRuntimeEvent) => void)[]
  > = {
    "fetch:started": [],
    "fetch:finished": [],
    "fetch:error": [],
  };

  public run(code: string) {
    void this.#run(code);
  }

  async #run(code: string) {
    this.#emit({ type: "fetch:started" });
    try {
      await fetch(code);
      this.#emit({ type: "fetch:finished" });
    } catch (error) {
      this.#emit({ type: "fetch:error", error });
    }
  }

  public cancel() {
    console.log("Canceling");
  }

  public on(
    event: CurlRuntimeEvent["type"],
    callback: (event: CurlRuntimeEvent) => void
  ) {
    this.#listeners[event].push(callback);
  }

  #emit(event: CurlRuntimeEvent) {
    for (const callback of this.#listeners[event.type]) {
      callback(event);
    }
  }
}
