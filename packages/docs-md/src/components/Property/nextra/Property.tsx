"use client";

import useMeasure from "react-use-measure";

import type { PropertyProps } from "../common/types.ts";

export function NextraProperty({ children, typeInfo }: PropertyProps) {
  const [ref, bounds] = useMeasure();
  console.log(Math.floor(bounds.width / 6));
  return (
    <div ref={ref}>
      {typeInfo.label}
      {children}
    </div>
  );
}
