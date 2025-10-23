import { Runtime } from "../runtime.ts";
import type { PythonRuntimeEvent } from "./events.ts";

export class PythonRuntime extends Runtime<PythonRuntimeEvent> {
  constructor() {
    super({
      "compilation:started": [],
      "compilation:finished": [],
      "compilation:error": [],
      "execution:started": [],
      "execution:log": [],
      "execution:uncaught-exception": [],
      "execution:uncaught-rejection": [],
    });
  }

  public run(code: string) {
    // TODO
    console.log("Running", code);
  }

  public cancel() {
    // TODO
    console.log("Canceling");
  }
}
