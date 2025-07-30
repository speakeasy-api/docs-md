import type { TryItNowProps } from "./common/types.ts";
import { TryItNowDocusaurus } from "./docusaurus/TryItNow.tsx";

export function TryItNow(props: TryItNowProps) {
  return <TryItNowDocusaurus {...props} />;
}
