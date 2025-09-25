// Web Worker for safely executing bundled code
// This runs in its own isolated context to prevent interference with the main thread

type WorkerMessage = {
  type: "execute";
  bundle: string;
};

// Note: We no longer store logs/errors locally since we send them immediately

// Listen for messages from the main thread
self.onmessage = function (event: MessageEvent<WorkerMessage>) {
  if (event.data.type === "execute") {
    try {
      // Create console overrides that immediately post messages
      const consoleOverride = `
      function __speakeasyLogCapture(...args) {
          const message = args.map((arg) => 
            typeof arg === 'string' ? arg : JSON.stringify(arg)
          ).join(' ');
          self.postMessage({
            type: 'log',
            message: message
          });
          __originalConsole.log(...args);
          
        };
      `;

      // Wrap the bundle with console setup
      const wrappedCode = `
        ${consoleOverride}
        
        // Execute the original bundle
        ${event.data.bundle}
        
        // Signal execution completion
        self.postMessage({
          type: 'complete'
        });
      `;

      // Execute the wrapped code
      eval(wrappedCode);
    } catch (error) {
      // Send back the error
      self.postMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};

export {}; // Make this a module
