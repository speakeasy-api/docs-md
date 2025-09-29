// Web Worker for safely executing bundled code
// This runs in its own isolated context to prevent interference with the main thread

import type {
  WorkerCompleteMessage,
  WorkerErrorMessage,
  WorkerExecuteMessage,
  WorkerLogMessage,
} from "./messages.ts";

// Helper to enforce strict typing
function sendMessage(
  message: WorkerCompleteMessage | WorkerErrorMessage | WorkerLogMessage
) {
  self.postMessage(message);
}

// Listen for messages from the main thread
self.onmessage = function (event: MessageEvent<WorkerExecuteMessage>) {
  if (event.data.type === "execute") {
    // Create console overrides that immediately post messages
    const previousConsole = console.log;

    // This function runs once the code has completed execution based on a few
    // possible outcomes:
    // 1. The code completed successfully
    // 2. The code threw a synchronous error
    // 3. The code threw an unhandled rejection (aka asynchronous error)
    function finalize() {
      // Restore console
      console.log = previousConsole;

      // Signal execution completion
      sendMessage({
        type: "complete",
      });
    }

    // Patch console log
    console.log = (message, ...optionalParams) => {
      if (optionalParams.length > 0) {
        throw new Error(
          "console.log with more than one argument is not supported yet. Stay tuned!"
        );
      }
      // TODO: we consider the sample complete once we have received a
      // console.log message. This of course would be incorrect if the user
      // changes the code  to either never call console.log, or call it more
      // than once. We should try to come up with a more holistic mechanism
      sendMessage({
        type: "log",
        message: JSON.stringify(message),
      });
      finalize();
    };

    // Listen for unhandled rejections, which includes the SDK returning an
    // error
    globalThis.addEventListener("unhandledrejection", (event) => {
      sendMessage({
        type: "error",
        message:
          event.reason instanceof Error
            ? event.reason.message
            : "Unknown error",
      });
      finalize();
    });

    try {
      // Execute the wrapped code using an indirect eval call for safety. See
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_direct_eval!
      eval?.(`"use strict";
        ${event.data.bundle}`);
    } catch (error) {
      // Send back the error
      sendMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
      finalize();
    }
  }
};

export {}; // Make this a module
