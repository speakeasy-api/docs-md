import { CurlTryItNow } from "./components/CurlTryItNow.tsx";
import { PythonTryItNow } from "./components/PythonTryItNow.tsx";
import { TypeScriptTryItNow } from "./components/TypeScriptTryItNow.tsx";
import type { TryItNowProps } from "./types.ts";

/**
 * Try It Now displays an interactive code playground that loads the TypeScript
 * code sample for an operation and allows users to modify and execute it.
 * Currently, Try It Now is based on Sandpack.
 */
export function TryItNow(props: TryItNowProps) {
  switch (props.language) {
    case "curl": {
      return <CurlTryItNow {...props} />;
    }
    case "typescript": {
      return <TypeScriptTryItNow {...props} />;
    }
    case "python": {
      return <PythonTryItNow {...props} />;
    }
  }
}
