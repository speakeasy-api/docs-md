import type { TryItNowProps } from "../../../types/shared.ts";
import { Content } from "./components/Content.tsx";

export function TryItNow(props: TryItNowProps) {
  // TODO: re-add support for themes, but in a scaffold-neutral way
  return <Content {...props} />;
}
