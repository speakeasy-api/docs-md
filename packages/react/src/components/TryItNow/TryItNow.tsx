import { TryItNowContents } from "./components/TryItNowContents.tsx";
import type { TryItNowProps } from "./types.ts";

/**
 * Try It Now displays an interactive code playground that loads the TypeScript
 * code sample for an operation and allows users to modify and execute it.
 * Currently, Try It Now is based on Sandpack.
 */
export function TryItNow(props: TryItNowProps) {
  // TODO: re-add support for themes, but in a scaffold-neutral way
  return <TryItNowContents {...props} />;
}
