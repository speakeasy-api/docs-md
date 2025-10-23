import { Runtime } from "../runtime.ts";
import type { PythonRuntimeEvent } from "./events.ts";
import type { WorkerMessage } from "./messages.ts";

// Store the shared dependency bundle globally, since it will never change
// for a given site build, and is used across multiple Runtime instances.
let workerCode: string | undefined;

export class PythonRuntime extends Runtime<PythonRuntimeEvent> {
  #dependencyUrl: string;
  #dependencyUrlPrefix: string;
  #worker?: Worker;
  #workerBlobUrl?: string;
  constructor({
    dependencyUrl,
    dependencyUrlPrefix,
  }: {
    dependencyUrl: string;
    dependencyUrlPrefix: string;
  }) {
    super({
      "python:initialization:started": [],
      "python:initialization:finished": [],
      "python:initialization:error": [],
      "python:execution:started": [],
      "python:execution:log": [],
      "python:execution:uncaught-exception": [],
      "python:execution:uncaught-rejection": [],
    });
    this.#dependencyUrl = dependencyUrl;
    this.#dependencyUrlPrefix = dependencyUrlPrefix;
  }

  public run(code: string) {
    // Hide the promise, since it doesn't indicate when run finishes (we never
    // know, cause Halting Problem plus lack of process.exit in samples)
    void this.#run(code);
  }

  async #run(code: string) {
    // Load the worker code if it hasn't been already loaded
    if (!workerCode) {
      const response = await fetch(this.#dependencyUrlPrefix + "/pyworker.js");
      workerCode = await response.text();
    }
    if (this.#worker) {
      this.#worker.terminate();
      this.#worker = undefined;
      if (this.#workerBlobUrl) {
        URL.revokeObjectURL(this.#workerBlobUrl);
        this.#workerBlobUrl = undefined;
      }
    }

    // Run the bundle
    this.emit({ type: "python:initialization:started" });
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    this.#workerBlobUrl = url.toString();
    this.#worker = new Worker(this.#workerBlobUrl, {
      type: "module",
    });

    // Set up message handler
    this.#worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      switch (event.data.type) {
        case "initialization:error": {
          this.emit({
            type: "python:initialization:error",
            error: event.data.error,
          });
          break;
        }
        case "initialization:finished": {
          this.emit({
            type: "python:initialization:finished",
          });
          break;
        }
        case "log": {
          this.emit({
            type: "python:execution:log",
            level: event.data.level,
            message: event.data.message,
          });
          break;
        }
        case "uncaught-exception": {
          this.emit({
            type: "python:execution:uncaught-exception",
            error: event.data.error,
          });
          break;
        }
        case "uncaught-reject": {
          this.emit({
            type: "python:execution:uncaught-rejection",
            error: event.data.error,
          });
          break;
        }
      }
    };

    // Handle worker errors
    this.#worker.onerror = (error) => {
      this.emit({
        type: "python:execution:uncaught-exception",
        error,
      });
      this.#worker?.terminate();
      if (this.#workerBlobUrl) {
        URL.revokeObjectURL(this.#workerBlobUrl);
        this.#workerBlobUrl = undefined;
      }
    };

    // Send the dependency bundle and user code bundle to the worker
    const message: WorkerMessage = {
      type: "execute",
      dependencyUrl: this.#dependencyUrl,
      code,
    };
    this.#worker.postMessage(message);
  }

  public cancel() {
    // TODO
    console.log("Canceling");
  }
}
