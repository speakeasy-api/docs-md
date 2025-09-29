import type {
  WorkerCompleteMessage,
  WorkerErrorMessage,
  WorkerExecuteMessage,
  WorkerLogMessage,
} from "./messages.ts";

export async function run(bundle: string): Promise<{
  logs: string[];
  errors: string[];
}> {
  return new Promise((resolve, reject) => {
    const logs: string[] = [];
    const errors: string[] = [];

    // Create worker from the worker file
    const worker = new Worker(new URL("./run-worker.js", import.meta.url), {
      type: "module",
    });

    // Set up message handler
    worker.onmessage = (
      event: MessageEvent<
        WorkerLogMessage | WorkerErrorMessage | WorkerCompleteMessage
      >
    ) => {
      switch (event.data.type) {
        case "log":
          logs.push(event.data.message);
          break;
        case "error":
          errors.push(event.data.message);
          break;
        case "complete":
          worker.terminate();
          resolve({
            logs,
            errors,
          });
          break;
      }
    };

    // Handle worker errors
    worker.onerror = (error) => {
      worker.terminate();
      reject(new Error(`Worker error: ${error.message}`));
    };

    // Send the bundle to the worker
    const message: WorkerExecuteMessage = {
      type: "execute",
      bundle,
    };
    worker.postMessage(message);
  });
}
