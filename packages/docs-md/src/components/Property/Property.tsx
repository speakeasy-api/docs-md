import type { PropertyProps } from "./PropertyContents.tsx";
import { PropertyWrapper } from "./PropertyWrapper.tsx";

export function Property(props: PropertyProps) {
  return <PropertyWrapper {...props} />;
}
