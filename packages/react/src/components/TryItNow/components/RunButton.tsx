"use client";

import type { RunButtonProps } from "../types.ts";

export function RunButton({ onClick }: RunButtonProps) {
  return (
    <button onClick={onClick} type="button" aria-label="Run code">
      Run
    </button>
  );
}
