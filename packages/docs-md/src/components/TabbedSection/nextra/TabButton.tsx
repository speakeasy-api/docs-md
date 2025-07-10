"use client";

import type { TabButtonProps } from "../common/types.ts";

export function TabButton({
  title,
  tooltip,
  isActive,
  onClick,
}: TabButtonProps) {
  return (
    <button
      title={tooltip}
      onClick={onClick}
      className="x:focus-visible:nextra-focus x:cursor-pointer x:transition-colors x:border x:border-gray-200 x:hover:bg-gray-100 x:dark:hover:bg-neutral-800 x:select-none x:rounded x:flex x:items-center"
      style={{
        fontWeight: isActive ? "bold" : "normal",
        minWidth: "4rem",
        borderRadius: "7px",
        justifyContent: "center",
      }}
    >
      {title}
    </button>
  );
}
