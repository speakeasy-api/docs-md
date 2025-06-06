"use client";

import type { TryItNowProps } from "@speakeasy-api/try-it-now-react";
import { TryItNow as TryItNowComponent } from "@speakeasy-api/try-it-now-react";
import React from "react";




export function TryItNow(props: TryItNowProps) {
  return <TryItNowComponent {...props} />;
}
