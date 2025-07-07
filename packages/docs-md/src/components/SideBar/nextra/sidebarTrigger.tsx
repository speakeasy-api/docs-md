"use client";

import type { PropsWithChildren } from "react";

export function NextraSideBarTrigger({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button onClick={onClick} className={`x:px-2 x:py-1 x:my-3`}>
      {children}
    </button>
  );
}
