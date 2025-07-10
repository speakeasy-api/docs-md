import type { PillProps } from "./common/types.ts";
import { DocusaurusPill } from "./docusaurus/Pill.tsx";

export function Pill(props: PillProps) {
  return <DocusaurusPill {...props} />;
}
