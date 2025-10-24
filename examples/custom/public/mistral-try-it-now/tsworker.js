// Web Worker for safely executing bundled code This runs in its own isolated
// context to prevent interference with the main thread, and to prevent console
// logs from the main thread from mixing with the logs from the worker.
// Browser-compatible string formatter (replacement for Node.js util.format)
function format(template, ...args) {
    let index = 0;
    return template.replace(/%([sdifcoO])/g, (match, specifier) => {
        if (index >= args.length)
            return match;
        const arg = args[index++];
        switch (specifier) {
            case "s": // string
                return String(arg);
            case "d": // number
            case "i": // integer
                return String(Number(arg));
            case "f": // float
                return String(Number(arg));
            case "o": // object (simple)
            case "O": // object (detailed)
                try {
                    return JSON.stringify(arg);
                }
                catch {
                    return String(arg);
                }
            case "c": // CSS (not supported, just return empty)
                return "";
            default:
                return match;
        }
    });
}
// Helper to enforce strict typing
function sendMessage(message) {
    self.postMessage(message);
}
function createConsolePatch(console, level) {
    const originalConsoleMethod = console[level];
    // console itself is defined using `any`, so we need to disable the lint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console[level] = (message, ...optionalParams) => {
        const hasSubstitutions = typeof message === "string" && /%[sdifcoO]/.test(message);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        originalConsoleMethod.apply(console, [message, ...optionalParams]);
        if (hasSubstitutions) {
            sendMessage({
                type: "log",
                level,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                message: format(message, ...optionalParams),
            });
            return;
        }
        sendMessage({
            type: "log",
            level,
            message,
        });
        for (const optionalParam of optionalParams) {
            sendMessage({
                type: "log",
                level,
                message: optionalParam,
            });
        }
    };
}
// Listen for messages from the main thread
self.onmessage = function (event) {
    if (event.data.type === "execute") {
        // Patch console
        createConsolePatch(console, "log");
        createConsolePatch(console, "info");
        createConsolePatch(console, "warn");
        createConsolePatch(console, "error");
        createConsolePatch(console, "debug");
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
            // First execute the dependency bundle to populate globalThis.__deps__
            eval?.(`"use strict";
        ${event.data.dependencyBundle}`);
            // Then execute the user code which can access dependencies via globalThis.__deps__
            eval?.(`"use strict";
        ${event.data.bundle}`);
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
export {};
//# sourceMappingURL=worker.js.map