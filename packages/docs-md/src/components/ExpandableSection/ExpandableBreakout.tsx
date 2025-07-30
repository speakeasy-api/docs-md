import type { BreakoutContentsProps } from "./components/BreakoutContents.tsx";
import { BreakoutContents } from "./components/BreakoutContents.tsx";

export function ExpandableBreakout(props: BreakoutContentsProps) {
  return <BreakoutContents {...props} />;
}
