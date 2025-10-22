import { InternalError } from "../util/internalError.ts";
import { bundleCode } from "./build.ts";
import type { TypeScriptRuntimeEvent } from "./events.ts";
import type { WorkerMessage } from "./messages.ts";

// Store the shared dependency bundle globally, since it will never change
// for a given site build, and is used across multiple Runtime instances.
let dependencyBundle: string | undefined;
let workerCode: string | undefined;

export class TypeScriptRuntime {
  #dependencyUrlPrefix: string;
  #listeners: Record<
    TypeScriptRuntimeEvent["type"],
    ((event: TypeScriptRuntimeEvent) => void)[]
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
    // know, cause Halting Problem plus lack of process.exit in samples)
    void this.#run(code);
  }

  async #run(code: string) {
    if (!dependencyBundle || !workerCode) {
      const [deps, worker] = await Promise.all([
        dependencyBundle
          ? Promise.resolve(dependencyBundle)
          : fetch(this.#dependencyUrlPrefix + "/deps.js").then((r) => r.text()),
        workerCode
          ? Promise.resolve(workerCode)
          : fetch(this.#dependencyUrlPrefix + "/worker.js").then((r) =>
              r.text()
            ),
      ]);
      dependencyBundle = deps;
      workerCode = worker;
    }
    if (this.#worker) {
      this.#worker.terminate();
      this.#worker = undefined;
      if (this.#workerBlobUrl) {
        URL.revokeObjectURL(this.#workerBlobUrl);
        this.#workerBlobUrl = undefined;
      }
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
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    this.#workerBlobUrl = url.toString();
    this.#worker = new Worker(this.#workerBlobUrl, {
      type: "module",
    });

    // Set up message handler
    this.#worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      switch (event.data.type) {
        case "log": {
          this.#emit({
            type: "execution:log",
            level: event.data.level,
            message: event.data.message,
          });
          break;
        }
        case "uncaught-exception": {
          this.#emit({
            type: "execution:uncaught-exception",
            error: event.data.error,
          });
          break;
        }
        case "uncaught-reject": {
          this.#emit({
            type: "execution:uncaught-rejection",
            error: event.data.error,
          });
          break;
        }
      }
    };

    // Handle worker errors
    this.#worker.onerror = (error) => {
      this.#emit({
        type: "execution:uncaught-exception",
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
      dependencyBundle,
      bundle: bundledCode,
    };
    this.#worker.postMessage(message);
  }

  public cancel() {
    this.#worker?.terminate();
    this.#worker = undefined;
    if (this.#workerBlobUrl) {
      URL.revokeObjectURL(this.#workerBlobUrl);
      this.#workerBlobUrl = undefined;
    }
  }

  public on(
    event: TypeScriptRuntimeEvent["type"],
    callback: (event: TypeScriptRuntimeEvent) => void
  ) {
    this.#listeners[event].push(callback);
  }

  #emit(event: TypeScriptRuntimeEvent) {
    for (const callback of this.#listeners[event.type]) {
      callback(event);
    }
  }
}
