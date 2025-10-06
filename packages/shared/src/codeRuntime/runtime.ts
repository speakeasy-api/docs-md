// Generated during prebuild step
import { WORKER_CODE } from "../../dist/codeRuntime/worker-code.js";
import { InternalError } from "../util/internalError.ts";
import { bundleCode } from "./build.ts";
import type { RuntimeEvents } from "./events.ts";
import type { WorkerMessage } from "./messages.ts";

// Store the shared dependency bundle globally, since it will never change
// for a given site build, and is used across multiple Runtime instances.
let dependencyBundle: string | undefined;

export class Runtime {
  #dependencyUrlPrefix: string;
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
  #workerBlobUrl?: string;

  constructor({ dependencyUrlPrefix }: { dependencyUrlPrefix: string }) {
    this.#dependencyUrlPrefix = dependencyUrlPrefix;
  }

  public run(code: string) {
    // Hide the promise, since it doesn't indicate when run finishes (we never
    // // know, cause Halting Problemplus lack of process.exit in samples)
    void this.#run(code);
  }

  async #run(code: string) {
    if (!dependencyBundle) {
      const results = await fetch(this.#dependencyUrlPrefix + "/deps.js");
      dependencyBundle = await results.text();
    }
    if (this.#worker) {
      this.#worker.terminate();
      this.#worker = undefined;
    }

    // Bundle the results
    let bundledCode: string;
    try {
      this.#emit({ type: "compilation:started" });

      // Bundle the code
      const bundleResults = await bundleCode(code, dependencyBundle);

      // Check the results of compilation
      if (bundleResults.errors.length > 0) {
        for (const error of bundleResults.errors) {
          this.#emit({ type: "compilation:error", error });
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
      this.#emit({ type: "compilation:finished" });
    } catch (error) {
      // Catch bundle errors, and stop running
      this.#emit({ type: "compilation:error", error });
      return;
    }

    // Run the bundle
    this.#emit({ type: "execution:started" });

    // Create worker from embedded code to avoid webpack bundling issues
    // The worker code is embedded at build time to prevent webpack from
    // processing it as a separate chunk with __webpack_require__ dependencies
    const blob = new Blob([WORKER_CODE], {
      type: "application/javascript",
    });
    this.#workerBlobUrl = URL.createObjectURL(blob);
    this.#worker = new Worker(this.#workerBlobUrl, {
      type: "module",
    });

    // Set up message handler
    this.#worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      switch (event.data.type) {
        case "log":
          this.#emit({
            type: "execution:log",
            level: event.data.level,
            message: event.data.message,
          });
          break;
        case "uncaught-exception":
          this.#emit({
            type: "execution:uncaught-exception",
            error: event.data.error,
          });
          break;
        case "uncaught-reject":
          this.#emit({
            type: "execution:uncaught-rejection",
            error: event.data.error,
          });
          break;
      }
    };

    // Handle worker errors
    this.#worker.onerror = (errorEvent) => {
      this.#emit({
        type: "execution:uncaught-exception",
        error: {
          message: errorEvent.message,
          filename: errorEvent.filename,
          lineno: errorEvent.lineno,
          colno: errorEvent.colno,
        },
      });
      this.#worker?.terminate();
    };

    // Send the dependency bundle and user code bundle to the worker
    const message: WorkerMessage = {
      type: "execute",
      dependencyBundle,
      bundle: bundledCode,
    };
    this.#worker.postMessage(message);
  }

  public cancel() {
    this.#worker?.terminate();
    this.#worker = undefined;

    // Clean up blob URL after terminating worker
    if (this.#workerBlobUrl) {
      URL.revokeObjectURL(this.#workerBlobUrl);
      this.#workerBlobUrl = undefined;
    }
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
