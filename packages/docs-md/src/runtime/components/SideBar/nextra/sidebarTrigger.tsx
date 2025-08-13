"use client";

import clsx from "clsx";
import type { PropsWithChildren } from "react";

export function NextraSideBarTrigger({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      // TODO: convert to using CSS tokens
      className={clsx(
        "x:focus-visible:nextra-focus x:cursor-pointer x:transition-colors x:border x:border-gray-200 x:hover:bg-gray-100 x:dark:hover:bg-neutral-800 x:select-none x:rounded x:flex x:items-center",
        "x:px-2 x:py-1 x:my-3"
      )}
    >
      {children}
    </button>
  );
}
