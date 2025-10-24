"use client";

import "@speakeasy-api/docs-md-components";

import type { PillProps as PillElementProps } from "@speakeasy-api/docs-md-components";
import type { PropsWithChildren } from "react";

export type PillProps = PropsWithChildren<PillElementProps>;

/**
 * A pill displays a small piece of information inline surrounded by a border
 * and optional background color. The pill takes in a "variant" that controls
 * the color scheme, such as "primary" or "error".
 */
export function Pill(props: PillProps) {
  return <spk-pill {...props} />;
}
