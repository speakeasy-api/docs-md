"use client";

import type { RunButtonProps } from "../types";

export function RunButton({ onClick }: RunButtonProps) {
  return <button onClick={onClick}>Run</button>;
}
