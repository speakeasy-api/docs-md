import type { PillProps } from "@speakeasy-api/docs-md-react";

export function Pill({ variant, children }: PillProps) {
  return (
    // Show a very obviously different Pill, in part to show that we can
    // override the default Pill implementation and pass it correctly to
    // ExpandableProperty
    <span
      style={{
        border: `1px solid ${variant === "primary" ? "green" : "blue"}`,
        borderRadius: "var(--speakeasy-border-radius-sm)",
        padding: "0.25rem 0.5rem",
      }}
    >
      {children}
    </span>
  );
}
