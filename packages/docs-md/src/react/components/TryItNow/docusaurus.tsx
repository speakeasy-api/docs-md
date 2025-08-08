import type { TryItNowProps } from "../../../types/shared.ts";
import { TryItNowDocusaurus } from "./docusaurus/TryItNow.tsx";

export function TryItNow(props: TryItNowProps) {
  return <TryItNowDocusaurus {...props} />;
}
