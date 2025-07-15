import type { PropertyProps } from "./common/types.ts";
import { NextraProperty } from "./nextra/Property.tsx";

export function Property(props: PropertyProps) {
  return <NextraProperty {...props} />;
}
