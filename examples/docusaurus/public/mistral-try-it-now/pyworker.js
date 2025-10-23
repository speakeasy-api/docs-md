// Web Worker for safely executing bundled code This runs in its own isolated
// context to prevent interference with the main thread, since the Python
// runtime blocks the main thread even when idling.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line fast-import/no-unresolved-imports
import { loadPyodide as loadPyodideUntyped } from "https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.mjs";
const loadPyodide = loadPyodideUntyped;
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
        // Initialize the runtime
        let pyodide;
        try {
            // Load the SDK via micropip
            pyodide = await loadPyodide();
            await pyodide.loadPackage("micropip");
            const micropip = pyodide.pyimport("micropip");
            const url = globalThis.location.origin + event.data.dependencyUrl;
            await micropip.install(url);
            sendMessage({ type: "initialization:finished" });
        }
        catch (error) {
            // Send back the error
            sendMessage({
                type: "initialization:error",
                error: error instanceof Error
                    ? {
                        message: error.message,
                        stack: error.stack,
                        name: error.name,
                    }
                    : { message: String(error) },
            });
            return;
        }
        try {
            // Set stdio
            pyodide.setStdout({
                batched: (msg) => sendMessage({ type: "log", message: msg, level: "info" }),
            });
            pyodide.setStderr({
                batched: (msg) => sendMessage({ type: "log", message: msg, level: "error" }),
            });
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