import type { PropertyProps } from "./common/types.ts";
import { DocusaurusProperty } from "./docusaurus/Property.tsx";

export function Property(props: PropertyProps) {
  return <DocusaurusProperty {...props} />;
}
