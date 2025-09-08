import { TryItNowContents } from "./components/TryItNowContents.tsx";
import type { TryItNowProps } from "./types.ts";

export function TryItNow(props: TryItNowProps) {
  // TODO: re-add support for themes, but in a scaffold-neutral way
  return <TryItNowContents {...props} />;
}
