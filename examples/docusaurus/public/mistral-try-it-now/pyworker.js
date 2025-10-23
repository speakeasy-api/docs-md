// Web Worker for safely executing bundled code This runs in its own isolated
// context to prevent interference with the main thread, and to prevent console
// logs from the main thread from mixing with the logs from the worker.
// @ts-expect-error
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.mjs";
// Helper to enforce strict typing
function sendMessage(message) {
    self.postMessage(message);
}
// Listen for messages from the main thread
self.onmessage = async function (event) {
    if (event.data.type === "execute") {
        // Listen for unhandled rejections, which includes the API returning an
        // error status code
        globalThis.addEventListener("unhandledrejection", (event) => {
            sendMessage({
                type: "uncaught-reject",
                error: event.reason instanceof Error
                    ? {
                        message: event.reason.message,
                        stack: event.reason.stack,
                        name: event.reason.name,
                    }
                    : { message: String(event.reason) },
            });
        });
        // Execute the wrapped code using an indirect eval call for safety. See
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_direct_eval!
        try {
            // Load the SDK
            const pyodide = await loadPyodide();
            await pyodide.loadPackage("micropip");
            const micropip = pyodide.pyimport("micropip");
            const url = window.location.origin + event.data.dependencyUrl;
            debugger;
            await micropip.install(url);
            pyodide.runPython(event.data.code);
        }
        catch (error) {
            // Send back the error
            sendMessage({
                type: "uncaught-exception",
                error: error instanceof Error
                    ? {
                        message: error.message,
                        stack: error.stack,
                        name: error.name,
                    }
                    : { message: String(error) },
            });
        }
    }
};
//# sourceMappingURL=worker.js.map