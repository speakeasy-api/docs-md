"use client";

import type { PropsWithChildren } from "react";

export function DocusaurusSideBarTrigger({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
      }}
    >
      {children}
    </button>
  );
}
