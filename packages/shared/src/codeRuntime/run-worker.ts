// Web Worker for safely executing bundled code
// This runs in its own isolated context to prevent interference with the main thread

import type { WorkerMessage } from "./messages.ts";

// Helper to enforce strict typing
function sendMessage(message: WorkerMessage) {
  self.postMessage(message);
}

// Listen for messages from the main thread
self.onmessage = function (event: MessageEvent<WorkerMessage>) {
  if (event.data.type === "execute") {
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
        level: "info",
        message: JSON.stringify(message),
      });
    };

    // Listen for unhandled rejections, which includes the SDK returning an
    // error
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

export {}; // Make this a module
