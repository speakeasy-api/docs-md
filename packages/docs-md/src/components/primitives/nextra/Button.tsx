"use client";

import clsx from "clsx";

import type { ButtonProps } from "../types.ts";

export function Button({ onClick, className, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      // TODO: convert to using CSS tokens
      className={clsx(
        "x:focus-visible:nextra-focus x:cursor-pointer x:transition-colors x:border x:border-gray-200 x:hover:bg-gray-100 x:dark:hover:bg-neutral-800 x:select-none x:rounded x:flex x:items-center",
        className
      )}
    >
      {children}
    </button>
  );
}
