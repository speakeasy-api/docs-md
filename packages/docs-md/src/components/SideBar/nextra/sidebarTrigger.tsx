"use client";

import type { PropsWithChildren } from "react";

import { Button } from "../../primitives/nextra/Button.tsx";

export function NextraSideBarTrigger({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <Button onClick={onClick} className="x:px-2 x:py-1 x:my-3">
      {children}
    </Button>
  );
}
