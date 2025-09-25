type WorkerMessage = {
  type: "execute";
  bundle: string;
};

type WorkerLogMessage = {
  type: "log";
  message: string;
};

type WorkerErrorMessage = {
  type: "error";
  message: string;
};

type WorkerCompleteMessage = {
  type: "complete";
};

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
      if (event.data.type === "log") {
        console.log("Intercepted log:", event.data.message);
        logs.push(event.data.message);
      } else if (event.data.type === "error") {
        console.log("Intercepted error:", event.data.message);
        errors.push(event.data.message);
      } else if (event.data.type === "complete") {
        console.log("Intercepted complete");
        worker.terminate();
        resolve({
          logs,
          errors,
        });
      }
    };

    // Handle worker errors
    worker.onerror = (error) => {
      worker.terminate();
      reject(new Error(`Worker error: ${error.message}`));
    };

    // Send the bundle to the worker
    const message: WorkerMessage = {
      type: "execute",
      bundle,
    };
    worker.postMessage(message);
  });
}
