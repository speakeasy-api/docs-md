"use client";

import "@speakeasy-api/docs-md-components";

import type { PillProps as PillElementProps } from "@speakeasy-api/docs-md-components";
import type { PropsWithChildren } from "react";

export type PillProps = PropsWithChildren<PillElementProps>;

export function Pill(props: PillProps) {
  return <spk-pill {...props} />;
}
