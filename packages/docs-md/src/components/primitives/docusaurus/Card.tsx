import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        backgroundColor: "var(--ifm-hero-background-color)",
        color: "var(--ifm-hero-text-color)",
        border:
          "var(--ifm-global-border-width) solid var(--ifm-blockquote-border-color)",
        borderRadius: "var(--ifm-global-radius)",
        boxShadow: "var(--ifm-global-shadow-tl)",
        padding:
          "var(--ifm-alert-padding-vertical) var(--ifm-alert-padding-horizontal)",
      }}
    >
      {children}
    </div>
  );
}
