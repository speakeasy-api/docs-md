import type { CodeProps } from "./common/types.ts";
import { DocusaurusCode } from "./docusaurus/docusaurus.tsx";

export function Code(props: CodeProps) {
  return <DocusaurusCode {...props} />;
}
