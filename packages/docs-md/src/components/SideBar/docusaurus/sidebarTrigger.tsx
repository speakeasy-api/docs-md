"use client";

import type { PropsWithChildren } from "react";

import { Button } from "../../Button/docusaurus.tsx";

export function DocusaurusSideBarTrigger({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <Button
      onClick={onClick}
      style={{
        padding: "8px 16px",
      }}
    >
      {children}
    </Button>
  );
}
