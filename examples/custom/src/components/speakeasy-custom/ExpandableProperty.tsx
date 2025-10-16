"use client";

import { ExpandableProperty as DefaultExpandableProperty } from "@speakeasy-api/docs-md-react";
import type { ExpandablePropertyProps } from "@speakeasy-api/docs-md-react";
import { Pill } from "./Pill";

export function ExpandableProperty(props: ExpandablePropertyProps) {
  return <DefaultExpandableProperty {...props} Pill={Pill} />;
}
