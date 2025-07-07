import type { TryItNowProps } from "./common/types.ts";
import { TryItNowNextra } from "./nextra/TryItNow.tsx";

export function TryItNow(props: TryItNowProps) {
  return <TryItNowNextra {...props} />;
}
