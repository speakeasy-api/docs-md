import { InternalError } from "../util/internalError.ts";
import { bundleCode } from "./build.ts";
import type { RuntimeEvents } from "./events.ts";
import type { WorkerMessage } from "./messages.ts";

export class Runtime {
  #dependencyBundle?: string;
  #dependencyUrlPrefix: string;
  #eventCounter = 0;
  #listeners: Record<
    RuntimeEvents["type"],
    ((event: RuntimeEvents) => void)[]
  > = {
    "compilation:started": [],
    "compilation:finished": [],
    "compilation:error": [],
    "execution:started": [],
    "execution:log": [],
    "execution:uncaught-exception": [],
    "execution:uncaught-rejection": [],
  };
  #worker?: Worker;

  constructor({ dependencyUrlPrefix }: { dependencyUrlPrefix: string }) {
    this.#dependencyUrlPrefix = dependencyUrlPrefix;
  }

  #generateEventId(): string {
    return `event-${Date.now()}-${++this.#eventCounter}`;
  }

  public run(code: string) {
    // Hide the promise, since it doesn't indicate when run finishes (we never
    // // know, cause Halting Problemplus lack of process.exit in samples)
    void this.#run(code);
  }

  async #run(code: string) {
    if (!this.#dependencyBundle) {
      const results = await fetch(this.#dependencyUrlPrefix + "/deps.js");
      this.#dependencyBundle = await results.text();
    }
    if (this.#worker) {
      this.#worker.terminate();
      this.#worker = undefined;
    }

    // Bundle the results
    let bundledCode: string;
    try {
      this.#emit({ type: "compilation:started", id: this.#generateEventId() });

      // Bundle the code
      const bundleResults = await bundleCode(code, this.#dependencyBundle);

      // Check the results of compilation
      if (bundleResults.errors.length > 0) {
        for (const error of bundleResults.errors) {
          this.#emit({
            type: "compilation:error",
            id: this.#generateEventId(),
            error,
          });
        }
        return;
      }
      if (!bundleResults.outputFiles) {
        throw new InternalError("bundleResults.outputFiles is undefined");
      }
      if (bundleResults.outputFiles.length !== 1) {
        throw new InternalError(
          `Expected exactly one output file, got ${bundleResults.outputFiles.length}`
        );
      }

      // Store the compilation results
      bundledCode = new TextDecoder().decode(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        bundleResults.outputFiles[0]!.contents
      );

      // Signal that compilation finished
      this.#emit({ type: "compilation:finished", id: this.#generateEventId() });
    } catch (error) {
      // Catch bundle errors, and stop running
      this.#emit({
        type: "compilation:error",
        id: this.#generateEventId(),
        error,
      });
      return;
    }

    // Run the bundle
    this.#emit({ type: "execution:started", id: this.#generateEventId() });

    // Create worker from the worker file
    this.#worker = new Worker(new URL("./run-worker.js", import.meta.url), {
      type: "module",
    });

    // Set up message handler
    this.#worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      switch (event.data.type) {
        case "log":
          this.#emit({
            type: "execution:log",
            level: event.data.level,
            id: this.#generateEventId(),
            message: event.data.message,
          });
          break;
        case "uncaught-exception":
          this.#emit({
            type: "execution:uncaught-exception",
            error: event.data.error,
            id: this.#generateEventId(),
          });
          break;
        case "uncaught-reject":
          this.#emit({
            type: "execution:uncaught-rejection",
            error: event.data.error,
            id: this.#generateEventId(),
          });
          break;
      }
    };

    // Handle worker errors
    this.#worker.onerror = (error) => {
      this.#emit({
        type: "execution:uncaught-exception",
        error,
        id: this.#generateEventId(),
      });
      this.#worker?.terminate();
    };

    // Send the dependency bundle and user code bundle to the worker
    const message: WorkerMessage = {
      type: "execute",
      dependencyBundle: this.#dependencyBundle,
      bundle: bundledCode,
    };
    this.#worker.postMessage(message);
  }

  public cancel() {
    this.#worker?.terminate();
    this.#worker = undefined;
  }

  public on(
    event: RuntimeEvents["type"],
    callback: (event: RuntimeEvents) => void
  ) {
    this.#listeners[event].push(callback);
  }

  #emit(event: RuntimeEvents) {
    for (const callback of this.#listeners[event.type]) {
      callback(event);
    }
  }
}
