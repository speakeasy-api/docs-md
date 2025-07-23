"use client";

import type { PropertyProps } from "./PropertyContents.tsx";
import { PropertyContents } from "./PropertyContents.tsx";

export function PropertyWrapper(props: PropertyProps) {
  return <PropertyContents {...props} />;
}
