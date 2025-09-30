// Web Worker for safely executing bundled code This runs in its own isolated
// context to prevent interference with the main thread, and to prevent console
// logs from the main thread from mixing with the logs from the worker.

import type { LogLevel } from "./events.ts";
import type { WorkerMessage } from "./messages.ts";

// Helper to enforce strict typing
function sendMessage(message: WorkerMessage) {
  self.postMessage(message);
}

function createConsolePatch(level: LogLevel) {
  // console itself is defined using `any`, so we need to disable the lint
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (message: any, ...optionalParams: any[]) => {
    const hasSubstitutions =
      typeof message === "string" && /%[sdifcoO]/.test(message);

    if (hasSubstitutions) {
      throw new Error(
        "console calls with substitution patterns are not supported yet. Stay tuned!"
      );
    }

    sendMessage({
      type: "log",
      level,
      message: JSON.stringify(message),
    });
    for (const optionalParam of optionalParams) {
      sendMessage({
        type: "log",
        level,
        message: JSON.stringify(optionalParam),
      });
    }
  };
}

// Listen for messages from the main thread
self.onmessage = function (event: MessageEvent<WorkerMessage>) {
  if (event.data.type === "execute") {
    // Patch console
    console.log = createConsolePatch("log");
    console.info = createConsolePatch("info");
    console.warn = createConsolePatch("warn");
    console.error = createConsolePatch("error");
    console.debug = createConsolePatch("debug");

    // Listen for unhandled rejections, which includes the API returning an
    // error status code
    globalThis.addEventListener("unhandledrejection", (event) => {
      sendMessage({
        type: "uncaught-reject",
        error: event.reason,
      });
    });

    try {
      // Execute the wrapped code using an indirect eval call for safety. See
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_direct_eval!
      eval?.(`"use strict";
        ${event.data.bundle}`);
    } catch (error) {
      // Send back the error
      sendMessage({
        type: "uncaught-exception",
        error,
      });
    }
  }
};

// Make sure that the browser knows this is a module. The `import type` above
// gets stripped out at compile time, so it's not sufficient
export {};
